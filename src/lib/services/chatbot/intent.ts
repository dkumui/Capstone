export type ChatIntent =
	| 'salam'
	| 'cek_produk'
	| 'cek_harga'
	| 'cek_ukuran'
	| 'cek_warna'
	| 'cek_stok'
	| 'cek_pemesanan'
	| 'cek_pengiriman'
	| 'cek_lokasi'
	| 'cek_seragam'
	| 'out_of_scope';

const GREETING_KEYWORDS = [
	'halo',
	'hai',
	'min',
	'admin',
	'assalamualaikum',
	'pagi',
	'siang',
	'sore',
	'malam'
];

const PATTERNS: Array<{ intent: Exclude<ChatIntent, 'out_of_scope' | 'salam'>; keywords: string[] }> = [
	{ intent: 'cek_produk', keywords: ['produk', 'katalog', 'batik cap', 'apa saja', 'jual apa'] },
	{ intent: 'cek_harga', keywords: ['harga', 'berapa', 'rp', '58.000', '62.000'] },
	{ intent: 'cek_ukuran', keywords: ['ukuran', 'panjang', 'lebar', '205', '110'] },
	{
		intent: 'cek_warna',
		keywords: [
			'warna',
			'varian',
			'biru',
			'hijau',
			'merah',
			'maroon',
			'turquoise',
			'ungu',
			'pink',
			'cokelat',
			'kuning'
		]
	},
	{ intent: 'cek_stok', keywords: ['stok', 'ready', 'habis', 'tersedia', 'tersisa', 'ada'] },
	{ intent: 'cek_pemesanan', keywords: ['pesan', 'pemesanan', 'order', 'beli online', 'cara beli'] },
	{ intent: 'cek_pengiriman', keywords: ['kirim', 'pengiriman', 'ongkir', 'antar', 'ekspedisi'] },
	{ intent: 'cek_lokasi', keywords: ['alamat', 'lokasi', 'toko', 'dimana', 'maps'] },
	{ intent: 'cek_seragam', keywords: ['seragam', 'instansi', 'komunitas', 'partai', 'banyak'] }
];

const ALLOWED_SCOPE_KEYWORDS = [
	'batik',
	'hm akmal',
	'unggul jaya',
	'cap',
	'harga',
	'ukuran',
	'warna',
	'stok',
	'pesan',
	'pengiriman',
	'alamat',
	'lokasi',
	'seragam',
	'katalog',
	'produk',
	'beli',
	'toko',
	'kain'
];

export function detectIntent(input: string): ChatIntent {
	const text = input.toLowerCase();

	if (GREETING_KEYWORDS.some((word) => text.includes(word))) {
		return 'salam';
	}

	const inScope = ALLOWED_SCOPE_KEYWORDS.some((word) => text.includes(word));
	if (!inScope) return 'out_of_scope';

	for (const pattern of PATTERNS) {
		if (pattern.keywords.some((keyword) => text.includes(keyword))) {
			return pattern.intent;
		}
	}

	return 'out_of_scope';
}