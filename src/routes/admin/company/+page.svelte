<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Data Toko | Admin Batik HM Akmal</title>
</svelte:head>

<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
	<h1 class="text-2xl font-bold text-[var(--color-brown)]">Data Toko</h1>
	<p class="mt-1 text-sm text-[#6c5543]">
		Edit informasi utama toko yang tampil di landing page.
	</p>

	{#if form?.message}
		<div class="mt-5 rounded-xl border border-[#d8c3aa] bg-[#fffaf3] px-4 py-3 text-sm text-[var(--color-brown)]">
			{form.message}
		</div>
	{/if}

	<form method="POST" action="?/updateCompany" class="mt-5 grid gap-4 md:grid-cols-2">
		<label class="text-sm text-[#6e5846]">
			Nama Usaha
			<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="business_name" value={data.company.businessName} required />
		</label>

		<label class="text-sm text-[#6e5846]">
			Nama Alternatif
			<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="alt_business_name" value={data.company.altBusinessName} />
		</label>

		<label class="text-sm text-[#6e5846] md:col-span-2">
			Deskripsi
			<textarea class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="description" rows="5" required>{data.company.description}</textarea>
		</label>

		<label class="text-sm text-[#6e5846] md:col-span-2">
			Alamat
			<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="address" value={data.company.address} required />
		</label>

		<label class="text-sm text-[#6e5846]">
			Nomor WhatsApp
			<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="whatsapp_number" value={data.company.whatsappNumber} placeholder="Contoh: 6281234567890" />
		</label>

		<label class="text-sm text-[#6e5846]">
			Nomor Telepon
			<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="contact_phone" value={data.company.contactPhone} />
		</label>

		<label class="text-sm text-[#6e5846]">
			Jam Operasional
			<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="operation_hours" value={data.company.operationHours} />
		</label>

		<label class="text-sm text-[#6e5846]">
			Google Maps Link
			<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="google_maps_link" value={data.company.googleMapsLink} />
		</label>

		<div class="md:col-span-2">
			<button class="btn-primary" type="submit">Simpan Data Toko</button>
		</div>
	</form>
</section>