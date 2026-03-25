export interface Product {
  id: number;
  imageURL: string;
  name: string;
  type: string;
  price: number;
  currency: string;
  color: string;
  gender: string;
  quantity: number;
}

export const GENDERS = ["Men", "Women"] as const;
export const COLORS = ["Black", "Blue", "Pink", "Green", "Red", "Grey", "Purple", "White", "Yellow"] as const;
export const TYPES = ["Polo", "Hoodie", "Basic"] as const;
export const PRICE_RANGES = [
  { label: "₹0 - ₹250", min: 0, max: 250 },
  { label: "₹251 - ₹350", min: 251, max: 350 },
  { label: "₹351 - ₹500", min: 351, max: 500 },
] as const;

export interface Coupon {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  label: string;
}

export const COUPONS: Coupon[] = [
  { code: 'TEE10', type: 'percentage', value: 10, minOrder: 500, label: '10% off on orders above ₹500' },
  { code: 'FLAT50', type: 'flat', value: 50, minOrder: 300, label: '₹50 off on orders above ₹300' },
  { code: 'SAVE20', type: 'percentage', value: 20, minOrder: 1000, label: '20% off on orders above ₹1000' },
];

export const TAX_RATE = 0.05;
export const SHIPPING_CHARGE = 49;
export const FREE_SHIPPING_THRESHOLD = 999;
