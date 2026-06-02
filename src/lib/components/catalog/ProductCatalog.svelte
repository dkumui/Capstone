<script lang="ts">
	import type { ProductTableRow, CapType } from '$lib/types/product-table';
	import ProductCard from './ProductCard.svelte';
	import ProductFilter from './ProductFilter.svelte';

	let {
		products,
		onAskProduct
	}: {
		products: ProductTableRow[];
		onAskProduct: (product: ProductTableRow) => void;
	} = $props();

	let selectedCap = $state<CapType | 'all'>('all');
	let searchColor = $state('');

	const filtered = $derived.by(() => {
		return products.filter((product) => {
			if (!product.is_active) return false;

			const capOk = selectedCap === 'all' || product.cap_type === selectedCap;

			const colorOk =
				searchColor.trim().length === 0 ||
				product.color_variant.toLowerCase().includes(searchColor.toLowerCase());

			return capOk && colorOk;
		});
	});
</script>

<section id="katalog" class="section-shell py-8 md:py-10">
	<h2 class="text-2xl font-bold text-[var(--color-brown)]">Katalog Produk</h2>

	<p class="mt-2 text-sm text-[#624c3b]">
		Filter berdasarkan jenis cap dan cari berdasarkan warna.
	</p>

	<div class="mt-4">
		<ProductFilter
			{selectedCap}
			{searchColor}
			onCapChange={(value) => (selectedCap = value)}
			onSearchChange={(value) => (searchColor = value)}
		/>
	</div>

	{#if filtered.length === 0}
		<div class="mt-5 rounded-xl border border-dashed border-[#d4bfa5] bg-white p-6 text-sm text-[#6d5644]">
			Produk tidak ditemukan untuk filter saat ini.
		</div>
	{:else}
		<div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as product (product.product_code)}
				<ProductCard {product} {onAskProduct} />
			{/each}
		</div>
	{/if}
</section>