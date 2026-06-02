import { INITIAL_FAQ } from '$lib/data/seed';
import type { CompanySettings, Product } from '$lib/types/domain';

const ALLOWED_TOPICS = [
  'batik',
  'hm akmal',
  'unggul jaya',
  'cap 1',
  'cap 2',
  'harga',
  'ukuran',
  'warna',
  'stok',
  'pesan',
  'pengiriman',
  'lokasi',
  'alamat',
  'layanan'
];

export interface ChatbotContext {
  company: CompanySettings;
  products: Product[];
}

export interface ChatbotReply {
  answer: string;
  isOutOfScope: boolean;
}

function isOutOfScope(message: string): boolean {
  const normalized = message.toLowerCase();
  return !ALLOWED_TOPICS.some((topic) => normalized.includes(topic));
}

function listColors(products: Product[], capType: Product['capType']): string {
  const colors = [...new Set(products.filter((p) => p.capType === capType).map((p) => p.colorVariant))];
  return colors.join(', ');
}

export function generateChatbotReply(input: string, context: ChatbotContext): ChatbotReply {
  const message = input.toLowerCase();

  if (isOutOfScope(input)) {
    return {
      isOutOfScope: true,
      answer:
        'Maaf, saya hanya bisa membantu informasi seputar Batik HM Akmal: produk batik cap, harga, ukuran, warna, stok, pemesanan, pengiriman, dan lokasi toko.'
    };
  }

  if (message.includes('produk') || message.includes('apa saja')) {
    return {
      isOutOfScope: false,
      answer:
        'Kami menyediakan Batik Cap 1 Warna dan Cap 2 Warna. Anda bisa pilih berdasarkan warna, lalu konfirmasi stok melalui chatbot atau WhatsApp admin.'
    };
  }

  if (message.includes('cap 1') && message.includes('warna apa')) {
    return {
      isOutOfScope: false,
      answer: `Varian Cap 1 Warna: ${listColors(context.products, 'CAP_1_WARNA')}. Harga Rp58.000 per kain.`
    };
  }

  if (message.includes('cap 2') && message.includes('warna apa')) {
    return {
      isOutOfScope: false,
      answer: `Varian Cap 2 Warna: ${listColors(context.products, 'CAP_2_WARNA')}. Harga Rp62.000 per kain.`
    };
  }

  if (message.includes('harga cap 1')) {
    return { isOutOfScope: false, answer: 'Harga Batik Cap 1 Warna adalah Rp58.000.' };
  }

  if (message.includes('harga cap 2')) {
    return { isOutOfScope: false, answer: 'Harga Batik Cap 2 Warna adalah Rp62.000.' };
  }

  if (message.includes('ukuran')) {
    return { isOutOfScope: false, answer: 'Ukuran awal semua produk kurang lebih 205 x 110 cm.' };
  }

  if (message.includes('stok')) {
    return {
      isOutOfScope: false,
      answer:
        'Stok kami sinkron ke sistem kasir. Jika data stok belum tersedia, mohon tunggu konfirmasi admin agar tidak terjadi salah informasi.'
    };
  }

  if (message.includes('pesan online')) {
    return {
      isOutOfScope: false,
      answer:
        'Pemesanan dilakukan setelah konfirmasi stok, lalu dilanjutkan via chatbot atau WhatsApp admin. Website ini tidak menyediakan checkout otomatis.'
    };
  }

  if (message.includes('beli langsung')) {
    return {
      isOutOfScope: false,
      answer: `Bisa. Silakan datang ke toko di ${context.company.address}.`
    };
  }

  if (message.includes('seragam')) {
    return {
      isOutOfScope: false,
      answer:
        'Bisa untuk kebutuhan seragam. Silakan kirim kebutuhan warna dan jumlah melalui WhatsApp agar admin bantu cek ketersediaan.'
    };
  }

  if (message.includes('kirim')) {
    return {
      isOutOfScope: false,
      answer: 'Bisa dikirim setelah stok dan detail pesanan dikonfirmasi admin.'
    };
  }

  if (message.includes('alamat') || message.includes('lokasi')) {
    return {
      isOutOfScope: false,
      answer: `Alamat toko: ${context.company.address}`
    };
  }

  const faqHit = INITIAL_FAQ.find((item) => item.tags.some((tag) => message.includes(tag)));
  if (faqHit) {
    return { isOutOfScope: false, answer: faqHit.answer };
  }

  return {
    isOutOfScope: false,
    answer:
      'Saya siap bantu terkait produk Batik Cap, warna, harga, ukuran, stok, dan pemesanan. Warna pada foto bisa sedikit berbeda karena pencahayaan dan layar perangkat.'
  };
}
