"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/app/auth/components/BreadCrumb";

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Lấy thông báo lỗi từ query params nếu có
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  return (
    <section className="section" style={{ marginTop: "-30px", minHeight: "60vh" }}>
      <Breadcrumb>
        <>Thanh toán thất bại</>
      </Breadcrumb>
      <div className="container">
        <div style={{ 
          maxWidth: "600px", 
          margin: "40px auto", 
          padding: "40px 20px",
          textAlign: "center"
        }}>
          {/* Failure Icon */}
          <div style={{
            width: "100px",
            height: "100px",
            margin: "0 auto 30px",
            borderRadius: "50%",
            backgroundColor: "#f44336",
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
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="white"
              />
            </svg>
          </div>

          {/* Failure Message */}
          <h1 style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "15px"
          }}>
            Thanh toán thất bại
          </h1>

          <p style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "20px",
            lineHeight: "1.6"
          }}>
            Rất tiếc, quá trình thanh toán của bạn không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
          </p>

          {errorMessage && (
            <div style={{
              backgroundColor: "#ffebee",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "30px",
              border: "1px solid #ffcdd2"
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: "14px", 
                color: "#c62828",
                fontWeight: "500"
              }}>
                {errorMessage}
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
              href="/checkout"
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
              Thử lại thanh toán
            </Link>

            <Link
              href="/cart"
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
              Quay lại giỏ hàng
            </Link>
          </div>

          {/* Additional Info */}
          <div style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "#fff3e0",
            borderRadius: "8px",
            textAlign: "left",
            border: "1px solid #ffe0b2"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "15px",
              color: "#e65100"
            }}>
              Các lý do có thể gây lỗi:
            </h3>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.8"
            }}>
              <li>• Thông tin thẻ không chính xác hoặc thẻ đã hết hạn</li>
              <li>• Số dư tài khoản không đủ</li>
              <li>• Kết nối mạng không ổn định</li>
              <li>• Hệ thống thanh toán đang bảo trì</li>
            </ul>
            <p style={{
              marginTop: "15px",
              fontSize: "14px",
              color: "#666",
              fontStyle: "italic"
            }}>
              Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với chúng tôi qua email hoặc hotline để được hỗ trợ.
            </p>
          </div>

          {/* Support Link */}
          <div style={{ marginTop: "30px" }}>
            <Link
              href="/lien-he"
              style={{
                fontSize: "14px",
                color: "var(--maincolor)",
                textDecoration: "none"
              }}
            >
              Liên hệ hỗ trợ khách hàng →
            </Link>
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

