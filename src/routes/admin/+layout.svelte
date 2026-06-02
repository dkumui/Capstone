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
	<div class="min-h-screen bg-[#f8f1e7]">
		<div class="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
			<aside class="hidden w-72 shrink-0 md:block">
				<div class="sticky top-6 overflow-hidden rounded-3xl border border-[#e2d1ba] bg-white shadow-sm">
					<div class="border-b border-[#eadac7] bg-[#fffaf3] p-5">
						<p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#9f7a5a]">
							Admin Panel
						</p>

						<h1 class="mt-2 text-2xl font-bold text-[var(--color-brown)]">
							Batik HM Akmal
						</h1>

						<p class="mt-1 text-xs leading-5 text-[#7a634f]">
							Kelola katalog Batik Cap, stok, data toko, dan chat pelanggan.
						</p>
					</div>

					<nav class="space-y-1 p-3 text-sm">
						{#each navItems as item}
							<a
								class={isActive(item.href)
									? 'block rounded-2xl bg-[#6a2a2a] px-4 py-3 text-white'
									: 'block rounded-2xl px-4 py-3 text-[#4a3425] transition hover:bg-[#f4eadf]'}
								href={item.href}
							>
								<span class="block font-semibold">{item.label}</span>
								<span class={isActive(item.href) ? 'mt-0.5 block text-xs text-white/75' : 'mt-0.5 block text-xs text-[#8a715c]'}>
									{item.desc}
								</span>
							</a>
						{/each}
					</nav>

					<div class="border-t border-[#eadac7] p-3">
						<a class="btn-secondary mb-2 w-full" href="/">
							Lihat Website
						</a>

						<form method="POST" action="/admin/logout">
							<button class="btn-secondary w-full" type="submit">
								Logout
							</button>
						</form>
					</div>
				</div>
			</aside>

			<main class="min-w-0 flex-1">
				<div class="mb-5 rounded-2xl border border-[#e2d1ba] bg-white p-3 md:hidden">
					<div class="flex items-center justify-between gap-3">
						<div>
							<p class="text-xs font-semibold uppercase tracking-wide text-[#9f7a5a]">
								Admin Panel
							</p>
							<p class="font-bold text-[var(--color-brown)]">Batik HM Akmal</p>
						</div>

						<form method="POST" action="/admin/logout">
							<button class="btn-secondary px-3 py-2 text-xs" type="submit">
								Logout
							</button>
						</form>
					</div>

					<div class="mt-3 flex gap-2 overflow-x-auto pb-1 text-sm">
						{#each navItems as item}
							<a
								class={isActive(item.href)
									? 'shrink-0 rounded-xl bg-[#6a2a2a] px-3 py-2 font-semibold text-white'
									: 'shrink-0 rounded-xl bg-[#f4eadf] px-3 py-2 text-[#4a3425]'}
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