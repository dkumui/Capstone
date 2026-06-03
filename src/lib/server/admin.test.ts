import { describe, it, expect } from 'vitest';
import { getString, getNumber, getNullableNumber, parseCapType } from './admin';

function makeFormData(entries: Record<string, string>): FormData {
	const fd = new FormData();
	for (const [key, value] of Object.entries(entries)) {
		fd.set(key, value);
	}
	return fd;
}

describe('getString', () => {
	it('returns trimmed string value', () => {
		const fd = makeFormData({ name: '  Hello  ' });
		expect(getString(fd, 'name')).toBe('Hello');
	});

	it('returns empty string for missing key', () => {
		const fd = makeFormData({});
		expect(getString(fd, 'missing')).toBe('');
	});

	it('converts non-string values to string', () => {
		const fd = makeFormData({ num: '42' });
		expect(getString(fd, 'num')).toBe('42');
	});
});

describe('getNumber', () => {
	it('parses a valid integer', () => {
		const fd = makeFormData({ price: '58000' });
		expect(getNumber(fd, 'price')).toBe(58000);
	});

	it('parses a valid decimal', () => {
		const fd = makeFormData({ val: '3.14' });
		expect(getNumber(fd, 'val')).toBe(3.14);
	});

	it('returns 0 for non-numeric value', () => {
		const fd = makeFormData({ val: 'abc' });
		expect(getNumber(fd, 'val')).toBe(0);
	});

	it('returns 0 for missing key', () => {
		const fd = makeFormData({});
		expect(getNumber(fd, 'missing')).toBe(0);
	});

	it('returns 0 for empty string', () => {
		const fd = makeFormData({ val: '' });
		expect(getNumber(fd, 'val')).toBe(0);
	});

	it('returns 0 for Infinity', () => {
		const fd = makeFormData({ val: 'Infinity' });
		expect(getNumber(fd, 'val')).toBe(0);
	});
});

describe('getNullableNumber', () => {
	it('parses a valid integer', () => {
		const fd = makeFormData({ qty: '10' });
		expect(getNullableNumber(fd, 'qty')).toBe(10);
	});

	it('returns null for empty string', () => {
		const fd = makeFormData({ qty: '' });
		expect(getNullableNumber(fd, 'qty')).toBeNull();
	});

	it('returns null for missing key', () => {
		const fd = makeFormData({});
		expect(getNullableNumber(fd, 'missing')).toBeNull();
	});

	it('returns null for non-numeric value', () => {
		const fd = makeFormData({ qty: 'abc' });
		expect(getNullableNumber(fd, 'qty')).toBeNull();
	});

	it('returns null for Infinity', () => {
		const fd = makeFormData({ qty: 'Infinity' });
		expect(getNullableNumber(fd, 'qty')).toBeNull();
	});

	it('parses zero correctly', () => {
		const fd = makeFormData({ qty: '0' });
		expect(getNullableNumber(fd, 'qty')).toBe(0);
	});

	it('parses negative number', () => {
		const fd = makeFormData({ qty: '-5' });
		expect(getNullableNumber(fd, 'qty')).toBe(-5);
	});

	it('returns null for whitespace-only', () => {
		const fd = makeFormData({ qty: '   ' });
		expect(getNullableNumber(fd, 'qty')).toBeNull();
	});
});

describe('parseCapType', () => {
	it('returns "cap_1_warna" for valid input', () => {
		expect(parseCapType('cap_1_warna')).toBe('cap_1_warna');
	});

	it('returns "cap_2_warna" for valid input', () => {
		expect(parseCapType('cap_2_warna')).toBe('cap_2_warna');
	});

	it('returns null for invalid value', () => {
		expect(parseCapType('cap_3_warna')).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(parseCapType('')).toBeNull();
	});

	it('returns null for uppercase variant', () => {
		expect(parseCapType('CAP_1_WARNA')).toBeNull();
	});
});
