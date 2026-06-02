<script lang="ts">
  import type { ServiceItem } from '$lib/types/domain';

  let { services } = $props<{ services: ServiceItem[] }>();
</script>

<section class="section-shell py-8 md:py-10">
  <h2 class="text-2xl font-bold text-[var(--color-brown)]">Layanan</h2>
  <div class="mt-4 grid gap-4 md:grid-cols-3">
    {#each services as service}
      <article class="rounded-xl border border-[#e5d6c3] bg-white p-5">
        <h3 class="font-semibold text-[var(--color-maroon)]">{service.title}</h3>
        <p class="mt-2 text-sm text-[#5b4737]">{service.description}</p>
      </article>
    {/each}
  </div>
</section>
