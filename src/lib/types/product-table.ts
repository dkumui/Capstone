export type CapType = 'cap_1_warna' | 'cap_2_warna';
export type StockStatus = 'ready' | 'limited' | 'sold_out' | 'check_stock';
export type ProductSource = 'seed' | 'manual' | 'cashier_api';

export interface ProductTableRow {
  id: string;
  product_code: string;
  name: string;
  product_type: 'batik_cap';
  cap_type: CapType;
  color_variant: string;
  size_length_cm: number;
  size_width_cm: number;
  size_note: string | null;
  price: number;
  stock_qty: number | null;
  stock_status: StockStatus;
  image_url: string | null;
  description: string | null;
  is_featured: boolean;
  is_active: boolean;
  source: ProductSource;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfileData {
  business_name: string;
  subtitle: string;
  profile: string;
  address: string;
  whatsapp_number: string;
  operation_hours: string;
  maps_url: string;
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
}
