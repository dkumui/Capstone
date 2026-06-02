<script lang="ts">
	import { formatRupiah } from '$lib/utils/format';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let search = $state('');
	let capFilter = $state<'all' | 'cap_1_warna' | 'cap_2_warna'>('all');
	let statusFilter = $state<'all' | 'active' | 'inactive'>('all');
	let stockFilter = $state<'all' | 'ready' | 'limited' | 'sold_out' | 'check_stock'>('all');

	const totalProducts = $derived(data.products.length);
	const activeProducts = $derived(data.products.filter((product) => product.is_active).length);
	const hiddenProducts = $derived(data.products.filter((product) => !product.is_active).length);
	const readyProducts = $derived(data.products.filter((product) => product.stock_status === 'ready').length);

	const filteredProducts = $derived.by(() => {
		return data.products.filter((product) => {
			const keyword = search.toLowerCase().trim();

			const keywordOk =
				keyword.length === 0 ||
				product.name.toLowerCase().includes(keyword) ||
				product.product_code.toLowerCase().includes(keyword) ||
				product.color_variant.toLowerCase().includes(keyword);

			const capOk = capFilter === 'all' || product.cap_type === capFilter;

			const statusOk =
				statusFilter === 'all' ||
				(statusFilter === 'active' && product.is_active) ||
				(statusFilter === 'inactive' && !product.is_active);

			const stockOk = stockFilter === 'all' || product.stock_status === stockFilter;

			return keywordOk && capOk && statusOk && stockOk;
		});
	});

	function capLabel(cap: string): string {
		return cap === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna';
	}

	function stockLabel(stock: string): string {
		if (stock === 'ready') return 'Ready';
		if (stock === 'limited') return 'Terbatas';
		if (stock === 'sold_out') return 'Habis';
		return 'Cek Stok';
	}

	function stockBadgeClass(stock: string): string {
		if (stock === 'ready') return 'border-green-200 bg-green-100 text-green-800';
		if (stock === 'limited') return 'border-yellow-200 bg-yellow-100 text-yellow-800';
		if (stock === 'sold_out') return 'border-red-200 bg-red-100 text-red-800';
		return 'border-stone-200 bg-stone-100 text-stone-700';
	}

	function activeBadgeClass(isActive: boolean): string {
		return isActive
			? 'border-green-200 bg-green-50 text-green-800'
			: 'border-stone-200 bg-stone-100 text-stone-700';
	}

	function productImage(src: string | null | undefined): string {
		return src && src.trim() !== '' ? src : '/placeholder-batik.svg';
	}
</script>

<svelte:head>
	<title>Manajemen Produk | Admin Batik HM Akmal</title>
</svelte:head>

<section class="space-y-6">
	<header class="rounded-2xl border border-[#e2d1ba] bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7a5a]">
					Admin Produk
				</p>
				<h1 class="mt-1 text-3xl font-bold text-[var(--color-brown)]">
					Manajemen Produk
				</h1>
				<p class="mt-2 max-w-2xl text-sm leading-6 text-[#6a5340]">
					Kelola katalog Batik Cap, tambah produk beserta foto, update stok, edit detail,
					sembunyikan produk, dan hapus data yang tidak digunakan.
				</p>
			</div>

			<a class="btn-secondary w-fit" href="/">
				Lihat Website
			</a>
		</div>

		<div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
			<article class="rounded-xl border border-[#eadac7] bg-[#fffaf3] p-4">
				<p class="text-xs font-semibold uppercase tracking-wide text-[#9f7a5a]">Total Produk</p>
				<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">{totalProducts}</p>
			</article>

			<article class="rounded-xl border border-[#eadac7] bg-[#fffaf3] p-4">
				<p class="text-xs font-semibold uppercase tracking-wide text-[#9f7a5a]">Produk Aktif</p>
				<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">{activeProducts}</p>
			</article>

			<article class="rounded-xl border border-[#eadac7] bg-[#fffaf3] p-4">
				<p class="text-xs font-semibold uppercase tracking-wide text-[#9f7a5a]">Disembunyikan</p>
				<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">{hiddenProducts}</p>
			</article>

			<article class="rounded-xl border border-[#eadac7] bg-[#fffaf3] p-4">
				<p class="text-xs font-semibold uppercase tracking-wide text-[#9f7a5a]">Stok Ready</p>
				<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">{readyProducts}</p>
			</article>
		</div>
	</header>

	{#if form?.message}
		<div class="rounded-xl border border-[#d8c3aa] bg-white px-4 py-3 text-sm font-medium text-[var(--color-brown)] shadow-sm">
			{form.message}
		</div>
	{/if}

	<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7a5a]">
				Produk Baru
			</p>
			<h2 class="text-2xl font-bold text-[var(--color-brown)]">Tambah Produk</h2>
			<p class="text-sm leading-6 text-[#6c5543]">
				Form ini langsung menyimpan data produk ke tabel <span class="font-mono">products</span>.
				Foto produk akan diunggah ke bucket Supabase Storage <span class="font-mono">product-images</span>
				lalu URL-nya disimpan ke kolom <span class="font-mono">image_url</span>.
			</p>
		</div>

		<form
			method="POST"
			action="?/createProduct"
			enctype="multipart/form-data"
			class="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_360px]"
		>
			<div class="grid gap-4 md:grid-cols-2">
				<label class="text-sm font-medium text-[#6e5846]">
					Kode Produk <span class="text-red-700">*</span>
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="product_code"
						placeholder="Contoh: HM-C1-008"
						required
					/>
				</label>

				<label class="text-sm font-medium text-[#6e5846]">
					Nama Produk
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="name"
						placeholder="Contoh: Cap 1 Warna Hitam"
					/>
				</label>

				<label class="text-sm font-medium text-[#6e5846]">
					Jenis Cap <span class="text-red-700">*</span>
					<select
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="cap_type"
					>
						<option value="cap_1_warna">Cap 1 Warna</option>
						<option value="cap_2_warna">Cap 2 Warna</option>
					</select>
				</label>

				<label class="text-sm font-medium text-[#6e5846]">
					Varian Warna <span class="text-red-700">*</span>
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="color_variant"
						placeholder="Contoh: Hitam"
						required
					/>
				</label>

				<label class="text-sm font-medium text-[#6e5846]">
					Panjang CM
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="size_length_cm"
						type="number"
						min="0"
						value="205"
					/>
				</label>

				<label class="text-sm font-medium text-[#6e5846]">
					Lebar CM
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="size_width_cm"
						type="number"
						min="0"
						value="110"
					/>
				</label>

				<label class="text-sm font-medium text-[#6e5846] md:col-span-2">
					Catatan Ukuran
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="size_note"
						value="Kurang lebih 205 x 110 cm"
					/>
				</label>

				<label class="text-sm font-medium text-[#6e5846]">
					Harga <span class="text-red-700">*</span>
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="price"
						type="number"
						min="0"
						placeholder="58000"
						required
					/>
				</label>

				<label class="text-sm font-medium text-[#6e5846]">
					Stok
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="stock_qty"
						type="number"
						min="0"
						placeholder="Kosongkan jika perlu cek stok"
					/>
				</label>

				<label class="text-sm font-medium text-[#6e5846] md:col-span-2">
					Deskripsi
					<textarea
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="description"
						rows="4"
						placeholder="Deskripsi singkat produk"
					></textarea>
				</label>

				<div class="flex flex-wrap gap-4 rounded-xl border border-[#eadac7] bg-[#fffaf3] px-4 py-3 text-sm text-[#6e5846] md:col-span-2">
					<label class="inline-flex items-center gap-2">
						<input name="is_featured" type="checkbox" />
						Produk unggulan
					</label>

					<label class="inline-flex items-center gap-2">
						<input name="is_active" type="checkbox" checked />
						Tampilkan di katalog
					</label>
				</div>
			</div>

			<aside class="rounded-2xl border border-[#eadac7] bg-[#fffaf3] p-4">
				<h3 class="font-semibold text-[var(--color-brown)]">Foto Produk</h3>
				<p class="mt-1 text-xs leading-5 text-[#6e5846]">
					Unggah file JPG, PNG, atau WebP. Maksimal 2 MB. Jika file diunggah, URL gambar manual tidak perlu diisi.
				</p>

				<label class="mt-4 block text-sm font-medium text-[#6e5846]">
					Upload Gambar
					<input
						class="mt-2 block w-full rounded-xl border border-dashed border-[#c9ad8e] bg-white px-3 py-3 text-sm text-[#6e5846]"
						name="image_file"
						type="file"
						accept="image/png,image/jpeg,image/webp"
					/>
				</label>

				<div class="my-4 flex items-center gap-3">
					<div class="h-px flex-1 bg-[#e2d1ba]"></div>
					<span class="text-xs font-semibold text-[#9f7a5a]">ATAU</span>
					<div class="h-px flex-1 bg-[#e2d1ba]"></div>
				</div>

				<label class="block text-sm font-medium text-[#6e5846]">
					URL Gambar Manual
					<input
						class="mt-1 w-full rounded-xl border border-[#dbc7af] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
						name="image_url"
						placeholder="/placeholder-batik.svg"
					/>
				</label>

				<button class="btn-primary mt-5 w-full" type="submit">
					Simpan Produk
				</button>

				<p class="mt-3 text-xs leading-5 text-[#7a634f]">
					Status stok otomatis dihitung dari jumlah stok: 0 habis, 1 sampai 5 terbatas, lebih dari 5 ready, kosong berarti cek stok.
				</p>
			</aside>
		</form>
	</section>

	<section class="rounded-2xl border border-[#e2d1ba] bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7a5a]">
					Database Produk
				</p>
				<h2 class="mt-1 text-2xl font-bold text-[var(--color-brown)]">Daftar Produk</h2>
				<p class="mt-1 text-sm text-[#6c5543]">
					Semua produk tampil di sini, termasuk produk yang disembunyikan dari katalog publik.
				</p>
			</div>

			<div class="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
				<input
					class="rounded-xl border border-[#dbc7af] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
					bind:value={search}
					placeholder="Cari produk..."
				/>

				<select
					class="rounded-xl border border-[#dbc7af] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
					bind:value={capFilter}
				>
					<option value="all">Semua Jenis</option>
					<option value="cap_1_warna">Cap 1 Warna</option>
					<option value="cap_2_warna">Cap 2 Warna</option>
				</select>

				<select
					class="rounded-xl border border-[#dbc7af] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
					bind:value={statusFilter}
				>
					<option value="all">Semua Tampilan</option>
					<option value="active">Aktif</option>
					<option value="inactive">Disembunyikan</option>
				</select>

				<select
					class="rounded-xl border border-[#dbc7af] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-maroon)] focus:ring-2 focus:ring-[#6a2a2a]/10"
					bind:value={stockFilter}
				>
					<option value="all">Semua Stok</option>
					<option value="ready">Ready</option>
					<option value="limited">Terbatas</option>
					<option value="sold_out">Habis</option>
					<option value="check_stock">Cek Stok</option>
				</select>
			</div>
		</div>

		{#if filteredProducts.length === 0}
			<p class="mt-5 rounded-xl bg-[#faf3ea] px-4 py-3 text-sm text-[#6f5946]">
				Tidak ada produk sesuai filter.
			</p>
		{:else}
			<div class="mt-5 grid gap-4">
				{#each filteredProducts as product}
					<article class="overflow-hidden rounded-2xl border border-[#eadac7] bg-[#fffaf3]">
						<div class="grid gap-0 lg:grid-cols-[220px_1fr]">
							<div class="bg-white p-4">
								<img
									src={productImage(product.image_url)}
									alt={product.name}
									class="h-44 w-full rounded-xl border border-[#eadac7] object-cover"
								/>

								<form
									method="POST"
									action="?/uploadProductImage"
									enctype="multipart/form-data"
									class="mt-3 rounded-xl border border-[#eadac7] bg-[#fffaf3] p-3"
								>
									<input type="hidden" name="product_code" value={product.product_code} />

									<label class="text-xs font-semibold text-[#6e5846]">
										Ganti Foto
										<input
											class="mt-2 block w-full text-xs text-[#6e5846]"
											name="image_file"
											type="file"
											accept="image/png,image/jpeg,image/webp"
											required
										/>
									</label>

									<button class="btn-secondary mt-3 w-full px-3 py-1.5 text-xs" type="submit">
										Upload Foto
									</button>
								</form>
							</div>

							<div class="p-4">
								<div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
									<div>
										<div class="flex flex-wrap items-center gap-2">
											<span class="rounded-full border border-[#e2d1ba] bg-white px-2 py-1 font-mono text-xs text-[#7a634f]">
												{product.product_code}
											</span>

											<span class={`rounded-full border px-2 py-1 text-xs font-semibold ${activeBadgeClass(product.is_active)}`}>
												{product.is_active ? 'Aktif' : 'Disembunyikan'}
											</span>

											<span class={`rounded-full border px-2 py-1 text-xs font-semibold ${stockBadgeClass(product.stock_status)}`}>
												{stockLabel(product.stock_status)}
											</span>

											{#if product.is_featured}
												<span class="rounded-full border border-[#e2d1ba] bg-white px-2 py-1 text-xs font-semibold text-[#6e5846]">
													Unggulan
												</span>
											{/if}
										</div>

										<h3 class="mt-3 text-xl font-bold text-[#4a3425]">
											{product.name}
										</h3>

										<p class="mt-1 text-sm text-[#6e5846]">
											{capLabel(product.cap_type)} • Warna {product.color_variant}
										</p>

										<p class="mt-1 text-sm text-[#6e5846]">
											Ukuran: {product.size_note ?? `Kurang lebih ${product.size_length_cm} x ${product.size_width_cm} cm`}
										</p>

										<p class="mt-2 text-lg font-bold text-[var(--color-maroon)]">
											{formatRupiah(product.price)}
										</p>
									</div>

									<div class="grid gap-2 sm:grid-cols-3 xl:w-[420px]">
										<form method="POST" action="?/updateStock" class="rounded-xl border border-[#eadac7] bg-white p-3 sm:col-span-3">
											<input type="hidden" name="product_code" value={product.product_code} />

											<label class="text-xs font-semibold text-[#6e5846]">
												Update Stok
												<div class="mt-2 flex gap-2">
													<input
														class="min-w-0 flex-1 rounded-lg border border-[#dbc7af] px-2 py-2 text-sm"
														name="stock_qty"
														type="number"
														min="0"
														value={product.stock_qty ?? ''}
														placeholder="Cek"
													/>
													<button class="btn-secondary px-3 py-2 text-xs" type="submit">
														Simpan
													</button>
												</div>
											</label>
										</form>

										<form method="POST" action="?/toggleActive" class="sm:col-span-2">
											<input type="hidden" name="product_code" value={product.product_code} />
											<input type="hidden" name="next_active" value={product.is_active ? 'false' : 'true'} />
											<button class="btn-secondary w-full px-3 py-2 text-xs" type="submit">
												{product.is_active ? 'Sembunyikan' : 'Aktifkan'}
											</button>
										</form>

										<form method="POST" action="?/deleteProduct">
											<input type="hidden" name="product_code" value={product.product_code} />
											<button
												class="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
												type="submit"
											>
												Hapus
											</button>
										</form>
									</div>
								</div>

								<details class="mt-4 rounded-xl border border-[#eadac7] bg-white p-4">
									<summary class="cursor-pointer text-sm font-semibold text-[var(--color-maroon)]">
										Edit detail produk
									</summary>

									<form method="POST" action="?/updateProduct" class="mt-4 grid gap-4 md:grid-cols-3">
										<input type="hidden" name="product_code" value={product.product_code} />

										<label class="text-sm font-medium text-[#6e5846]">
											Nama Produk
											<input class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="name" value={product.name} required />
										</label>

										<label class="text-sm font-medium text-[#6e5846]">
											Jenis Cap
											<select class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="cap_type">
												<option value="cap_1_warna" selected={product.cap_type === 'cap_1_warna'}>Cap 1 Warna</option>
												<option value="cap_2_warna" selected={product.cap_type === 'cap_2_warna'}>Cap 2 Warna</option>
											</select>
										</label>

										<label class="text-sm font-medium text-[#6e5846]">
											Varian Warna
											<input class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="color_variant" value={product.color_variant} required />
										</label>

										<label class="text-sm font-medium text-[#6e5846]">
											Panjang CM
											<input class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="size_length_cm" type="number" min="0" value={product.size_length_cm} />
										</label>

										<label class="text-sm font-medium text-[#6e5846]">
											Lebar CM
											<input class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="size_width_cm" type="number" min="0" value={product.size_width_cm} />
										</label>

										<label class="text-sm font-medium text-[#6e5846]">
											Catatan Ukuran
											<input class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="size_note" value={product.size_note ?? 'Kurang lebih 205 x 110 cm'} />
										</label>

										<label class="text-sm font-medium text-[#6e5846]">
											Harga
											<input class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="price" type="number" min="0" value={product.price} required />
										</label>

										<label class="text-sm font-medium text-[#6e5846]">
											Stok
											<input class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="stock_qty" type="number" min="0" value={product.stock_qty ?? ''} />
										</label>

										<label class="text-sm font-medium text-[#6e5846]">
											URL Gambar
											<input class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="image_url" value={product.image_url ?? ''} />
										</label>

										<label class="text-sm font-medium text-[#6e5846] md:col-span-3">
											Deskripsi
											<textarea class="mt-1 w-full rounded-xl border border-[#dbc7af] px-3 py-2" name="description" rows="3">{product.description ?? ''}</textarea>
										</label>

										<div class="flex flex-wrap gap-4 rounded-xl border border-[#eadac7] bg-[#fffaf3] px-4 py-3 text-sm text-[#6e5846] md:col-span-3">
											<label class="inline-flex items-center gap-2">
												<input name="is_featured" type="checkbox" checked={product.is_featured} />
												Produk unggulan
											</label>

											<label class="inline-flex items-center gap-2">
												<input name="is_active" type="checkbox" checked={product.is_active} />
												Tampilkan di katalog
											</label>
										</div>

										<div class="md:col-span-3">
											<button class="btn-primary" type="submit">
												Simpan Perubahan Produk
											</button>
										</div>
									</form>
								</details>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</section>
</section>