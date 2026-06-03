<script lang="ts">
	import type { CapType } from '$lib/types/product-table';

	let {
		selectedCap,
		searchColor,
		onCapChange,
		onSearchChange
	} = $props<{
		selectedCap: CapType | 'all';
		searchColor: string;
		onCapChange: (value: CapType | 'all') => void;
		onSearchChange: (value: string) => void;
	}>();
</script>

<div class="rounded-[1.5rem] border border-[#ead8bc] bg-white/90 p-4 soft-shadow">
	<div class="grid gap-3 lg:grid-cols-[1fr_360px]">
		<div class="grid gap-2 sm:grid-cols-3">
			<button
				type="button"
				class={selectedCap === 'all' ? 'btn-primary' : 'btn-secondary'}
				onclick={() => onCapChange('all')}
			>
				Semua
			</button>

			<button
				type="button"
				class={selectedCap === 'cap_1_warna' ? 'btn-primary' : 'btn-secondary'}
				onclick={() => onCapChange('cap_1_warna')}
			>
				Cap 1 Warna
			</button>

			<button
				type="button"
				class={selectedCap === 'cap_2_warna' ? 'btn-primary' : 'btn-secondary'}
				onclick={() => onCapChange('cap_2_warna')}
			>
				Cap 2 Warna
			</button>
		</div>

		<input
			class="w-full rounded-full border border-[#dbc7af] bg-[#fffaf2] px-5 py-3 text-sm outline-none transition focus:border-[var(--color-gold)] focus:ring-4 focus:ring-[#c89235]/15"
			placeholder="Cari warna, misalnya biru atau maroon..."
			value={searchColor}
			oninput={(event) => onSearchChange((event.currentTarget as HTMLInputElement).value)}
		/>
	</div>
</div>