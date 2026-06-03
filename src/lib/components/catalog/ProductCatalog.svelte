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

	const activeProducts = $derived(products.filter((product) => product.is_active));

	const filtered = $derived.by(() => {
		return activeProducts.filter((product) => {
			const capOk = selectedCap === 'all' || product.cap_type === selectedCap;

			const keyword = searchColor.trim().toLowerCase();
			const colorOk =
				keyword.length === 0 ||
				product.color_variant.toLowerCase().includes(keyword) ||
				product.name.toLowerCase().includes(keyword) ||
				product.product_code.toLowerCase().includes(keyword);

			return capOk && colorOk;
		});
	});
</script>

<section id="katalog" class="section-shell py-10 md:py-16">
	<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
		<div>
			<p class="eyebrow">Katalog Produk</p>
			<h2 class="section-title mt-3">Pilih Batik Cap sesuai warna dan kebutuhan.</h2>
			<p class="section-description">
				Gunakan filter untuk menemukan produk. Stok dapat berubah, sehingga pelanggan disarankan bertanya terlebih dahulu.
			</p>
		</div>

		<div class="rounded-2xl border border-[#ead8bc] bg-white/80 px-5 py-4">
			<p class="text-sm font-bold text-[var(--color-indigo)]">{activeProducts.length} produk aktif</p>
			<p class="mt-1 text-xs text-[#7a634f]">Terhubung dengan data admin</p>
		</div>
	</div>

	<div class="mt-7">
		<ProductFilter
			{selectedCap}
			{searchColor}
			onCapChange={(value) => (selectedCap = value)}
			onSearchChange={(value) => (searchColor = value)}
		/>
	</div>

	{#if filtered.length === 0}
		<div class="mt-6 rounded-[1.5rem] border border-dashed border-[#d4bfa5] bg-white/80 p-8 text-center">
			<p class="font-bold text-[var(--color-brown)]">Produk tidak ditemukan.</p>
			<p class="mt-2 text-sm text-[#6d5644]">Coba ubah jenis cap atau kata kunci warna.</p>
		</div>
	{:else}
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each filtered as product (product.product_code)}
				<ProductCard {product} {onAskProduct} />
			{/each}
		</div>
	{/if}
</section>