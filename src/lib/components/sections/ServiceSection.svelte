<script lang="ts">
	import type { ServiceData } from '$lib/types/product-table';

	let { services } = $props<{ services: ServiceData[] }>();
</script>

<section id="layanan" class="section-shell py-10 md:py-16">
	<div class="surface-card overflow-hidden p-6 md:p-8">
		<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div>
				<p class="eyebrow">Layanan</p>
				<h2 class="section-title mt-3">Belanja batik lebih mudah untuk berbagai kebutuhan.</h2>
				<p class="section-description">
					Layanan disusun agar pelanggan bisa memilih produk, menanyakan stok, dan berkomunikasi dengan admin tanpa bingung.
				</p>
			</div>
		</div>

		<div class="mt-7 grid gap-4 md:grid-cols-3">
			{#each services as service, index}
				<article class="rounded-[1.25rem] border border-[#ead8bc] bg-[#fffaf3] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
					<div class="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-indigo)] text-sm font-black text-white">
						{index + 1}
					</div>

					<h3 class="mt-4 text-lg font-black text-[var(--color-brown)]">{service.title}</h3>
					<p class="mt-2 text-sm leading-7 text-[#6f5b47]">{service.description}</p>
				</article>
			{/each}
		</div>
	</div>
</section>