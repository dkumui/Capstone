import { describe, it, expect } from 'vitest';
import { formatRupiah, stockStatusLabel } from './format';

describe('formatRupiah', () => {
	it('formats zero', () => {
		expect(formatRupiah(0)).toContain('0');
	});

	it('formats a typical product price', () => {
		const result = formatRupiah(58000);
		expect(result).toContain('58');
	});

	it('formats a large number', () => {
		const result = formatRupiah(1000000);
		expect(result).toContain('1.000.000');
	});

	it('includes IDR currency indicator', () => {
		const result = formatRupiah(58000);
		expect(result).toMatch(/Rp|IDR/);
	});

	it('has no decimal fraction digits', () => {
		const result = formatRupiah(58000);
		expect(result).not.toMatch(/,\d{2}$/);
	});
});

describe('stockStatusLabel', () => {
	it('returns "Tersedia" for IN_STOCK', () => {
		expect(stockStatusLabel('IN_STOCK')).toBe('Tersedia');
	});

	it('returns "Stok Menipis" for LOW_STOCK', () => {
		expect(stockStatusLabel('LOW_STOCK')).toBe('Stok Menipis');
	});

	it('returns "Habis" for OUT_OF_STOCK', () => {
		expect(stockStatusLabel('OUT_OF_STOCK')).toBe('Habis');
	});

	it('returns fallback for unknown status', () => {
		expect(stockStatusLabel('UNKNOWN')).toBe('Perlu Konfirmasi Admin');
	});

	it('returns fallback for empty string', () => {
		expect(stockStatusLabel('')).toBe('Perlu Konfirmasi Admin');
	});
});
