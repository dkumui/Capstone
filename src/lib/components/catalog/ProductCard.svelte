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
		if (stock === 'ready') return 'bg-green-50 text-green-800 border-green-200';
		if (stock === 'limited') return 'bg-amber-50 text-amber-800 border-amber-200';
		if (stock === 'sold_out') return 'bg-red-50 text-red-800 border-red-200';
		return 'bg-stone-50 text-stone-700 border-stone-200';
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

<article class="group overflow-hidden rounded-[1.5rem] border border-[#ead8bc] bg-white soft-shadow transition duration-300 hover:-translate-y-1 hover:shadow-xl">
	<div class="relative overflow-hidden bg-[#f6ead7]">
		<img
			src={productImage(product.image_url)}
			alt={product.name}
			class="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
			loading="lazy"
		/>

		<div class="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-black text-[var(--color-indigo)] backdrop-blur">
			{capLabel(product.cap_type)}
		</div>

		<div class={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-black backdrop-blur ${stockBadgeClass(product.stock_status)}`}>
			{stockLabel(product.stock_status)}
		</div>
	</div>

	<div class="p-5">
		<p class="font-mono text-xs font-semibold uppercase tracking-wide text-[#9b8066]">
			{product.product_code}
		</p>

		<h3 class="mt-2 line-clamp-2 text-xl font-black leading-tight text-[var(--color-brown)]">
			{product.name}
		</h3>

		<div class="mt-4 grid grid-cols-2 gap-3 text-sm">
			<div class="rounded-2xl bg-[#fff7e8] p-3">
				<p class="text-xs font-semibold text-[#8a715c]">Warna</p>
				<p class="mt-1 font-bold text-[var(--color-indigo)]">{product.color_variant}</p>
			</div>

			<div class="rounded-2xl bg-[#fff7e8] p-3">
				<p class="text-xs font-semibold text-[#8a715c]">Ukuran</p>
				<p class="mt-1 font-bold text-[var(--color-indigo)]">
					{product.size_length_cm} x {product.size_width_cm} cm
				</p>
			</div>
		</div>

		<div class="mt-5 flex items-end justify-between gap-3">
			<div>
				<p class="text-xs font-semibold text-[#8a715c]">Harga</p>
				<p class="text-2xl font-black text-[var(--color-maroon)]">
					{formatRupiah(product.price)}
				</p>
			</div>

			<button class="btn-primary px-4 py-2.5" type="button" onclick={handleAskClick}>
				Tanya Produk
			</button>
		</div>
	</div>
</article>