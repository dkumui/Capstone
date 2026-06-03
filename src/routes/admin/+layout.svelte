<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const isLoginPage = $derived(page.url.pathname === '/admin/login');

	const navItems = [
		{ href: '/admin', label: 'Overview', desc: 'Ringkasan sistem' },
		{ href: '/admin/company', label: 'Data Toko', desc: 'Profil dan kontak' },
		{ href: '/admin/products', label: 'Manajemen Produk', desc: 'CRUD dan stok' },
		{ href: '/admin/inventory', label: 'Log Stok', desc: 'Riwayat perubahan' },
		{ href: '/admin/chats', label: 'Riwayat Chat', desc: 'Pesan pelanggan' }
	];

	function isActive(href: string): boolean {
		const pathname = String(page.url.pathname);

		if (href === '/admin') {
			return pathname === '/admin';
		}

		return pathname.startsWith(href);
	}
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="min-h-screen bg-[var(--color-bg)]">
		<div class="mx-auto flex w-full max-w-[1480px] gap-6 px-4 py-6 md:px-6">
			<aside class="hidden w-72 shrink-0 md:block">
				<div class="sticky top-6 overflow-hidden border border-[var(--color-line)] bg-white shadow-[0_24px_70px_rgba(43,41,38,0.08)]">
					<div class="border-b border-[var(--color-line)] p-6">
						<div class="flex items-center gap-3">
							<span class="flex h-9 w-9 items-center justify-center bg-[var(--color-charcoal)] text-[0.7rem] font-black tracking-[0.12em] text-white">
								HM
							</span>
							<div class="leading-tight">
								<p class="text-[0.65rem] font-black uppercase tracking-[0.22em] text-[var(--color-accent)]">Admin Panel</p>
								<h1 class="font-heading text-2xl font-bold leading-none text-[var(--color-ink)]">Batik HM Akmal</h1>
							</div>
						</div>

						<p class="mt-4 text-xs leading-6 text-[var(--color-muted)]">
							Kelola katalog Batik Cap, stok, data toko, dan chat pelanggan.
						</p>
					</div>

					<nav class="space-y-1 p-3 text-sm">
						{#each navItems as item}
							<a
								class={isActive(item.href)
									? 'block bg-[var(--color-charcoal)] px-4 py-3 text-white'
									: 'block px-4 py-3 text-[var(--color-ink)] transition hover:bg-[var(--color-soft)] hover:text-[var(--color-accent)]'}
								href={item.href}
							>
								<span class="block font-bold">{item.label}</span>
								<span class={isActive(item.href) ? 'mt-1 block text-xs text-white/70' : 'mt-1 block text-xs text-[var(--color-muted)]'}>
									{item.desc}
								</span>
							</a>
						{/each}
					</nav>

					<div class="border-t border-[var(--color-line)] p-3">
						<a class="btn-secondary mb-2 w-full" href="/">Lihat Website</a>

						<form method="POST" action="/admin/logout">
							<button class="btn-secondary w-full" type="submit">Logout</button>
						</form>
					</div>
				</div>
			</aside>

			<main class="min-w-0 flex-1">
				<div class="mb-5 border border-[var(--color-line)] bg-white p-3 md:hidden">
					<div class="flex items-center justify-between gap-3">
						<div>
							<p class="text-[0.65rem] font-black uppercase tracking-[0.22em] text-[var(--color-accent)]">Admin Panel</p>
							<p class="font-heading text-2xl font-bold leading-none text-[var(--color-ink)]">Batik HM Akmal</p>
						</div>

						<form method="POST" action="/admin/logout">
							<button class="btn-secondary px-3 py-2 text-[0.62rem]" type="submit">Logout</button>
						</form>
					</div>

					<div class="mt-3 flex gap-2 overflow-x-auto pb-1 text-sm">
						{#each navItems as item}
							<a
								class={isActive(item.href)
									? 'shrink-0 bg-[var(--color-charcoal)] px-3 py-2 text-xs font-bold text-white'
									: 'shrink-0 bg-[var(--color-soft)] px-3 py-2 text-xs font-bold text-[var(--color-ink)]'}
								href={item.href}
							>
								{item.label}
							</a>
						{/each}
					</div>
				</div>

				{@render children()}
			</main>
		</div>
	</div>
{/if}