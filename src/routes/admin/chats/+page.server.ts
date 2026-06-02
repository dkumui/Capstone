import { requireAdmin } from '$lib/server/admin';
import { getAdminChatSessions } from '$lib/services/chatbot/persistence';

export const load = async ({ cookies }) => {
	requireAdmin(cookies);

	const chatSessions = await getAdminChatSessions();

	return {
		chatSessions
	};
};