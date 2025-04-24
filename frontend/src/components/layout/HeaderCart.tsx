// src/components/HeaderCart.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const HeaderCart = () => {
    const { cart } = useCart();

    return (
        <div className="header-cart">
            <Link
                className="cart-head"
                href="/cart"
                title="Giỏ hàng"
                style={{ whiteSpace: "nowrap" }}
            >
                <span className="count_item count_item_pr">{cart.length}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        d="M1.71076 10.6861L3.03101 21.2481C3.15612 22.2489 4.00692 23 5.01556 23L18.9844 23C19.9931 23 20.8439 22.2489 20.969 21.2481L22.2892 10.6861C22.4012 9.79077 21.7031 9 20.8008 9L3.19917 9C2.29693 9 1.59885 9.79077 1.71076 10.6861Z"
                        stroke="white"
                        strokeWidth="2"
                    />
                    <path
                        d="M5 9.00004L10.4815 2.60497C11.2797 1.67375 12.7203 1.67375 13.5185 2.60497L19 9.00004H5Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M6.75 13.0834V18.9167"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M12 13.0834V18.9167"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M17.25 13.0834V18.9167"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
                <span className="text">Giỏ hàng</span>
            </Link>
        </div>
    );
};

export default HeaderCart;