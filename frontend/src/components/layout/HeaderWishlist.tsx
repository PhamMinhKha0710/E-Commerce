// src/components/HeaderWishlist.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { wishlistService, AUTH_REQUIRED_ERROR } from "@/services/wishlistService";

const HeaderWishlist = () => {
    const [wishlistCount, setWishlistCount] = useState(0);
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const updateCountFromCache = () => {
            if (!isMounted) return;
            setWishlistCount(wishlistService.getWishlistCount());
        };

        const syncWishlist = async () => {
            if (!isLoggedIn) {
                wishlistService.clearCache();
                updateCountFromCache();
                return;
            }
            try {
                await wishlistService.getWishlist();
            } catch (error: unknown) {
                const message = (error as Error)?.message;
                if (message === AUTH_REQUIRED_ERROR) {
                    wishlistService.clearCache();
                } else {
                    console.error("Không thể đồng bộ wishlist:", error);
                }
            } finally {
                updateCountFromCache();
            }
        };

        syncWishlist();

        const handleWishlistUpdate = () => {
            updateCountFromCache();
        };

        if (typeof window !== "undefined") {
            window.addEventListener("wishlistUpdated", handleWishlistUpdate as EventListener);
        }

        return () => {
            isMounted = false;
            if (typeof window !== "undefined") {
                window.removeEventListener("wishlistUpdated", handleWishlistUpdate as EventListener);
            }
        };
    }, [isLoggedIn]);

    return (
        <div className="header-wish">
            <Link href="/yeu-thich" title="Yêu thích" style={{ whiteSpace: "nowrap" }}>
                {wishlistCount > 0 && (
                    <span className="count_item count_item_pr">{wishlistCount}</span>
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={25}
                    height={21}
                    viewBox="0 0 22 18"
                    fill="none"
                >
                    <path
                        d="M10.9996 4.70328L11.9897 3.70983C13.636 2.05781 16.1884 2.00757 17.8907 3.59366V3.59366C19.8065 5.37864 19.9059 8.52072 18.1073 10.4395L16.0996 12.5815L12.2673 16.1333C11.5399 16.8074 10.4583 16.8076 9.73066 16.1337L8.59209 15.0791"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10.999 4.70331L10.0093 3.7101C8.3631 2.05796 5.8106 2.00764 4.10827 3.59375V3.59375C2.19257 5.37868 2.09313 8.52068 3.89163 10.4394L5.8995 12.5815L9.73108 16.1332C10.4584 16.8074 11.54 16.8078 12.2676 16.134L13.4069 15.079"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="text">Yêu thích</div>
            </Link>
        </div>
    );
};

export default HeaderWishlist;

