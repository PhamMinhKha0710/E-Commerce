"use client"

import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import type { TopSellingProduct } from "@/lib/api/dashboard"

interface TopSellingProductsProps {
  products: TopSellingProduct[]
}

export function TopSellingProducts({ products }: TopSellingProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }
  if (products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Không có sản phẩm nào
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.productId} className="flex items-center">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.productName}
            width={40}
            height={40}
            className="rounded-md mr-4 object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{product.productName}</p>
            <div className="flex items-center justify-between mt-1">
              <div className="flex-1 mr-4">
                <Progress value={product.progressPercent} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">{product.salesCount} sản phẩm</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(product.revenue)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
