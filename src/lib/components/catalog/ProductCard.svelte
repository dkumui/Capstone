<script lang="ts">
	import { formatRupiah } from '$lib/utils/format';
	import type { ProductTableRow } from '$lib/types/product-table';

	let {
		product,
		onAskProduct
	}: {
		product: ProductTableRow;
		onAskProduct: (product: ProductTableRow) => void;
	} = $props();

	function capLabel(cap: ProductTableRow['cap_type']): string {
		return cap === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna';
	}

	function stockLabel(stock: ProductTableRow['stock_status']): string {
		if (stock === 'ready') return 'Ready';
		if (stock === 'limited') return 'Terbatas';
		if (stock === 'sold_out') return 'Habis';
		return 'Cek Stok';
	}

	function stockBadgeClass(stock: ProductTableRow['stock_status']): string {
		if (stock === 'ready') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
		if (stock === 'limited') return 'border-amber-200 bg-amber-50 text-amber-800';
		if (stock === 'sold_out') return 'border-red-200 bg-red-50 text-red-800';
		return 'border-stone-200 bg-stone-50 text-stone-700';
	}

	function productImage(src: string | null | undefined): string {
		return src && src.trim() !== '' ? src : '/placeholder-batik.svg';
	}

	function handleAskClick() {
		if (!product?.product_code || !product?.color_variant) {
			console.error('Produk tidak valid untuk chatbot:', product);
			return;
		}

		onAskProduct({
			...product,
			name:
				product.name ||
				`${product.cap_type === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna'} ${product.color_variant}`
		});
	}
</script>

<article class="group border border-[var(--color-line)] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(43,41,38,0.1)]">
	<div class="relative border-b border-[var(--color-line)] bg-[var(--color-soft)] p-4">
		<div class="aspect-square overflow-hidden bg-white">
			<img
				src={productImage(product.image_url)}
				alt={product.name}
				class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
				loading="lazy"
			/>
		</div>

		<div class="absolute left-4 top-4 border border-[var(--color-line)] bg-white px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-[var(--color-ink)]">
			{capLabel(product.cap_type)}
		</div>
	</div>

	<div class="p-4">
		<div class="flex items-center justify-between gap-3">
			<p class="font-mono text-[0.67rem] font-bold uppercase tracking-[0.14em] text-[var(--color-muted-2)]">
				{product.product_code}
			</p>
			<span class={`shrink-0 border px-2 py-1 text-[0.65rem] font-black ${stockBadgeClass(product.stock_status)}`}>
				{stockLabel(product.stock_status)}
			</span>
		</div>

		<h3 class="mt-3 line-clamp-2 min-h-[3rem] text-base font-black leading-snug text-[var(--color-ink)]">
			{product.name}
		</h3>

		<div class="mt-4 grid grid-cols-2 gap-2 text-xs">
			<div class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-3">
				<p class="font-bold uppercase tracking-[0.12em] text-[var(--color-muted-2)]">Warna</p>
				<p class="mt-1 font-bold text-[var(--color-ink)]">{product.color_variant}</p>
			</div>

			<div class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-3">
				<p class="font-bold uppercase tracking-[0.12em] text-[var(--color-muted-2)]">Ukuran</p>
				<p class="mt-1 font-bold text-[var(--color-ink)]">
					{product.size_length_cm} x {product.size_width_cm} cm
				</p>
			</div>
		</div>

		<div class="mt-5 flex items-end justify-between gap-3">
			<div>
				<p class="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[var(--color-muted-2)]">Harga</p>
				<p class="mt-1 text-xl font-black text-[var(--color-accent)]">{formatRupiah(product.price)}</p>
			</div>

			<button class="btn-primary px-3 py-2 text-[0.62rem]" type="button" onclick={handleAskClick}>
				Tanya
			</button>
		</div>
	</div>
</article>