<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';

	let { children } = $props();

	const isAdminArea = $derived(String(page.url.pathname).startsWith('/admin'));

	const year = new Date().getFullYear();

	const navLinks = [
		{ href: '/#katalog', label: 'Katalog' },
		{ href: '/#layanan', label: 'Layanan' },
		{ href: '/#kontak', label: 'Kontak' }
	];
</script>

{#if isAdminArea}
	{@render children()}
{:else}
	<div class="flex min-h-screen flex-col">
		<header class="site-nav">
			<div class="section-shell flex h-16 items-center justify-between gap-4 md:h-20">
				<a href="/" class="flex items-center gap-3">
					<span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-indigo)] text-base font-black text-[var(--color-gold)] shadow-sm">
						BA
					</span>
					<span class="leading-tight">
						<span class="block text-base font-black tracking-tight text-[var(--color-indigo)] md:text-lg">
							Batik HM Akmal
						</span>
						<span class="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--color-copper)]">
							Unggul Jaya Banyurip
						</span>
					</span>
				</a>

				<nav class="hidden items-center gap-1 md:flex">
					{#each navLinks as link}
						<a
							class="rounded-full px-4 py-2 text-sm font-bold text-[var(--color-brown)] transition hover:bg-[#fff3df] hover:text-[var(--color-indigo)]"
							href={link.href}
						>
							{link.label}
						</a>
					{/each}
				</nav>

				<div class="flex items-center gap-2">
					<a class="hidden btn-gold px-4 py-2 text-xs sm:inline-flex" href="/#katalog">
						Lihat Katalog
					</a>
					<a class="btn-secondary px-4 py-2 text-xs" href="/admin">Admin</a>
				</div>
			</div>

			<div class="border-t border-[var(--color-line)] bg-white/70 md:hidden">
				<div class="section-shell flex gap-2 overflow-x-auto py-2.5 text-sm">
					{#each navLinks as link}
						<a
							class="shrink-0 rounded-full bg-[#fff3df] px-4 py-1.5 font-bold text-[var(--color-brown)]"
							href={link.href}
						>
							{link.label}
						</a>
					{/each}
				</div>
			</div>
		</header>

		<main class="flex-1">
			{@render children()}
		</main>

		<footer class="mt-auto border-t border-[var(--color-line)] bg-[var(--color-indigo)] text-white">
			<div class="section-shell grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
				<div>
					<p class="text-lg font-black">Batik HM Akmal</p>
					<p class="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
						Unggul Jaya Banyurip
					</p>
					<p class="mt-4 max-w-sm text-sm leading-7 text-white/70">
						Produsen Batik Cap khas Pekalongan untuk kebutuhan kain, jahit, seragam, dan
						koleksi harian. Katalog digital, pemesanan via chatbot atau WhatsApp.
					</p>
				</div>

				<div>
					<p class="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-gold)]">
						Navigasi
					</p>
					<ul class="mt-4 space-y-2 text-sm text-white/75">
						<li><a class="transition hover:text-white" href="/#katalog">Katalog Produk</a></li>
						<li><a class="transition hover:text-white" href="/#layanan">Layanan</a></li>
						<li><a class="transition hover:text-white" href="/#kontak">Kontak &amp; Lokasi</a></li>
						<li><a class="transition hover:text-white" href="/admin">Dashboard Admin</a></li>
					</ul>
				</div>

				<div>
					<p class="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-gold)]">
						Lokasi
					</p>
					<p class="mt-4 text-sm leading-7 text-white/75">
						Banyurip, Pekalongan Selatan,<br />
						Kota Pekalongan, Jawa Tengah
					</p>
				</div>
			</div>

			<div class="border-t border-white/10">
				<div class="section-shell flex flex-col gap-1 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
					<p>&copy; {year} Batik HM Akmal. Seluruh hak cipta dilindungi.</p>
					<p>Katalog Batik Cap Pekalongan</p>
				</div>
			</div>
		</footer>
	</div>
{/if}
