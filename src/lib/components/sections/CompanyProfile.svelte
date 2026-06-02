<script lang="ts">
  import type { CompanySettings } from '$lib/types/domain';

  let { company } = $props<{ company: CompanySettings }>();
</script>

<section class="section-shell py-8 md:py-10">
  <div class="rounded-2xl border border-[#e1d2be] bg-white p-6 md:p-8">
    <h2 class="text-2xl font-bold text-[var(--color-brown)]">Profil UMKM</h2>
    <p class="mt-3 text-sm leading-7 text-[#5c4838]">{company.businessName} berfokus pada produksi Batik Cap, terutama kategori Cap 1 Warna dan Cap 2 Warna dengan variasi warna khas Pekalongan.</p>
  </div>
</section>
