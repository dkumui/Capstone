insert into public.company_settings (
  business_name,
  alt_business_name,
  description,
  address,
  whatsapp_number,
  contact_phone,
  operation_hours,
  google_maps_link
)
values (
  'Batik HM Akmal',
  'Unggul Jaya Banyurip',
  'Produsen Batik Cap khas Pekalongan dengan fokus pada Cap 1 Warna dan Cap 2 Warna.',
  'Jl. Gatot Subroto No.628, Banyurip Alit, Kec. Pekalongan Selatan, Kota Pekalongan, Jawa Tengah 51139',
  '6281234567890',
  '0812-3456-7890',
  'Senin - Sabtu, 08.00 - 16.30 WIB',
  'https://maps.google.com/?q=Jl.+Gatot+Subroto+No.628+Pekalongan'
)
on conflict do nothing;

insert into public.products (
  product_code,
  name,
  product_type,
  cap_type,
  color_variant,
  size_length_cm,
  size_width_cm,
  size_note,
  price,
  stock_qty,
  stock_status,
  image_url,
  description,
  is_featured,
  is_active,
  source
)
values
('HM-C1-001', 'Cap 1 Warna Biru', 'batik_cap', 'cap_1_warna', 'Biru', 205, 110, 'Kurang lebih 205 x 110 cm', 58000, null, 'check_stock', null, 'Batik Cap 1 Warna varian biru.', true, true, 'seed'),
('HM-C1-002', 'Cap 1 Warna Hijau Lemon', 'batik_cap', 'cap_1_warna', 'Hijau Lemon', 205, 110, 'Kurang lebih 205 x 110 cm', 58000, null, 'check_stock', null, 'Batik Cap 1 Warna varian hijau lemon.', true, true, 'seed'),
('HM-C1-003', 'Cap 1 Warna Merah', 'batik_cap', 'cap_1_warna', 'Merah', 205, 110, 'Kurang lebih 205 x 110 cm', 58000, null, 'check_stock', null, 'Batik Cap 1 Warna varian merah.', true, true, 'seed'),
('HM-C1-004', 'Cap 1 Warna Biru Varian Kedua', 'batik_cap', 'cap_1_warna', 'Biru', 205, 110, 'Kurang lebih 205 x 110 cm', 58000, null, 'check_stock', null, 'Batik Cap 1 Warna biru varian kedua.', false, true, 'seed'),
('HM-C1-005', 'Cap 1 Warna Merah Maroon', 'batik_cap', 'cap_1_warna', 'Merah Maroon', 205, 110, 'Kurang lebih 205 x 110 cm', 58000, null, 'check_stock', null, 'Batik Cap 1 Warna varian merah maroon.', true, true, 'seed'),
('HM-C1-006', 'Cap 1 Warna Turquoise', 'batik_cap', 'cap_1_warna', 'Turquoise', 205, 110, 'Kurang lebih 205 x 110 cm', 58000, null, 'check_stock', null, 'Batik Cap 1 Warna varian turquoise.', false, true, 'seed'),
('HM-C1-007', 'Cap 1 Warna Ungu', 'batik_cap', 'cap_1_warna', 'Ungu', 205, 110, 'Kurang lebih 205 x 110 cm', 58000, null, 'check_stock', null, 'Batik Cap 1 Warna varian ungu.', false, true, 'seed'),
('HM-C2-001', 'Cap 2 Warna Hijau Kuning', 'batik_cap', 'cap_2_warna', 'Hijau Kuning', 205, 110, 'Kurang lebih 205 x 110 cm', 62000, null, 'check_stock', null, 'Batik Cap 2 Warna varian hijau kuning.', true, true, 'seed'),
('HM-C2-002', 'Cap 2 Warna Hijau Cokelat', 'batik_cap', 'cap_2_warna', 'Hijau Cokelat', 205, 110, 'Kurang lebih 205 x 110 cm', 62000, null, 'check_stock', null, 'Batik Cap 2 Warna varian hijau cokelat.', false, true, 'seed'),
('HM-C2-003', 'Cap 2 Warna Biru Pink', 'batik_cap', 'cap_2_warna', 'Biru Pink', 205, 110, 'Kurang lebih 205 x 110 cm', 62000, null, 'check_stock', null, 'Batik Cap 2 Warna varian biru pink.', true, true, 'seed'),
('HM-C2-004', 'Cap 2 Warna Cokelat Pink', 'batik_cap', 'cap_2_warna', 'Cokelat Pink', 205, 110, 'Kurang lebih 205 x 110 cm', 62000, null, 'check_stock', null, 'Batik Cap 2 Warna varian cokelat pink.', false, true, 'seed'),
('HM-C2-005', 'Cap 2 Warna Hijau Turquoise', 'batik_cap', 'cap_2_warna', 'Hijau Turquoise', 205, 110, 'Kurang lebih 205 x 110 cm', 62000, null, 'check_stock', null, 'Batik Cap 2 Warna varian hijau turquoise.', true, true, 'seed')
on conflict (product_code) do nothing;

insert into public.services (title, description, display_order, is_active)
values
('Penjualan Batik Cap Ecer & Partai', 'Melayani pembelian untuk kebutuhan pribadi, usaha, dan komunitas.', 1, true),
('Konsultasi Warna & Ketersediaan', 'Tanya warna dan stok via chatbot atau WhatsApp admin sebelum pemesanan.', 2, true),
('Pengiriman Antar Kota', 'Pengiriman dilakukan setelah konfirmasi stok dan detail pesanan.', 3, true)
on conflict do nothing;

insert into public.faq_knowledge_base (question, answer, tags, is_active)
values
('Bisa pesan online?', 'Pemesanan dilakukan setelah konfirmasi stok melalui chatbot atau WhatsApp admin.', '{pesan,online}', true),
('Bisa beli langsung ke toko?', 'Bisa, silakan datang langsung ke alamat toko pada jam operasional.', '{beli,toko,langsung}', true),
('Bisa dikirim?', 'Bisa, pengiriman tersedia setelah konfirmasi stok dan detail pesanan.', '{kirim,pengiriman}', true)
on conflict do nothing;
