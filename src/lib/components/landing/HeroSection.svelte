<script lang="ts">
	import type { CompanyProfileData } from '$lib/types/product-table';

	let { company }: { company: CompanyProfileData } = $props();

	const whatsappHref = $derived(`https://wa.me/${company.whatsapp_number || '6281234567890'}`);
</script>

<section class="section-shell pt-8 md:pt-12">
	<div class="relative overflow-hidden rounded-[2rem] border border-[#ead8bc] bg-[#fff8ec] card-shadow">
		<div class="absolute inset-0 batik-pattern opacity-80"></div>
		<div class="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c89235]/20 blur-3xl"></div>
		<div class="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-[#7b1f2a]/10 blur-3xl"></div>

		<div class="relative grid gap-8 p-6 md:grid-cols-[1.15fr_0.85fr] md:p-10 lg:p-14">
			<div class="flex flex-col justify-center">
				<div class="inline-flex w-fit items-center gap-2 rounded-full border border-[#e5c98e] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-copper)]">
					<span class="h-2 w-2 rounded-full bg-[var(--color-gold)]"></span>
					Katalog Resmi UMKM Batik
				</div>

				<h1 class="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-[var(--color-indigo)] md:text-6xl">
					{company.business_name}
				</h1>

				<p class="mt-5 max-w-2xl text-base leading-8 text-[#514031] md:text-lg">
					{company.subtitle}
				</p>

				<div class="mt-7 flex flex-col gap-3 sm:flex-row">
					<a href="#katalog" class="btn-primary">
						Lihat Katalog Batik
					</a>

					<a href={whatsappHref} target="_blank" rel="noreferrer" class="btn-gold">
						Tanya Stok Sekarang
					</a>
				</div>

				<div class="mt-8 grid gap-3 sm:grid-cols-3">
					<div class="rounded-2xl border border-[#ead8bc] bg-white/75 p-4">
						<p class="text-2xl font-black text-[var(--color-maroon)]">±205</p>
						<p class="mt-1 text-xs font-semibold text-[#6f5b47]">cm panjang kain</p>
					</div>

					<div class="rounded-2xl border border-[#ead8bc] bg-white/75 p-4">
						<p class="text-2xl font-black text-[var(--color-maroon)]">1 & 2</p>
						<p class="mt-1 text-xs font-semibold text-[#6f5b47]">kategori warna cap</p>
					</div>

					<div class="rounded-2xl border border-[#ead8bc] bg-white/75 p-4">
						<p class="text-2xl font-black text-[var(--color-maroon)]">Real</p>
						<p class="mt-1 text-xs font-semibold text-[#6f5b47]">stok dicek admin</p>
					</div>
				</div>
			</div>

			<div class="relative">
				<div class="rounded-[1.75rem] border border-[#ead8bc] bg-white/80 p-4 soft-shadow">
					<div class="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#183153] via-[#7b1f2a] to-[#c89235] p-1">
						<div class="flex h-full flex-col justify-between rounded-[1rem] bg-[#fff8ec] p-6">
							<div>
								<p class="eyebrow">Batik Cap Pekalongan</p>
								<h2 class="mt-3 text-3xl font-black leading-tight text-[var(--color-brown)]">
									Kain batik untuk jahit, seragam, dan kebutuhan harian.
								</h2>
							</div>

							<div class="grid gap-3">
								<div class="rounded-2xl bg-white p-4">
									<p class="text-sm font-bold text-[var(--color-indigo)]">Cap 1 Warna</p>
									<p class="mt-1 text-xs text-[#6f5b47]">Pilihan warna solid, harga lebih ekonomis.</p>
								</div>

								<div class="rounded-2xl bg-white p-4">
									<p class="text-sm font-bold text-[var(--color-indigo)]">Cap 2 Warna</p>
									<p class="mt-1 text-xs text-[#6f5b47]">Kombinasi warna lebih hidup untuk kebutuhan seragam.</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="absolute -bottom-4 -left-4 hidden rounded-2xl bg-[var(--color-indigo)] px-5 py-4 text-white shadow-xl md:block">
					<p class="text-xs font-semibold text-white/70">Lokasi</p>
					<p class="text-sm font-bold">Banyurip, Pekalongan</p>
				</div>
			</div>
		</div>
	</div>
</section>