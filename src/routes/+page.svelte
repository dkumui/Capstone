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

<section class="section-shell py-12 md:py-16">
	<div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
		<div class="bg-white p-6 md:p-10">
			<p class="eyebrow">Batik stories</p>
			<h2 class="section-title mt-4">Batik cap yang mudah dipilih.</h2>
			<p class="section-description">{company.profile}</p>
			<a href="#katalog" class="btn-primary mt-8">See all</a>
		</div>

		<div class="grid gap-4 sm:grid-cols-2">
			<article class="border border-[var(--color-line)] bg-white p-5">
				<div class="h-44 bg-[var(--color-soft)] p-4">
					<img src="/placeholder-batik.svg" alt="Motif batik" class="h-full w-full object-cover" />
				</div>
				<h3 class="font-heading mt-5 text-3xl font-bold leading-none text-[var(--color-ink)]">Pilih motif</h3>
				<p class="mt-3 text-sm leading-7 text-[var(--color-muted)]">Katalog menampilkan variasi cap, warna, ukuran, harga, dan status stok.</p>
			</article>

			<article class="border border-[var(--color-line)] bg-white p-5">
				<div class="h-44 bg-[var(--color-soft)] p-4">
					<div class="h-full w-full batik-pattern"></div>
				</div>
				<h3 class="font-heading mt-5 text-3xl font-bold leading-none text-[var(--color-ink)]">Tanya admin</h3>
				<p class="mt-3 text-sm leading-7 text-[var(--color-muted)]">Tombol Tanya Produk membawa konteks produk langsung ke chatbot.</p>
			</article>
		</div>
	</div>
</section>

<section class="section-shell py-12 md:py-16">
	<div class="bg-white px-6 py-10 md:px-10">
		<p class="eyebrow">How it works</p>
		<h2 class="section-title mt-4">Alur pesan batik.</h2>

		<div class="mt-10 grid gap-4 md:grid-cols-4">
			{#each [
				{ title: 'Select pattern', desc: 'Pilih motif dan jenis cap dari katalog.' },
				{ title: 'Pick your style', desc: 'Cek warna, ukuran, harga, dan stok.' },
				{ title: 'Ask product', desc: 'Klik Tanya Produk untuk memulai chat.' },
				{ title: 'Checkout', desc: 'Admin membantu konfirmasi pesanan.' }
			] as step, index}
				<article class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-6 text-center">
					<div class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-charcoal)] text-xs font-black text-white">
						{index + 1}
					</div>
					<h3 class="mt-5 text-sm font-black text-[var(--color-ink)]">{step.title}</h3>
					<p class="mt-2 text-xs leading-6 text-[var(--color-muted)]">{step.desc}</p>
				</article>
			{/each}
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