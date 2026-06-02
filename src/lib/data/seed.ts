import type { FaqItem, Product } from '$lib/types/domain';

const SIZE_TEXT = 'Kurang lebih 205 x 110 cm';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', slug: 'cap-1-warna-biru', name: 'Cap 1 Warna Biru', capType: 'CAP_1_WARNA', colorVariant: 'Biru', sizeText: SIZE_TEXT, price: 58000, description: 'Batik Cap 1 Warna varian biru.', isActive: true, isFeatured: true, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p2', slug: 'cap-1-warna-hijau-lemon', name: 'Cap 1 Warna Hijau Lemon', capType: 'CAP_1_WARNA', colorVariant: 'Hijau Lemon', sizeText: SIZE_TEXT, price: 58000, description: 'Batik Cap 1 Warna varian hijau lemon.', isActive: true, isFeatured: true, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p3', slug: 'cap-1-warna-merah', name: 'Cap 1 Warna Merah', capType: 'CAP_1_WARNA', colorVariant: 'Merah', sizeText: SIZE_TEXT, price: 58000, description: 'Batik Cap 1 Warna varian merah.', isActive: true, isFeatured: true, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p4', slug: 'cap-1-warna-biru-v2', name: 'Cap 1 Warna Biru Varian Kedua', capType: 'CAP_1_WARNA', colorVariant: 'Biru', sizeText: SIZE_TEXT, price: 58000, description: 'Batik Cap 1 Warna biru varian kedua.', isActive: true, isFeatured: false, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p5', slug: 'cap-1-warna-merah-maroon', name: 'Cap 1 Warna Merah Maroon', capType: 'CAP_1_WARNA', colorVariant: 'Merah Maroon', sizeText: SIZE_TEXT, price: 58000, description: 'Batik Cap 1 Warna varian merah maroon.', isActive: true, isFeatured: true, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p6', slug: 'cap-1-warna-turquoise', name: 'Cap 1 Warna Turquoise', capType: 'CAP_1_WARNA', colorVariant: 'Turquoise', sizeText: SIZE_TEXT, price: 58000, description: 'Batik Cap 1 Warna varian turquoise.', isActive: true, isFeatured: false, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p7', slug: 'cap-1-warna-ungu', name: 'Cap 1 Warna Ungu', capType: 'CAP_1_WARNA', colorVariant: 'Ungu', sizeText: SIZE_TEXT, price: 58000, description: 'Batik Cap 1 Warna varian ungu.', isActive: true, isFeatured: false, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p8', slug: 'cap-2-warna-hijau-kuning', name: 'Cap 2 Warna Hijau Kuning', capType: 'CAP_2_WARNA', colorVariant: 'Hijau Kuning', sizeText: SIZE_TEXT, price: 62000, description: 'Batik Cap 2 Warna varian hijau kuning.', isActive: true, isFeatured: true, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p9', slug: 'cap-2-warna-hijau-cokelat', name: 'Cap 2 Warna Hijau Cokelat', capType: 'CAP_2_WARNA', colorVariant: 'Hijau Cokelat', sizeText: SIZE_TEXT, price: 62000, description: 'Batik Cap 2 Warna varian hijau cokelat.', isActive: true, isFeatured: false, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p10', slug: 'cap-2-warna-biru-pink', name: 'Cap 2 Warna Biru Pink', capType: 'CAP_2_WARNA', colorVariant: 'Biru Pink', sizeText: SIZE_TEXT, price: 62000, description: 'Batik Cap 2 Warna varian biru pink.', isActive: true, isFeatured: true, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p11', slug: 'cap-2-warna-cokelat-pink', name: 'Cap 2 Warna Cokelat Pink', capType: 'CAP_2_WARNA', colorVariant: 'Cokelat Pink', sizeText: SIZE_TEXT, price: 62000, description: 'Batik Cap 2 Warna varian cokelat pink.', isActive: true, isFeatured: false, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] },
  { id: 'p12', slug: 'cap-2-warna-hijau-turquoise', name: 'Cap 2 Warna Hijau Turquoise', capType: 'CAP_2_WARNA', colorVariant: 'Hijau Turquoise', sizeText: SIZE_TEXT, price: 62000, description: 'Batik Cap 2 Warna varian hijau turquoise.', isActive: true, isFeatured: true, stockStatus: 'NEEDS_CONFIRMATION', stockQuantity: null, images: [] }
];

export const INITIAL_FAQ: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Bisa pesan online?',
    answer: 'Pemesanan dilakukan setelah konfirmasi stok melalui chatbot atau WhatsApp admin.',
    tags: ['pesan', 'online'],
    isActive: true
  },
  {
    id: 'faq-2',
    question: 'Bisa kirim ke luar kota?',
    answer: 'Bisa, pengiriman tersedia setelah detail pesanan dan stok dikonfirmasi.',
    tags: ['pengiriman'],
    isActive: true
  }
];
