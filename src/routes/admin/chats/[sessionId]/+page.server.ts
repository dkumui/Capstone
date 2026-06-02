import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	getAdminChatThread,
	insertAdminChatReply,
	updateChatSessionStatus,
	type ChatSessionStatus
} from '$lib/services/chatbot/persistence';

function requireAdmin(cookies: import('@sveltejs/kit').Cookies) {
	const session = cookies.get('admin_session');

	if (!env.ADMIN_SESSION_TOKEN || session !== env.ADMIN_SESSION_TOKEN) {
		throw redirect(303, '/admin/login');
	}
}

function getString(formData: FormData, key: string): string {
	return String(formData.get(key) ?? '').trim();
}

function parseStatus(value: string): ChatSessionStatus | null {
	if (value === 'open' || value === 'pending' || value === 'closed') {
		return value;
	}

	return null;
}

export const load = async ({ cookies, params }) => {
	requireAdmin(cookies);

	const thread = await getAdminChatThread(params.sessionId);

	if (!thread.session) {
		throw redirect(303, '/admin#chat');
	}

	return thread;
};

export const actions = {
	reply: async ({ request, cookies, params }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const message = getString(formData, 'message');

		const result = await insertAdminChatReply({
			sessionId: params.sessionId,
			message
		});

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	},

	updateStatus: async ({ request, cookies, params }) => {
		requireAdmin(cookies);

		const formData = await request.formData();
		const status = parseStatus(getString(formData, 'status'));

		if (!status) {
			return fail(400, {
				message: 'Status tidak valid.'
			});
		}

		const result = await updateChatSessionStatus({
			sessionId: params.sessionId,
			status
		});

		if (!result.success) {
			return fail(400, {
				message: result.message
			});
		}

		return {
			message: result.message
		};
	}
};