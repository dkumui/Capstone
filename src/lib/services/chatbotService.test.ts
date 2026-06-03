import { describe, it, expect } from 'vitest';
import { generateChatbotReply, type ChatbotContext } from './chatbotService';
import { DEFAULT_COMPANY_SETTINGS } from '$lib/config/defaults';
import { INITIAL_PRODUCTS } from '$lib/data/seed';

const context: ChatbotContext = {
	company: DEFAULT_COMPANY_SETTINGS,
	products: INITIAL_PRODUCTS
};

function reply(message: string) {
	return generateChatbotReply(message, context);
}

describe('generateChatbotReply', () => {
	describe('out of scope', () => {
		it('rejects unrelated questions', () => {
			const res = reply('bagaimana cuaca hari ini?');
			expect(res.isOutOfScope).toBe(true);
			expect(res.answer).toContain('hanya bisa membantu');
		});

		it('rejects when no ALLOWED_TOPICS keyword present', () => {
			const res = reply('produk apa saja yang tersedia');
			expect(res.isOutOfScope).toBe(true);
		});
	});

	describe('produk / apa saja', () => {
		it('responds to product queries with allowed topic', () => {
			const res = reply('batik apa saja yang tersedia');
			expect(res.isOutOfScope).toBe(false);
			expect(res.answer).toContain('Batik Cap');
		});
	});

	describe('cap 1 warna apa', () => {
		it('lists cap 1 color variants with price', () => {
			const res = reply('cap 1 warna apa');
			expect(res.isOutOfScope).toBe(false);
			expect(res.answer).toContain('Rp58.000');
		});

		it('returns generic product answer when "apa saja" triggers produk branch first', () => {
			const res = reply('cap 1 warna apa saja');
			expect(res.isOutOfScope).toBe(false);
			expect(res.answer).toContain('Batik Cap');
		});
	});

	describe('cap 2 warna apa', () => {
		it('lists cap 2 color variants with price', () => {
			const res = reply('cap 2 warna apa');
			expect(res.isOutOfScope).toBe(false);
			expect(res.answer).toContain('Rp62.000');
		});
	});

	describe('harga cap 1', () => {
		it('returns cap 1 price', () => {
			const res = reply('harga cap 1');
			expect(res.answer).toBe('Harga Batik Cap 1 Warna adalah Rp58.000.');
		});
	});

	describe('harga cap 2', () => {
		it('returns cap 2 price', () => {
			const res = reply('harga cap 2');
			expect(res.answer).toBe('Harga Batik Cap 2 Warna adalah Rp62.000.');
		});
	});

	describe('ukuran', () => {
		it('returns size info', () => {
			const res = reply('ukuran batik berapa');
			expect(res.answer).toContain('205 x 110');
		});
	});

	describe('stok', () => {
		it('returns stock info', () => {
			const res = reply('stok batik ada');
			expect(res.isOutOfScope).toBe(false);
			expect(res.answer).toContain('sistem kasir');
		});
	});

	describe('pesan online', () => {
		it('returns ordering info', () => {
			const res = reply('bisa pesan online?');
			expect(res.answer).toContain('konfirmasi stok');
		});
	});

	describe('beli langsung', () => {
		it('includes store address', () => {
			const res = reply('bisa beli langsung batik?');
			expect(res.answer).toContain(DEFAULT_COMPANY_SETTINGS.address);
		});
	});

	describe('seragam', () => {
		it('returns out_of_scope since seragam is not in ALLOWED_TOPICS', () => {
			const res = reply('bisa untuk seragam?');
			expect(res.isOutOfScope).toBe(true);
		});

		it('returns uniform info when combined with an allowed topic keyword', () => {
			const res = reply('seragam batik bisa?');
			expect(res.isOutOfScope).toBe(false);
			expect(res.answer).toContain('seragam');
		});
	});

	describe('kirim', () => {
		it('returns shipping info', () => {
			const res = reply('bisa kirim ke luar kota batik?');
			expect(res.answer).toContain('stok');
		});
	});

	describe('alamat / lokasi', () => {
		it('returns address for alamat query', () => {
			const res = reply('alamat toko batik');
			expect(res.answer).toContain(DEFAULT_COMPANY_SETTINGS.address);
		});

		it('returns address for lokasi query', () => {
			const res = reply('lokasi toko batik');
			expect(res.answer).toContain(DEFAULT_COMPANY_SETTINGS.address);
		});
	});

	describe('FAQ fallback', () => {
		it('matches FAQ tags', () => {
			const res = reply('pengiriman batik');
			expect(res.isOutOfScope).toBe(false);
			expect(res.answer.length).toBeGreaterThan(0);
		});
	});

	describe('generic fallback', () => {
		it('returns default answer for in-scope but unmatched query', () => {
			const res = reply('batik');
			expect(res.isOutOfScope).toBe(false);
			expect(res.answer).toContain('Batik Cap');
		});
	});
});
