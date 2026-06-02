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

<div class="rounded-xl border border-[#e3d2bc] bg-white p-4 md:p-5">
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <button class={selectedCap === 'all' ? 'btn-primary' : 'btn-secondary'} onclick={() => onCapChange('all')}>Semua Produk</button>
    <button class={selectedCap === 'cap_1_warna' ? 'btn-primary' : 'btn-secondary'} onclick={() => onCapChange('cap_1_warna')}>Cap 1 Warna</button>
    <button class={selectedCap === 'cap_2_warna' ? 'btn-primary' : 'btn-secondary'} onclick={() => onCapChange('cap_2_warna')}>Cap 2 Warna</button>
  </div>
  <div class="mt-3">
    <input
      class="w-full rounded-lg border border-[#d8c4ab] px-3 py-2 text-sm outline-none focus:border-[var(--color-earth)]"
      placeholder="Cari berdasarkan warna..."
      value={searchColor}
      oninput={(e) => onSearchChange((e.currentTarget as HTMLInputElement).value)}
    />
  </div>
</div>
