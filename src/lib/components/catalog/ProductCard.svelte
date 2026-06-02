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

	function productImage(src: string | null | undefined): string {
		return src && src.trim() !== '' ? src : '/placeholder-batik.svg';
	}

	function handleAskClick() {
        console.log('Tanya Produk diklik:', product);

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

<article class="card-shadow overflow-hidden rounded-xl border border-[#e4d3bf] bg-white">
	<img
		src={productImage(product.image_url)}
		alt={product.name}
		class="h-52 w-full object-cover"
		loading="lazy"
	/>

	<div class="space-y-2 p-4">
		<h3 class="text-lg font-semibold text-[var(--color-brown)]">{product.name}</h3>

		<p class="text-xs uppercase tracking-wide text-[var(--color-earth)]">
			{capLabel(product.cap_type)} • {product.color_variant}
		</p>

		<p class="text-sm text-[#644f3f]">
			Ukuran: {product.size_note ?? `±${product.size_length_cm} x ${product.size_width_cm} cm`}
		</p>

		<p class="text-sm font-bold text-[var(--color-maroon)]">
			{formatRupiah(product.price)}
		</p>

		<div class="flex items-center justify-between gap-3 pt-2">
			<span class="rounded-full bg-[#f4eadf] px-3 py-1 text-xs font-semibold text-[#654b37]">
				{stockLabel(product.stock_status)}
			</span>

			<button class="btn-secondary" type="button" onclick={handleAskClick}>
				Tanya Produk
			</button>
		</div>
	</div>
</article>