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
			text: 'Halo, saya asisten Batik HM Akmal. Saya bisa membantu cek produk, warna, harga, ukuran, stok, pemesanan, dan lokasi toko.'
		}
	]);

	$effect(() => {
		if (!selectedProduct) return;
		if (selectedProductRequestId === 0) return;
		if (selectedProductRequestId === lastHandledProductRequestId) return;

		if (!selectedProduct.product_code || !selectedProduct.name || !selectedProduct.color_variant) {
			console.error('Invalid selectedProduct for chatbot:', selectedProduct);
			return;
		}

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
					{ sender: 'assistant', text: 'Terjadi kendala koneksi. Coba ulang sebentar lagi.' }
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
				{ sender: 'assistant', text: 'Terjadi kendala koneksi. Coba ulang sebentar lagi.' }
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
		<div class="mb-3 w-[min(94vw,410px)] overflow-hidden rounded-[1.5rem] border border-[#ead8bc] bg-white shadow-2xl">
			<div class="bg-[var(--color-indigo)] px-4 py-4 text-white">
				<div class="flex items-center justify-between gap-3">
					<div class="flex items-center gap-3">
						<span class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-base font-black text-[var(--color-gold)]">
							BA
						</span>
						<div>
							<p class="text-sm font-black">Chat Batik HM Akmal</p>
							<p class="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
								<span class="inline-block h-2 w-2 rounded-full bg-green-400"></span>
								Asisten siap membantu
							</p>
						</div>
					</div>

					<button class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold transition hover:bg-white/20" type="button" onclick={closeChat}>
						Tutup
					</button>
				</div>
			</div>

			<div class="border-b border-[#eadfce] bg-[#fffaf3] p-3">
				<p class="text-xs font-bold uppercase tracking-wide text-[#8a715c]">Data pelanggan opsional</p>

				<div class="mt-2 grid gap-2 sm:grid-cols-2">
					<input
						class="rounded-full border border-[#d9c6af] bg-white px-3 py-2 text-xs outline-none focus:border-[var(--color-gold)] focus:ring-4 focus:ring-[#c89235]/15"
						bind:value={customerName}
						placeholder="Nama"
					/>

					<input
						class="rounded-full border border-[#d9c6af] bg-white px-3 py-2 text-xs outline-none focus:border-[var(--color-gold)] focus:ring-4 focus:ring-[#c89235]/15"
						bind:value={customerWhatsapp}
						placeholder="No. WhatsApp"
					/>
				</div>
			</div>

			<div class="max-h-80 space-y-2 overflow-y-auto bg-[#fffaf3] p-3">
				{#each messages as msg}
					<div
						class={msg.sender === 'assistant'
							? 'mr-7 rounded-2xl rounded-tl-sm border border-[#ead8bc] bg-white px-3 py-2.5 text-sm leading-6 text-[#4a3425]'
							: 'ml-7 rounded-2xl rounded-tr-sm bg-[var(--color-indigo)] px-3 py-2.5 text-sm leading-6 text-white'}
					>
						{msg.text}
					</div>
				{/each}

				{#if loading}
					<div class="mr-7 inline-flex items-center gap-1 rounded-2xl rounded-tl-sm border border-[#ead8bc] bg-white px-3 py-3">
						<span class="h-2 w-2 animate-bounce rounded-full bg-[#b89b6f] [animation-delay:-0.3s]"></span>
						<span class="h-2 w-2 animate-bounce rounded-full bg-[#b89b6f] [animation-delay:-0.15s]"></span>
						<span class="h-2 w-2 animate-bounce rounded-full bg-[#b89b6f]"></span>
					</div>
				{/if}
			</div>

			<div class="border-t border-[#eadfce] bg-white p-3">
				<div class="flex gap-2">
					<input
						class="min-w-0 flex-1 rounded-full border border-[#d9c6af] px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)] focus:ring-4 focus:ring-[#c89235]/15"
						bind:value={input}
						placeholder="Tulis pertanyaan..."
						onkeydown={handleKeydown}
					/>

					<button class="btn-primary px-4" type="button" onclick={sendMessage} disabled={loading}>
						Kirim
					</button>
				</div>

				<a
					class="mt-2 inline-flex w-full justify-center rounded-full border border-[#ead8bc] bg-[#fff7e8] px-3 py-2.5 text-xs font-black text-[var(--color-indigo)] transition hover:bg-white"
					href={getWhatsappHref()}
					target="_blank"
					rel="noreferrer"
				>
					Lanjut ke WhatsApp Admin
				</a>
			</div>
		</div>
	{/if}

	<button class="flex items-center gap-2 rounded-full bg-[var(--color-indigo)] px-5 py-3 text-sm font-black text-white shadow-xl shadow-[#183153]/25 transition hover:-translate-y-0.5 hover:bg-[#213f67]" type="button" onclick={() => (open = !open)}>
		<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
		</svg>
		{open ? 'Tutup Chat' : 'Chat Produk'}
	</button>
</div>