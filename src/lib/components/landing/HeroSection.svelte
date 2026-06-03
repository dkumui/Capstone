<script lang="ts">
	import type { CompanyProfileData } from '$lib/types/product-table';

	interface Props {
		company: CompanyProfileData;
	}

	let { company }: Props = $props();

	const whatsappHref = $derived(`https://wa.me/${company.whatsapp_number || '6281234567890'}`);

	/*
		CARA GANTI GAMBAR HERO:

		1. Simpan gambar ke folder:
		   static/images/hero/

		2. Contoh nama file:
		   static/images/hero/hero-main.jpg
		   static/images/hero/thumb-1.jpg
		   static/images/hero/thumb-2.jpg
		   static/images/hero/thumb-3.jpg

		3. Lalu ubah path di bawah ini.
		   File di folder static dipanggil langsung dari root, contoh:
		   /images/hero/hero-main.jpg
	*/

	const heroImage = '/image/IMG_20240811_142317.jpg';

	const thumbnailImages = [
		{
			src: '/image/IMG_20240810_202041.jpg',
			alt: 'Motif batik cap Pekalongan pertama'
		},
		{
			src: '/image/IMG_20240812_184431.jpg',
			alt: 'Motif batik cap Pekalongan kedua'
		},
		{
			src: '/image/IMG_20240814_002159.jpg',
			alt: 'Motif batik cap Pekalongan ketiga'
		}
	];
</script>

<section class="section-shell pt-8 md:pt-12">
	<div class="relative overflow-hidden bg-white">
		<div class="absolute inset-y-0 right-0 hidden w-[42%] bg-[var(--color-soft)] lg:block"></div>

		<div class="relative grid min-h-[640px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-14 lg:py-14">
			<div class="flex flex-col justify-center">
				<p class="eyebrow">Custom batik catalog</p>

				<h2 class="section-title mt-4">Your one-stop custom batik</h2>
				<!-- <h1 class="font-heading mt-6 max-w-[660px] text-[4rem] font-bold leading-[0.92] tracking-[-0.055em] text-[var(--color-ink)] md:text-[6rem] lg:text-[7rem]">
					Your one-stop<br />custom batik
				</h1> -->

				<p class="mt-7 max-w-md text-[0.95rem] leading-8 text-[var(--color-muted)]">
					{company.subtitle}. Pilih motif, cek detail warna, lalu tanyakan stok langsung ke admin.
				</p>

				<div class="mt-8 flex flex-col gap-3 sm:flex-row">
					<a href="#katalog" class="btn-primary">Shop now</a>
					<a href={whatsappHref} target="_blank" rel="noreferrer" class="btn-secondary">Tanya stok</a>
				</div>

				<div class="mt-10 max-w-xl border border-[var(--color-line)] bg-white p-5 shadow-[0_26px_70px_rgba(43,41,38,0.08)]">
					<div class="flex items-center gap-3">
						<span class="h-5 w-5 border border-[var(--color-line)] bg-[var(--color-soft)]"></span>
						<span class="bg-[var(--color-charcoal)] px-3 py-1 text-[0.62rem] font-bold text-white">
							Hello customer
						</span>
					</div>

					<p class="mt-4 text-sm font-bold text-[var(--color-ink)]">
						Where do you want your batik to go?
					</p>

					<div class="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
						<div class="border border-[var(--color-line)] px-4 py-3 text-center text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
							Seragam
						</div>

						<div class="border border-[var(--color-line)] px-4 py-3 text-center text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
							Jahit baju
						</div>

						<a
							class="flex items-center justify-center bg-[var(--color-charcoal)] px-5 py-3 text-white transition hover:bg-[var(--color-accent)]"
							href="#katalog"
							aria-label="Lihat katalog"
						>
							→
						</a>
					</div>
				</div>
			</div>

			<div class="relative flex items-center justify-center lg:justify-end">
				<div class="relative w-full max-w-[560px]">
					<div class="absolute -left-16 top-24 hidden h-72 w-72 rounded-full border border-[var(--color-line)] lg:block"></div>
					<div class="absolute left-6 top-36 hidden h-96 w-96 rounded-full border border-[var(--color-line)] lg:block"></div>

					<div class="relative ml-auto">
						<div class="border border-[var(--color-line)] bg-[#f1e8d7] p-5 shadow-[0_30px_80px_rgba(43,41,38,0.1)]">
							<div class="relative aspect-[4/3] overflow-hidden bg-white">
								<img
									src={heroImage}
									alt="Batik HM Akmal"
									class="h-full w-full object-cover"
								/>

								<div class="absolute inset-x-0 bottom-0 bg-white/85 px-5 py-4 text-center backdrop-blur-sm">
									<p class="text-sm font-medium tracking-[0.08em] text-[var(--color-ink)]">
										Batik HM Akmal
									</p>
								</div>
							</div>
						</div>

						<div class="mt-5 grid grid-cols-3 gap-4">
							{#each thumbnailImages as image}
								<div class="border border-[var(--color-line)] bg-white p-2 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(43,41,38,0.08)]">
									<img
										src={image.src}
										alt={image.alt}
										class="aspect-square w-full object-cover"
										loading="lazy"
									/>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>