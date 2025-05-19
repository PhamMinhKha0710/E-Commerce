"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Brand } from "@/lib/api/brands";

// Define the props interface for BrandManagement
interface BrandManagementProps {
  initialBrands: Brand[];
}

// Dynamic import of the BrandManagement component
const BrandManagement = dynamic(
  () =>
    import("@/components/brands/brand-management").then(
      (mod) => mod.BrandManagement as ComponentType<BrandManagementProps>
    ),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-[500px]">Đang tải...</div>,
  }
);

export default function ClientBrandManagement({ initialBrands }: BrandManagementProps) {
  return <BrandManagement initialBrands={initialBrands} />;
} 