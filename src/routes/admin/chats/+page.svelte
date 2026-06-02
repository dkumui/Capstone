<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let statusFilter = $state<'all' | 'open' | 'pending' | 'closed'>('all');
	let search = $state('');

	const filteredSessions = $derived.by(() => {
		return data.chatSessions.filter((session) => {
			const statusOk = statusFilter === 'all' || session.status === statusFilter;

			const keyword = search.toLowerCase().trim();
			const keywordOk =
				keyword.length === 0 ||
				(session.customer_name ?? '').toLowerCase().includes(keyword) ||
				(session.customer_whatsapp ?? '').toLowerCase().includes(keyword) ||
				(session.product_name ?? '').toLowerCase().includes(keyword) ||
				(session.product_code ?? '').toLowerCase().includes(keyword);

			return statusOk && keywordOk;
		});
	});

	function formatDate(value: string | null | undefined): string {
		if (!value) return '-';

		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '-';

		return date.toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Riwayat Chat | Admin Batik HM Akmal</title>
</svelte:head>

<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
	<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-[var(--color-brown)]">Riwayat Chat</h1>
			<p class="mt-1 text-sm text-[#6c5543]">
				Lihat chat pelanggan, detail produk yang ditanyakan, dan lanjutkan ke WhatsApp.
			</p>
		</div>

		<div class="grid gap-2 sm:grid-cols-2">
			<input class="rounded-lg border border-[#dbc7af] px-3 py-2 text-sm" bind:value={search} placeholder="Cari chat..." />

			<select class="rounded-lg border border-[#dbc7af] px-3 py-2 text-sm" bind:value={statusFilter}>
				<option value="all">Semua Status</option>
				<option value="open">Open</option>
				<option value="pending">Pending</option>
				<option value="closed">Closed</option>
			</select>
		</div>
	</div>

	{#if filteredSessions.length === 0}
		<p class="mt-4 rounded-xl bg-[#faf3ea] px-4 py-3 text-sm text-[#6f5946]">
			Tidak ada chat sesuai filter.
		</p>
	{:else}
		<div class="mt-5 space-y-3">
			{#each filteredSessions as session}
				<article class="rounded-xl border border-[#eadac7] bg-[#fffaf3] p-4">
					<div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
						<div>
							<p class="font-mono text-xs text-[#7a634f]">{session.id}</p>

							<h3 class="mt-1 font-semibold text-[#4a3425]">
								{session.customer_name ?? 'Pelanggan tanpa nama'}
							</h3>

							<p class="mt-1 text-sm text-[#6e5846]">
								WhatsApp: {session.customer_whatsapp ?? 'Belum diisi'}
							</p>

							{#if session.product_name}
								<p class="mt-1 text-sm text-[#6e5846]">
									Produk: {session.product_name} {session.product_color ? `warna ${session.product_color}` : ''}
								</p>
							{/if}

							<p class="mt-1 text-xs text-[#7a634f]">
								Status: {session.status} • Update: {formatDate(session.last_message_at)}
							</p>
						</div>

						<div class="flex flex-wrap gap-2">
							<a class="btn-secondary px-3 py-2 text-xs" href={`/admin/chats/${session.id}`}>
								Lihat Detail
							</a>

							{#if session.customer_whatsapp}
								<a class="btn-primary px-3 py-2 text-xs" href={`https://wa.me/${session.customer_whatsapp}`} target="_blank" rel="noreferrer">
									WhatsApp
								</a>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>