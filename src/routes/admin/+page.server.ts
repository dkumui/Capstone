import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getCompanySettings, updateCompanySettings } from '$lib/services/companyService';
import { uploadProductImage } from '$lib/services/uploadService';
import { getAdminChatSessions } from '$lib/services/chatbot/persistence';
import {
	createProduct,
	deleteProductByProductCode,
	getAdminProducts,
	toggleProductActive,
	updateProductByProductCode,
	updateProductImageByProductCode,
	updateStockByProductCode
} from '$lib/services/inventoryService';
import { createAdminSupabaseClient } from '$lib/supabase/admin';

type CapType = 'cap_1_warna' | 'cap_2_warna';

function requireAdmin(cookies: import('@sveltejs/kit').Cookies) {
	const session = cookies.get('admin_session');

	if (!env.ADMIN_SESSION_TOKEN || session !== env.ADMIN_SESSION_TOKEN) {
		throw redirect(303, '/admin/login');
	}
}

function getString(formData: FormData, key: string): string {
	return String(formData.get(key) ?? '').trim();
}

function getNumber(formData: FormData, key: string): number {
	const raw = getString(formData, key);
	const value = Number(raw);

	if (!Number.isFinite(value)) {
		return 0;
	}

	return value;
}

function getNullableNumber(formData: FormData, key: string): number | null {
	const raw = getString(formData, key);

	if (raw === '') {
		return null;
	}

	const value = Number(raw);

	if (!Number.isFinite(value)) {
		return null;
	}

	return value;
}

function parseCapType(value: string): CapType | null {
	if (value === 'cap_1_warna' || value === 'cap_2_warna') {
		return value;
	}

	return null;
}

export const load = async ({ cookies }) => {
	requireAdmin(cookies);

	const [company, products, chatSessions] = await Promise.all([
		getCompanySettings(),
		getAdminProducts(),
		getAdminChatSessions()
	]);

	const supabase = createAdminSupabaseClient();

	let inventoryTransactions: Array<{
		id: string;
		product_code: string;
		previous_qty: number | null;
		new_qty: number | null;
		created_at: string;
	}> = [];

	if (supabase) {
		const { data: transactionData } = await supabase
			.from('inventory_transactions')
			.select('id,product_code,previous_qty,new_qty,created_at')
			.order('created_at', { ascending: false })
			.limit(25);

		if (transactionData) {
			inventoryTransactions = transactionData;
		}
	}

	return {
		company,
		products,
		chatSessions,
		inventoryTransactions
	};
};

export const actions = {
	updateCompany: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();

		const businessName = getString(formData, 'business_name');
		const address = getString(formData, 'address');

		if (!businessName || !address) {
			return fail(400, {
				message: 'Nama usaha dan alamat wajib diisi.'
			});
		}

		const result = await updateCompanySettings({
			businessName,
			altBusinessName: getString(formData, 'alt_business_name'),
			description: getString(formData, 'description'),
			address,
			whatsappNumber: getString(formData, 'whatsapp_number'),
			contactPhone: getString(formData, 'contact_phone'),
			operationHours: getString(formData, 'operation_hours'),
			googleMapsLink: getString(formData, 'google_maps_link')
		});

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	},

	createProduct: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();

		const capType = parseCapType(getString(formData, 'cap_type'));
		const productCode = getString(formData, 'product_code').toUpperCase();
		const colorVariant = getString(formData, 'color_variant');
		const price = getNumber(formData, 'price');

		if (!capType) {
			return fail(400, {
				message: 'Jenis cap tidak valid.'
			});
		}

		if (!productCode || !colorVariant) {
			return fail(400, {
				message: 'Kode produk dan warna wajib diisi.'
			});
		}

		if (price <= 0) {
			return fail(400, {
				message: 'Harga produk wajib lebih dari 0.'
			});
		}

		const name =
			getString(formData, 'name') ||
			`${capType === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna'} ${colorVariant}`;

		const result = await createProduct({
			productCode,
			name,
			capType,
			colorVariant,
			sizeLengthCm: getNumber(formData, 'size_length_cm') || 205,
			sizeWidthCm: getNumber(formData, 'size_width_cm') || 110,
			sizeNote: getString(formData, 'size_note') || 'Kurang lebih 205 x 110 cm',
			price,
			stockQty: getNullableNumber(formData, 'stock_qty'),
			imageUrl: getString(formData, 'image_url') || null,
			description: getString(formData, 'description') || null,
			isFeatured: formData.get('is_featured') === 'on',
			isActive: formData.get('is_active') === 'on'
		});

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	},

	updateProduct: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();

		const productCode = getString(formData, 'product_code');
		const capType = parseCapType(getString(formData, 'cap_type'));
		const name = getString(formData, 'name');
		const colorVariant = getString(formData, 'color_variant');
		const price = getNumber(formData, 'price');

		if (!productCode) {
			return fail(400, {
				message: 'Kode produk tidak ditemukan.'
			});
		}

		if (!capType) {
			return fail(400, {
				message: 'Jenis cap tidak valid.'
			});
		}

		if (!name || !colorVariant) {
			return fail(400, {
				message: 'Nama produk dan warna wajib diisi.'
			});
		}

		if (price <= 0) {
			return fail(400, {
				message: 'Harga produk wajib lebih dari 0.'
			});
		}

		const result = await updateProductByProductCode({
			productCode,
			name,
			capType,
			colorVariant,
			sizeLengthCm: getNumber(formData, 'size_length_cm') || 205,
			sizeWidthCm: getNumber(formData, 'size_width_cm') || 110,
			sizeNote: getString(formData, 'size_note') || 'Kurang lebih 205 x 110 cm',
			price,
			stockQty: getNullableNumber(formData, 'stock_qty'),
			imageUrl: getString(formData, 'image_url') || null,
			description: getString(formData, 'description') || null,
			isFeatured: formData.get('is_featured') === 'on',
			isActive: formData.get('is_active') === 'on'
		});

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	},

	updateStock: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const productCode = getString(formData, 'product_code');
		const stockQty = getNullableNumber(formData, 'stock_qty');

		if (!productCode) {
			return fail(400, {
				message: 'Kode produk tidak ditemukan.'
			});
		}

		const result = await updateStockByProductCode({
			productCode,
			stockQty
		});

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	},

	uploadProductImage: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();

		const productCode = getString(formData, 'product_code');
		const imageFile = formData.get('image_file');

		if (!productCode) {
			return fail(400, {
				message: 'Kode produk tidak ditemukan.'
			});
		}

		if (!(imageFile instanceof File)) {
			return fail(400, {
				message: 'File gambar tidak valid.'
			});
		}

		const uploadResult = await uploadProductImage(imageFile, productCode);

		if (!uploadResult.success || !uploadResult.publicUrl) {
			return fail(400, {
				message: uploadResult.message
			});
		}

		const updateResult = await updateProductImageByProductCode(productCode, uploadResult.publicUrl);

		if (!updateResult.success) {
			return fail(400, {
				message: updateResult.message
			});
		}

		return {
			message: 'Foto produk berhasil diunggah dan diperbarui.'
		};
	},

	toggleActive: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const productCode = getString(formData, 'product_code');
		const nextActive = getString(formData, 'next_active') === 'true';

		if (!productCode) {
			return fail(400, {
				message: 'Kode produk tidak ditemukan.'
			});
		}

		const result = await toggleProductActive(productCode, nextActive);

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	},

	deleteProduct: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const productCode = getString(formData, 'product_code');

		if (!productCode) {
			return fail(400, {
				message: 'Kode produk tidak ditemukan.'
			});
		}

		const result = await deleteProductByProductCode(productCode);

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	},

	logout: async ({ cookies }) => {
		cookies.delete('admin_session', {
			path: '/'
		});

		throw redirect(303, '/admin/login');
	}
};