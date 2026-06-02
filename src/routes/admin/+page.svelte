<script lang="ts">
	import { formatRupiah } from '$lib/utils/format';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const activeProducts = $derived(data.products.filter((product) => product.is_active));
	const featuredProducts = $derived(data.products.filter((product) => product.is_featured));
	const readyProducts = $derived(data.products.filter((product) => product.stock_status === 'ready'));

	function stockLabel(stock: string): string {
		if (stock === 'ready') return 'Ready';
		if (stock === 'limited') return 'Terbatas';
		if (stock === 'sold_out') return 'Habis';
		return 'Cek Stok';
	}

	function stockBadgeClass(stock: string): string {
		if (stock === 'ready') return 'bg-green-100 text-green-800 border-green-200';
		if (stock === 'limited') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		if (stock === 'sold_out') return 'bg-red-100 text-red-800 border-red-200';
		return 'bg-stone-100 text-stone-700 border-stone-200';
	}

	function capLabel(cap: string): string {
		return cap === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna';
	}

	function formatDate(value: string | null | undefined): string {
		if (!value) return '-';

		const date = new Date(value);

		if (Number.isNaN(date.getTime())) {
			return '-';
		}

		return date.toLocaleString('id-ID');
	}

	function productImage(src: string | null | undefined): string {
		return src && src.trim() !== '' ? src : '/placeholder-batik.svg';
	}
</script>

<svelte:head>
	<title>Admin Dashboard | Batik HM Akmal</title>
</svelte:head>

<div class="min-h-screen bg-[#f8f1e7]">
	<div class="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
		<aside class="hidden w-64 shrink-0 md:block">
			<div class="sticky top-6 rounded-2xl border border-[#e2d1ba] bg-white p-4 shadow-sm">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wide text-[#9f7a5a]">Dashboard</p>
					<h1 class="mt-1 text-xl font-bold text-[var(--color-brown)]">Batik HM Akmal</h1>
				</div>

				<nav class="mt-6 space-y-2 text-sm">
					<a class="block rounded-lg px-3 py-2 text-[#4a3425] hover:bg-[#f4eadf]" href="#overview">
						Overview
					</a>
					<a class="block rounded-lg px-3 py-2 text-[#4a3425] hover:bg-[#f4eadf]" href="#company">
						Data Toko
					</a>
					<a class="block rounded-lg px-3 py-2 text-[#4a3425] hover:bg-[#f4eadf]" href="#create-product">
						Tambah Produk
					</a>
					<a class="block rounded-lg px-3 py-2 text-[#4a3425] hover:bg-[#f4eadf]" href="#products">
						CRUD Produk
					</a>
					<a class="block rounded-lg px-3 py-2 text-[#4a3425] hover:bg-[#f4eadf]" href="#inventory-log">
						Log Stok
					</a>
					<a class="block rounded-lg px-3 py-2 text-[#4a3425] hover:bg-[#f4eadf]" href="#chat">
						Riwayat Chat
					</a>
				</nav>

				<form method="POST" action="?/logout" class="mt-6">
					<button class="btn-secondary w-full" type="submit">Logout</button>
				</form>
			</div>
		</aside>

		<main class="min-w-0 flex-1 space-y-8">
			<section id="overview">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h1 class="text-3xl font-bold text-[var(--color-brown)]">Admin Dashboard</h1>
						<p class="mt-2 text-sm text-[#6a5340]">
							Kelola data toko, produk Batik Cap, stok, foto produk, dan chat pelanggan.
						</p>
					</div>

					<form method="POST" action="?/logout" class="md:hidden">
						<button class="btn-secondary" type="submit">Logout</button>
					</form>
				</div>

				{#if form?.message}
					<div class="mt-5 rounded-xl border border-[#d8c3aa] bg-white px-4 py-3 text-sm text-[var(--color-brown)]">
						{form.message}
					</div>
				{/if}

				<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<article class="rounded-xl border border-[#e4d3bf] bg-white p-4">
						<p class="text-sm text-[#7a634f]">Total Produk</p>
						<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">{data.products.length}</p>
					</article>

					<article class="rounded-xl border border-[#e4d3bf] bg-white p-4">
						<p class="text-sm text-[#7a634f]">Produk Aktif</p>
						<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">{activeProducts.length}</p>
					</article>

					<article class="rounded-xl border border-[#e4d3bf] bg-white p-4">
						<p class="text-sm text-[#7a634f]">Produk Unggulan</p>
						<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">{featuredProducts.length}</p>
					</article>

					<article class="rounded-xl border border-[#e4d3bf] bg-white p-4">
						<p class="text-sm text-[#7a634f]">Stok Ready</p>
						<p class="mt-2 text-2xl font-bold text-[var(--color-maroon)]">{readyProducts.length}</p>
					</article>
				</div>
			</section>

			<section id="company" class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
				<h2 class="text-xl font-semibold text-[var(--color-brown)]">Data Toko</h2>
				<p class="mt-1 text-sm text-[#6c5543]">Edit informasi utama toko yang muncul di landing page.</p>

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
						<textarea class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="description" rows="4" required>{data.company.description}</textarea>
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

			<section id="create-product" class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
				<h2 class="text-xl font-semibold text-[var(--color-brown)]">Tambah Produk</h2>
				<p class="mt-1 text-sm text-[#6c5543]">Tambahkan varian Batik Cap baru.</p>

				<form method="POST" action="?/createProduct" class="mt-5 grid gap-4 md:grid-cols-2">
					<label class="text-sm text-[#6e5846]">
						Kode Produk
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="product_code" placeholder="Contoh: HM-C1-008" required />
					</label>

					<label class="text-sm text-[#6e5846]">
						Nama Produk
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="name" placeholder="Contoh: Cap 1 Warna Hitam" />
					</label>

					<label class="text-sm text-[#6e5846]">
						Jenis Cap
						<select class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="cap_type">
							<option value="cap_1_warna">Cap 1 Warna</option>
							<option value="cap_2_warna">Cap 2 Warna</option>
						</select>
					</label>

					<label class="text-sm text-[#6e5846]">
						Varian Warna
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="color_variant" placeholder="Contoh: Hitam" required />
					</label>

					<label class="text-sm text-[#6e5846]">
						Panjang CM
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="size_length_cm" type="number" value="205" />
					</label>

					<label class="text-sm text-[#6e5846]">
						Lebar CM
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="size_width_cm" type="number" value="110" />
					</label>

					<label class="text-sm text-[#6e5846]">
						Catatan Ukuran
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="size_note" value="Kurang lebih 205 x 110 cm" />
					</label>

					<label class="text-sm text-[#6e5846]">
						Harga
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="price" type="number" min="0" placeholder="58000" required />
					</label>

					<label class="text-sm text-[#6e5846]">
						Stok
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="stock_qty" type="number" min="0" placeholder="Kosongkan jika perlu cek stok" />
					</label>

					<label class="text-sm text-[#6e5846]">
						URL Gambar
						<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="image_url" placeholder="/placeholder-batik.svg" />
					</label>

					<label class="text-sm text-[#6e5846] md:col-span-2">
						Deskripsi
						<textarea class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="description" rows="3" placeholder="Deskripsi singkat produk"></textarea>
					</label>

					<div class="flex flex-wrap gap-4 text-sm text-[#6e5846] md:col-span-2">
						<label class="inline-flex items-center gap-2">
							<input name="is_featured" type="checkbox" />
							Produk unggulan
						</label>

						<label class="inline-flex items-center gap-2">
							<input name="is_active" type="checkbox" checked />
							Tampilkan di katalog
						</label>
					</div>

					<div class="md:col-span-2">
						<button class="btn-primary" type="submit">Simpan Produk</button>
					</div>
				</form>
			</section>

			<section id="products" class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
				<h2 class="text-xl font-semibold text-[var(--color-brown)]">CRUD Produk</h2>
				<p class="mt-1 text-sm text-[#6c5543]">Semua produk tampil di sini, termasuk produk yang sedang disembunyikan.</p>

				{#if data.products.length === 0}
					<p class="mt-4 rounded-xl bg-[#faf3ea] px-4 py-3 text-sm text-[#6f5946]">Belum ada produk.</p>
				{:else}
					<div class="mt-4 space-y-4">
						{#each data.products as product}
							<article class="rounded-xl border border-[#eadac7] bg-[#fffaf3] p-4">
								<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
									<div class="flex gap-4">
										<img src={productImage(product.image_url)} alt={product.name} class="h-24 w-24 rounded-lg border border-[#eadac7] object-cover" />

										<div>
											<p class="font-mono text-xs text-[#7a634f]">{product.product_code}</p>
											<h3 class="mt-1 text-lg font-semibold text-[#4a3425]">{product.name}</h3>
											<p class="mt-1 text-sm text-[#6e5846]">
												{capLabel(product.cap_type)} • {product.color_variant} • {formatRupiah(product.price)}
											</p>
											<p class="mt-1 text-sm text-[#6e5846]">
												Ukuran: {product.size_note ?? `Kurang lebih ${product.size_length_cm} x ${product.size_width_cm} cm`}
											</p>

											<div class="mt-2 flex flex-wrap gap-2">
												<span class={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${stockBadgeClass(product.stock_status)}`}>
													{stockLabel(product.stock_status)}
												</span>

												<span class="inline-flex rounded-full border border-[#e2d1ba] bg-white px-2 py-1 text-xs font-semibold text-[#6e5846]">
													{product.is_active ? 'Aktif' : 'Disembunyikan'}
												</span>

												{#if product.is_featured}
													<span class="inline-flex rounded-full border border-[#e2d1ba] bg-white px-2 py-1 text-xs font-semibold text-[#6e5846]">
														Unggulan
													</span>
												{/if}
											</div>
										</div>
									</div>

									<div class="flex min-w-48 flex-col gap-2">
										<form method="POST" action="?/updateStock" class="flex gap-2">
											<input type="hidden" name="product_code" value={product.product_code} />
											<input class="w-24 rounded-lg border border-[#dbc7af] px-2 py-1 text-sm" name="stock_qty" type="number" min="0" value={product.stock_qty ?? ''} placeholder="Cek" />
											<button class="btn-secondary px-3 py-1 text-xs" type="submit">Update Stok</button>
										</form>

										<form method="POST" action="?/toggleActive">
											<input type="hidden" name="product_code" value={product.product_code} />
											<input type="hidden" name="next_active" value={product.is_active ? 'false' : 'true'} />
											<button class="btn-secondary w-full px-3 py-1 text-xs" type="submit">
												{product.is_active ? 'Sembunyikan Produk' : 'Aktifkan Produk'}
											</button>
										</form>

										<form method="POST" action="?/deleteProduct">
											<input type="hidden" name="product_code" value={product.product_code} />
											<button class="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700" type="submit">
												Hapus Produk
											</button>
										</form>
									</div>
								</div>

								<div class="mt-4 grid gap-4 lg:grid-cols-[220px_1fr]">
									<form method="POST" action="?/uploadProductImage" enctype="multipart/form-data" class="rounded-lg border border-[#eadac7] bg-white p-3">
										<input type="hidden" name="product_code" value={product.product_code} />
										<label class="text-sm text-[#6e5846]">
											Upload Foto
											<input class="mt-2 block w-full text-xs text-[#6e5846]" name="image_file" type="file" accept="image/png,image/jpeg,image/webp" required />
										</label>
										<button class="btn-secondary mt-3 w-full px-3 py-1 text-xs" type="submit">Upload</button>
									</form>

									<details class="rounded-lg border border-[#eadac7] bg-white p-3">
										<summary class="cursor-pointer text-sm font-semibold text-[var(--color-maroon)]">
											Edit detail produk
										</summary>

										<form method="POST" action="?/updateProduct" class="mt-4 grid gap-3 md:grid-cols-3">
											<input type="hidden" name="product_code" value={product.product_code} />

											<label class="text-sm text-[#6e5846]">
												Nama Produk
												<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="name" value={product.name} required />
											</label>

											<label class="text-sm text-[#6e5846]">
												Jenis Cap
												<select class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="cap_type">
													<option value="cap_1_warna" selected={product.cap_type === 'cap_1_warna'}>Cap 1 Warna</option>
													<option value="cap_2_warna" selected={product.cap_type === 'cap_2_warna'}>Cap 2 Warna</option>
												</select>
											</label>

											<label class="text-sm text-[#6e5846]">
												Varian Warna
												<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="color_variant" value={product.color_variant} required />
											</label>

											<label class="text-sm text-[#6e5846]">
												Panjang CM
												<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="size_length_cm" type="number" value={product.size_length_cm} />
											</label>

											<label class="text-sm text-[#6e5846]">
												Lebar CM
												<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="size_width_cm" type="number" value={product.size_width_cm} />
											</label>

											<label class="text-sm text-[#6e5846]">
												Catatan Ukuran
												<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="size_note" value={product.size_note ?? 'Kurang lebih 205 x 110 cm'} />
											</label>

											<label class="text-sm text-[#6e5846]">
												Harga
												<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="price" type="number" min="0" value={product.price} required />
											</label>

											<label class="text-sm text-[#6e5846]">
												Stok
												<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="stock_qty" type="number" min="0" value={product.stock_qty ?? ''} placeholder="Kosongkan jika cek stok" />
											</label>

											<label class="text-sm text-[#6e5846]">
												URL Gambar
												<input class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="image_url" value={product.image_url ?? ''} />
											</label>

											<label class="text-sm text-[#6e5846] md:col-span-3">
												Deskripsi
												<textarea class="mt-1 w-full rounded-lg border border-[#dbc7af] px-3 py-2" name="description" rows="3">{product.description ?? ''}</textarea>
											</label>

											<div class="flex flex-wrap gap-4 text-sm text-[#6e5846] md:col-span-3">
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
												<button class="btn-primary" type="submit">Simpan Perubahan Produk</button>
											</div>
										</form>
									</details>
								</div>
							</article>
						{/each}
					</div>
				{/if}
			</section>

			<section id="inventory-log" class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
				<h2 class="text-xl font-semibold text-[var(--color-brown)]">Log Perubahan Stok</h2>

				{#if !data.inventoryTransactions || data.inventoryTransactions.length === 0}
					<p class="mt-4 rounded-xl bg-[#faf3ea] px-4 py-3 text-sm text-[#6f5946]">Belum ada perubahan stok.</p>
				{:else}
					<div class="mt-4 overflow-x-auto">
						<table class="min-w-full text-left text-sm">
							<thead>
								<tr class="border-b border-[#efdfcc] text-[#6f5846]">
									<th class="py-2 pr-4">Produk</th>
									<th class="py-2 pr-4">Stok Lama</th>
									<th class="py-2 pr-4">Stok Baru</th>
									<th class="py-2 pr-4">Waktu</th>
								</tr>
							</thead>

							<tbody>
								{#each data.inventoryTransactions as trx}
									<tr class="border-b border-[#f3e8d9]">
										<td class="py-2 pr-4 font-mono text-xs">{trx.product_code}</td>
										<td class="py-2 pr-4">{trx.previous_qty ?? 'Cek stok'}</td>
										<td class="py-2 pr-4">{trx.new_qty ?? 'Cek stok'}</td>
										<td class="py-2 pr-4">{formatDate(trx.created_at)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</section>

			<section id="chat" class="rounded-2xl border border-[#e2d1ba] bg-white p-5">
                <h2 class="text-xl font-semibold text-[var(--color-brown)]">Riwayat Chat</h2>
                <p class="mt-1 text-sm text-[#6c5543]">
                    Buka detail chat untuk melihat percakapan, membalas pesan, atau menghubungi pelanggan via WhatsApp.
                </p>

                {#if data.chatSessions.length === 0}
                    <p class="mt-4 rounded-xl bg-[#faf3ea] px-4 py-3 text-sm text-[#6f5946]">
                        Belum ada sesi chat tersimpan.
                    </p>
                {:else}
                    <div class="mt-4 space-y-3">
                        {#each data.chatSessions as session}
                            <article class="rounded-xl border border-[#eadac7] bg-[#fffaf3] p-4">
                                <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p class="font-mono text-xs text-[#7a634f]">{session.id}</p>

                                        <h3 class="mt-1 font-semibold text-[#4a3425]">
                                            {session.customer_name ?? 'Pelanggan tanpa nama'}
                                        </h3>

                                        <p class="mt-1 text-sm text-[#6e5846]">
                                            WhatsApp: {session.customer_whatsapp ?? 'Belum diisi'}
                                        </p>

                                        {#if session.product_name}
                                            <p class="mt-1 text-sm text-[#6e5846]">
                                                Produk: {session.product_name} {session.product_color ? `warna ${session.product_color}` : ''}
                                            </p>
                                        {/if}

                                        <p class="mt-1 text-xs text-[#7a634f]">
                                            Status: {session.status} • Update: {formatDate(session.last_message_at)}
                                        </p>
                                    </div>

                                    <div class="flex flex-wrap gap-2">
                                        <a
                                            class="btn-secondary px-3 py-2 text-xs"
                                            href={`/admin/chats/${session.id}`}
                                        >
                                            Lihat Detail
                                        </a>

                                        {#if session.customer_whatsapp}
                                            <a
                                                class="btn-primary px-3 py-2 text-xs"
                                                href={`https://wa.me/${session.customer_whatsapp}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                WhatsApp
                                            </a>
                                        {/if}
                                    </div>
                                </div>
                            </article>
                        {/each}
                    </div>
                {/if}
            </section>
		</main>
	</div>
</div>