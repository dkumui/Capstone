<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';

	let { children } = $props();

	const isAdminArea = $derived(String(page.url.pathname).startsWith('/admin'));
	const year = new Date().getFullYear();

	const navLinks = [
		{ href: '/#katalog', label: 'Patterns' },
		{ href: '/#layanan', label: 'Services' },
		{ href: '/#kontak', label: 'Contact' }
	];
</script>

{#if isAdminArea}
	{@render children()}
{:else}
	<div class="min-h-screen">
		<aside class="fixed bottom-0 left-0 top-0 z-50 hidden w-[148px] border-r border-[var(--color-line)] bg-white lg:flex lg:flex-col">
			<div class="flex h-24 items-center justify-center">
				<a href="/" class="flex h-8 w-8 items-center justify-center bg-[var(--color-charcoal)] text-[0.7rem] font-black tracking-[0.12em] text-white">
					HM
				</a>
			</div>

			<nav class="mt-24 space-y-6 px-7 text-[0.72rem] font-extrabold text-[var(--color-ink)]">
				{#each navLinks as link}
					<a class="group flex items-center gap-3 transition hover:text-[var(--color-accent)]" href={link.href}>
						<span class="h-1.5 w-1.5 rounded-full border border-current transition group-hover:bg-current"></span>
						{link.label}
					</a>
				{/each}
			</nav>

			<div class="mt-auto px-7 pb-8">
				<a class="block text-[0.72rem] font-extrabold text-[var(--color-ink)] transition hover:text-[var(--color-accent)]" href="/#kontak">
					Blog
				</a>
				<div class="mt-10 border-t border-[var(--color-line)] pt-7">
					<p class="text-[0.62rem] uppercase tracking-[0.2em] text-[var(--color-muted-2)]">Chat with us</p>
					<p class="mt-2 text-[0.72rem] font-bold text-[var(--color-green)]">Online</p>
				</div>
				<div class="mt-8 flex gap-3 text-[0.7rem] font-black text-[var(--color-muted)]">
					<span>f</span>
					<span>x</span>
					<span>ig</span>
				</div>
			</div>
		</aside>

		<div class="lg:pl-[148px]">
			<header class="site-nav">
				<div class="section-shell flex h-16 items-center justify-between gap-4 md:h-[74px]">
					<a href="/" class="flex items-center gap-3 lg:hidden">
						<span class="flex h-8 w-8 items-center justify-center bg-[var(--color-soft)] text-[0.7rem] font-black tracking-[0.12em] text-white">
							HM
						</span>
						<span class="text-sm font-black text-[var(--color-ink)]">Batik HM Akmal</span>
					</a>

					<!-- <div class="hidden items-center gap-3 text-[0.75rem] font-semibold text-[var(--color-muted)] lg:flex">
						<span class="text-sm">⌕</span>
						<span>Search pattern or style</span>
					</div> -->

					<nav class="hidden items-center gap-7 md:flex">
						{#each navLinks as link}
							<a class="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[var(--color-muted)] transition hover:text-[var(--color-accent)]" href={link.href}>
								{link.label}
							</a>
						{/each}
					</nav>

					<div class="flex items-center gap-3">
						<a class="hidden text-[0.72rem] font-black uppercase tracking-[0.18em] text-[var(--color-accent)] sm:inline-flex" href="/#katalog">
							Shop in
						</a>
						<!-- <a class="btn-secondary px-4 py-2 text-[0.68rem]" href="/admin">Admin</a> -->
					</div>
				</div>
			</header>

			<main class="min-h-screen bg-[var(--color-canvas)]">
				{@render children()}
			</main>

			<footer class="border-t border-[var(--color-line)] bg-white">
				<div class="section-shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
					<div>
						<p class="font-heading text-4xl font-bold leading-none text-[var(--color-ink)]">Batik HM Akmal</p>
						<p class="mt-3 text-[0.7rem] font-black uppercase tracking-[0.26em] text-[var(--color-accent)]">
							Unggul Jaya Banyurip
						</p>
						<p class="mt-5 max-w-sm text-sm leading-7 text-[var(--color-muted)]">
							Katalog Batik Cap Pekalongan untuk kebutuhan kain, jahit, seragam, dan pemesanan langsung melalui admin.
						</p>
					</div>

					<div>
						<p class="text-[0.7rem] font-black uppercase tracking-[0.24em] text-[var(--color-ink)]">Navigasi</p>
						<ul class="mt-5 space-y-3 text-sm text-[var(--color-muted)]">
							<li><a class="transition hover:text-[var(--color-accent)]" href="/#katalog">Katalog Produk</a></li>
							<li><a class="transition hover:text-[var(--color-accent)]" href="/#layanan">Layanan</a></li>
							<li><a class="transition hover:text-[var(--color-accent)]" href="/#kontak">Kontak</a></li>
							<!-- <li><a class="transition hover:text-[var(--color-accent)]" href="/admin">Dashboard Admin</a></li> -->
						</ul>
					</div>

					<div>
						<p class="text-[0.7rem] font-black uppercase tracking-[0.24em] text-[var(--color-ink)]">Lokasi</p>
						<p class="mt-5 text-sm leading-7 text-[var(--color-muted)]">
							Banyurip, Pekalongan Selatan,<br />Kota Pekalongan, Jawa Tengah
						</p>
					</div>
				</div>

				<div class="border-t border-[var(--color-line)]">
					<div class="section-shell flex flex-col gap-2 py-5 text-xs text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
						<p>&copy; {year} Batik HM Akmal. Seluruh hak cipta dilindungi.</p>
						<p>Minimalist editorial batik catalog.</p>
					</div>
				</div>
			</footer>
		</div>
	</div>
{/if}