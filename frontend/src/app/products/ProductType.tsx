// data/products.ts
export interface Product {
  slug: string;
  name: string;
  category: string;
  image: string;
  brand: string;
  description: string;
  price: number; 
  oldPrice: number;
  currency: string;
  availability: string;
  seller: {
    name: string;
    url: string;
    logo: string;
  };
  images: string[];
  hasVariations?: boolean; 
  defaultCombinationId?: string; 
  variantGroups?: VariantGroup[]; 
}

export interface RelatedProduct {
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
}

export interface VariantOption {
  value: string;
  label: string;
  available: boolean;
}

export interface VariantGroup {
  name: string; // Tên thuộc tính (ví dụ: "type", "size", "color")
  options: VariantOption[];
}

export interface VariantCombination {
  id: string; // variantId
  attributes: { [key: string]: string }; // Các thuộc tính (ví dụ: { type: "Warm Forest", size: "600G" })
  price: number;
  oldPrice?: number; // Thêm giá cũ cho từng tổ hợp
  available: boolean;
}

