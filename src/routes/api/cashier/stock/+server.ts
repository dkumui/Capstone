import { getStockByProductCode } from '$lib/services/inventoryService';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { timingSafeEqual } from 'crypto';

function isValidApiKey(provided: string): boolean {
  const expected = env.CASHIER_API_KEY;
  if (!expected) return false;

  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const GET = async ({ url, request }) => {
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token || !isValidApiKey(token)) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const productCode = url.searchParams.get('productCode');
  if (!productCode) return json({ error: 'productCode is required' }, { status: 400 });

  const stock = await getStockByProductCode(productCode);
  return json(stock);
};
