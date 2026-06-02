import { MOCK_PRODUCTS } from '$lib/mock/products';
import type { ProductTableRow } from '$lib/types/product-table';

export const OUT_OF_SCOPE_REPLY =
  'Maaf, saya hanya dapat membantu pertanyaan seputar Batik HM Akmal, produk batik cap, harga, ukuran, warna, stok, pemesanan, pengiriman, dan informasi toko.';

export interface FaqItem {
  question: string;
  answer: string;
  keywords: string[];
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Produk fokus apa?',
    answer: 'Produk kami fokus pada Batik Cap.',
    keywords: ['produk', 'fokus', 'batik cap']
  },
  {
    question: 'Harga Cap 1 Warna',
    answer: 'Harga Batik Cap 1 Warna adalah Rp58.000.',
    keywords: ['harga cap 1', 'cap 1 warna', '58.000']
  },
  {
    question: 'Harga Cap 2 Warna',
    answer: 'Harga Batik Cap 2 Warna adalah Rp62.000.',
    keywords: ['harga cap 2', 'cap 2 warna', '62.000']
  },
  {
    question: 'Ukuran kain',
    answer: 'Ukuran kain kurang lebih 205 x 110 cm.',
    keywords: ['ukuran', '205', '110']
  },
  {
    question: 'Info stok',
    answer:
      'Stok harus dicek dari sistem kasir. Jika stok belum tersedia, mohon tunggu konfirmasi admin.',
    keywords: ['stok', 'ready', 'tersedia', 'habis']
  },
  {
    question: 'Perbedaan warna foto',
    answer: 'Warna pada foto dapat sedikit berbeda karena pencahayaan dan layar perangkat.',
    keywords: ['warna foto', 'pencahayaan', 'layar']
  }
];

export const DEFAULT_PRODUCTS: ProductTableRow[] = MOCK_PRODUCTS;

export const CAP_1_COLORS = ['Biru', 'Hijau Lemon', 'Merah', 'Merah Maroon', 'Turquoise', 'Ungu'];
export const CAP_2_COLORS = [
  'Hijau Kuning',
  'Hijau Cokelat',
  'Biru Pink',
  'Cokelat Pink',
  'Hijau Turquoise'
];
