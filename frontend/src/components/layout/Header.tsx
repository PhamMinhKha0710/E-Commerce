"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import HeaderCart from "./HeaderCart";

interface SuggestionResponse {
  suggestions: string[];
  productNames: string[];
  urls: string[];
}

const Header = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [productUrls, setProductUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const { isLoggedIn, user, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim() === "") {
        setSuggestions([]);
        setProductNames([]);
        setProductUrls([]);
        setIsSearchOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5130/api/Search/suggest?query=${encodeURIComponent(inputValue)}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }
        const data: SuggestionResponse = await response.json();
        setSuggestions(data.suggestions || []);
        setProductNames(data.productNames || []);
        setProductUrls(data.urls || []);
        setIsSearchOpen(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setProductNames([]);
        setProductUrls([]);
        setIsSearchOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setIsSearchOpen(false);
    window.location.href = `/danh-cho-ban?query=${encodeURIComponent(suggestion)}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      window.location.href = `/danh-cho-ban?query=${encodeURIComponent(inputValue)}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        window.location.href = `/danh-cho-ban?query=${encodeURIComponent(inputValue)}`;
      }
    }
  };

  const handleCameraClick = () => {
    // Assuming camera icon triggers an image search
    window.location.href = `/danh-cho-ban?imageSearch=true`;
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  return (
    <header className="header">
      <div className="header-middle">
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-xl-2 col-lg-2 col-md-3 col-12 col-left">
              <Link href="/" className="logo" onClick={() => { window.location.href = '/'; return false; }}>
                <Image
                  src="/images/smile.svg"
                  width={124}
                  height={49}
                  alt="ND Mall"
                />
              </Link>
            </div>
            <div className="col-xl-7 col-lg-2 col-md-9 col-12 d-flex align-items-center col-middle">
              <div className="header-store d-lg-block d-none">
                <a href="he-thong-cua-hang.html" title="Hệ thống cửa hàng">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={28}
                    height={29}
                    viewBox="0 0 28 29"
                    fill="none"
                  >
                    <path
                      d="M3.75159 11.5114V23.9209C3.75159 25.2418 4.82237 26.3125 6.14325 26.3125H21.8539C23.1748 26.3125 24.2456 25.2418 24.2456 23.9209V11.5114"
                      stroke="white"
                      strokeWidth="1.79375"
                    />
                    <path
                      d="M10.0133 26.9578V20.5824C10.0133 19.5918 10.8164 18.7887 11.8071 18.7887H16.1894C17.1801 18.7887 17.9832 19.5918 17.9832 20.5824V26.9578"
                      stroke="white"
                      strokeWidth="1.79375"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.6914 12.168C19.0126 12.9842 17.9895 13.5038 16.845 13.5038C15.7005 13.5038 14.6774 12.9842 13.9986 12.168C13.3198 12.9842 12.2967 13.5038 11.1522 13.5038C10.0077 13.5038 8.98458 12.9842 8.30583 12.168C7.62707 12.9842 6.60393 13.5038 5.45944 13.5038C3.70885 13.5038 2.24408 12.289 1.85833 10.6573C1.6837 9.91865 1.95533 9.2465 2.24863 8.78559L5.20647 4.13756C5.7812 3.23442 6.7775 2.6875 7.848 2.6875H20.1492C21.2197 2.6875 22.216 3.23442 22.7907 4.13756L25.7486 8.78559C26.0419 9.2465 26.3135 9.91865 26.1389 10.6573C25.7531 12.289 24.2883 13.5038 22.5378 13.5038C21.3933 13.5038 20.3701 12.9842 19.6914 12.168ZM6.64731 5.05445C6.90855 4.64393 7.36141 4.39533 7.848 4.39533H20.1492C20.6358 4.39533 21.0886 4.64393 21.3499 5.05445L24.3077 9.70249C24.4794 9.9723 24.5015 10.1601 24.4769 10.2644C24.2691 11.1429 23.4787 11.7959 22.5378 11.7959C21.4373 11.7959 20.5453 10.9039 20.5453 9.80347H18.8375C18.8375 10.9039 17.9454 11.7959 16.845 11.7959C15.7451 11.7959 14.8534 10.9048 14.8525 9.80516V9.80347H13.1447L13.1447 9.80516C13.1438 10.9048 12.2521 11.7959 11.1522 11.7959C10.0518 11.7959 9.15974 10.9039 9.15974 9.80347H7.45191C7.45191 10.9039 6.55985 11.7959 5.45944 11.7959C4.51852 11.7959 3.72804 11.1429 3.52035 10.2644C3.4957 10.1601 3.51776 9.9723 3.68946 9.70249L6.64731 5.05445Z"
                      fill="white"
                    />
                  </svg>
                  <div className="text">
                    <span>Hệ thống cửa hàng</span>
                    <span>40 cửa hàng</span>
                  </div>
                </a>
              </div>
              <div className="header-search" ref={searchRef}>
                <form
                  onSubmit={handleSearchSubmit}
                  className="input-group search-bar theme-header-search-form ultimate-search"
                  role="search"
                >
                  <input
                    type="text"
                    name="query"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="search-auto input-group-field auto-search"
                    required
                  />
                  <input type="hidden" name="type" value="product" />
                  <span className="input-group-btn">
                    <span className="camera-icon" onClick={handleCameraClick} style={{ cursor: "pointer" }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </span>
                    <button className="btn icon-fallback-text" aria-label="Search" type="submit">
                      Tìm kiếm
                    </button>
                  </span>
                  <div className={`search-suggest ${isSearchOpen ? "open" : ""}`}>
                    <ul className="smart-search-title">
                      <li data-tab="#tab-search-1" className="active">
                        <a href="javascript:void(0)" title="Sản phẩm">
                          Sản phẩm
                        </a>
                      </li>
                      <li data-tab="#tab-search-2">
                        <a href="javascript:void(0)" title="Tin tức">
                          Tin tức
                        </a>
                      </li>
                    </ul>
                    <div className="list-search-suggest">
                      <div
                        className="list-search list-search-style active"
                        id="tab-search-1"
                      >
                        {isLoading ? (
                          <div>Loading...</div>
                        ) : (
                          <>
                            {productNames.length > 0 && (
                              <div className="title-search">
                                <span>Sản phẩm gợi ý</span>
                              </div>
                            )}
                            {productNames.map((product, index) => (
                              <div
                                key={index}
                                className="product-smart"
                                onClick={() => handleSuggestionClick(product)}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="image_thumb">
                                  <img
                                    src={productUrls[index]}
                                    alt={product}
                                    width={80}
                                    height={80}
                                  />
                                </div>
                                <div className="product-info">
                                  <h3>
                                    <a href="javascript:void(0)">{product}</a>
                                  </h3>
                                  <div className="price-box">
                                    <span className="price">Liên hệ</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {suggestions.length > 0 && (
                              <div className="title-search">
                                <span>Từ khóa gợi ý</span>
                              </div>
                            )}
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="product-smart"
                                onClick={() => handleSuggestionClick(suggestion)}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="product-info">
                                  <h3>
                                    <a href="javascript:void(0)">{suggestion}</a>
                                  </h3>
                                </div>
                              </div>
                            ))}
                            {(suggestions.length > 0 || productNames.length > 0) && (
                              <a
                                href={`/danh-cho-ban?query=${encodeURIComponent(inputValue)}`}
                                className="see-more"
                              >
                                Xem thêm
                              </a>
                            )}
                          </>
                        )}
                      </div>
                      <div
                        className="list-search2 list-search-style"
                        id="tab-search-2"
                      >
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-12 col-12 d-flex align-items-center col-right">
              <div className="menu-bar d-lg-none d-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={16}
                  viewBox="0 0 20 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.958984 1C0.958984 0.516751 1.35074 0.125 1.83398 0.125H12.334C12.8172 0.125 13.209 0.516751 13.209 1C13.209 1.48325 12.8172 1.875 12.334 1.875H1.83398C1.35074 1.875 0.958984 1.48325 0.958984 1Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.958984 15C0.958984 14.5168 1.35074 14.125 1.83398 14.125H8.83399C9.31723 14.125 9.70899 14.5168 9.70899 15C9.70899 15.4832 9.31723 15.875 8.83399 15.875H1.83398C1.35074 15.875 0.958984 15.4832 0.958984 15Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.958984 8C0.958984 7.51675 1.35074 7.125 1.83398 7.125H18.1673C18.6506 7.125 19.0423 7.51675 19.0423 8C19.0423 8.48325 18.6506 8.875 18.1673 8.875H1.83398C1.35074 8.875 0.958984 8.48325 0.958984 8Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="header-wish">
                <a href="yeu-thich.html" title="Yêu thích" style={{ whiteSpace: "nowrap" }}>
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
                </a>
              </div>
              <div className="header-store d-lg-none">
                <a href="he-thong-cua-hang.html" title="Hệ thống cửa hàng">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={28}
                    height={29}
                    viewBox="0 0 28 29"
                    fill="none"
                  >
                    <path
                      d="M3.75159 11.5114V23.9209C3.75159 25.2418 4.82237 26.3125 6.14325 26.3125H21.8539C23.1748 26.3125 24.2456 25.2418 24.2456 23.9209V11.5114"
                      stroke="white"
                      strokeWidth="1.79375"
                    />
                    <path
                      d="M10.0133 26.9578V20.5824C10.0133 19.5918 10.8164 18.7887 11.8071 18.7887H16.1894C17.1801 18.7887 17.9832 19.5918 17.9832 20.5824V26.9578"
                      stroke="white"
                      strokeWidth="1.79375"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.6914 12.168C19.0126 12.9842 17.9895 13.5038 16.845 13.5038C15.7005 13.5038 14.6774 12.9842 13.9986 12.168C13.3198 12.9842 12.2967 13.5038 11.1522 13.5038C10.0077 13.5038 8.98458 12.9842 8.30583 12.168C7.62707 12.9842 6.60393 13.5038 5.45944 13.5038C3.70885 13.5038 2.24408 12.289 1.85833 10.6573C1.6837 9.91865 1.95533 9.2465 2.24863 8.78559L5.20647 4.13756C5.7812 3.23442 6.7775 2.6875 7.848 2.6875H20.1492C21.2197 2.6875 22.216 3.23442 22.7907 4.13756L25.7486 8.78559C26.0419 9.2465 26.3135 9.91865 26.1389 10.6573C25.7531 12.289 24.2883 13.5038 22.5378 13.5038C21.3933 13.5038 20.3701 12.9842 19.6914 12.168ZM6.64731 5.05445C6.90855 4.64393 7.36141 4.39533 7.848 4.39533H20.1492C20.6358 4.39533 21.0886 4.64393 21.3499 5.05445L24.3077 9.70249C24.4794 9.9723 24.5015 10.1601 24.4769 10.2644C24.2691 11.1429 23.4787 11.7959 22.5378 11.7959C21.4373 11.7959 20.5453 10.9039 20.5453 9.80347H18.8375C18.8375 10.9039 17.9454 11.7959 16.845 11.7959C15.7451 11.7959 14.8534 10.9048 14.8525 9.80516V9.80347H13.1447L13.1447 9.80516C13.1438 10.9048 12.2521 11.7959 11.1522 11.7959C10.0518 11.7959 9.15974 10.9039 9.15974 9.80347H7.45191C7.45191 10.9039 6.55985 11.7959 5.45944 11.7959C4.51852 11.7959 3.72804 11.1429 3.52035 10.2644C3.4957 10.1601 3.51776 9.9723 3.68946 9.70249L6.64731 5.05445Z"
                      fill="white"
                    />
                  </svg>
                  <div className="text">
                    <span>Hệ thống cửa hàng</span>
                    <span>40 cửa hàng</span>
                  </div>
                </a>
              </div>
              <div className="header-account">
                {isClient ? (
                  isLoggedIn ? (
                    <div className="user-profile" style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          margin: "0 auto",
                        }}
                      >
                        <Image
                          src={"/images/user.png"}
                          width={30}
                          height={30}
                          alt="User Avatar"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <span
                        className="info"
                        style={{ color: "white", display: "block", whiteSpace: "nowrap" }}
                      >
                        Chào {user?.name ? user.name.split(" ").pop() : "Khách"}
                      </span>
                      <div
                        className="drop-account"
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                          borderRadius: "2px",
                        }}
                      >
                        <Link
                          href="/profile"
                          style={{
                            display: "block",
                            padding: "4px 8px 9px 8px",
                            border: "none",
                            borderBottom: "1px solid #dddbf1",
                            color: "#000",
                            textDecoration: "none",
                            transition: "background-color 0.3s ease, color 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#3db3b7";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#000";
                          }}
                        >
                          Hồ sơ
                        </Link>
                        <button
                          onClick={handleLogout}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "none",
                            borderRadius: "2px",
                            background: "#fff",
                            color: "#000",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease, color 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#3db3b7";
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#fff";
                            e.currentTarget.style.color = "#000";
                          }}
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={21}
                        height={22}
                        viewBox="0 0 21 22"
                        fill="none"
                      >
                        <path
                          d="M15 6C15 8.62336 12.8733 10.75 10.25 10.75C7.62668 10.75 5.5 8.62336 5.5 6C5.5 3.37664 7.62668 1.25 10.25 1.25C12.8733 1.25 15 3.37664 15 6Z"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <path
                          d="M19.5 21.5V19.5C19.5 16.1863 16.8137 13.5 13.5 13.5H7.5C4.18629 13.5 1.5 16.1863 1.5 19.5V21.5"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>
                      <span
                        className="info"
                        style={{ color: "white", whiteSpace: "nowrap" }}
                      >
                        Tài khoản
                      </span>
                      <div className="drop-account">
                        <Link href="/auth/login">Đăng nhập</Link>
                        <Link href="/auth/register">Đăng ký</Link>
                      </div>
                    </div>
                  )
                ) : (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={21}
                      height={22}
                      viewBox="0 0 21 22"
                      fill="none"
                    >
                      <path
                        d="M15 6C15 8.62336 12.8733 10.75 10.25 10.75C7.62668 10.75 5.5 8.62336 5.5 6C5.5 3.37664 7.62668 1.25 10.25 1.25C12.8733 1.25 15 3.37664 15 6Z"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <path
                        d="M19.5 21.5V19.5C19.5 16.1863 16.8137 13.5 13.5 13.5H7.5C4.18629 13.5 1.5 16.1863 1.5 19.5V21.5"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="info" style={{ color: "white" }}>
                      Tài khoản
                    </span>
                  </div>
                )}
              </div>
              <HeaderCart />
            </div>
          </div>
        </div>
      </div>
      <div className="header-menu">
        <div className="opacity_menu"></div>
        <div className="container">
          <div className="header-menu-scroll">
            <nav className="header-nav">
              <ul className="item_big item_big_index" style={{ marginBottom: "0px" }}>
                <li className="nav-item active">
                  <a className="a-img" href="index.html" title="Trang chủ">
                    Trang chủ
                  </a>
                </li>
                <li className="nav-item">
                  <a className="a-img" href="gioi-thieu.html" title="Giới thiệu">
                    Giới thiệu
                  </a>
                </li>
                <li className="nav-item has-mega">
                  <a className="a-img caret-down" href="collections/all.html" title="Sản phẩm">
                    Sản phẩm
                  </a>
                  <i className="fa fa-caret-down"></i>
                  <div className="mega-content d-lg-block d-none">
                    <div className="nav-block nav-block-center">
                      <ul className="level0 row">
                        <li className="level1 parent item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="do-choi-me-be.html" title="Đồ Chơi - Mẹ & Bé">
                            <span>Đồ Chơi - Mẹ & Bé</span>
                          </a>
                          <ul className="level1">
                            <li className="level2">
                              <a href="ta-bim.html" title="Tã, Bỉm">
                                <span>Tã, Bỉm</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="dinh-duong-cho-be.html" title="Dinh dưỡng cho bé">
                                <span>Dinh dưỡng cho bé</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="thuc-pham-an-dam.html" title="Thực phẩm ăn dặm">
                                <span>Thực phẩm ăn dặm</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="dinh-duong-cho-me.html" title="Dinh dưỡng cho mẹ">
                                <span>Dinh dưỡng cho mẹ</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="do-dung-cho-be.html" title="Đồ dùng cho bé">
                                <span>Đồ dùng cho bé</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="level1 parent item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="dien-thoai-may-tinh-bang.html" title="Điện Thoại - Máy Tính Bảng">
                            <span>Điện Thoại - Máy Tính Bảng</span>
                          </a>
                          <ul className="level1">
                            <li className="level2">
                              <a href="dien-thoai-smartphone.html" title="Điện thoại Smartphone">
                                <span>Điện thoại Smartphone</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="may-tinh-bang.html" title="Máy tính bảng">
                                <span>Máy tính bảng</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="may-doc-sach.html" title="Máy đọc sách">
                                <span>Máy đọc sách</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="dien-thoai-pho-thong.html" title="Điện thoại phổ thông">
                                <span>Điện thoại phổ thông</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="dien-thoai-ban.html" title="Điện thoại bàn">
                                <span>Điện thoại bàn</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="level1 parent item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="lam-dep-suc-khoe.html" title="Làm Đẹp - Sức Khỏe">
                            <span>Làm Đẹp - Sức Khỏe</span>
                          </a>
                          <ul className="level1">
                            <li className="level2">
                              <a href="cham-soc-da-mat.html" title="Chăm sóc da mặt">
                                <span>Chăm sóc da mặt</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="trang-diem.html" title="Trang điểm">
                                <span>Trang điểm</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="cham-soc-ca-nhan.html" title="Chăm sóc cá nhân">
                                <span>Chăm sóc cá nhân</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="cham-soc-co-the.html" title="Chăm sóc cơ thể">
                                <span>Chăm sóc cơ thể</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="duoc-my-pham.html" title="Dược mỹ phẩm">
                                <span>Dược mỹ phẩm</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="level1 parent item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="dien-gia-dung.html" title="Điện Gia Dụng">
                            <span>Điện Gia Dụng</span>
                          </a>
                          <ul className="level1">
                            <li className="level2">
                              <a href="do-dung-nha-bep.html" title="Đồ dùng nhà bếp">
                                <span>Đồ dùng nhà bếp</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="thiet-bi-gia-dinh.html" title="Thiết bị gia đình">
                                <span>Thiết bị gia đình</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="level1 parent item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="phu-kien-thoi-trang.html" title="Phụ kiện thời trang">
                            <span>Phụ kiện thời trang</span>
                          </a>
                          <ul className="level1">
                            <li className="level2">
                              <a href="mat-kinh.html" title="Mắt kính">
                                <span>Mắt kính</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="phu-kien-thoi-trang-nu.html" title="Phụ kiện thời trang nữ">
                                <span>Phụ kiện thời trang nữ</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="phu-kien-thoi-trang-nam.html" title="Phụ kiện thời trang nam">
                                <span>Phụ kiện thời trang nam</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="level1 parent item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="dong-ho-va-trang-suc.html" title="Đồng hồ và Trang sức">
                            <span>Đồng hồ và Trang sức</span>
                          </a>
                          <ul className="level1">
                            <li className="level2">
                              <a href="dong-ho-nam.html" title="Đồng hồ nam">
                                <span>Đồng hồ nam</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="dong-ho-nu.html" title="Đồng hồ nữ">
                                <span>Đồng hồ nữ</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="dong-ho-tre-em.html" title="Đồng hồ trẻ em">
                                <span>Đồng hồ trẻ em</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="phu-kien-dong-ho.html" title="Phụ kiện đồng hồ">
                                <span>Phụ kiện đồng hồ</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="trang-suc.html" title="Trang sức">
                                <span>Trang sức</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="level1 parent item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="laptop-may-vi-tinh-linh-kien.html" title="Laptop - Máy Vi Tính - Linh kiện">
                            <span>Laptop - Máy Vi Tính - Linh kiện</span>
                          </a>
                          <ul className="level1">
                            <li className="level2">
                              <a href="laptop.html" title="Laptop">
                                <span>Laptop</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="thiet-bi-van-phong-thiet-bi-ngoai-vi.html" title="Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi">
                                <span>Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="thiet-bi-luu-tru.html" title="Thiết Bị Lưu Trữ">
                                <span>Thiết Bị Lưu Trữ</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="thiet-bi-mang.html" title="Thiết Bị Mạng">
                                <span>Thiết Bị Mạng</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="pc-may-tinh-bo.html" title="PC - Máy Tính Bộ">
                                <span>PC - Máy Tính Bộ</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="linh-kien-may-tinh-phu-kien-may-tinh.html" title="Linh Kiện Máy Tính - Phụ Kiện Máy Tính">
                                <span>Linh Kiện Máy Tính - Phụ Kiện Máy Tính</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="level1 parent item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="nha-cua-doi-song.html" title="Nhà cửa & Đời sống">
                            <span>Nhà cửa & Đời sống</span>
                          </a>
                          <ul className="level1">
                            <li className="level2">
                              <a href="dung-cu-nha-bep.html" title="Dụng cụ nhà bếp">
                                <span>Dụng cụ nhà bếp</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="do-dung-phong-an.html" title="Đồ dùng phòng ăn">
                                <span>Đồ dùng phòng ăn</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="do-dung-phong-ngu.html" title="Đồ dùng phòng ngủ">
                                <span>Đồ dùng phòng ngủ</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="noi-that.html" title="Nội thất">
                                <span>Nội thất</span>
                              </a>
                            </li>
                            <li className="level2">
                              <a href="trang-tri-nha-cua.html" title="Trang trí nhà cửa">
                                <span>Trang trí nhà cửa</span>
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="level1 item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="bach-hoa-online.html" title="Bách Hóa Online">
                            <span>Bách Hóa Online</span>
                          </a>
                        </li>
                        <li className="level1 item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="thiet-bi-so-phu-kien-so.html" title="Thiết Bị Số - Phụ Kiện Số">
                            <span>Thiết Bị Số - Phụ Kiện Số</span>
                          </a>
                        </li>
                        <li className="level1 item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="dien-tu-dien-lanh-tv.html" title="Điện Tử - Điện Lạnh - TV">
                            <span>Điện Tử - Điện Lạnh - TV</span>
                          </a>
                        </li>
                        <li className="level1 item col-lg-3 col-md-3 col-sm-3">
                          <a className="h-mega" href="the-thao-da-ngoai.html" title="Thể Thao - Dã Ngoại">
                            <span>Thể Thao - Dã Ngoại</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <ul className="item_small d-lg-none">
                    <li>
                      <a className="caret-down" href="do-choi-me-be.html" title="Đồ Chơi - Mẹ & Bé">
                        Đồ Chơi - Mẹ & Bé
                      </a>
                      <i className="fa fa-caret-down"></i>
                      <ul>
                        <li>
                          <a href="ta-bim.html" title="Tã, Bỉm" className="a3">
                            Tã, Bỉm
                          </a>
                        </li>
                        <li>
                          <a href="dinh-duong-cho-be.html" title="Dinh dưỡng cho bé" className="a3">
                            Dinh dưỡng cho bé
                          </a>
                        </li>
                        <li>
                          <a href="thuc-pham-an-dam.html" title="Thực phẩm ăn dặm" className="a3">
                            Thực phẩm ăn dặm
                          </a>
                        </li>
                        <li>
                          <a href="dinh-duong-cho-me.html" title="Dinh dưỡng cho mẹ" className="a3">
                            Dinh dưỡng cho mẹ
                          </a>
                        </li>
                        <li>
                          <a href="do-dung-cho-be.html" title="Đồ dùng cho bé" className="a3">
                            Đồ dùng cho bé
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a className="caret-down" href="dien-thoai-may-tinh-bang.html" title="Điện Thoại - Máy Tính Bảng">
                        Điện Thoại - Máy Tính Bảng
                      </a>
                      <i className="fa fa-caret-down"></i>
                      <ul>
                        <li>
                          <a href="dien-thoai-smartphone.html" title="Điện thoại Smartphone" className="a3">
                            Điện thoại Smartphone
                          </a>
                        </li>
                        <li>
                          <a href="may-tinh-bang.html" title="Máy tính bảng" className="a3">
                            Máy tính bảng
                          </a>
                        </li>
                        <li>
                          <a href="may-doc-sach.html" title="Máy đọc sách" className="a3">
                            Máy đọc sách
                          </a>
                        </li>
                        <li>
                          <a href="dien-thoai-pho-thong.html" title="Điện thoại phổ thông" className="a3">
                            Điện thoại phổ thông
                          </a>
                        </li>
                        <li>
                          <a href="dien-thoai-ban.html" title="Điện thoại bàn" className="a3">
                            Điện thoại bàn
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a className="caret-down" href="lam-dep-suc-khoe.html" title="Làm Đẹp - Sức Khỏe">
                        Làm Đẹp - Sức Khỏe
                      </a>
                      <i className="fa fa-caret-down"></i>
                      <ul>
                        <li>
                          <a href="cham-soc-da-mat.html" title="Chăm sóc da mặt" className="a3">
                            Chăm sóc da mặt
                          </a>
                        </li>
                        <li>
                          <a href="trang-diem.html" title="Trang điểm" className="a3">
                            Trang điểm
                          </a>
                        </li>
                        <li>
                          <a href="cham-soc-ca-nhan.html" title="Chăm sóc cá nhân" className="a3">
                            Chăm sóc cá nhân
                          </a>
                        </li>
                        <li>
                          <a href="cham-soc-co-the.html" title="Chăm sóc cơ thể" className="a3">
                            Chăm sóc cơ thể
                          </a>
                        </li>
                        <li>
                          <a href="duoc-my-pham.html" title="Dược mỹ phẩm" className="a3">
                            Dược mỹ phẩm
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a className="caret-down" href="dien-gia-dung.html" title="Điện Gia Dụng">
                        Điện Gia Dụng
                      </a>
                      <i className="fa fa-caret-down"></i>
                      <ul>
                        <li>
                          <a href="do-dung-nha-bep.html" title="Đồ dùng nhà bếp" className="a3">
                            Đồ dùng nhà bếp
                          </a>
                        </li>
                        <li>
                          <a href="thiet-bi-gia-dinh.html" title="Thiết bị gia đình" className="a3">
                            Thiết bị gia đình
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a className="caret-down" href="phu-kien-thoi-trang.html" title="Phụ kiện thời trang">
                        Phụ kiện thời trang
                      </a>
                      <i className="fa fa-caret-down"></i>
                      <ul>
                        <li>
                          <a href="mat-kinh.html" title="Mắt kính" className="a3">
                            Mắt kính
                          </a>
                        </li>
                        <li>
                          <a href="phu-kien-thoi-trang-nu.html" title="Phụ kiện thời trang nữ" className="a3">
                            Phụ kiện thời trang nữ
                          </a>
                        </li>
                        <li>
                          <a href="phu-kien-thoi-trang-nam.html" title="Phụ kiện thời trang nam" className="a3">
                            Phụ kiện thời trang nam
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a className="caret-down" href="dong-ho-va-trang-suc.html" title="Đồng hồ và Trang sức">
                        Đồng hồ và Trang sức
                      </a>
                      <i className="fa fa-caret-down"></i>
                      <ul>
                        <li>
                          <a href="dong-ho-nam.html" title="Đồng hồ nam" className="a3">
                            Đồng hồ nam
                          </a>
                        </li>
                        <li>
                          <a href="dong-ho-nu.html" title="Đồng hồ nữ" className="a3">
                            Đồng hồ nữ
                          </a>
                        </li>
                        <li>
                          <a href="dong-ho-tre-em.html" title="Đồng hồ trẻ em" className="a3">
                            Đồng hồ trẻ em
                          </a>
                        </li>
                        <li>
                          <a href="phu-kien-dong-ho.html" title="Phụ kiện đồng hồ" className="a3">
                            Phụ kiện đồng hồ
                          </a>
                        </li>
                        <li>
                          <a href="trang-suc.html" title="Trang sức" className="a3">
                            Trang sức
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a className="caret-down" href="laptop-may-vi-tinh-linh-kien.html" title="Laptop - Máy Vi Tính - Linh kiện">
                        Laptop - Máy Vi Tính - Linh kiện
                      </a>
                      <i className="fa fa-caret-down"></i>
                      <ul>
                        <li>
                          <a href="laptop.html" title="Laptop" className="a3">
                            Laptop
                          </a>
                        </li>
                        <li>
                          <a href="thiet-bi-van-phong-thiet-bi-ngoai-vi.html" title="Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi" className="a3">
                            Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi
                          </a>
                        </li>
                        <li>
                          <a href="thiet-bi-luu-tru.html" title="Thiết Bị Lưu Trữ" className="a3">
                            Thiết Bị Lưu Trữ
                          </a>
                        </li>
                        <li>
                          <a href="thiet-bi-mang.html" title="Thiết Bị Mạng" className="a3">
                            Thiết Bị Mạng
                          </a>
                        </li>
                        <li>
                          <a href="pc-may-tinh-bo.html" title="PC - Máy Tính Bộ" className="a3">
                            PC - Máy Tính Bộ
                          </a>
                        </li>
                        <li>
                          <a href="linh-kien-may-tinh-phu-kien-may-tinh.html" title="Linh Kiện Máy Tính - Phụ Kiện Máy Tính" className="a3">
                            Linh Kiện Máy Tính - Phụ Kiện Máy Tính
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a className="caret-down" href="nha-cua-doi-song.html" title="Nhà cửa & Đời sống">
                        Nhà cửa & Đời sống
                      </a>
                      <i className="fa fa-caret-down"></i>
                      <ul>
                        <li>
                          <a href="dung-cu-nha-bep.html" title="Dụng cụ nhà bếp" className="a3">
                            Dụng cụ nhà bếp
                          </a>
                        </li>
                        <li>
                          <a href="do-dung-phong-an.html" title="Đồ dùng phòng ăn" className="a3">
                            Đồ dùng phòng ăn
                          </a>
                        </li>
                        <li>
                          <a href="do-dung-phong-ngu.html" title="Đồ dùng phòng ngủ" className="a3">
                            Đồ dùng phòng ngủ
                          </a>
                        </li>
                        <li>
                          <a href="noi-that.html" title="Nội thất" className="a3">
                            Nội thất
                          </a>
                        </li>
                        <li>
                          <a href="trang-tri-nha-cua.html" title="Trang trí nhà cửa" className="a3">
                            Trang trí nhà cửa
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="level1 item col-lg-3 col-md-3 col-sm-3">
                      <a className="h-mega" href="bach-hoa-online.html" title="Bách Hóa Online">
                        Bách Hóa Online
                      </a>
                    </li>
                    <li className="level1 item col-lg-3 col-md-3 col-sm-3">
                      <a className="h-mega" href="thiet-bi-so-phu-kien-so.html" title="Thiết Bị Số - Phụ Kiện Số">
                        Thiết Bị Số - Phụ Kiện Số
                      </a>
                    </li>
                    <li className="level1 item col-lg-3 col-md-3 col-sm-3">
                      <a className="h-mega" href="dien-tu-dien-lanh-tv.html" title="Điện Tử - Điện Lạnh - TV">
                        Điện Tử - Điện Lạnh - TV
                      </a>
                    </li>
                    <li className="level1 item col-lg-3 col-md-3 col-sm-3">
                      <a className="h-mega" href="the-thao-da-ngoai.html" title="Thể Thao - Dã Ngoại">
                        Thể Thao - Dã Ngoại
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="a-img" href="yeu-thich.html" title="Yêu thích">
                    Yêu thích
                  </a>
                </li>
                <li className="nav-item">
                  <a className="a-img" href="lien-he.html" title="Liên hệ">
                    Liên hệ
                  </a>
                </li>
                <li className="nav-item">
                  <a className="a-img" href="tin-tuc.html" title="Tin tức">
                    Tin tức
                  </a>
                </li>
                <li className="nav-item">
                  <a className="a-img" href="he-thong-cua-hang.html" title="Hệ thống cửa hàng">
                    Hệ thống cửa hàng
                  </a>
                </li>
                <li className="nav-item">
                  <a className="a-img" href="apps/affiliate-v2.html" title="Đăng ký Affiliate">
                    Đăng ký Affiliate
                  </a>
                </li>
              </ul>
            </nav>
            <div className="control-menu">
              <a href="#" id="prev">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path
                    fill="#fff"
                    d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                  />
                </svg>
              </a>
              <a href="#" id="next">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path
                    fill="#fff"
                    d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;