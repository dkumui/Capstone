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
        console.log('Produk masuk ke halaman utama:', product);

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
	<title>Batik HM Akmal | Katalog Batik Cap</title>
	<meta
		name="description"
		content="Batik HM Akmal - Batik Cap Pekalongan untuk kebutuhan kain, jahit, dan seragam."
	/>
</svelte:head>

<HeroSection {company} />

<section class="section-shell py-8 md:py-10">
	<div class="rounded-2xl border border-[#e4d4c0] bg-white p-6 md:p-8">
		<h2 class="text-2xl font-bold text-[var(--color-brown)]">Profil UMKM</h2>
		<p class="mt-3 text-sm leading-7 text-[#5d4939]">{company.profile}</p>
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