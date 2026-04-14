export interface LeadProduct {
  id: string;
  name: string;
  price: string;
}

export interface Lead {
  id: string;
  storeUserId: string;
  productId: string | null;
  name: string;
  phone: string;
  message: string | null;
  createdAt: string;
  product: LeadProduct | null;
}
