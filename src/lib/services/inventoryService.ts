import { MOCK_PRODUCTS } from '$lib/mock/products';
import { createServerSupabaseClient } from '$lib/supabase/server';
import type { ProductTableRow } from '$lib/types/product-table';
import { createAdminSupabaseClient } from '$lib/supabase/admin';

export type InventoryStockStatus = 'ready' | 'limited' | 'sold_out' | 'check_stock' | 'not_found';

export interface InventoryStockResult {
  productCode: string;
  stockQty: number | null;
  stockStatus: InventoryStockStatus;
  source: 'supabase' | 'mock';
}

export interface InventoryTransactionInput {
  productCode: string;
  previousQty: number | null;
  newQty: number | null;
  changedBy?: string | null;
  note?: string | null;
}

function computeStockStatus(stockQty: number | null | undefined): Exclude<InventoryStockStatus, 'not_found'> {
  if (stockQty === null || stockQty === undefined) return 'check_stock';
  if (stockQty === 0) return 'sold_out';
  if (stockQty >= 1 && stockQty <= 5) return 'limited';
  return 'ready';
}

function mapRowToProduct(row: any): ProductTableRow {
	return {
		id: row.id,
		product_code: row.product_code,
		name: row.name,
		product_type: row.product_type,
		cap_type: row.cap_type,
		color_variant: row.color_variant,
		size_length_cm: row.size_length_cm,
		size_width_cm: row.size_width_cm,
		size_note: row.size_note,
		price: row.price,
		stock_qty: row.stock_qty,
		stock_status: computeStockStatus(row.stock_qty),
		image_url: row.image_url,
		description: row.description,
		is_featured: row.is_featured,
		is_active: row.is_active,
		source: row.source,
		created_at: row.created_at,
		updated_at: row.updated_at
	};
}

function getMockProducts(): ProductTableRow[] {
  return MOCK_PRODUCTS.map((product) => ({
    ...product,
    stock_status: computeStockStatus(product.stock_qty)
  }));
}

export async function getPublicProducts(): Promise<ProductTableRow[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return getMockProducts();

  const { data } = await supabase
    .from('products')
    .select('id, product_code, product_type, cap_type, color_variant, size_length_cm, size_width_cm, size_note, price, stock_qty, image_url, description, is_featured, is_active, source, created_at, updated_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (!data || data.length === 0) return getMockProducts();
  return data.map(mapRowToProduct);
}

export async function getStockByProductCode(productCode: string): Promise<InventoryStockResult> {
  const supabase = createServerSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('product_code, stock_qty')
      .eq('product_code', productCode)
      .maybeSingle();

    if (error || !data) {
      return { productCode, stockQty: null, stockStatus: 'not_found', source: 'supabase' };
    }

    return {
      productCode,
      stockQty: data.stock_qty,
      stockStatus: computeStockStatus(data.stock_qty),
      source: 'supabase'
    };
  }

  const product = MOCK_PRODUCTS.find((item) => item.product_code === productCode);
  if (!product) {
    return { productCode, stockQty: null, stockStatus: 'not_found', source: 'mock' };
  }

  return {
    productCode,
    stockQty: product.stock_qty,
    stockStatus: computeStockStatus(product.stock_qty),
    source: 'mock'
  };
}

export async function getProductByProductCode(productCode: string): Promise<ProductTableRow | null> {
  const products = await getPublicProducts();
  return products.find((item) => item.product_code === productCode) ?? null;
}

export async function getAdminProducts(): Promise<ProductTableRow[]> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return getPublicProducts();
	}

	const { data, error } = await supabase
		.from('products')
		.select(
			'id, product_code, product_type, cap_type, color_variant, size_length_cm, size_width_cm, size_note, price, stock_qty, image_url, description, is_featured, is_active, source, created_at, updated_at'
		)
		.order('created_at', { ascending: false });

	if (error || !data) {
		return getPublicProducts();
	}

	return data.map(mapRowToProduct);
}

export async function logInventoryTransaction(input: InventoryTransactionInput): Promise<void> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return;

  await supabase.from('inventory_transactions').insert({
    product_code: input.productCode,
    previous_qty: input.previousQty,
    new_qty: input.newQty,
    changed_by: input.changedBy ?? null,
    note: input.note ?? null,
    source: 'manual'
  });
}

export function getComputedStockStatus(
	stockQty: number | null | undefined
): Exclude<InventoryStockStatus, 'not_found'> {
	return computeStockStatus(stockQty);
}

export interface CreateProductInput {
	productCode: string;
	name: string;
	capType: 'cap_1_warna' | 'cap_2_warna';
	colorVariant: string;
	sizeLengthCm: number;
	sizeWidthCm: number;
	sizeNote: string;
	price: number;
	stockQty: number | null;
	imageUrl?: string | null;
	description?: string | null;
	isFeatured: boolean;
	isActive: boolean;
}

export interface UpdateStockInput {
	productCode: string;
	stockQty: number | null;
}

export async function createProduct(input: CreateProductInput): Promise<{
	success: boolean;
	message: string;
}> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			success: false,
			message: 'Supabase admin client belum dikonfigurasi.'
		};
	}

	const { error } = await supabase.from('products').insert({
		product_code: input.productCode,
		name: input.name,
		product_type: 'batik_cap',
		cap_type: input.capType,
		color_variant: input.colorVariant,
		size_length_cm: input.sizeLengthCm,
		size_width_cm: input.sizeWidthCm,
		size_note: input.sizeNote,
		price: input.price,
		stock_qty: input.stockQty,
		stock_status: computeStockStatus(input.stockQty),
		image_url: input.imageUrl ?? null,
		description: input.description ?? null,
		is_featured: input.isFeatured,
		is_active: input.isActive,
		source: 'manual'
	});

	if (error) {
		return {
			success: false,
			message: error.message
		};
	}

	return {
		success: true,
		message: 'Produk berhasil ditambahkan.'
	};
}

export async function updateStockByProductCode(input: UpdateStockInput): Promise<{
	success: boolean;
	message: string;
}> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			success: false,
			message: 'Supabase admin client belum dikonfigurasi.'
		};
	}

	const { error } = await supabase
		.from('products')
		.update({
			stock_qty: input.stockQty,
			stock_status: computeStockStatus(input.stockQty)
		})
		.eq('product_code', input.productCode);

	if (error) {
		return {
			success: false,
			message: error.message
		};
	}

	return {
		success: true,
		message: 'Stok produk berhasil diperbarui.'
	};
}

export async function toggleProductActive(productCode: string, isActive: boolean): Promise<{
	success: boolean;
	message: string;
}> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			success: false,
			message: 'Supabase admin client belum dikonfigurasi.'
		};
	}

	const { error } = await supabase
		.from('products')
		.update({
			is_active: isActive
		})
		.eq('product_code', productCode);

	if (error) {
		return {
			success: false,
			message: error.message
		};
	}

	return {
		success: true,
		message: isActive ? 'Produk berhasil diaktifkan.' : 'Produk berhasil disembunyikan.'
	};
}

export async function deleteProductByProductCode(productCode: string): Promise<{
	success: boolean;
	message: string;
}> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			success: false,
			message: 'Supabase admin client belum dikonfigurasi.'
		};
	}

	const { error } = await supabase.from('products').delete().eq('product_code', productCode);

	if (error) {
		return {
			success: false,
			message: error.message
		};
	}

	return {
		success: true,
		message: 'Produk berhasil dihapus.'
	};
}

export interface UpdateProductInput {
	productCode: string;
	name: string;
	capType: 'cap_1_warna' | 'cap_2_warna';
	colorVariant: string;
	sizeLengthCm: number;
	sizeWidthCm: number;
	sizeNote: string;
	price: number;
	stockQty: number | null;
	imageUrl?: string | null;
	description?: string | null;
	isFeatured: boolean;
	isActive: boolean;
}

export async function updateProductByProductCode(input: UpdateProductInput): Promise<{
	success: boolean;
	message: string;
}> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			success: false,
			message: 'Supabase admin client belum dikonfigurasi.'
		};
	}

	const { error } = await supabase
		.from('products')
		.update({
			name: input.name,
			cap_type: input.capType,
			color_variant: input.colorVariant,
			size_length_cm: input.sizeLengthCm,
			size_width_cm: input.sizeWidthCm,
			size_note: input.sizeNote,
			price: input.price,
			stock_qty: input.stockQty,
			stock_status: computeStockStatus(input.stockQty),
			image_url: input.imageUrl ?? null,
			description: input.description ?? null,
			is_featured: input.isFeatured,
			is_active: input.isActive
		})
		.eq('product_code', input.productCode);

	if (error) {
		return {
			success: false,
			message: error.message
		};
	}

	return {
		success: true,
		message: 'Produk berhasil diperbarui.'
	};
}

export async function updateProductImageByProductCode(productCode: string, imageUrl: string): Promise<{
	success: boolean;
	message: string;
}> {
	const supabase = createAdminSupabaseClient();

	if (!supabase) {
		return {
			success: false,
			message: 'Supabase admin client belum dikonfigurasi.'
		};
	}

	const { error } = await supabase
		.from('products')
		.update({
			image_url: imageUrl
		})
		.eq('product_code', productCode);

	if (error) {
		return {
			success: false,
			message: error.message
		};
	}

	return {
		success: true,
		message: 'Foto produk berhasil diperbarui.'
	};
}