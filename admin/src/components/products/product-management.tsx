"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, Download, Filter, MoreHorizontal, PackagePlus, Search, Trash } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const products = [
  {
    id: "PRD-1001",
    name: "Điện thoại Samsung Galaxy S23",
    category: "Điện thoại",
    brand: "Samsung",
    price: "₫23,990,000",
    stock: 45,
    status: "Đang bán", //if stock > 0 then status = "Đang bán", else status = "Hết hàng"
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "PRD-1002",
    name: "Laptop Dell XPS 13",
    category: "Laptop",
    brand: "Dell",
    price: "₫32,990,000",
    stock: 12,
    status: "Đang bán",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "PRD-1003",
    name: "Tai nghe Apple AirPods Pro",
    category: "Phụ kiện",
    brand: "Apple",
    price: "₫5,990,000",
    stock: 78,
    status: "Đang bán",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "PRD-1004",
    name: "iPad Pro 12.9 inch",
    category: "Máy tính bảng",
    brand: "Apple",
    price: "₫28,990,000",
    stock: 23,
    status: "Đang bán",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "PRD-1005",
    name: "Đồng hồ thông minh Apple Watch Series 8",
    category: "Đồng hồ thông minh",
    brand: "Apple",
    price: "₫10,990,000",
    stock: 34,
    status: "Đang bán",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "PRD-1006",
    name: "Máy ảnh Sony Alpha A7 IV",
    category: "Máy ảnh",
    brand: "Sony",
    price: "₫54,990,000",
    stock: 8,
    status: "Đang bán",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "PRD-1007",
    name: "Loa Bluetooth JBL Charge 5",
    category: "Âm thanh",
    brand: "JBL",
    price: "₫3,490,000",
    stock: 0,
    status: "Hết hàng",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "PRD-1008",
    name: "Màn hình LG UltraGear 27GP950",
    category: "Màn hình",
    brand: "LG",
    price: "₫18,990,000",
    stock: 5,
    status: "Đang bán",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export function ProductManagement() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map((product) => product.id))
    }
  }

  const toggleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang bán":
        return "bg-green-500"
      case "Hết hàng":
        return "bg-red-500"
      case "Ngừng kinh doanh":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
        <Button className="flex items-center gap-2">
          <PackagePlus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>Quản lý tất cả sản phẩm trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm sản phẩm..." className="pl-8 w-full" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Lọc
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Lọc theo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Danh mục</DropdownMenuItem>
                    <DropdownMenuItem>Thương hiệu</DropdownMenuItem>
                    <DropdownMenuItem>Trạng thái</DropdownMenuItem>
                    <DropdownMenuItem>Giá</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Xuất
                </Button>
                <Select defaultValue="10">
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                <span className="text-sm">{selectedProducts.length} sản phẩm đã chọn</span>
                <Button variant="outline" size="sm" className="gap-1 ml-auto">
                  <Trash className="h-3 w-3" />
                  Xóa
                </Button>
              </div>
            )}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedProducts.length === products.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Thương hiệu</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Tồn kho</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleSelectProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{product.name}</span>
                            <span className="text-xs text-muted-foreground">{product.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(product.status)} text-white border-none`}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/products/${product.id}`}>Xem chi tiết</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Xóa sản phẩm</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Hiển thị 1-8 của 256 sản phẩm</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
