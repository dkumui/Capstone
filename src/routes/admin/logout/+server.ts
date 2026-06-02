import { redirect } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	cookies.delete('admin_session', {
		path: '/'
	});

	throw redirect(303, '/admin/login');
};

export const GET = async ({ cookies }) => {
	cookies.delete('admin_session', {
		path: '/'
	});

	throw redirect(303, '/admin/login');
};