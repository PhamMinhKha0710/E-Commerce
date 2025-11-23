"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/app/auth/components/BreadCrumb";
import { useCart } from "@/context/CartContext";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Lấy orderId từ query params nếu có
    const orderIdParam = searchParams.get("orderId");
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }

    // Xóa giỏ hàng sau khi thanh toán thành công
    clearCart();
  }, [searchParams, clearCart]);

  return (
    <section className="section" style={{ marginTop: "-30px", minHeight: "60vh" }}>
      <Breadcrumb>
        <>Thanh toán thành công</>
      </Breadcrumb>
      <div className="container">
        <div style={{ 
          maxWidth: "600px", 
          margin: "40px auto", 
          padding: "40px 20px",
          textAlign: "center"
        }}>
          {/* Success Icon */}
          <div style={{
            width: "100px",
            height: "100px",
            margin: "0 auto 30px",
            borderRadius: "50%",
            backgroundColor: "#4caf50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "scaleIn 0.5s ease-out"
          }}>
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill="white"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "15px"
          }}>
            Thanh toán thành công!
          </h1>

          <p style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "30px",
            lineHeight: "1.6"
          }}>
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được xử lý thành công.
          </p>

          {orderId && (
            <div style={{
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "30px"
            }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                Mã đơn hàng: <strong style={{ color: "#333" }}>{orderId}</strong>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <Link
              href="/userProfile/orders"
              style={{
                display: "inline-block",
                padding: "12px 30px",
                backgroundColor: "var(--maincolor)",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500",
                transition: "background-color 0.3s",
                fontSize: "16px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--maincolor)";
              }}
            >
              Xem đơn hàng
            </Link>

            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 30px",
                backgroundColor: "white",
                color: "var(--maincolor)",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: "500",
                border: "1px solid var(--maincolor)",
                transition: "all 0.3s",
                fontSize: "16px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fef0f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Additional Info */}
          <div style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            textAlign: "left"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "15px",
              color: "#333"
            }}>
              Thông tin đơn hàng:
            </h3>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.8"
            }}>
              <li>✓ Đơn hàng đã được xác nhận và đang được xử lý</li>
              <li>✓ Bạn sẽ nhận được email xác nhận trong vài phút</li>
              <li>✓ Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}

