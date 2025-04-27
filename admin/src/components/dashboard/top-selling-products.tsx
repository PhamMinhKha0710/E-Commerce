"use client"

import Image from "next/image"
import { Progress } from "@/components/ui/progress"

const products = [
  {
    name: "Điện thoại Samsung Galaxy S23",
    image: "/placeholder.svg?height=40&width=40",
    sales: 245,
    revenue: "₫4,900,000,000",
    progress: 100,
  },
  {
    name: "Laptop Dell XPS 13",
    image: "/placeholder.svg?height=40&width=40",
    sales: 189,
    revenue: "₫4,725,000,000",
    progress: 77,
  },
  {
    name: "Tai nghe Apple AirPods Pro",
    image: "/placeholder.svg?height=40&width=40",
    sales: 156,
    revenue: "₫1,248,000,000",
    progress: 64,
  },
  {
    name: "iPad Pro 12.9 inch",
    image: "/placeholder.svg?height=40&width=40",
    sales: 124,
    revenue: "₫3,720,000,000",
    progress: 51,
  },
  {
    name: "Đồng hồ thông minh Apple Watch Series 8",
    image: "/placeholder.svg?height=40&width=40",
    sales: 98,
    revenue: "₫1,176,000,000",
    progress: 40,
  },
]

export function TopSellingProducts() {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.name} className="flex items-center">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={40}
            height={40}
            className="rounded-md mr-4"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{product.name}</p>
            <div className="flex items-center justify-between mt-1">
              <div className="flex-1 mr-4">
                <Progress value={product.progress} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">{product.sales} sản phẩm</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
