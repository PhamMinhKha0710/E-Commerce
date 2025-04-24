"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Subcategory {
  id: number; // ID duy nhất cho danh mục con
  title: string;
}

interface CategoryMenuItemProps {
  id: number; 
  title: string; 
}

const fetchSubcategories = async (categoryId: number): Promise<Subcategory[]> => {
  try {
    const response = await fetch(`http://localhost:5130/api/categories/${categoryId}/subcategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

const CategoryMenuItem = ({ id, title }: CategoryMenuItemProps) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);

  // Tạo href động cho danh mục chính
  const href = `/danh-cho-ban/${id}`;

  useEffect(() => {
    if (!isHovered || subcategories.length > 0) return;

    const loadSubcategories = async () => {
      setLoadingSub(true);
      const data = await fetchSubcategories(id);
      setSubcategories(data);
      setLoadingSub(false);
    };

    loadSubcategories();
  }, [isHovered, id, subcategories.length]);

  const hasSubcategories = subcategories.length > 0;

  return (
    <li
      className={`dropdown menu-item-count ${hasSubcategories ? "has-submenu" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link className="nd-categories-a" href={href} title={title}>
        {title}
        {hasSubcategories && (
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fal"
            data-icon="chevron-right"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            className="svg-inline--fa fa-chevron-right fa-w-8"
          >
            <path
              fill="currentColor"
              d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"
            />
          </svg>
        )}
      </Link>
      {isHovered && hasSubcategories && (
        <div className="subcate gd-menu" style={{ zIndex: 1000 }}>
          <div className="nd-cate-list">
            {loadingSub ? (
              <aside>Loading subcategories...</aside>
            ) : (
              subcategories.map((sub) => {
                // Tạo href động cho danh mục con
                const subHref = `/danh-cho-ban/${id}/sub/${sub.id}`;
                return (
                  <aside key={sub.id}>
                    <Link className="nd-categories-main-sub" href={subHref} title={sub.title}>
                      {sub.title}
                    </Link>
                  </aside>
                );
              })
            )}
          </div>
        </div>
      )}
    </li>
  );
};

export default CategoryMenuItem;