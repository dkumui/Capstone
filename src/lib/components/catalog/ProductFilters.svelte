<script lang="ts">
  import type { CapType } from '$lib/types/domain';

  let {
    selectedCap,
    searchColor,
    onCapChange,
    onSearchChange
  } = $props<{
    selectedCap: CapType | 'ALL';
    searchColor: string;
    onCapChange: (value: CapType | 'ALL') => void;
    onSearchChange: (value: string) => void;
  }>();
</script>

<div class="rounded-xl border border-[#e3d2bc] bg-white p-4 md:p-5">
  <div class="grid gap-3 md:grid-cols-3">
    <button class={selectedCap === 'ALL' ? 'btn-primary' : 'btn-secondary'} onclick={() => onCapChange('ALL')}>Semua</button>
    <button class={selectedCap === 'CAP_1_WARNA' ? 'btn-primary' : 'btn-secondary'} onclick={() => onCapChange('CAP_1_WARNA')}>Cap 1 Warna</button>
    <button class={selectedCap === 'CAP_2_WARNA' ? 'btn-primary' : 'btn-secondary'} onclick={() => onCapChange('CAP_2_WARNA')}>Cap 2 Warna</button>
  </div>
  <div class="mt-3">
    <input
      class="w-full rounded-lg border border-[#d8c4ab] px-3 py-2 text-sm outline-none focus:border-[var(--color-earth)]"
      placeholder="Cari warna... (contoh: biru, maroon, turquoise)"
      value={searchColor}
      oninput={(e) => onSearchChange((e.currentTarget as HTMLInputElement).value)}
    />
  </div>
</div>
