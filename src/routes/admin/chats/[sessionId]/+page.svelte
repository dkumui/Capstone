<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const session = $derived(data.session as NonNullable<PageData['session']>);

	function formatDate(value: string | null | undefined): string {
		if (!value) return '-';

		const date = new Date(value);

		if (Number.isNaN(date.getTime())) {
			return '-';
		}

		return date.toLocaleString('id-ID');
	}

	function statusLabel(status: string): string {
		if (status === 'open') return 'Open';
		if (status === 'pending') return 'Pending';
		if (status === 'closed') return 'Closed';
		return status;
	}

	function whatsappHref(): string | null {
        if (!session.customer_whatsapp) return null;

        const message = session.product_name
            ? `Halo, kami dari Batik HM Akmal. Saya ingin menindaklanjuti pertanyaan Anda tentang ${session.product_name}${session.product_color ? ` warna ${session.product_color}` : ''}.`
            : 'Halo, kami dari Batik HM Akmal. Saya ingin menindaklanjuti pertanyaan Anda melalui website.';

        return `https://wa.me/${session.customer_whatsapp}?text=${encodeURIComponent(message)}`;
    }
</script>

<svelte:head>
	<title>Detail Chat | Admin Batik HM Akmal</title>
</svelte:head>

<div class="min-h-screen bg-[#f8f1e7] px-4 py-6">
	<div class="mx-auto max-w-5xl space-y-6">
		<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<div>
				<a class="text-sm font-semibold text-[var(--color-maroon)]" href="/admin#chat">
					← Kembali ke Dashboard
				</a>

				<h1 class="mt-2 text-3xl font-bold text-[var(--color-brown)]">Detail Chat</h1>
				<p class="mt-1 text-sm text-[#6a5340]">
					Lihat percakapan pelanggan dan tindak lanjuti melalui dashboard atau WhatsApp.
				</p>
			</div>

			{#if whatsappHref()}
				<a class="btn-primary" href={whatsappHref()} target="_blank" rel="noreferrer">
					Hubungi via WhatsApp
				</a>
			{/if}
		</div>

		{#if form?.message}
			<div class="rounded-xl border border-[#d8c3aa] bg-white px-4 py-3 text-sm text-[var(--color-brown)]">
				{form.message}
			</div>
		{/if}

		<section class="grid gap-4 md:grid-cols-3">
			<article class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
				<p class="text-sm text-[#7a634f]">Nama Pelanggan</p>
				<p class="mt-2 font-semibold text-[#4a3425]">
					{session.customer_name ?? 'Belum diisi'}
				</p>
			</article>

			<article class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
				<p class="text-sm text-[#7a634f]">WhatsApp</p>
				<p class="mt-2 font-semibold text-[#4a3425]">
					{session.customer_whatsapp ?? 'Belum diisi'}
				</p>
			</article>

			<article class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
				<p class="text-sm text-[#7a634f]">Status</p>
				<p class="mt-2 font-semibold text-[#4a3425]">
					{statusLabel(session.status)}
				</p>
			</article>
		</section>

		<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
			<h2 class="text-xl font-semibold text-[var(--color-brown)]">Informasi Sesi</h2>

			<div class="mt-4 grid gap-3 text-sm md:grid-cols-2">
				<p>
					<span class="font-semibold text-[#4a3425]">Session ID:</span>
					<span class="font-mono text-xs text-[#6e5846]">{session.id}</span>
				</p>

				<p>
					<span class="font-semibold text-[#4a3425]">Produk:</span>
					<span class="text-[#6e5846]">
						{session.product_name ?? 'Tidak ada konteks produk'}
					</span>
				</p>

				<p>
					<span class="font-semibold text-[#4a3425]">Kode Produk:</span>
					<span class="text-[#6e5846]">{session.product_code ?? '-'}</span>
				</p>

				<p>
					<span class="font-semibold text-[#4a3425]">Warna:</span>
					<span class="text-[#6e5846]">{session.product_color ?? '-'}</span>
				</p>

				<p>
					<span class="font-semibold text-[#4a3425]">Dibuat:</span>
					<span class="text-[#6e5846]">{formatDate(session.created_at)}</span>
				</p>

				<p>
					<span class="font-semibold text-[#4a3425]">Update terakhir:</span>
					<span class="text-[#6e5846]">{formatDate(session.last_message_at)}</span>
				</p>
			</div>

			<form method="POST" action="?/updateStatus" class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
				<label class="text-sm text-[#6e5846]">
					Ubah Status
					<select
						class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2"
						name="status"
					>
						<option value="open" selected={session.status === 'open'}>Open</option>
						<option value="pending" selected={session.status === 'pending'}>Pending</option>
						<option value="closed" selected={session.status === 'closed'}>Closed</option>
					</select>
				</label>

				<button class="btn-secondary" type="submit">Simpan Status</button>
			</form>
		</section>

		<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
			<h2 class="text-xl font-semibold text-[var(--color-brown)]">Percakapan</h2>

			{#if data.messages.length === 0}
				<p class="mt-4 rounded-xl bg-[#faf3ea] px-4 py-3 text-sm text-[#6f5946]">
					Belum ada pesan.
				</p>
			{:else}
				<div class="mt-5 space-y-3">
					{#each data.messages as message}
						<div
							class={message.sender === 'user'
								? 'mr-10 rounded-xl bg-[#f8efe3] p-3'
								: message.sender === 'assistant'
									? 'ml-10 rounded-xl bg-[#6a2a2a] p-3 text-white'
									: 'ml-10 rounded-xl border border-[#d8c3aa] bg-white p-3'}
						>
							<div class="flex items-center justify-between gap-3">
								<p class="text-xs font-semibold uppercase tracking-wide">
									{message.sender === 'user'
										? 'Pelanggan'
										: message.sender === 'assistant'
											? 'Chatbot'
											: 'Admin'}
								</p>

								<p class="text-xs opacity-70">{formatDate(message.created_at)}</p>
							</div>

							<p class="mt-2 text-sm leading-6">{message.message}</p>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
			<h2 class="text-xl font-semibold text-[var(--color-brown)]">Balas sebagai Admin</h2>
			<p class="mt-1 text-sm text-[#6c5543]">
				Balasan ini disimpan ke riwayat chat. Untuk mengirim langsung ke pelanggan, gunakan tombol WhatsApp.
			</p>

			<form method="POST" action="?/reply" class="mt-4 space-y-3">
				<textarea
					class="w-full rounded-lg border border-[#dbc7af] px-3 py-2 text-sm"
					name="message"
					rows="4"
					placeholder="Tulis balasan admin..."
					required
				></textarea>

				<button class="btn-primary" type="submit">Simpan Balasan</button>
			</form>
		</section>
	</div>
</div>