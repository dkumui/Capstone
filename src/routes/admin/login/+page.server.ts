import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const password = String(formData.get('password') ?? '');

		if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_TOKEN) {
			return fail(500, {
				message: 'ADMIN_PASSWORD atau ADMIN_SESSION_TOKEN belum diatur di .env.'
			});
		}

		if (password !== env.ADMIN_PASSWORD) {
			return fail(401, {
				message: 'Password admin salah.'
			});
		}

		cookies.set('admin_session', env.ADMIN_SESSION_TOKEN, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 8
		});

		throw redirect(303, '/admin');
	}
};