import { describe, it, expect } from 'vitest';
import { generateRuleBasedReply, type ChatRequestContext } from './engine';
import type { ProductTableRow } from '$lib/types/product-table';

const now = new Date().toISOString();

const SAMPLE_PRODUCTS: ProductTableRow[] = [
	{
		id: '1',
		product_code: 'HM-C1-001',
		name: 'Cap 1 Warna Biru',
		product_type: 'batik_cap',
		cap_type: 'cap_1_warna',
		color_variant: 'Biru',
		size_length_cm: 205,
		size_width_cm: 110,
		size_note: 'Kurang lebih 205 x 110 cm',
		price: 58000,
		stock_qty: 10,
		stock_status: 'ready',
		image_url: null,
		description: 'Batik Cap 1 Warna varian biru.',
		is_featured: true,
		is_active: true,
		source: 'seed',
		created_at: now,
		updated_at: now
	},
	{
		id: '2',
		product_code: 'HM-C2-001',
		name: 'Cap 2 Warna Hijau Kuning',
		product_type: 'batik_cap',
		cap_type: 'cap_2_warna',
		color_variant: 'Hijau Kuning',
		size_length_cm: 205,
		size_width_cm: 110,
		size_note: null,
		price: 62000,
		stock_qty: 3,
		stock_status: 'limited',
		image_url: null,
		description: null,
		is_featured: true,
		is_active: true,
		source: 'seed',
		created_at: now,
		updated_at: now
	},
	{
		id: '3',
		product_code: 'HM-C1-003',
		name: 'Cap 1 Warna Merah',
		product_type: 'batik_cap',
		cap_type: 'cap_1_warna',
		color_variant: 'Merah',
		size_length_cm: 205,
		size_width_cm: 110,
		size_note: 'Kurang lebih 205 x 110 cm',
		price: 58000,
		stock_qty: 0,
		stock_status: 'sold_out',
		image_url: null,
		description: null,
		is_featured: false,
		is_active: true,
		source: 'seed',
		created_at: now,
		updated_at: now
	},
	{
		id: '4',
		product_code: 'HM-C1-004',
		name: 'Cap 1 Warna Ungu',
		product_type: 'batik_cap',
		cap_type: 'cap_1_warna',
		color_variant: 'Ungu',
		size_length_cm: 205,
		size_width_cm: 110,
		size_note: null,
		price: 58000,
		stock_qty: null,
		stock_status: 'check_stock',
		image_url: null,
		description: null,
		is_featured: false,
		is_active: true,
		source: 'seed',
		created_at: now,
		updated_at: now
	}
];

function reply(message: string, productCode?: string): { intent: string; answer: string } {
	const ctx: ChatRequestContext = { message, productCode, products: SAMPLE_PRODUCTS };
	return generateRuleBasedReply(ctx);
}

describe('generateRuleBasedReply', () => {
	describe('salam', () => {
		it('responds to a greeting', () => {
			const res = reply('Halo');
			expect(res.intent).toBe('salam');
			expect(res.answer).toContain('selamat datang');
		});
	});

	describe('out_of_scope', () => {
		it('rejects unrelated topics', () => {
			const res = reply('cuaca hari ini cerah');
			expect(res.intent).toBe('out_of_scope');
		});
	});

	describe('cek_produk', () => {
		it('returns product detail when productCode is provided', () => {
			const res = reply('info produk batik ini', 'HM-C1-001');
			expect(res.intent).toBe('cek_produk');
			expect(res.answer).toContain('Cap 1 Warna Biru');
		});

		it('returns generic product info when no productCode', () => {
			const res = reply('produk katalog batik');
			expect(res.intent).toBe('cek_produk');
			expect(res.answer).toContain('Batik Cap');
		});

		it('triggers cek_produk when "batik cap" appears even with price words', () => {
			const res = reply('harga batik cap 1 berapa');
			expect(res.intent).toBe('cek_produk');
		});
	});

	describe('cek_harga', () => {
		it('returns price for a matched color product via productCode', () => {
			const res = reply('harga batik ini berapa', 'HM-C1-001');
			expect(res.intent).toBe('cek_harga');
			expect(res.answer).toContain('58.000');
		});

		it('returns both prices for generic price query', () => {
			const res = reply('harga kain batik berapa');
			expect(res.intent).toBe('cek_harga');
			expect(res.answer).toContain('Rp58.000');
			expect(res.answer).toContain('Rp62.000');
		});
	});

	describe('cek_ukuran', () => {
		it('returns size info', () => {
			const res = reply('ukuran kain batik');
			expect(res.intent).toBe('cek_ukuran');
			expect(res.answer).toContain('205 x 110');
		});
	});

	describe('cek_warna', () => {
		it('returns specific color product info when color matched', () => {
			const res = reply('ada warna biru batik tidak');
			expect(res.intent).toBe('cek_warna');
			expect(res.answer).toContain('Cap 1 Warna Biru');
		});

		it('returns all color options for generic warna query', () => {
			const res = reply('warna kain batik');
			expect(res.intent).toBe('cek_warna');
			expect(res.answer).toContain('Cap 1 Warna');
			expect(res.answer).toContain('Cap 2 Warna');
		});
	});

	describe('cek_stok', () => {
		it('returns stock info for a ready product via productCode', () => {
			const res = reply('stok batik ini', 'HM-C1-001');
			expect(res.intent).toBe('cek_stok');
			expect(res.answer).toContain('Tersedia');
		});

		it('returns sold out message for sold_out product via productCode', () => {
			const res = reply('stok batik ini', 'HM-C1-003');
			expect(res.intent).toBe('cek_stok');
			expect(res.answer).toContain('habis');
		});

		it('returns check_stock message for unconfirmed product via productCode', () => {
			const res = reply('stok batik ini', 'HM-C1-004');
			expect(res.intent).toBe('cek_stok');
			expect(res.answer).toContain('konfirmasi admin');
		});

		it('prompts to specify color when no match', () => {
			const res = reply('stok batik');
			expect(res.intent).toBe('cek_stok');
			expect(res.answer).toContain('sebutkan warna');
		});
	});

	describe('cek_pemesanan', () => {
		it('returns ordering info', () => {
			const res = reply('cara pesan batik');
			expect(res.intent).toBe('cek_pemesanan');
			expect(res.answer).toContain('Pemesanan');
		});
	});

	describe('cek_pengiriman', () => {
		it('returns shipping info', () => {
			const res = reply('pengiriman batik bisa kemana');
			expect(res.intent).toBe('cek_pengiriman');
			expect(res.answer).toContain('Pengiriman');
		});
	});

	describe('cek_lokasi', () => {
		it('returns store address', () => {
			const res = reply('alamat toko batik dimana');
			expect(res.intent).toBe('cek_lokasi');
			expect(res.answer).toContain('Alamat toko');
		});
	});

	describe('cek_seragam', () => {
		it('returns uniform info', () => {
			const res = reply('batik untuk seragam bisa');
			expect(res.intent).toBe('cek_seragam');
			expect(res.answer).toContain('seragam');
		});
	});

	describe('productCode lookup', () => {
		it('uses productCode to find product for price query', () => {
			const res = reply('harga batik ini berapa', 'HM-C1-001');
			expect(res.intent).toBe('cek_harga');
			expect(res.answer).toContain('Cap 1 Warna Biru');
		});
	});

	describe('size_note fallback', () => {
		it('uses dimension fallback when size_note is null', () => {
			const res = reply('harga batik hijau kuning berapa');
			expect(res.intent).toBe('cek_harga');
			expect(res.answer).toContain('205');
			expect(res.answer).toContain('110');
		});
	});

	describe('color keyword triggers cek_warna over cek_stok', () => {
		it('returns cek_warna when both stok and color keywords are present', () => {
			const res = reply('stok batik biru ada tidak');
			expect(res.intent).toBe('cek_warna');
		});
	});
});
