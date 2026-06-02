<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Login Admin | Batik HM Akmal</title>
</svelte:head>

<section class="section-shell py-12">
	<div class="mx-auto max-w-md rounded-2xl border border-[#ddcab0] bg-white p-6">
		<h1 class="text-2xl font-bold text-[var(--color-brown)]">Login Admin</h1>
		<p class="mt-2 text-sm text-[#6a5442]">
			Masuk ke dashboard admin Batik HM Akmal.
		</p>

		<form method="POST" class="mt-5 space-y-3">
			<input
				class="w-full rounded-lg border border-[#d9c6af] px-3 py-2"
				name="password"
				placeholder="Password admin"
				type="password"
				required
			/>

			{#if form?.message}
				<p class="text-sm text-red-700">{form.message}</p>
			{/if}

			<button class="btn-primary w-full" type="submit">
				Masuk
			</button>
		</form>
	</div>
</section>