<script lang="ts">
	import ProductCatalog from '$lib/components/catalog/ProductCatalog.svelte';
	import ChatbotWidget from '$lib/components/chat/ChatbotWidget.svelte';
	import HeroSection from '$lib/components/landing/HeroSection.svelte';
	import ContactSection from '$lib/components/sections/ContactSection.svelte';
	import ServiceSection from '$lib/components/sections/ServiceSection.svelte';
	import type { PageData } from './$types';
	import type { ProductTableRow } from '$lib/types/product-table';

	let { data }: { data: PageData } = $props();

	const fallbackCompany = {
		business_name: 'Batik HM Akmal',
		subtitle: 'Batik Cap Pekalongan untuk kebutuhan kain, jahit, dan seragam',
		profile:
			'Produsen Batik Cap khas Pekalongan dengan fokus pada kualitas motif, ketepatan warna, dan harga yang ramah untuk kebutuhan harian maupun seragam.',
		address:
			'Jl. Gatot Subroto No.628, Banyurip Alit, Kec. Pekalongan Selatan, Kota Pekalongan, Jawa Tengah 51139',
		whatsapp_number: '6281234567890',
		operation_hours: 'Senin - Sabtu, 08.00 - 16.30 WIB',
		maps_url: 'https://maps.google.com/?q=Jl.+Gatot+Subroto+No.628+Pekalongan'
	};

	const company = $derived(data.company ?? fallbackCompany);
	const products = $derived(data.products ?? []);
	const services = $derived(data.services ?? []);

	let selectedProductForChat = $state<{
		name: string;
		product_code: string;
		color_variant: string;
	} | null>(null);

	let selectedProductRequestId = $state(0);

	function handleAskProduct(product: ProductTableRow) {
		if (!product?.product_code || !product?.color_variant) {
			console.error('Produk tidak valid untuk chatbot:', product);
			return;
		}

		const productName =
			product.name ||
			`${product.cap_type === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna'} ${product.color_variant}`;

		selectedProductForChat = {
			name: productName,
			product_code: product.product_code,
			color_variant: product.color_variant
		};

		selectedProductRequestId += 1;
	}
</script>

<svelte:head>
	<title>Batik HM Akmal | Katalog Batik Cap Pekalongan</title>
	<meta
		name="description"
		content="Katalog resmi Batik HM Akmal. Temukan Batik Cap Pekalongan untuk kain, jahit, seragam, dan kebutuhan harian."
	/>
</svelte:head>

<HeroSection {company} />

<section class="section-shell py-10 md:py-14">
	<div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
		<div class="surface-card p-6 md:p-8">
			<p class="eyebrow">Tentang UMKM</p>
			<h2 class="section-title mt-3">Batik Cap yang mudah dipilih, mudah ditanyakan.</h2>
			<p class="section-description">{company.profile}</p>

			<div class="mt-6 grid gap-3 sm:grid-cols-2">
				<div class="rounded-2xl bg-[#fff7e8] p-4">
					<p class="font-bold text-[var(--color-indigo)]">Fokus Produk</p>
					<p class="mt-1 text-sm leading-6 text-[#6f5b47]">Katalog difokuskan pada Batik Cap 1 Warna dan 2 Warna.</p>
				</div>

				<div class="rounded-2xl bg-[#fff7e8] p-4">
					<p class="font-bold text-[var(--color-indigo)]">Stok Transparan</p>
					<p class="mt-1 text-sm leading-6 text-[#6f5b47]">Pelanggan dapat bertanya stok langsung melalui chatbot atau WhatsApp.</p>
				</div>
			</div>
		</div>

		<div class="surface-card overflow-hidden p-6 md:p-8">
			<p class="eyebrow">Alur Pembelian</p>
			<h2 class="section-title mt-3">Pilih produk, tanyakan stok, lanjutkan pemesanan.</h2>

			<div class="mt-6 grid gap-4">
				<div class="flex gap-4 rounded-2xl border border-[#ead8bc] bg-white p-4">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-indigo)] text-sm font-black text-white">1</div>
					<div>
						<p class="font-bold text-[var(--color-brown)]">Lihat katalog</p>
						<p class="mt-1 text-sm leading-6 text-[#6f5b47]">Gunakan filter Cap 1 Warna atau Cap 2 Warna sesuai kebutuhan.</p>
					</div>
				</div>

				<div class="flex gap-4 rounded-2xl border border-[#ead8bc] bg-white p-4">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-maroon)] text-sm font-black text-white">2</div>
					<div>
						<p class="font-bold text-[var(--color-brown)]">Tanya produk</p>
						<p class="mt-1 text-sm leading-6 text-[#6f5b47]">Klik tombol Tanya Produk agar chatbot langsung membawa konteks produk.</p>
					</div>
				</div>

				<div class="flex gap-4 rounded-2xl border border-[#ead8bc] bg-white p-4">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)] text-sm font-black text-[#24170c]">3</div>
					<div>
						<p class="font-bold text-[var(--color-brown)]">Konfirmasi admin</p>
						<p class="mt-1 text-sm leading-6 text-[#6f5b47]">Admin membantu cek stok, total harga, dan pengiriman.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<ProductCatalog {products} onAskProduct={handleAskProduct} />

<ServiceSection {services} />
<ContactSection {company} />

<ChatbotWidget
	selectedProduct={selectedProductForChat}
	selectedProductRequestId={selectedProductRequestId}
	businessWhatsappNumber={company.whatsapp_number}
/>