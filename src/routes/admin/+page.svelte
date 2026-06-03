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
		if (stock === 'limited') return 'border-amber-200 bg-amber-50 text-amber-800';
		if (stock === 'sold_out') return 'border-red-200 bg-red-50 text-red-800';
		return 'border-stone-200 bg-stone-50 text-stone-700';
	}

	function statusBadgeClass(status: string): string {
		if (status === 'open') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
		if (status === 'pending') return 'border-amber-200 bg-amber-50 text-amber-800';
		return 'border-stone-200 bg-stone-50 text-stone-700';
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
	<header class="border border-[var(--color-line)] bg-white p-6 shadow-[0_22px_70px_rgba(43,41,38,0.07)] md:p-8">
		<p class="eyebrow">Dashboard</p>
		<div class="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div>
				<h1 class="font-heading text-5xl font-bold leading-none tracking-[-0.04em] text-[var(--color-ink)] md:text-6xl">Overview</h1>
				<p class="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
					Ringkasan data produk, stok, dan chat pelanggan Batik HM Akmal dalam satu tampilan.
				</p>
			</div>
			<a class="btn-primary" href="/admin/products">Kelola produk</a>
		</div>

		<div class="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
			{#each metrics as metric}
				<article class="border border-[var(--color-line)] bg-[var(--color-soft-2)] p-5">
					<p class="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[var(--color-muted-2)]">
						{metric.label}
					</p>
					<p class="font-heading mt-3 text-5xl font-bold leading-none text-[var(--color-ink)]">{metric.value}</p>
					<p class="mt-2 text-xs text-[var(--color-muted)]">{metric.hint}</p>
				</article>
			{/each}
		</div>
	</header>

	<div class="grid gap-5 lg:grid-cols-2">
		<section class="border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_60px_rgba(43,41,38,0.06)] md:p-6">
			<div class="flex items-center justify-between gap-3">
				<h2 class="font-heading text-3xl font-bold leading-none text-[var(--color-ink)]">Produk Perlu Perhatian</h2>
				<span class="chip">{attentionProducts.length} item</span>
			</div>

			<div class="mt-5 space-y-3">
				{#each attentionProducts.slice(0, 6) as product}
					<div class="flex items-center justify-between gap-3 border border-[var(--color-line)] bg-[var(--color-soft-2)] p-3">
						<div class="min-w-0">
							<p class="truncate font-bold text-[var(--color-ink)]">{product.name}</p>
							<p class="mt-1 font-mono text-xs text-[var(--color-muted)]">
								{product.product_code} • Stok: {product.stock_qty ?? 'Cek stok'}
							</p>
						</div>
						<span class={`shrink-0 border px-2.5 py-1 text-xs font-bold ${stockBadgeClass(product.stock_status)}`}>
							{stockLabel(product.stock_status)}
						</span>
					</div>
				{:else}
					<p class="bg-[var(--color-soft-2)] p-4 text-sm text-[var(--color-muted)]">
						Semua produk dalam kondisi ready.
					</p>
				{/each}
			</div>

			<a class="btn-secondary mt-5 inline-flex" href="/admin/products">Kelola Produk</a>
		</section>

		<section class="border border-[var(--color-line)] bg-white p-5 shadow-[0_18px_60px_rgba(43,41,38,0.06)] md:p-6">
			<div class="flex items-center justify-between gap-3">
				<h2 class="font-heading text-3xl font-bold leading-none text-[var(--color-ink)]">Chat Terbaru</h2>
				<span class="chip">{data.chatSessions.length} chat</span>
			</div>

			<div class="mt-5 space-y-3">
				{#each data.chatSessions.slice(0, 6) as session}
					<a
						class="flex items-center justify-between gap-3 border border-[var(--color-line)] bg-[var(--color-soft-2)] p-3 transition hover:bg-white hover:shadow-[0_16px_44px_rgba(43,41,38,0.08)]"
						href={`/admin/chats/${session.id}`}
					>
						<div class="min-w-0">
							<p class="truncate font-bold text-[var(--color-ink)]">
								{session.customer_name ?? 'Pelanggan tanpa nama'}
							</p>
							<p class="mt-1 text-xs text-[var(--color-muted)]">{formatDate(session.last_message_at)}</p>
						</div>
						<span class={`shrink-0 border px-2.5 py-1 text-xs font-bold capitalize ${statusBadgeClass(session.status)}`}>
							{session.status}
						</span>
					</a>
				{:else}
					<p class="bg-[var(--color-soft-2)] p-4 text-sm text-[var(--color-muted)]">
						Belum ada chat pelanggan.
					</p>
				{/each}
			</div>

			<a class="btn-secondary mt-5 inline-flex" href="/admin/chats">Lihat Semua Chat</a>
		</section>
	</div>
</section>