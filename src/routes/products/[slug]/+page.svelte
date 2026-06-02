<script lang="ts">
  import { formatRupiah, stockStatusLabel } from '$lib/utils/format';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const imageUrl = $derived(data.product.images.find((img) => img.isPrimary)?.imageUrl ?? '/placeholder-batik.svg');
</script>

<svelte:head>
  <title>{data.product.name} | Batik HM Akmal</title>
</svelte:head>

<section class="section-shell py-10">
  <a href="/" class="text-sm text-[var(--color-maroon)]">← Kembali ke katalog</a>
  <div class="mt-4 grid gap-6 rounded-2xl border border-[#e2d0b8] bg-white p-5 md:grid-cols-2 md:p-8">
    <img src={imageUrl} alt={data.product.name} class="w-full rounded-xl object-cover" />
    <div>
      <h1 class="text-3xl font-bold text-[var(--color-brown)]">{data.product.name}</h1>
      <p class="mt-2 text-sm text-[#6a5545]">{data.product.description}</p>
      <ul class="mt-4 space-y-2 text-sm text-[#5d4939]">
        <li>Jenis: {data.product.capType === 'CAP_1_WARNA' ? 'Cap 1 Warna' : 'Cap 2 Warna'}</li>
        <li>Warna: {data.product.colorVariant}</li>
        <li>Ukuran: {data.product.sizeText}</li>
        <li>Harga: {formatRupiah(data.product.price)}</li>
        <li>Status stok: {stockStatusLabel(data.product.stockStatus)}</li>
      </ul>
      <p class="mt-4 text-xs text-[#7a6756]">Warna foto dapat sedikit berbeda karena pencahayaan dan layar perangkat.</p>
    </div>
  </div>
</section>
