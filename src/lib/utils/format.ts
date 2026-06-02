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
