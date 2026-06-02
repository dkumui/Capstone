import { error } from '@sveltejs/kit';
import { getProductBySlug } from '$lib/services/productService';

export const load = async ({ params }) => {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    throw error(404, 'Produk tidak ditemukan');
  }

  return { product };
};
