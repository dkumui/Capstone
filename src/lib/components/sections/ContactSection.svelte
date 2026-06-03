<script lang="ts">
	import type { CompanyProfileData } from '$lib/types/product-table';

	let { company } = $props<{ company: CompanyProfileData }>();

	const whatsappHref = $derived(`https://wa.me/${company.whatsapp_number}`);
</script>

<section id="kontak" class="section-shell pb-16 pt-10 md:pb-20 md:pt-16">
	<div class="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
		<div class="relative overflow-hidden rounded-[2rem] bg-[var(--color-indigo)] p-6 text-white card-shadow md:p-8">
			<div class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--color-gold)]/20 blur-3xl"></div>
			<div class="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>

			<div class="relative">
				<p class="text-xs font-black uppercase tracking-[0.22em] text-[#f0c777]">Alamat & Kontak</p>
				<h2 class="mt-3 text-3xl font-black tracking-tight md:text-4xl">
					Kunjungi toko atau hubungi admin untuk cek stok.
				</h2>

				<div class="mt-7 space-y-4">
					<div class="rounded-2xl border border-white/15 bg-white/10 p-4">
						<p class="text-xs font-semibold uppercase tracking-wide text-white/60">Alamat</p>
						<p class="mt-2 text-sm leading-7 text-white/90">{company.address}</p>
					</div>

					<div class="rounded-2xl border border-white/15 bg-white/10 p-4">
						<p class="text-xs font-semibold uppercase tracking-wide text-white/60">Jam Operasional</p>
						<p class="mt-2 text-sm leading-7 text-white/90">{company.operation_hours}</p>
					</div>
				</div>

				<div class="mt-7 flex flex-col gap-3 sm:flex-row">
					<a class="btn-gold" href={whatsappHref} target="_blank" rel="noreferrer">
						WhatsApp Admin
					</a>

					<a class="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20" href={company.maps_url} target="_blank" rel="noreferrer">
						Buka Rute Lokasi
					</a>
				</div>
			</div>
		</div>

		<div class="surface-card p-6 md:p-8">
			<p class="eyebrow">Catatan Belanja</p>
			<h3 class="mt-3 text-2xl font-black text-[var(--color-brown)]">Sebelum memesan, konfirmasi stok terlebih dahulu.</h3>

			<div class="mt-6 space-y-3">
				<div class="rounded-2xl bg-[#fff7e8] p-4">
					<p class="font-bold text-[var(--color-indigo)]">Stok dapat berubah</p>
					<p class="mt-1 text-sm leading-6 text-[#6f5b47]">Produk bisa terjual melalui toko offline atau chat, sehingga stok perlu dikonfirmasi.</p>
				</div>

				<div class="rounded-2xl bg-[#fff7e8] p-4">
					<p class="font-bold text-[var(--color-indigo)]">Warna foto bisa berbeda</p>
					<p class="mt-1 text-sm leading-6 text-[#6f5b47]">Perbedaan layar dan pencahayaan dapat memengaruhi tampilan warna kain.</p>
				</div>

				<div class="rounded-2xl bg-[#fff7e8] p-4">
					<p class="font-bold text-[var(--color-indigo)]">Bisa tanya produk spesifik</p>
					<p class="mt-1 text-sm leading-6 text-[#6f5b47]">Klik Tanya Produk di katalog agar chatbot langsung mengenali produk yang dipilih.</p>
				</div>
			</div>
		</div>
	</div>
</section>