<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(value: string | null | undefined): string {
		if (!value) return '-';

		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return '-';

		return date.toLocaleString('id-ID');
	}
</script>

<svelte:head>
	<title>Log Stok | Admin Batik HM Akmal</title>
</svelte:head>

<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
	<h1 class="text-2xl font-bold text-[var(--color-brown)]">Log Stok</h1>
	<p class="mt-1 text-sm text-[#6c5543]">
		Riwayat perubahan stok dari dashboard admin.
	</p>

	{#if data.inventoryTransactions.length === 0}
		<p class="mt-4 rounded-xl bg-[#faf3ea] px-4 py-3 text-sm text-[#6f5946]">
			Belum ada perubahan stok.
		</p>
	{:else}
		<div class="mt-5 overflow-x-auto">
			<table class="min-w-full text-left text-sm">
				<thead>
					<tr class="border-b border-[#efdfcc] text-[#6f5846]">
						<th class="py-2 pr-4">Produk</th>
						<th class="py-2 pr-4">Stok Lama</th>
						<th class="py-2 pr-4">Stok Baru</th>
						<th class="py-2 pr-4">Status Lama</th>
						<th class="py-2 pr-4">Status Baru</th>
						<th class="py-2 pr-4">Sumber</th>
						<th class="py-2 pr-4">Waktu</th>
					</tr>
				</thead>

				<tbody>
					{#each data.inventoryTransactions as trx}
						<tr class="border-b border-[#f3e8d9]">
							<td class="py-2 pr-4 font-mono text-xs">{trx.product_code}</td>
							<td class="py-2 pr-4">{trx.previous_qty ?? 'Cek stok'}</td>
							<td class="py-2 pr-4">{trx.new_qty ?? 'Cek stok'}</td>
							<td class="py-2 pr-4">{trx.previous_stock_status ?? '-'}</td>
							<td class="py-2 pr-4">{trx.new_stock_status ?? '-'}</td>
							<td class="py-2 pr-4">{trx.source}</td>
							<td class="py-2 pr-4">{formatDate(trx.created_at)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>