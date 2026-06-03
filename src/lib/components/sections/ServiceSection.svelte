<script lang="ts">
	import type { ServiceData } from '$lib/types/product-table';

	let { services } = $props<{ services: ServiceData[] }>();
</script>

<section id="layanan" class="section-shell py-12 md:py-16">
	<div class="bg-white px-6 py-10 md:px-10">
		<div class="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
			<div>
				<p class="eyebrow">Customize your style</p>
				<h2 class="section-title mt-4">Layanan batik.</h2>
				<p class="section-description">
					Layanan dibuat agar pelanggan bisa memilih produk, menanyakan stok, dan berkomunikasi dengan admin tanpa alur yang membingungkan.
				</p>
			</div>

			<div class="grid gap-4 md:grid-cols-3">
				{#each services as service, index}
					<article class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_60px_rgba(43,41,38,0.08)]">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-charcoal)] text-xs font-black text-white">
							{index + 1}
						</div>

						<h3 class="mt-5 text-base font-black text-[var(--color-ink)]">{service.title}</h3>
						<p class="mt-3 text-sm leading-7 text-[var(--color-muted)]">{service.description}</p>
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>