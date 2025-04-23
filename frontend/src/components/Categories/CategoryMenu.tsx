import CategoryMenuItem from "@/components/Categories/CategoryMenuItem";
import React from "react";

const CategoryMenu = () => {
    return (
        <div className="color-bg">
            <div className="menu_mega">
                <div className="title_menu">
                    {/* ... (SVG và text "Danh mục") ... */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="16"
                        viewBox="0 0 20 16"
                        fill="none"
                    >
                        <path
                            d="M6 2L19 2"
                            stroke="#2B2F33"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M6 8L19 8"
                            stroke="#2B2F33"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M6 14L19 14"
                            stroke="#2B2F33"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <path
                            d="M1.25 9.25C1.94036 9.25 2.5 8.69036 2.5 8C2.5 7.30964 1.94036 6.75 1.25 6.75C0.559644 6.75 0 7.30964 0 8C0 8.69036 0.559644 9.25 1.25 9.25Z"
                            fill="#2B2F33"
                        />
                        <path
                            d="M1.25 3.25C1.94036 3.25 2.5 2.69036 2.5 2C2.5 1.30964 1.94036 0.75 1.25 0.75C0.559644 0.75 0 1.30964 0 2C0 2.69036 0.559644 3.25 1.25 3.25Z"
                            fill="#2B2F33"
                        />
                        <path
                            d="M1.25 15.25C1.94036 15.25 2.5 14.6904 2.5 14C2.5 13.3096 1.94036 12.75 1.25 12.75C0.559644 12.75 0 13.3096 0 14C0 14.6904 0.559644 15.25 1.25 15.25Z"
                            fill="#2B2F33"
                        />
                    </svg>
                    Danh mục
                </div>
                <div className="nav-cate">
                    <ul id="menu2017">
                        <CategoryMenuItem
                            href="/do-choi-me-be"
                            title="Đồ Chơi - Mẹ & Bé"
                            subcategories={[
                                { href: "ta-bim.html", title: "Tã, Bỉm" },
                                {
                                    href: "dinh-duong-cho-be.html",
                                    title: "Dinh dưỡng cho bé",
                                },
                                {
                                    href: "thuc-pham-an-dam.html",
                                    title: "Thực phẩm ăn dặm",
                                },
                                {
                                    href: "dinh-duong-cho-me.html",
                                    title: "Dinh dưỡng cho mẹ",
                                },
                                {
                                    href: "do-dung-cho-be.html",
                                    title: "Đồ dùng cho bé",
                                },
                            ]}
                        />
                        <CategoryMenuItem
                            href="dien-thoai-may-tinh-bang.html"
                            title="Điện Thoại - Máy Tính Bảng"
                            subcategories={[
                                {
                                    href: "dien-thoai-smartphone.html",
                                    title: "Điện thoại Smartphone",
                                },
                                {
                                    href: "may-tinh-bang.html",
                                    title: "Máy tính bảng",
                                },
                                {
                                    href: "may-doc-sach.html",
                                    title: "Máy đọc sách",
                                },
                                {
                                    href: "dien-thoai-pho-thong.html",
                                    title: "Điện thoại phổ thông",
                                },
                                {
                                    href: "dien-thoai-ban.html",
                                    title: "Điện thoại bàn",
                                },
                            ]}
                        />
                        {/* ... Thêm các CategoryMenuItem khác ... */}
                        <CategoryMenuItem
                            href="lam-dep-suc-khoe.html"
                            title="Làm Đẹp - Sức Khỏe"
                            subcategories={[
                                {
                                    href: "cham-soc-da-mat.html",
                                    title: "Chăm sóc da mặt",
                                },
                                {
                                    href: "trang-diem.html",
                                    title: "Trang điểm",
                                },
                                {
                                    href: "cham-soc-ca-nhan.html",
                                    title: "Chăm sóc cá nhân",
                                },
                                {
                                    href: "cham-soc-co-the.html",
                                    title: "Chăm sóc cơ thể",
                                },
                                {
                                    href: "duoc-my-pham.html",
                                    title: "Dược mỹ phẩm",
                                },
                            ]}
                        />
                        <CategoryMenuItem
                            href="dien-gia-dung.html"
                            title="Điện Gia Dụng"
                            subcategories={[
                                {
                                    href: "do-dung-nha-bep.html",
                                    title: "Đồ dùng nhà bếp",
                                },
                                {
                                    href: "thiet-bi-gia-dinh.html",
                                    title: "Thiết bị gia đình",
                                },
                            ]}
                        />
                        <CategoryMenuItem
                            href="phu-kien-thoi-trang.html"
                            title="Phụ kiện thời trang"
                            subcategories={[
                                { href: "mat-kinh.html", title: "Mắt kính" },
                                {
                                    href: "phu-kien-thoi-trang-nu.html",
                                    title: "Phụ kiện thời trang nữ",
                                },
                                {
                                    href: "phu-kien-thoi-trang-nam.html",
                                    title: "Phụ kiện thời trang nam",
                                },
                            ]}
                        />
                        <CategoryMenuItem
                            href="dong-ho-va-trang-suc.html"
                            title="Đồng hồ và Trang sức"
                            subcategories={[
                                {
                                    href: "dong-ho-nam.html",
                                    title: "Đồng hồ nam",
                                },
                                {
                                    href: "dong-ho-nu.html",
                                    title: "Đồng hồ nữ",
                                },
                                {
                                    href: "dong-ho-tre-em.html",
                                    title: "Đồng hồ trẻ em",
                                },
                                {
                                    href: "phu-kien-dong-ho.html",
                                    title: "Phụ kiện đồng hồ",
                                },
                                { href: "trang-suc.html", title: "Trang sức" },
                            ]}
                        />
                        <CategoryMenuItem
                            href="laptop-may-vi-tinh-linh-kien.html"
                            title="Laptop - Máy Vi Tính - Linh kiện"
                            subcategories={[
                                { href: "laptop.html", title: "Laptop" },
                                {
                                    href: "thiet-bi-van-phong-thiet-bi-ngoai-vi.html",
                                    title: "Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi",
                                },
                                {
                                    href: "thiet-bi-luu-tru.html",
                                    title: "Thiết Bị Lưu Trữ",
                                },
                                {
                                    href: "thiet-bi-mang.html",
                                    title: "Thiết Bị Mạng",
                                },
                                {
                                    href: "pc-may-tinh-bo.html",
                                    title: "PC - Máy Tính Bộ",
                                },
                                {
                                    href: "linh-kien-may-tinh-phu-kien-may-tinh.html",
                                    title: "Linh Kiện Máy Tính - Phụ Kiện Máy Tính",
                                },
                            ]}
                        />
                        <CategoryMenuItem
                            href="nha-cua-doi-song.html"
                            title="Nhà cửa & Đời sống"
                            subcategories={[
                                {
                                    href: "dung-cu-nha-bep.html",
                                    title: "Dụng cụ nhà bếp",
                                },
                                {
                                    href: "do-dung-phong-an.html",
                                    title: "Đồ dùng phòng ăn",
                                },
                                {
                                    href: "do-dung-phong-ngu.html",
                                    title: "Đồ dùng phòng ngủ",
                                },
                                { href: "noi-that.html", title: "Nội thất" },
                                {
                                    href: "trang-tri-nha-cua.html",
                                    title: "Trang trí nhà cửa",
                                },
                            ]}
                        />
                        <li className="menu-item-count">
                            <a
                                className="nd-categories-a"
                                href="bach-hoa-online.html"
                                title="Bách Hóa Online"
                            >
                                Bách Hóa Online
                            </a>
                        </li>
                        <li className="menu-item-count">
                            <a
                                className="nd-categories-a"
                                href="thiet-bi-so-phu-kien-so.html"
                                title="Thiết Bị Số - Phụ Kiện Số"
                            >
                                Thiết Bị Số - Phụ Kiện Số
                            </a>
                        </li>
                        <li className="menu-item-count">
                            <a
                                className="nd-categories-a"
                                href="dien-tu-dien-lanh-tv.html"
                                title="Điện Tử - Điện Lạnh - TV"
                            >
                                Điện Tử - Điện Lạnh - TV
                            </a>
                        </li>
                        <li className="menu-item-count">
                            <a
                                className="nd-categories-a"
                                href="the-thao-da-ngoai.html"
                                title="Thể Thao - Dã Ngoại"
                            >
                                Thể Thao - Dã Ngoại
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CategoryMenu;
