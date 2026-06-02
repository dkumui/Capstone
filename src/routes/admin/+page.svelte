<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const activeProducts = $derived(data.products.filter((product) => product.is_active));
	const featuredProducts = $derived(data.products.filter((product) => product.is_featured));
	const readyProducts = $derived(data.products.filter((product) => product.stock_status === 'ready'));
	const openChats = $derived(data.chatSessions.filter((chat) => chat.status === 'open'));

	function formatDate(value: string | null | undefined): string {
		if (!value) return '-';

		const date = new Date(value);

		if (Number.isNaN(date.getTime())) {
			return '-';
		}

		return date.toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Overview Admin | Batik HM Akmal</title>
</svelte:head>

<section>
	<h1 class="text-3xl font-bold text-[var(--color-brown)]">Overview</h1>
	<p class="mt-2 text-sm text-[#6a5340]">
		Ringkasan data produk, stok, dan chat pelanggan Batik HM Akmal.
	</p>

	<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<article class="rounded-xl border border-[#e4d3bf] bg-white p-4">
			<p class="text-sm text-[#7a634f]">Total Produk</p>
			<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">
				{data.products.length}
			</p>
		</article>

		<article class="rounded-xl border border-[#e4d3bf] bg-white p-4">
			<p class="text-sm text-[#7a634f]">Produk Aktif</p>
			<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">
				{activeProducts.length}
			</p>
		</article>

		<article class="rounded-xl border border-[#e4d3bf] bg-white p-4">
			<p class="text-sm text-[#7a634f]">Stok Ready</p>
			<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">
				{readyProducts.length}
			</p>
		</article>

		<article class="rounded-xl border border-[#e4d3bf] bg-white p-4">
			<p class="text-sm text-[#7a634f]">Chat Open</p>
			<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">
				{openChats.length}
			</p>
		</article>
	</div>

	<div class="mt-8 grid gap-5 lg:grid-cols-2">
		<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
			<h2 class="text-xl font-semibold text-[var(--color-brown)]">
				Produk Perlu Perhatian
			</h2>

			<div class="mt-4 space-y-3">
				{#each data.products.filter((product) => product.stock_status !== 'ready').slice(0, 8) as product}
					<div class="rounded-xl bg-[#fffaf3] p-3">
						<p class="font-semibold text-[#4a3425]">{product.name}</p>
						<p class="mt-1 text-sm text-[#6e5846]">
							{product.product_code} • Status: {product.stock_status} • Stok:
							{product.stock_qty ?? 'Cek stok'}
						</p>
					</div>
				{:else}
					<p class="rounded-xl bg-[#fffaf3] p-3 text-sm text-[#6e5846]">
						Semua produk dalam kondisi ready.
					</p>
				{/each}
			</div>

			<a class="btn-secondary mt-4 inline-flex" href="/admin/products">
				Kelola Produk
			</a>
		</section>

		<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
			<h2 class="text-xl font-semibold text-[var(--color-brown)]">
				Chat Terbaru
			</h2>

			<div class="mt-4 space-y-3">
				{#each data.chatSessions.slice(0, 8) as session}
					<a
						class="block rounded-xl bg-[#fffaf3] p-3 hover:bg-[#f7eddf]"
						href={`/admin/chats/${session.id}`}
					>
						<p class="font-semibold text-[#4a3425]">
							{session.customer_name ?? 'Pelanggan tanpa nama'}
						</p>
						<p class="mt-1 text-sm text-[#6e5846]">
							Status: {session.status} • {formatDate(session.last_message_at)}
						</p>
					</a>
				{:else}
					<p class="rounded-xl bg-[#fffaf3] p-3 text-sm text-[#6e5846]">
						Belum ada chat pelanggan.
					</p>
				{/each}
			</div>

			<a class="btn-secondary mt-4 inline-flex" href="/admin/chats">
				Lihat Semua Chat
			</a>
		</section>
	</div>
</section>