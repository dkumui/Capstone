import type { CompanySettings, ServiceItem } from '$lib/types/domain';

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  id: 'default-company',
  businessName: 'Batik HM Akmal',
  altBusinessName: 'Unggul Jaya Banyurip',
  description:
    'Produsen Batik Cap khas Pekalongan dengan fokus pada kualitas motif, ketepatan warna, dan harga yang ramah untuk kebutuhan harian maupun seragam.',
  address:
    'Jl. Gatot Subroto No.628, Banyurip Alit, Kec. Pekalongan Selatan, Kota Pekalongan, Jawa Tengah 51139',
  whatsappNumber: '6281234567890',
  contactPhone: '0812-3456-7890',
  operationHours: 'Senin - Sabtu, 08.00 - 16.30 WIB',
  googleMapsLink: 'https://maps.google.com/?q=Jl.+Gatot+Subroto+No.628+Pekalongan'
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'svc-1',
    title: 'Penjualan Batik Cap Ecer & Partai',
    description: 'Melayani pembelian untuk kebutuhan pribadi, usaha, dan komunitas.',
    isActive: true
  },
  {
    id: 'svc-2',
    title: 'Konsultasi Warna & Ketersediaan',
    description: 'Tanya warna dan stok via chatbot atau WhatsApp sebelum pemesanan.',
    isActive: true
  },
  {
    id: 'svc-3',
    title: 'Pengiriman Antar Kota',
    description: 'Pengiriman dilakukan setelah konfirmasi stok dan detail pesanan.',
    isActive: true
  }
];
