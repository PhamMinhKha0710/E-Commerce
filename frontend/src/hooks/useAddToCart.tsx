"use client";

import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import Image from "next/image";

export interface CartItem {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  currency: string;
  hasVariations: boolean;
  productItemId: number | null; // Thay selectedVariations
}

export const useAddToCart = () => {
  const { addToCart } = useCart();

  const handleAddToCart = async (product: CartItem) => {
    try {
      await addToCart({
        productId: product.productId,
        productName: product.productName,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: 1,
        currency: product.currency || "VND",
        hasVariations: product.hasVariations || false,
        productItemId: product.productItemId, // Truyền trực tiếp productItemId
      });
      toast.success(
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={product.imageUrl || "/default-image.jpg"}
            alt={product.productName}
            width={40}
            height={40}
            style={{ marginRight: "10px", borderRadius: "4px" }}
          />
          <div>
            <strong>{product.price} : {product.productName}</strong> đã được thêm vào giỏ hàng!
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            background: "#f0fff0",
            color: "#28a745",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }
      );
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng!");
      console.error("Error adding to cart:", error);
    }
  };

  return handleAddToCart;
};