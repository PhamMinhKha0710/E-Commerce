// data/products.ts
export interface Product {
  productId: number; // Thêm productId để lưu Id của sản phẩm
  slug: string;
  name: string;
  category: string;
  image: string; // Ảnh chính của sản phẩm (có thể lấy từ ProductItem IsDefault hoặc danh sách ProductImages)
  brand: string;
  description: string;
  price: number; // Giá của ProductItem mặc định
  oldPrice: number; // Giá cũ của ProductItem mặc định
  currency: string;
  availability: string; // Dựa trên QtyInStock của ProductItem mặc định
  seller: {
    name: string;
    url: string;
    logo: string;
  };
  images: string[]; // Danh sách ảnh từ ProductImages
  hasVariations?: boolean; // Tương ứng với HasVariation
  defaultCombinationId?: string; // Id của ProductItem mặc định (IsDefault = true)
  variantGroups?: VariantGroup[]; // Nhóm biến thể (tương ứng với Variation)
}

export interface RelatedProduct {
  productId: number; // Thêm productId cho sản phẩm liên quan
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
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