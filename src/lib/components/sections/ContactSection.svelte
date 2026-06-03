<script lang="ts">
	import type { CompanyProfileData } from '$lib/types/product-table';

	let { company } = $props<{ company: CompanyProfileData }>();

	const whatsappHref = $derived(`https://wa.me/${company.whatsapp_number}`);
</script>

<section id="kontak" class="section-shell pb-16 pt-12 md:pb-20 md:pt-16">
	<div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
		<div class="bg-white p-6 md:p-10">
			<p class="eyebrow">Contact</p>
			<h2 class="section-title mt-4">Kunjungi toko atau hubungi admin.</h2>
			<p class="section-description">
				Konfirmasi stok sebelum memesan karena produk dapat terjual melalui toko offline atau chat pelanggan lain.
			</p>

			<div class="mt-8 flex flex-col gap-3 sm:flex-row">
				<a class="btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp Admin</a>
				<a class="btn-secondary" href={company.maps_url} target="_blank" rel="noreferrer">Buka rute</a>
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<article class="border border-[var(--color-line)] bg-white p-6">
				<p class="text-[0.7rem] font-black uppercase tracking-[0.22em] text-[var(--color-accent)]">Alamat</p>
				<p class="mt-4 text-sm leading-7 text-[var(--color-muted)]">{company.address}</p>
			</article>

			<article class="border border-[var(--color-line)] bg-white p-6">
				<p class="text-[0.7rem] font-black uppercase tracking-[0.22em] text-[var(--color-accent)]">Jam operasional</p>
				<p class="mt-4 text-sm leading-7 text-[var(--color-muted)]">{company.operation_hours}</p>
			</article>

			<article class="border border-[var(--color-line)] bg-white p-6 md:col-span-2">
				<p class="text-[0.7rem] font-black uppercase tracking-[0.22em] text-[var(--color-accent)]">Catatan belanja</p>
				<div class="mt-5 grid gap-3 md:grid-cols-3">
					<div class="bg-[var(--color-soft-2)] p-4">
						<p class="font-bold text-[var(--color-ink)]">Stok berubah</p>
						<p class="mt-2 text-xs leading-6 text-[var(--color-muted)]">Selalu cek ketersediaan stok terlebih dahulu.</p>
					</div>
					<div class="bg-[var(--color-soft-2)] p-4">
						<p class="font-bold text-[var(--color-ink)]">Warna foto</p>
						<p class="mt-2 text-xs leading-6 text-[var(--color-muted)]">Warna dapat berbeda karena layar dan pencahayaan.</p>
					</div>
					<div class="bg-[var(--color-soft-2)] p-4">
						<p class="font-bold text-[var(--color-ink)]">Tanya produk</p>
						<p class="mt-2 text-xs leading-6 text-[var(--color-muted)]">Chatbot membaca produk yang dipilih dari katalog.</p>
					</div>
				</div>
			</article>
		</div>
	</div>
</section>