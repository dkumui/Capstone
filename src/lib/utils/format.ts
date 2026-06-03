export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
}

export function stockStatusLabel(status: string): string {
  if (status === 'IN_STOCK') return 'Tersedia';
  if (status === 'LOW_STOCK') return 'Stok Menipis';
  if (status === 'OUT_OF_STOCK') return 'Habis';
  return 'Perlu Konfirmasi Admin';
}

export function dbStockStatusLabel(status: string): string {
  if (status === 'ready') return 'Tersedia';
  if (status === 'limited') return 'Terbatas';
  if (status === 'sold_out') return 'Habis';
  return 'Perlu konfirmasi admin';
}

export function capTypeLabel(capType: string): string {
  return capType === 'cap_1_warna' ? 'Cap 1 Warna' : 'Cap 2 Warna';
}

export function sizeDescription(row: {
  size_note: string | null;
  size_length_cm: number;
  size_width_cm: number;
}): string {
  return row.size_note ?? `kurang lebih ${row.size_length_cm} x ${row.size_width_cm} cm`;
}
