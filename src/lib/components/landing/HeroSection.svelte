<script lang="ts">
	import type { CompanyProfileData } from '$lib/types/product-table';

	let { company }: { company: CompanyProfileData } = $props();

	const whatsappHref = $derived(`https://wa.me/${company.whatsapp_number || '6281234567890'}`);
</script>

<section class="section-shell pt-10 pb-8 md:pt-16 md:pb-12">
	<div class="batik-pattern card-shadow rounded-2xl border border-[#d8c2a6] bg-[var(--color-cream)] p-8 md:p-12">
		<p class="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-earth)]">
			Katalog Resmi UMKM
		</p>

		<h1 class="max-w-3xl text-3xl font-bold leading-tight text-[var(--color-brown)] md:text-5xl">
			{company.business_name}
		</h1>

		<p class="mt-4 max-w-2xl text-base font-medium leading-7 text-[#553e2f] md:text-lg">
			{company.subtitle}
		</p>

		<div class="mt-6 flex flex-wrap gap-3">
			<a href={whatsappHref} target="_blank" rel="noreferrer" class="btn-primary">
				Tanya Stok Sekarang
			</a>

			<a href="#katalog" class="btn-secondary">
				Lihat Katalog
			</a>
		</div>
	</div>
</section>