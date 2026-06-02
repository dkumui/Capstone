import { createAdminSupabaseClient } from '$lib/supabase/admin';
import { randomUUID } from 'crypto';

const PRODUCT_IMAGE_BUCKET = 'product-images';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export interface UploadImageResult {
	success: boolean;
	message: string;
	publicUrl: string | null;
	path: string | null;
}

function getFileExtension(file: File): string {
	if (file.type === 'image/jpeg') return 'jpg';
	if (file.type === 'image/png') return 'png';
	if (file.type === 'image/webp') return 'webp';
	return 'bin';
}

export async function uploadProductImage(file: File, productCode: string): Promise<UploadImageResult> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			success: false,
			message: 'Supabase admin client belum dikonfigurasi.',
			publicUrl: null,
			path: null
		};
	}

	if (!file || file.size === 0) {
		return {
			success: false,
			message: 'File gambar belum dipilih.',
			publicUrl: null,
			path: null
		};
	}

	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		return {
			success: false,
			message: 'Format gambar harus JPG, PNG, atau WebP.',
			publicUrl: null,
			path: null
		};
	}

	if (file.size > MAX_IMAGE_SIZE) {
		return {
			success: false,
			message: 'Ukuran gambar maksimal 2 MB.',
			publicUrl: null,
			path: null
		};
	}

	const ext = getFileExtension(file);
	const safeProductCode = productCode.toLowerCase().replace(/[^a-z0-9-]/g, '-');
	const path = `${safeProductCode}/${randomUUID()}.${ext}`;

	const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
		contentType: file.type,
		upsert: false
	});

	if (error) {
		return {
			success: false,
			message: error.message,
			publicUrl: null,
			path: null
		};
	}

	const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);

	return {
		success: true,
		message: 'Gambar produk berhasil diunggah.',
		publicUrl: data.publicUrl,
		path
	};
}