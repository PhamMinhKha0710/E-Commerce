import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "lazysizes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/home/Banner";
import SalesPop from "@/components/Pop/SalesPop";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider
import { CartProvider } from "@/context/CartContext"; // Import CartProvider
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
    title: "SmileMart",
    description: "ShopNest - Sàn thương mại điện tử với hàng chất lượng",
    keywords: "Cập nhật sau",
    robots: "noodp,index,follow",
    themeColor: "#f02b2b",
    openGraph: {
        type: "website",
        title: "ShopNest",
        url: "https://nd-mall.mysapo.net/",
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

export default function RootLayout({
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
                <meta name="robots" content="noodp,index,follow" />
                <link rel="canonical" href="/" />
                <link
                    rel="icon"
                    href="/file_co_CSS/favicon.png"
                    type="image/x-icon"
                />
            </head>
            <body style={{ backgroundColor: "#e7eef6" }}>
                <AuthProvider>
                    <CartProvider>
                        {" "}
                        {/* Bao bọc toàn bộ nội dung bằng AuthProvider */}
                        <Header />
                        {children}
                        <SalesPop />
                        <Footer />
                        <Banner />
                        <ToastContainer />
                    </CartProvider>
                </AuthProvider>

                {/* Load JavaScript */}
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
