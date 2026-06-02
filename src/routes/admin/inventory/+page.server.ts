import { requireAdmin } from '$lib/server/admin';
import { createAdminSupabaseClient } from '$lib/supabase/admin';

export const load = async ({ cookies }) => {
	requireAdmin(cookies);

	const supabase = createAdminSupabaseClient();

	let inventoryTransactions: Array<{
		id: string;
		product_code: string;
		previous_qty: number | null;
		new_qty: number | null;
		previous_stock_status: string | null;
		new_stock_status: string | null;
		source: string;
		note: string | null;
		created_at: string;
	}> = [];

	if (supabase) {
		const { data } = await supabase
			.from('inventory_transactions')
			.select('id,product_code,previous_qty,new_qty,previous_stock_status,new_stock_status,source,note,created_at')
			.order('created_at', { ascending: false })
			.limit(100);

		inventoryTransactions = data ?? [];
	}

	return {
		inventoryTransactions
	};
};