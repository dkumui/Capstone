import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { timingSafeEqual } from 'crypto';
import type { Cookies } from '@sveltejs/kit';

function safeEqual(a: string, b: string): boolean {
	try {
		const bufA = Buffer.from(a);
		const bufB = Buffer.from(b);
		if (bufA.length !== bufB.length) return false;
		return timingSafeEqual(bufA, bufB);
	} catch {
		return false;
	}
}

export function requireAdmin(cookies: Cookies) {
	const session = cookies.get('admin_session');

	if (!env.ADMIN_SESSION_TOKEN || !session || !safeEqual(session, env.ADMIN_SESSION_TOKEN)) {
		throw redirect(303, '/admin/login');
	}
}

export function getString(formData: FormData, key: string): string {
	return String(formData.get(key) ?? '').trim();
}

export function getNumber(formData: FormData, key: string): number {
	const raw = getString(formData, key);
	const value = Number(raw);

	if (!Number.isFinite(value)) {
		return 0;
	}

	return value;
}

export function getNullableNumber(formData: FormData, key: string): number | null {
	const raw = getString(formData, key);

	if (raw === '') {
		return null;
	}

	const value = Number(raw);

	if (!Number.isFinite(value)) {
		return null;
	}

	return value;
}

export type AdminCapType = 'cap_1_warna' | 'cap_2_warna';

export function parseCapType(value: string): AdminCapType | null {
	if (value === 'cap_1_warna' || value === 'cap_2_warna') {
		return value;
	}

	return null;
}