<script lang="ts">
	import { formatRupiah, stockStatusLabel } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const imageUrl = $derived(data.product.images.find((img) => img.isPrimary)?.imageUrl ?? '/placeholder-batik.svg');
</script>

<svelte:head>
	<title>{data.product.name} | Batik HM Akmal</title>
</svelte:head>

<section class="section-shell py-10 md:py-14">
	<a href="/" class="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[var(--color-accent)]">← Kembali ke katalog</a>

	<div class="mt-6 grid gap-6 bg-white p-5 md:grid-cols-2 md:p-8 lg:p-10">
		<div class="border border-[var(--color-line)] bg-[var(--color-soft)] p-4">
			<img src={imageUrl} alt={data.product.name} class="aspect-square w-full object-cover" />
		</div>

		<div class="flex flex-col justify-center">
			<p class="eyebrow">Product detail</p>
			<h1 class="font-heading mt-4 text-5xl font-bold leading-none tracking-[-0.04em] text-[var(--color-ink)] md:text-6xl">
				{data.product.name}
			</h1>
			<p class="mt-5 text-sm leading-8 text-[var(--color-muted)]">{data.product.description}</p>

			<div class="mt-7 grid gap-3 sm:grid-cols-2">
				<div class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-4">
					<p class="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted-2)]">Jenis</p>
					<p class="mt-2 font-bold text-[var(--color-ink)]">{data.product.capType === 'CAP_1_WARNA' ? 'Cap 1 Warna' : 'Cap 2 Warna'}</p>
				</div>
				<div class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-4">
					<p class="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted-2)]">Warna</p>
					<p class="mt-2 font-bold text-[var(--color-ink)]">{data.product.colorVariant}</p>
				</div>
				<div class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-4">
					<p class="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted-2)]">Ukuran</p>
					<p class="mt-2 font-bold text-[var(--color-ink)]">{data.product.sizeText}</p>
				</div>
				<div class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-4">
					<p class="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted-2)]">Status</p>
					<p class="mt-2 font-bold text-[var(--color-ink)]">{stockStatusLabel(data.product.stockStatus)}</p>
				</div>
			</div>

			<div class="mt-8 border-t border-[var(--color-line)] pt-6">
				<p class="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted-2)]">Harga</p>
				<p class="mt-2 text-3xl font-black text-[var(--color-accent)]">{formatRupiah(data.product.price)}</p>
				<p class="mt-4 text-xs leading-6 text-[var(--color-muted)]">Warna foto dapat sedikit berbeda karena pencahayaan dan layar perangkat.</p>
			</div>
		</div>
	</div>
</section>