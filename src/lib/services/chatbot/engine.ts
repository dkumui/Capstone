import { MOCK_COMPANY } from '$lib/mock/products';
import type { ProductTableRow } from '$lib/types/product-table';
import { capTypeLabel, dbStockStatusLabel, sizeDescription } from '$lib/utils/format';
import { detectIntent, type ChatIntent } from './intent';
import {
  CAP_1_COLORS,
  CAP_2_COLORS,
  DEFAULT_PRODUCTS,
  FAQ_ITEMS,
  OUT_OF_SCOPE_REPLY
} from './knowledgeBase';

export interface ChatRequestContext {
  message: string;
  productCode?: string;
  products?: ProductTableRow[];
}

export interface ChatResponse {
  intent: ChatIntent;
  answer: string;
}

function findProductByCode(productCode?: string, products: ProductTableRow[] = DEFAULT_PRODUCTS) {
  if (!productCode) return null;
  return products.find((item) => item.product_code === productCode) ?? null;
}

function faqFallback(message: string): string | null {
  const normalized = message.toLowerCase();
  const faq = FAQ_ITEMS.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
  return faq?.answer ?? null;
}

function findProductByColor(message: string, products: ProductTableRow[]): ProductTableRow | null {
	const normalized = message.toLowerCase();

	return (
		products.find((product) => {
			const color = product.color_variant.toLowerCase();
			return normalized.includes(color);
		}) ?? null
	);
}
export function generateRuleBasedReply(input: ChatRequestContext): ChatResponse {
  const products = input.products ?? DEFAULT_PRODUCTS;
  const message = input.message.toLowerCase();
  const intent = detectIntent(input.message);
  const selectedProduct = findProductByCode(input.productCode, products);
  const matchedColorProduct = selectedProduct ?? findProductByColor(message, products);
  
  if (intent === 'salam') {
	return {
		intent,
		answer:
			'Halo, selamat datang di Batik HM Akmal. Saya bisa membantu cek produk Batik Cap, harga, ukuran, warna, stok, pemesanan, pengiriman, dan alamat toko.'
	};
}

  if (intent === 'out_of_scope') {
    return { intent, answer: OUT_OF_SCOPE_REPLY };
  }

  if (intent === 'cek_produk') {
    if (selectedProduct) {
      return {
        intent,
        answer: `Produk yang sedang Anda lihat adalah ${selectedProduct.name} (${selectedProduct.product_code}), ${capTypeLabel(selectedProduct.cap_type)} warna ${selectedProduct.color_variant}. Status stok saat ini ${dbStockStatusLabel(selectedProduct.stock_status)}.`
      };
    }

    return {
      intent,
      answer:
        'Produk kami fokus pada Batik Cap, tersedia dalam kategori Cap 1 Warna dan Cap 2 Warna.'
    };
  }

	if (intent === 'cek_harga') {
		if (matchedColorProduct) {
			return {
				intent,
				answer: `Harga ${matchedColorProduct.name} adalah Rp${matchedColorProduct.price.toLocaleString('id-ID')} dengan ukuran ${sizeDescription(matchedColorProduct)}.`
			};
		}

		if (message.includes('cap 1')) {
			return { intent, answer: 'Harga Batik Cap 1 Warna adalah Rp58.000.' };
		}

		if (message.includes('cap 2')) {
			return { intent, answer: 'Harga Batik Cap 2 Warna adalah Rp62.000.' };
		}

		return {
			intent,
			answer: 'Harga Batik Cap 1 Warna Rp58.000 dan Batik Cap 2 Warna Rp62.000.'
		};
	}

  if (intent === 'cek_ukuran') {
    return { intent, answer: 'Ukuran kain kurang lebih 205 x 110 cm.' };
  }

  	if (intent === 'cek_warna') {
		if (matchedColorProduct) {
			return {
				intent,
				answer: `Ada ${matchedColorProduct.name}. Jenisnya ${capTypeLabel(matchedColorProduct.cap_type)}, ukuran ${sizeDescription(matchedColorProduct)}, harga Rp${matchedColorProduct.price.toLocaleString('id-ID')}. Untuk stok, saya perlu melihat data stok terbaru.`
			};
		}

		if (message.includes('cap 1')) {
			return {
				intent,
				answer: `Cap 1 Warna tersedia dalam warna: ${CAP_1_COLORS.join(', ')}.`
			};
		}

		if (message.includes('cap 2')) {
			return {
				intent,
				answer: `Cap 2 Warna tersedia dalam warna: ${CAP_2_COLORS.join(', ')}.`
			};
		}

		return {
			intent,
			answer:
				`Pilihan warna Batik Cap kami meliputi Cap 1 Warna (${CAP_1_COLORS.join(', ')}) dan Cap 2 Warna (${CAP_2_COLORS.join(', ')}).`
		};
	}

	if (intent === 'cek_stok') {
		if (matchedColorProduct) {
			if (matchedColorProduct.stock_status === 'check_stock') {
				return {
					intent,
					answer: `Untuk ${matchedColorProduct.name}, stok perlu dikonfirmasi admin karena data stok belum tersedia. Silakan hubungi admin atau tinggalkan pesan melalui chat ini.`
				};
			}

			if (matchedColorProduct.stock_status === 'sold_out') {
				return {
					intent,
					answer: `${matchedColorProduct.name} saat ini habis berdasarkan data stok terakhir. Admin dapat membantu mencarikan varian warna lain.`
				};
			}

			return {
				intent,
				answer: `${matchedColorProduct.name} saat ini ${dbStockStatusLabel(matchedColorProduct.stock_status)}. Jumlah stok: ${matchedColorProduct.stock_qty ?? 'perlu konfirmasi admin'}.`
			};
		}

		return {
			intent,
			answer:
				'Silakan sebutkan warna atau kode produk yang ingin dicek, misalnya Cap 1 Warna Biru atau Cap 2 Warna Hijau Kuning.'
		};
	}

  if (intent === 'cek_pemesanan') {
    return {
      intent,
      answer:
        'Pemesanan dilakukan setelah konfirmasi stok, lalu dilanjutkan melalui chatbot atau WhatsApp admin.'
    };
  }

  if (intent === 'cek_pengiriman') {
    return {
      intent,
      answer: 'Pengiriman bisa dilakukan setelah stok dikonfirmasi admin dan detail pesanan disetujui.'
    };
  }

  if (intent === 'cek_lokasi') {
    return {
      intent,
      answer: `Alamat toko: ${MOCK_COMPANY.address}`
    };
  }

  if (intent === 'cek_seragam') {
    return {
      intent,
      answer:
        'Bisa untuk kebutuhan seragam. Silakan informasikan warna dan jumlah agar admin membantu konfirmasi stok.'
    };
  }

  const faqHit = faqFallback(input.message);
  if (faqHit) {
    return { intent, answer: faqHit };
  }

  return {
    intent,
    answer:
      'Warna pada foto dapat sedikit berbeda karena pencahayaan dan layar perangkat. Untuk stok, mohon konfirmasi admin terlebih dahulu.'
  };
}
