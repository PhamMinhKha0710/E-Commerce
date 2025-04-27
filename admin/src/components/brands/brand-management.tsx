"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Download, Filter, MoreHorizontal, PlusCircle, Search, Trash } from "lucide-react"

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

const brands = [
  {
    id: "BRD-1001",
    name: "Samsung",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Tập đoàn điện tử đa quốc gia của Hàn Quốc",
    productCount: 145,
    status: "Hiển thị",
  },
  {
    id: "BRD-1002",
    name: "Apple",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Công ty công nghệ đa quốc gia của Mỹ",
    productCount: 98,
    status: "Hiển thị",
  },
  {
    id: "BRD-1003",
    name: "Dell",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Công ty máy tính đa quốc gia của Mỹ",
    productCount: 67,
    status: "Hiển thị",
  },
  {
    id: "BRD-1004",
    name: "Sony",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Tập đoàn đa quốc gia của Nhật Bản",
    productCount: 89,
    status: "Hiển thị",
  },
  {
    id: "BRD-1005",
    name: "LG",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Tập đoàn điện tử đa quốc gia của Hàn Quốc",
    productCount: 76,
    status: "Hiển thị",
  },
  {
    id: "BRD-1006",
    name: "Xiaomi",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Công ty điện tử của Trung Quốc",
    productCount: 112,
    status: "Hiển thị",
  },
  {
    id: "BRD-1007",
    name: "Asus",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Công ty máy tính và điện tử của Đài Loan",
    productCount: 54,
    status: "Ẩn",
  },
  {
    id: "BRD-1008",
    name: "Lenovo",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Công ty máy tính đa quốc gia của Trung Quốc",
    productCount: 43,
    status: "Hiển thị",
  },
]

export function BrandManagement() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedBrands.length === brands.length) {
      setSelectedBrands([])
    } else {
      setSelectedBrands(brands.map((brand) => brand.id))
    }
  }

  const toggleSelectBrand = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId))
    } else {
      setSelectedBrands([...selectedBrands, brandId])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hiển thị":
        return "bg-green-500"
      case "Ẩn":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý thương hiệu</h2>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Thêm thương hiệu
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách thương hiệu</CardTitle>
          <CardDescription>Quản lý tất cả thương hiệu trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Tìm kiếm thương hiệu..." className="pl-8 w-full" />
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
                    <DropdownMenuItem>Trạng thái</DropdownMenuItem>
                    <DropdownMenuItem>Số lượng sản phẩm</DropdownMenuItem>
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
            {selectedBrands.length > 0 && (
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                <span className="text-sm">{selectedBrands.length} thương hiệu đã chọn</span>
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
                      <Checkbox checked={selectedBrands.length === brands.length} onCheckedChange={toggleSelectAll} />
                    </TableHead>
                    <TableHead>Thương hiệu</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Số sản phẩm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={() => toggleSelectBrand(brand.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={brand.logo || "/placeholder.svg"}
                            alt={brand.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{brand.name}</span>
                            <span className="text-xs text-muted-foreground">{brand.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{brand.description}</TableCell>
                      <TableCell>{brand.productCount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(brand.status)} text-white border-none`}>
                          {brand.status}
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
                              <Link href={`/dashboard/brands/${brand.id}`}>Xem chi tiết</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/brands/${brand.id}`}>Chỉnh sửa</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {brand.status === "Hiển thị" ? (
                              <DropdownMenuItem>Ẩn thương hiệu</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>Hiển thị thương hiệu</DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">Xóa thương hiệu</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Hiển thị 1-8 của 24 thương hiệu</div>
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
