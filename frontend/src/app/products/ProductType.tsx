// data/products.ts
export interface Product {
  productId: number; 
  categoryId: number;
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
  categoryId: number;
  productId: string;
  productName: string;
  href: string;
  slug: string | null;
  imageUrl: string;
  price: string;
  comparePrice: string | null;
  discount: string | null;
  hasVariations: boolean;
  contact: boolean;
  productItemId: number | null;
}

export interface VariantOption {
  value: string;
  label: string;
  available: boolean; // Dựa trên QtyInStock của ProductItem liên quan
}

export interface VariantGroup {
  name: string; // Tên thuộc tính (tương ứng với Variation.Value, ví dụ: "type", "size", "color")
  options: VariantOption[];
}

export interface VariantCombination {
  id: string; // ProductItem.Id
  attributes: { [key: string]: string }; // Tương ứng với ProductConfiguration (ví dụ: { type: "Warm Forest", size: "600G" })
  price: number; // ProductItem.Price
  oldPrice?: number; // ProductItem.OldPrice
  available: boolean; // Dựa trên ProductItem.QtyInStock
}