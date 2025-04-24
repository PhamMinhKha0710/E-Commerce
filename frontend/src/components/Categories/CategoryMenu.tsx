"use client";

import { useState, useEffect } from "react";
import CategoryMenuItem from "@/components/Categories/CategoryMenuItem";

interface CategoryMenuItemProps {
  id: number;
  title: string;
}

const fetchCategories = async (): Promise<CategoryMenuItemProps[]> => {
  try {
    const response = await fetch("http://localhost:5130/api/Categories/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    const data = await response.json();
    console.log("Categories fetched from /api/Categories/parent:", data); // Debug dữ liệu
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const CategoryMenu = () => {
  const [categories, setCategories] = useState<CategoryMenuItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      if (mounted) {
        console.log("Setting categories:", data); // Debug trước khi set
        if (data.length === 0) {
          setError("Không có danh mục nào (API có thể chưa trả về dữ liệu)");
        } else {
          setCategories(data);
        }
        setLoading(false);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="color-bg">
        <div className="menu_mega">
          <div className="title_menu">Đang tải danh mục...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="color-bg">
        <div className="menu_mega">
          <div className="title_menu">{error}</div>
        </div>
      </div>
    );
  }

  console.log("Rendering CategoryMenu with categories:", categories); // Debug render

  return (
    <div className="color-bg">
      <div className="menu_mega">
        <div className="title_menu">
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
            {categories.length === 0 ? (
              <li>Không có danh mục nào</li>
            ) : (
              categories.map((category) => (
                <CategoryMenuItem
                  key={category.id}
                  id={category.id}
                  title={category.title}
                />
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;