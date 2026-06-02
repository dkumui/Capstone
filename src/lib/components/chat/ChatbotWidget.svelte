<script lang="ts">
	type ProductChatContext = {
		name: string;
		product_code: string;
		color_variant: string;
	};

	interface Message {
		sender: 'user' | 'assistant';
		text: string;
	}

	let {
		selectedProduct = null,
		selectedProductRequestId = 0,
		businessWhatsappNumber = '6281234567890'
	} = $props<{
		selectedProduct?: ProductChatContext | null;
		selectedProductRequestId?: number;
		businessWhatsappNumber?: string;
	}>();

	let open = $state(false);
	let input = $state('');
	let loading = $state(false);
	let sessionId = $state<string | null>(null);
	let customerName = $state('');
	let customerWhatsapp = $state('');
	let lastHandledProductRequestId = $state(0);

	let messages = $state<Message[]>([
		{
			sender: 'assistant',
			text: 'Halo! Saya asisten Batik HM Akmal. Saya bisa bantu info produk, warna, harga, ukuran, stok, pemesanan, pengiriman, dan lokasi toko.'
		}
	]);

	$effect(() => {
		if (!selectedProduct) return;
		if (selectedProductRequestId === 0) return;
		if (selectedProductRequestId === lastHandledProductRequestId) return;

		lastHandledProductRequestId = selectedProductRequestId;
		open = true;

		messages = [
			...messages,
			{
				sender: 'assistant',
				text: `Anda sedang melihat ${selectedProduct.name} (${selectedProduct.product_code}) warna ${selectedProduct.color_variant}. Silakan tanyakan harga, ukuran, atau stok produk ini.`
			}
		];
	});

	function normalizeWhatsapp(value: string): string {
		const digits = value.replace(/\D/g, '');

		if (digits.startsWith('0')) {
			return `62${digits.slice(1)}`;
		}

		return digits || '6281234567890';
	}

	function getWhatsappHref(): string {
		const target = normalizeWhatsapp(businessWhatsappNumber);

		const productText = selectedProduct
			? `Saya ingin bertanya tentang ${selectedProduct.name} (${selectedProduct.product_code}) warna ${selectedProduct.color_variant}.`
			: 'Saya ingin bertanya tentang produk Batik HM Akmal.';

		const customerText = [
			customerName.trim() ? `Nama saya ${customerName.trim()}.` : '',
			customerWhatsapp.trim() ? `Nomor saya ${customerWhatsapp.trim()}.` : ''
		]
			.filter(Boolean)
			.join(' ');

		const message = [productText, customerText].filter(Boolean).join(' ');

		return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
	}

	function closeChat() {
		open = false;
	}

	async function sendMessage() {
		const text = input.trim();
		if (!text || loading) return;

		messages = [...messages, { sender: 'user', text }];
		input = '';
		loading = true;

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: text,
					sessionId,
					productCode: selectedProduct?.product_code ?? null,
					productName: selectedProduct?.name ?? null,
					productColor: selectedProduct?.color_variant ?? null,
					customerName: customerName.trim() || null,
					customerWhatsapp: customerWhatsapp.trim() || null
				})
			});

			if (!res.ok) {
				messages = [
					...messages,
					{
						sender: 'assistant',
						text: 'Terjadi kendala koneksi. Coba ulang sebentar lagi.'
					}
				];
				return;
			}

			const data = (await res.json()) as {
				answer: string;
				sessionId: string;
				intent: string;
				storage: 'supabase' | 'mock';
			};

			sessionId = data.sessionId;
			messages = [...messages, { sender: 'assistant', text: data.answer }];
		} catch {
			messages = [
				...messages,
				{
					sender: 'assistant',
					text: 'Terjadi kendala koneksi. Coba ulang sebentar lagi.'
				}
			];
		} finally {
			loading = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter') return;

		event.preventDefault();
		sendMessage();
	}
</script>

<div class="fixed bottom-4 right-4 z-50">
	{#if open}
		<div class="mb-3 w-[min(92vw,380px)] rounded-2xl border border-[#dcc8ae] bg-white shadow-2xl">
			<div class="flex items-center justify-between rounded-t-2xl bg-[var(--color-maroon)] px-4 py-3 text-white">
				<p class="text-sm font-semibold">Chat Batik HM Akmal</p>
				<button class="text-xs font-semibold" type="button" onclick={closeChat}>Tutup</button>
			</div>

			<div class="border-b border-[#eadfce] bg-[#fffaf3] p-3">
				<p class="text-xs font-semibold text-[#6a5340]">Data pelanggan opsional</p>

				<div class="mt-2 grid gap-2 sm:grid-cols-2">
					<input
						class="rounded-lg border border-[#d9c6af] px-3 py-2 text-xs"
						bind:value={customerName}
						placeholder="Nama"
					/>

					<input
						class="rounded-lg border border-[#d9c6af] px-3 py-2 text-xs"
						bind:value={customerWhatsapp}
						placeholder="No. WhatsApp"
					/>
				</div>
			</div>

			<div class="max-h-80 space-y-2 overflow-y-auto p-3">
				{#each messages as msg}
					<div
						class={msg.sender === 'assistant'
							? 'mr-6 rounded-lg bg-[#f8efe3] px-3 py-2 text-sm text-[#4a3425]'
							: 'ml-6 rounded-lg bg-[#6a2a2a] px-3 py-2 text-sm text-white'}
					>
						{msg.text}
					</div>
				{/each}

				{#if loading}
					<p class="text-xs text-[#7d6650]">Asisten sedang mengetik...</p>
				{/if}
			</div>

			<div class="border-t border-[#eadfce] p-3">
				<div class="flex gap-2">
					<input
						class="flex-1 rounded-lg border border-[#d9c6af] px-3 py-2 text-sm"
						bind:value={input}
						placeholder="Tulis pertanyaan..."
						onkeydown={handleKeydown}
					/>

					<button class="btn-primary" type="button" onclick={sendMessage} disabled={loading}>
						Kirim
					</button>
				</div>

				<a
					class="mt-2 inline-flex w-full justify-center rounded-lg border border-[#d9c6af] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-maroon)]"
					href={getWhatsappHref()}
					target="_blank"
					rel="noreferrer"
				>
					Lanjut ke WhatsApp
				</a>
			</div>
		</div>
	{/if}

	<button class="btn-primary rounded-full px-5 py-3" type="button" onclick={() => (open = !open)}>
		{open ? 'Tutup Chat' : 'Chat Kami'}
	</button>
</div>