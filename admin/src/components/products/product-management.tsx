"use client"

import { useEffect, useState } from "react"
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
import { getProducts, type ProductListResponse } from "@/lib/api/products"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductManagement() {
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [productData, setProductData] = useState<ProductListResponse>({
    products: [],
    categories: [],
    brands: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0
  })
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const data = await getProducts(pageNumber, pageSize)
        setProductData(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [pageNumber, pageSize])

  const toggleSelectAll = () => {
    if (selectedProducts.length === productData.products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(productData.products.map((product) => product.id))
    }
  }

  const toggleSelectProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-500"
      case "Out of Stock":
        return "bg-red-500"
      case "Discontinued":
        return "bg-gray-500"
      default:
        return "bg-blue-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const handlePageChange = (page: number) => {
    setPageNumber(page)
  }

  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size))
    setPageNumber(1) // Reset to first page when changing page size
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
        <Button className="flex items-center gap-2" asChild>
          <Link href="/dashboard/products/add">
          <PackagePlus className="h-4 w-4" />
          Thêm sản phẩm
          </Link>
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
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
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
                        checked={selectedProducts.length === productData.products.length && productData.products.length > 0}
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
                  {loading ? (
                    // Skeleton loader khi đang tải dữ liệu
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : productData.products.length === 0 ? (
                    // Hiển thị khi không có sản phẩm
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                        Không có sản phẩm nào. Hãy thêm sản phẩm mới.
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Hiển thị danh sách sản phẩm
                    productData.products.map((product) => (
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
                              src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{product.name}</span>
                              <span className="text-xs text-muted-foreground">{product.sku}</span>
                          </div>
                        </div>
                      </TableCell>
                        <TableCell>{product.categoryName}</TableCell>
                        <TableCell>{product.brandName}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
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
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/products/${product.id}?edit=true`}>Chỉnh sửa</Link>
                              </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Xóa sản phẩm</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {productData.totalCount > 0 && (
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {(pageNumber - 1) * pageSize + 1}-
                  {Math.min(pageNumber * pageSize, productData.totalCount)} của {productData.totalCount} sản phẩm
                </div>
              <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={pageNumber <= 1}
                    onClick={() => handlePageChange(pageNumber - 1)}
                  >
                  Trước
                </Button>
                  {Array.from({ length: Math.min(5, productData.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button 
                        key={page}
                        variant="outline" 
                        size="sm"
                        className={pageNumber === page ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                </Button>
                    );
                  })}
                  {productData.totalPages > 5 && <span>...</span>}
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={pageNumber >= productData.totalPages}
                    onClick={() => handlePageChange(pageNumber + 1)}
                  >
                  Sau
                </Button>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
