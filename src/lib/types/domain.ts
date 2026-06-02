export type CapType = 'CAP_1_WARNA' | 'CAP_2_WARNA';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'NEEDS_CONFIRMATION';

export type ChatSessionStatus = 'open' | 'pending' | 'closed';

export interface CompanySettings {
  id: string;
  businessName: string;
  altBusinessName: string;
  description: string;
  address: string;
  whatsappNumber: string;
  contactPhone: string;
  operationHours: string;
  googleMapsLink: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  capType: CapType;
  colorVariant: string;
  sizeText: string;
  price: number;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  stockStatus: StockStatus;
  stockQuantity: number | null;
  images: ProductImage[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  message: string;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  isActive: boolean;
}

export interface ProductFilterInput {
  capType?: CapType | 'ALL';
  searchColor?: string;
}
