<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const activeProducts = $derived(data.products.filter((product) => product.is_active));
	const readyProducts = $derived(data.products.filter((product) => product.stock_status === 'ready'));
	const openChats = $derived(data.chatSessions.filter((chat) => chat.status === 'open'));
	const attentionProducts = $derived(
		data.products.filter((product) => product.stock_status !== 'ready')
	);

	const metrics = $derived([
		{ label: 'Total Produk', value: data.products.length, hint: 'Seluruh data produk' },
		{ label: 'Produk Aktif', value: activeProducts.length, hint: 'Tampil di katalog' },
		{ label: 'Stok Ready', value: readyProducts.length, hint: 'Stok lebih dari 5' },
		{ label: 'Chat Open', value: openChats.length, hint: 'Perlu ditindaklanjuti' }
	]);

	function stockLabel(stock: string): string {
		if (stock === 'ready') return 'Ready';
		if (stock === 'limited') return 'Terbatas';
		if (stock === 'sold_out') return 'Habis';
		return 'Cek Stok';
	}

	function stockBadgeClass(stock: string): string {
		if (stock === 'limited') return 'border-yellow-200 bg-yellow-100 text-yellow-800';
		if (stock === 'sold_out') return 'border-red-200 bg-red-100 text-red-800';
		return 'border-stone-200 bg-stone-100 text-stone-700';
	}

	function statusBadgeClass(status: string): string {
		if (status === 'open') return 'border-green-200 bg-green-100 text-green-800';
		if (status === 'pending') return 'border-yellow-200 bg-yellow-100 text-yellow-800';
		return 'border-stone-200 bg-stone-100 text-stone-700';
	}

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

<section class="space-y-6">
	<header class="rounded-2xl border border-[#e2d1ba] bg-white p-5 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7a5a]">Dashboard</p>
		<h1 class="mt-1 text-3xl font-bold text-[var(--color-brown)]">Overview</h1>
		<p class="mt-2 max-w-2xl text-sm leading-6 text-[#6a5340]">
			Ringkasan data produk, stok, dan chat pelanggan Batik HM Akmal dalam satu tampilan.
		</p>

		<div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
			{#each metrics as metric}
				<article class="rounded-xl border border-[#eadac7] bg-[#fffaf3] p-4">
					<p class="text-xs font-semibold uppercase tracking-wide text-[#9f7a5a]">
						{metric.label}
					</p>
					<p class="mt-2 text-3xl font-black text-[var(--color-maroon)]">{metric.value}</p>
					<p class="mt-1 text-xs text-[#8a715c]">{metric.hint}</p>
				</article>
			{/each}
		</div>
	</header>

	<div class="grid gap-5 lg:grid-cols-2">
		<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between gap-3">
				<h2 class="text-xl font-bold text-[var(--color-brown)]">Produk Perlu Perhatian</h2>
				<span class="chip">{attentionProducts.length} item</span>
			</div>

			<div class="mt-4 space-y-3">
				{#each attentionProducts.slice(0, 6) as product}
					<div class="flex items-center justify-between gap-3 rounded-xl border border-[#eadac7] bg-[#fffaf3] p-3">
						<div class="min-w-0">
							<p class="truncate font-semibold text-[#4a3425]">{product.name}</p>
							<p class="mt-0.5 font-mono text-xs text-[#8a715c]">
								{product.product_code} • Stok: {product.stock_qty ?? 'Cek stok'}
							</p>
						</div>
						<span class={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${stockBadgeClass(product.stock_status)}`}>
							{stockLabel(product.stock_status)}
						</span>
					</div>
				{:else}
					<p class="rounded-xl bg-[#fffaf3] p-3 text-sm text-[#6e5846]">
						Semua produk dalam kondisi ready.
					</p>
				{/each}
			</div>

			<a class="btn-secondary mt-4 inline-flex" href="/admin/products">Kelola Produk</a>
		</section>

		<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5 shadow-sm">
			<div class="flex items-center justify-between gap-3">
				<h2 class="text-xl font-bold text-[var(--color-brown)]">Chat Terbaru</h2>
				<span class="chip">{data.chatSessions.length} chat</span>
			</div>

			<div class="mt-4 space-y-3">
				{#each data.chatSessions.slice(0, 6) as session}
					<a
						class="flex items-center justify-between gap-3 rounded-xl border border-[#eadac7] bg-[#fffaf3] p-3 transition hover:bg-[#f7eddf]"
						href={`/admin/chats/${session.id}`}
					>
						<div class="min-w-0">
							<p class="truncate font-semibold text-[#4a3425]">
								{session.customer_name ?? 'Pelanggan tanpa nama'}
							</p>
							<p class="mt-0.5 text-xs text-[#8a715c]">
								{formatDate(session.last_message_at)}
							</p>
						</div>
						<span class={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusBadgeClass(session.status)}`}>
							{session.status}
						</span>
					</a>
				{:else}
					<p class="rounded-xl bg-[#fffaf3] p-3 text-sm text-[#6e5846]">
						Belum ada chat pelanggan.
					</p>
				{/each}
			</div>

			<a class="btn-secondary mt-4 inline-flex" href="/admin/chats">Lihat Semua Chat</a>
		</section>
	</div>
</section>
