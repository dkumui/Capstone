import type { CompanyProfileData, ProductTableRow, ServiceData } from '$lib/types/product-table';

const now = new Date().toISOString();

export const MOCK_COMPANY: CompanyProfileData = {
  business_name: 'Batik HM Akmal',
  subtitle: 'Batik Cap Pekalongan untuk kebutuhan kain, jahit, dan seragam',
  profile:
    'Batik HM Akmal atau Unggul Jaya Banyurip adalah UMKM batik cap Pekalongan yang fokus pada kualitas warna, motif, dan kemudahan pemesanan lewat chat/WhatsApp.',
  address:
    'Jl. Gatot Subroto No.628, Banyurip Alit, Kec. Pekalongan Selatan, Kota Pekalongan, Jawa Tengah 51139',
  whatsapp_number: '6281234567890',
  operation_hours: 'Senin - Sabtu, 08.00 - 16.30 WIB',
  maps_url: 'https://maps.google.com/?q=Jl.+Gatot+Subroto+No.628+Pekalongan'
};

export const MOCK_SERVICES: ServiceData[] = [
  {
    id: 'svc-1',
    title: 'Konsultasi Produk Batik Cap',
    description: 'Tanya warna, ukuran, harga, dan stok melalui chatbot atau WhatsApp admin.'
  },
  {
    id: 'svc-2',
    title: 'Pemesanan untuk Kain dan Seragam',
    description: 'Cocok untuk kebutuhan personal, jahit, komunitas, maupun seragam.'
  },
  {
    id: 'svc-3',
    title: 'Pengiriman Setelah Konfirmasi',
    description: 'Pengiriman diproses setelah stok diverifikasi dan pesanan dikonfirmasi admin.'
  }
];

export const MOCK_PRODUCTS: ProductTableRow[] = [
  { id: '1', product_code: 'HM-C1-001', name: 'Cap 1 Warna Biru', product_type: 'batik_cap', cap_type: 'cap_1_warna', color_variant: 'Biru', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 58000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 1 Warna varian biru.', is_featured: true, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '2', product_code: 'HM-C1-002', name: 'Cap 1 Warna Hijau Lemon', product_type: 'batik_cap', cap_type: 'cap_1_warna', color_variant: 'Hijau Lemon', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 58000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 1 Warna varian hijau lemon.', is_featured: true, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '3', product_code: 'HM-C1-003', name: 'Cap 1 Warna Merah', product_type: 'batik_cap', cap_type: 'cap_1_warna', color_variant: 'Merah', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 58000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 1 Warna varian merah.', is_featured: true, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '4', product_code: 'HM-C1-004', name: 'Cap 1 Warna Biru Varian Kedua', product_type: 'batik_cap', cap_type: 'cap_1_warna', color_variant: 'Biru', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 58000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 1 Warna biru varian kedua.', is_featured: false, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '5', product_code: 'HM-C1-005', name: 'Cap 1 Warna Merah Maroon', product_type: 'batik_cap', cap_type: 'cap_1_warna', color_variant: 'Merah Maroon', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 58000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 1 Warna varian merah maroon.', is_featured: true, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '6', product_code: 'HM-C1-006', name: 'Cap 1 Warna Turquoise', product_type: 'batik_cap', cap_type: 'cap_1_warna', color_variant: 'Turquoise', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 58000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 1 Warna varian turquoise.', is_featured: false, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '7', product_code: 'HM-C1-007', name: 'Cap 1 Warna Ungu', product_type: 'batik_cap', cap_type: 'cap_1_warna', color_variant: 'Ungu', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 58000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 1 Warna varian ungu.', is_featured: false, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '8', product_code: 'HM-C2-001', name: 'Cap 2 Warna Hijau Kuning', product_type: 'batik_cap', cap_type: 'cap_2_warna', color_variant: 'Hijau Kuning', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 62000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 2 Warna varian hijau kuning.', is_featured: true, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '9', product_code: 'HM-C2-002', name: 'Cap 2 Warna Hijau Cokelat', product_type: 'batik_cap', cap_type: 'cap_2_warna', color_variant: 'Hijau Cokelat', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 62000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 2 Warna varian hijau cokelat.', is_featured: false, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '10', product_code: 'HM-C2-003', name: 'Cap 2 Warna Biru Pink', product_type: 'batik_cap', cap_type: 'cap_2_warna', color_variant: 'Biru Pink', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 62000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 2 Warna varian biru pink.', is_featured: true, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '11', product_code: 'HM-C2-004', name: 'Cap 2 Warna Cokelat Pink', product_type: 'batik_cap', cap_type: 'cap_2_warna', color_variant: 'Cokelat Pink', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 62000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 2 Warna varian cokelat pink.', is_featured: false, is_active: true, source: 'seed', created_at: now, updated_at: now },
  { id: '12', product_code: 'HM-C2-005', name: 'Cap 2 Warna Hijau Turquoise', product_type: 'batik_cap', cap_type: 'cap_2_warna', color_variant: 'Hijau Turquoise', size_length_cm: 205, size_width_cm: 110, size_note: 'Kurang lebih 205 x 110 cm', price: 62000, stock_qty: 0, stock_status: 'check_stock', image_url: '/placeholder-batik.svg', description: 'Batik Cap 2 Warna varian hijau turquoise.', is_featured: true, is_active: true, source: 'seed', created_at: now, updated_at: now }
];
