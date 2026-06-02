<script lang="ts">
  import { formatRupiah } from '$lib/utils/format';
  import type { ProductTableRow } from '$lib/types/product-table';

  let { product, onAsk } = $props<{ product: ProductTableRow; onAsk: (product: ProductTableRow) => void }>();

  function capLabel(cap: ProductTableRow['cap_type']): string {
    return cap === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna';
  }

  function stockLabel(stock: ProductTableRow['stock_status']): string {
    if (stock === 'ready') return 'Ready';
    if (stock === 'limited') return 'Terbatas';
    if (stock === 'sold_out') return 'Habis';
    return 'Cek Stok';
  }
</script>

<article class="card-shadow overflow-hidden rounded-xl border border-[#e4d3bf] bg-white">
  <img src={product.image_url ?? '/placeholder-batik.svg'} alt={product.name} class="h-52 w-full object-cover" loading="lazy" />
  <div class="space-y-2 p-4">
    <h3 class="text-lg font-semibold text-[var(--color-brown)]">{product.name}</h3>
    <p class="text-xs uppercase tracking-wide text-[var(--color-earth)]">{capLabel(product.cap_type)} • {product.color_variant}</p>
    <p class="text-sm text-[#644f3f]">Ukuran: ± {product.size_length_cm} x {product.size_width_cm} cm</p>
    <p class="text-sm font-bold text-[var(--color-maroon)]">{formatRupiah(product.price)}</p>
    <div class="flex items-center justify-between pt-2">
      <span class="rounded-full bg-[#f4eadf] px-3 py-1 text-xs font-semibold text-[#654b37]">{stockLabel(product.stock_status)}</span>
      <button class="btn-secondary" type="button" onclick={() => onAsk(product)}>Tanya Produk</button>
    </div>
  </div>
</article>
