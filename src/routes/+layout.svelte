<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';

	let { children } = $props();

	const isLoginPage = $derived(page.url.pathname === '/admin/login');

	const navItems = [
		{ href: '/admin', label: 'Overview', desc: 'Ringkasan sistem' },
		{ href: '/admin/company', label: 'Data Toko', desc: 'Profil dan kontak' },
		{ href: '/admin/products', label: 'Manajemen Produk', desc: 'CRUD dan stok' },
		{ href: '/admin/inventory', label: 'Log Stok', desc: 'Audit perubahan' },
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
	<div class="min-h-screen bg-[#fff9ef]">
		<div class="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
			<aside class="hidden w-72 shrink-0 md:block">
				<div class="sticky top-6 overflow-hidden rounded-[1.75rem] border border-[#ead8bc] bg-white shadow-sm">
					<div class="bg-[var(--color-indigo)] p-5 text-white">
						<p class="text-xs font-black uppercase tracking-[0.22em] text-[#f0c777]">
							Admin Panel
						</p>

						<h1 class="mt-2 text-2xl font-black">
							Batik HM Akmal
						</h1>

						<p class="mt-2 text-xs leading-5 text-white/70">
							Kelola katalog, stok, data toko, dan chat pelanggan.
						</p>
					</div>

					<nav class="space-y-1 p-3 text-sm">
						{#each navItems as item}
							<a
								class={isActive(item.href)
									? 'block rounded-2xl bg-[#fff7e8] px-4 py-3 text-[var(--color-indigo)] ring-1 ring-[#ead8bc]'
									: 'block rounded-2xl px-4 py-3 text-[#4a3425] transition hover:bg-[#fff7e8]'}
								href={item.href}
							>
								<span class="block font-black">{item.label}</span>
								<span class="mt-0.5 block text-xs text-[#8a715c]">{item.desc}</span>
							</a>
						{/each}
					</nav>

					<div class="border-t border-[#ead8bc] p-3">
						<a class="btn-secondary mb-2 w-full" href="/">
							Lihat Website
						</a>

						<form method="POST" action="/admin/logout">
							<button class="btn-primary w-full" type="submit">
								Logout
							</button>
						</form>
					</div>
				</div>
			</aside>

			<main class="min-w-0 flex-1">
				<div class="mb-5 rounded-2xl border border-[#ead8bc] bg-white p-3 shadow-sm md:hidden">
					<div class="flex items-center justify-between gap-3">
						<div>
							<p class="text-xs font-black uppercase tracking-wide text-[#9f7a5a]">
								Admin Panel
							</p>
							<p class="font-black text-[var(--color-indigo)]">Batik HM Akmal</p>
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
									? 'shrink-0 rounded-full bg-[var(--color-indigo)] px-4 py-2 font-black text-white'
									: 'shrink-0 rounded-full bg-[#fff7e8] px-4 py-2 font-semibold text-[#4a3425]'}
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