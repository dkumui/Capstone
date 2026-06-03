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

<div class="border border-[var(--color-line)] bg-white p-4">
	<div class="grid gap-3 lg:grid-cols-[1fr_380px]">
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
			class="input-editorial"
			placeholder="Search color, code, or style..."
			value={searchColor}
			oninput={(event) => onSearchChange((event.currentTarget as HTMLInputElement).value)}
		/>
	</div>
</div>