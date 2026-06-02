<script lang="ts">
  import type { CompanyProfileData } from '$lib/types/product-table';

  let { company } = $props<{ company: CompanyProfileData }>();

  const whatsappHref = $derived(`https://wa.me/${company.whatsapp_number}`);
</script>

<section class="section-shell pb-12 pt-8 md:pt-10">
  <div class="rounded-2xl border border-[#e1cfb7] bg-[#fffaf3] p-6 md:p-8">
    <h2 class="text-2xl font-bold text-[var(--color-brown)]">Alamat & Kontak</h2>
    <p class="mt-3 text-sm leading-7 text-[#5c4838]">{company.address}</p>
    <p class="mt-2 text-sm text-[#5c4838]">Jam Operasional: {company.operation_hours}</p>
    <div class="mt-5 flex flex-wrap gap-3">
      <a class="btn-primary" href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp Admin</a>
      <a class="btn-secondary" href={company.maps_url} target="_blank" rel="noreferrer">Buka Rute Lokasi</a>
    </div>
  </div>
</section>
