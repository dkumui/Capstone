import { requireAdmin } from '$lib/server/admin';
import { getAdminProducts } from '$lib/services/inventoryService';
import { getAdminChatSessions } from '$lib/services/chatbot/persistence';
import { createAdminSupabaseClient } from '$lib/supabase/admin';

export const load = async ({ cookies }) => {
	requireAdmin(cookies);

	const [products, chatSessions] = await Promise.all([
		getAdminProducts(),
		getAdminChatSessions()
	]);

	const supabase = createAdminSupabaseClient();

	let inventoryTransactionCount = 0;

	if (supabase) {
		const { count } = await supabase
			.from('inventory_transactions')
			.select('id', { count: 'exact', head: true });

		inventoryTransactionCount = count ?? 0;
	}

	return {
		products,
		chatSessions,
		inventoryTransactionCount
	};
};