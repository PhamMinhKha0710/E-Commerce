import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import SalesPop from "@/components/Pop/SalesPop";
import Banner from "@/components/home/Banner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "lazysizes";
// Import CSS từ thư mục styles hoặc tương tự (thay vì public)
import "@/styles/checkout.vendor.min.css"; // Đảm bảo file này tồn tại trong dự án
import "@/styles/checkout.min.css"; // Đảm bảo file này tồn tại trong dự án

export const metadata: Metadata = {
  title: "Checkout - SmileMart",
  description: "Hoàn tất đơn hàng của bạn tại ShopNest",
  keywords: "checkout, shopping, e-commerce",
  robots: "noindex, nofollow", // Thường trang checkout không cần SEO
  themeColor: "#f02b2b",
  openGraph: {
    type: "website",
    title: "Checkout - ShopNest",
    url: "https://nd-mall.mysapo.net/checkout",
    siteName: "ShopNest - Sàn thương mại điện tử với hàng chất lượng",
    images: [
      {
        url: "/file_co_CSS/logo.png",
        width: 800,
        height: 600,
        alt: "ShopNest Logo",
      },
    ],
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/file_co_CSS/favicon.png" type="image/x-icon" />
      </head>
      <body style={{ backgroundColor: "#e7eef6" }}>
        <AuthProvider>
          <CartProvider>
            {children}
            <SalesPop />
            <Banner />
            <ToastContainer />
          </CartProvider>
        </AuthProvider>

        {/* Load JavaScript giống RootLayout để giữ tính năng */}
        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"
          strategy="beforeInteractive"
        />
        <Script id="theme-settings" strategy="lazyOnload">
          {`
            window.theme = window.theme || {}; 
            theme.settings = {
              moneyFormat: "{{amount_no_decimals_with_comma_separator}}₫",
            };
          `}
        </Script>
        <Script id="lazyload" strategy="lazyOnload">
          {`
            function awe_lazyloadImage() {
                var ll = new LazyLoad({
                    elements_selector: ".lazyload",
                    load_delay: 100,
                    threshold: 0
                });
            }
            window.awe_lazyloadImage = awe_lazyloadImage;

            $(document).ready(function () {
                awe_lazyloadImage();
            });

            let productJson = null;
            console.log('productJson', productJson);

            let collectionsJson = {"error":"Không hỗ trợ json serialize cho đối tượng này"};
            console.log('collectionsJson', collectionsJson);
          `}
        </Script>
        <Script
          src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/search_filter.js?1736305669595"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}