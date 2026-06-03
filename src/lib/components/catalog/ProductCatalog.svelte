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

<section id="katalog" class="section-shell py-12 md:py-16">
	<div class="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
		<div>
			<p class="eyebrow">300+ Patterns</p>
			<h2 class="section-title mt-4">Katalog batik.</h2>
			<p class="section-description">
				Gunakan filter untuk menemukan produk. Stok dapat berubah karena penjualan offline dan pemesanan chat.
			</p>
		</div>

		<div class="grid gap-3 sm:grid-cols-3">
			<div class="border border-[var(--color-line)] bg-white p-4">
				<p class="font-heading text-4xl font-bold leading-none text-[var(--color-ink)]">{activeProducts.length}</p>
				<p class="mt-2 text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted)]">Produk aktif</p>
			</div>
			<div class="border border-[var(--color-line)] bg-white p-4">
				<p class="font-heading text-4xl font-bold leading-none text-[var(--color-ink)]">1</p>
				<p class="mt-2 text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted)]">Cap satu warna</p>
			</div>
			<div class="border border-[var(--color-line)] bg-white p-4">
				<p class="font-heading text-4xl font-bold leading-none text-[var(--color-ink)]">2</p>
				<p class="mt-2 text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted)]">Cap dua warna</p>
			</div>
		</div>
	</div>

	<div class="mt-8">
		<ProductFilter
			{selectedCap}
			{searchColor}
			onCapChange={(value) => (selectedCap = value)}
			onSearchChange={(value) => (searchColor = value)}
		/>
	</div>

	{#if filtered.length === 0}
		<div class="mt-6 border border-dashed border-[var(--color-line)] bg-white p-10 text-center">
			<p class="font-bold text-[var(--color-ink)]">Produk tidak ditemukan.</p>
			<p class="mt-2 text-sm text-[var(--color-muted)]">Coba ubah jenis cap atau kata kunci warna.</p>
		</div>
	{:else}
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filtered as product (product.product_code)}
				<ProductCard {product} {onAskProduct} />
			{/each}
		</div>
	{/if}
</section>