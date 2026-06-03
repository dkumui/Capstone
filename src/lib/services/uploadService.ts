import { createAdminSupabaseClient } from '$lib/supabase/admin';
import { err } from '$lib/utils/result';
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

function errUpload(message: string): UploadImageResult {
	return { ...err(message), publicUrl: null, path: null };
}

function getFileExtension(file: File): string {
	if (file.type === 'image/jpeg') return 'jpg';
	if (file.type === 'image/png') return 'png';
	if (file.type === 'image/webp') return 'webp';
	return 'bin';
}

export async function uploadProductImage(file: File, productCode: string): Promise<UploadImageResult> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) return errUpload('Supabase admin client belum dikonfigurasi.');
	if (!file || file.size === 0) return errUpload('File gambar belum dipilih.');
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return errUpload('Format gambar harus JPG, PNG, atau WebP.');
	if (file.size > MAX_IMAGE_SIZE) return errUpload('Ukuran gambar maksimal 2 MB.');

	const ext = getFileExtension(file);
	const safeProductCode = productCode.toLowerCase().replace(/[^a-z0-9-]/g, '-');
	const path = `${safeProductCode}/${randomUUID()}.${ext}`;

	const { error } = await supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
		contentType: file.type,
		upsert: false
	});

	if (error) return errUpload(error.message);

	const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);

	return {
		success: true,
		message: 'Gambar produk berhasil diunggah.',
		publicUrl: data.publicUrl,
		path
	};
}
