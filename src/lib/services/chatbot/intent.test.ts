import { describe, it, expect } from 'vitest';
import { detectIntent } from './intent';

describe('detectIntent', () => {
	describe('salam (greeting)', () => {
		it.each([
			'halo',
			'Hai admin',
			'Assalamualaikum',
			'Selamat pagi',
			'siang min',
			'sore',
			'malam'
		])('returns "salam" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('salam');
		});
	});

	describe('out_of_scope', () => {
		it('returns "out_of_scope" for unrelated text', () => {
			expect(detectIntent('cuaca hari ini cerah')).toBe('out_of_scope');
		});

		it('returns "out_of_scope" for empty string', () => {
			expect(detectIntent('')).toBe('out_of_scope');
		});

		it('returns "out_of_scope" for gibberish', () => {
			expect(detectIntent('xyz123')).toBe('out_of_scope');
		});

		it('returns "out_of_scope" when no scope keyword present', () => {
			expect(detectIntent('jual apa')).toBe('out_of_scope');
		});
	});

	describe('cek_produk', () => {
		it.each([
			'produk batik apa saja',
			'lihat katalog batik',
			'batik cap apa saja'
		])('returns "cek_produk" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('cek_produk');
		});

		it('prioritizes cek_produk when "batik cap" matches before price keywords', () => {
			expect(detectIntent('harga batik cap')).toBe('cek_produk');
		});

		it('prioritizes cek_produk when "apa saja" matches', () => {
			expect(detectIntent('warna batik apa saja')).toBe('cek_produk');
		});
	});

	describe('cek_harga', () => {
		it.each([
			'harga kain batik',
			'berapa harga kain',
			'rp batik'
		])('returns "cek_harga" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('cek_harga');
		});

		it('cek_harga takes precedence over cek_ukuran when "berapa" appears', () => {
			expect(detectIntent('ukuran kain batik berapa')).toBe('cek_harga');
		});
	});

	describe('cek_ukuran', () => {
		it('returns "cek_ukuran" for size queries without price keywords', () => {
			expect(detectIntent('ukuran kain batik')).toBe('cek_ukuran');
		});

		it('matches dimension keywords', () => {
			expect(detectIntent('panjang kain batik')).toBe('cek_ukuran');
			expect(detectIntent('lebar kain batik')).toBe('cek_ukuran');
		});
	});

	describe('cek_warna', () => {
		it.each([
			'warna kain batik',
			'varian batik',
			'batik biru',
			'batik hijau',
			'batik merah',
			'batik maroon',
			'batik turquoise',
			'batik ungu',
			'batik pink',
			'batik cokelat',
			'batik kuning'
		])('returns "cek_warna" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('cek_warna');
		});
	});

	describe('cek_stok', () => {
		it.each([
			'stok batik',
			'ready kain',
			'batik habis',
			'batik tersedia',
			'ada kain batik'
		])('returns "cek_stok" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('cek_stok');
		});

		it('cek_warna takes precedence over cek_stok when color keyword present', () => {
			expect(detectIntent('stok batik biru ada tidak')).toBe('cek_warna');
		});
	});

	describe('cek_pemesanan', () => {
		it.each([
			'cara pesan batik',
			'pemesanan kain',
			'order batik',
			'cara beli batik'
		])('returns "cek_pemesanan" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('cek_pemesanan');
		});

		it('cek_pemesanan takes precedence over cek_seragam when "pesan" matches first', () => {
			expect(detectIntent('pesan banyak batik')).toBe('cek_pemesanan');
		});
	});

	describe('cek_pengiriman', () => {
		it.each([
			'kirim batik',
			'pengiriman kain',
			'ongkir batik',
			'antar batik',
			'ekspedisi batik'
		])('returns "cek_pengiriman" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('cek_pengiriman');
		});
	});

	describe('cek_lokasi', () => {
		it.each([
			'alamat toko',
			'lokasi toko batik',
			'toko dimana',
			'maps toko'
		])('returns "cek_lokasi" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('cek_lokasi');
		});
	});

	describe('cek_seragam', () => {
		it.each([
			'seragam batik',
			'batik instansi',
			'batik komunitas',
			'batik partai'
		])('returns "cek_seragam" for "%s"', (input) => {
			expect(detectIntent(input)).toBe('cek_seragam');
		});
	});

	describe('priority: greeting beats other intents', () => {
		it('returns "salam" when greeting keyword appears alongside scope keyword', () => {
			expect(detectIntent('halo, saya mau lihat produk batik')).toBe('salam');
		});
	});

	describe('case insensitivity', () => {
		it('handles uppercase input', () => {
			expect(detectIntent('HARGA KAIN BATIK')).toBe('cek_harga');
		});

		it('handles mixed case', () => {
			expect(detectIntent('Stok Batik')).toBe('cek_stok');
		});
	});
});
