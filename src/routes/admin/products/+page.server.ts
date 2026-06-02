import { fail } from '@sveltejs/kit';
import {
	requireAdmin,
	getString,
	getNumber,
	getNullableNumber,
	parseCapType
} from '$lib/server/admin';
import { uploadProductImage } from '$lib/services/uploadService';
import {
	createProduct,
	deleteProductByProductCode,
	getAdminProducts,
	toggleProductActive,
	updateProductByProductCode,
	updateProductImageByProductCode,
	updateStockByProductCode
} from '$lib/services/inventoryService';

export const load = async ({ cookies }) => {
	requireAdmin(cookies);

	const products = await getAdminProducts();

	return {
		products
	};
};

export const actions = {
	createProduct: async ({ request, cookies }) => {
        requireAdmin(cookies);

        const formData = await request.formData();

        const capType = parseCapType(getString(formData, 'cap_type'));
        const productCode = getString(formData, 'product_code').toUpperCase();
        const colorVariant = getString(formData, 'color_variant');
        const price = getNumber(formData, 'price');
        const imageFile = formData.get('image_file');

        if (!capType) return fail(400, { message: 'Jenis cap tidak valid.' });
        if (!productCode || !colorVariant) {
            return fail(400, { message: 'Kode produk dan warna wajib diisi.' });
        }
        if (price <= 0) return fail(400, { message: 'Harga produk wajib lebih dari 0.' });

        const name =
            getString(formData, 'name') ||
            `${capType === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna'} ${colorVariant}`;

        let imageUrl = getString(formData, 'image_url') || null;

        if (imageFile instanceof File && imageFile.size > 0) {
            const uploadResult = await uploadProductImage(imageFile, productCode);

            if (!uploadResult.success || !uploadResult.publicUrl) {
                return fail(400, {
                    message: uploadResult.message
                });
            }

            imageUrl = uploadResult.publicUrl;
        }

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
            imageUrl,
            description: getString(formData, 'description') || null,
            isFeatured: formData.get('is_featured') === 'on',
            isActive: formData.get('is_active') === 'on'
        });

        if (!result.success) return fail(400, { message: result.message });

        return {
            message: imageUrl
                ? 'Produk dan foto berhasil ditambahkan.'
                : 'Produk berhasil ditambahkan.'
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

		if (!productCode) return fail(400, { message: 'Kode produk tidak ditemukan.' });
		if (!capType) return fail(400, { message: 'Jenis cap tidak valid.' });
		if (!name || !colorVariant) return fail(400, { message: 'Nama produk dan warna wajib diisi.' });
		if (price <= 0) return fail(400, { message: 'Harga produk wajib lebih dari 0.' });

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

		if (!result.success) return fail(400, { message: result.message });

		return { message: result.message };
	},

	updateStock: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const productCode = getString(formData, 'product_code');

		if (!productCode) return fail(400, { message: 'Kode produk tidak ditemukan.' });

		const result = await updateStockByProductCode({
			productCode,
			stockQty: getNullableNumber(formData, 'stock_qty')
		});

		if (!result.success) return fail(400, { message: result.message });

		return { message: result.message };
	},

	uploadProductImage: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const productCode = getString(formData, 'product_code');
		const imageFile = formData.get('image_file');

		if (!productCode) return fail(400, { message: 'Kode produk tidak ditemukan.' });
		if (!(imageFile instanceof File)) return fail(400, { message: 'File gambar tidak valid.' });

		const uploadResult = await uploadProductImage(imageFile, productCode);

		if (!uploadResult.success || !uploadResult.publicUrl) {
			return fail(400, { message: uploadResult.message });
		}

		const updateResult = await updateProductImageByProductCode(productCode, uploadResult.publicUrl);

		if (!updateResult.success) {
			return fail(400, { message: updateResult.message });
		}

		return { message: 'Foto produk berhasil diunggah dan diperbarui.' };
	},

	toggleActive: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const productCode = getString(formData, 'product_code');
		const nextActive = getString(formData, 'next_active') === 'true';

		if (!productCode) return fail(400, { message: 'Kode produk tidak ditemukan.' });

		const result = await toggleProductActive(productCode, nextActive);

		if (!result.success) return fail(400, { message: result.message });

		return { message: result.message };
	},

	deleteProduct: async ({ request, cookies }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const productCode = getString(formData, 'product_code');

		if (!productCode) return fail(400, { message: 'Kode produk tidak ditemukan.' });

		const result = await deleteProductByProductCode(productCode);

		if (!result.success) return fail(400, { message: result.message });

		return { message: result.message };
	}
};