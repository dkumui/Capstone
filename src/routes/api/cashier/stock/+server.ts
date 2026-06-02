import { getStockByProductCode } from '$lib/services/inventoryService';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
  const productCode = url.searchParams.get('productCode');
  if (!productCode) return json({ error: 'productCode is required' }, { status: 400 });

  const stock = await getStockByProductCode(productCode);
  return json(stock);
};
