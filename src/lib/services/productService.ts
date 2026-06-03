import { getPublicProducts as getInventoryProducts, getStockByProductCode } from '$lib/services/inventoryService';
import type { Product, ProductFilterInput } from '$lib/types/domain';
import { capTypeLabel } from '$lib/utils/format';
import { toSlug } from '$lib/utils/slug';

function toLegacyStockStatus(stockStatus: 'ready' | 'limited' | 'sold_out' | 'check_stock' | 'not_found'): Product['stockStatus'] {
  if (stockStatus === 'ready') return 'IN_STOCK';
  if (stockStatus === 'limited') return 'LOW_STOCK';
  if (stockStatus === 'sold_out') return 'OUT_OF_STOCK';
  return 'NEEDS_CONFIRMATION';
}

export async function getPublicProducts(filter: ProductFilterInput = {}): Promise<Product[]> {
  const products = await getInventoryProducts();

  const filtered = products.filter((product) => {
    const capOk = !filter.capType || filter.capType === 'ALL' ? true : product.cap_type.toUpperCase() === filter.capType;
    const colorOk = filter.searchColor?.trim()
      ? product.color_variant.toLowerCase().includes(filter.searchColor.toLowerCase())
      : true;
    return capOk && colorOk;
  });

  return Promise.all(
    filtered.map(async (product) => {
      const stock = await getStockByProductCode(product.product_code);

      return {
        id: product.id,
        slug: toSlug(product.name),
        name: product.name,
        capType: product.cap_type === 'cap_1_warna' ? 'CAP_1_WARNA' as const : 'CAP_2_WARNA' as const,
        colorVariant: product.color_variant,
        sizeText: product.size_note ?? `Kurang lebih ${product.size_length_cm} x ${product.size_width_cm} cm`,
        price: product.price,
        description: product.description ?? '',
        isActive: product.is_active,
        isFeatured: product.is_featured,
        stockStatus: toLegacyStockStatus(stock.stockStatus),
        stockQuantity: stock.stockQty,
        images: [
          {
            id: `${product.id}-primary`,
            productId: product.id,
            imageUrl: product.image_url ?? '/placeholder-batik.svg',
            isPrimary: true
          }
        ]
      };
    })
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getPublicProducts();
  return products.find((product) => product.slug === slug) ?? null;
}
