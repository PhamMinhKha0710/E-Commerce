"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronDown, Download, Filter, MoreHorizontal, PlusCircle, Search, Trash, Edit } from "lucide-react"
import { toast } from "sonner"

import { Brand, deleteBrand } from "@/lib/api/brands"
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface BrandManagementProps {
  initialBrands: Brand[];
}

export function BrandManagement({ initialBrands }: BrandManagementProps) {
  const router = useRouter()
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const handleDeleteBrand = async (id: number) => {
    try {
      await deleteBrand(id)
      toast.success("Xóa thương hiệu thành công")
      setBrands(brands.filter(brand => brand.id !== id))
    } catch (error) {
      toast.error("Không thể xóa thương hiệu")
      console.error("Error deleting brand:", error)
    }
  }

  const toggleSelectAll = () => {
    if (selectedBrands.length === paginatedBrands.length) {
      setSelectedBrands([])
    } else {
      setSelectedBrands(paginatedBrands.map((brand) => brand.id))
    }
  }

  const toggleSelectBrand = (brandId: number) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId))
    } else {
      setSelectedBrands([...selectedBrands, brandId])
    }
  }

  const getStatusColor = (productCount: number) => {
    return productCount > 0 ? "bg-green-500" : "bg-gray-500"
  }
  
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage)
  
  // Lấy danh sách thương hiệu cho trang hiện tại
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Xử lý khi thay đổi số lượng hiển thị
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset về trang 1 khi thay đổi số lượng hiển thị
  }
  
  // Điều hướng giữa các trang
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }
  
  // Tạo các nút phân trang
  const renderPaginationButtons = () => {
    const buttons = []
    
    // Nút Prev
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => goToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Trước
      </Button>
    )
    
    // Hiển thị số trang
    // Logic: Hiển thị 5 nút trang, ưu tiên trang hiện tại ở giữa
    const maxVisibleButtons = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2))
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1)
    
    // Điều chỉnh lại startPage nếu không đủ nút ở cuối
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1)
    }
    
    // Thêm nút trang đầu và dấu chấm lửng nếu cần
    if (startPage > 1) {
      buttons.push(
        <Button
          key="1"
          variant={1 === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(1)}
        >
          1
        </Button>
      )
      if (startPage > 2) {
        buttons.push(
          <Button key="ellipsis1" variant="outline" size="sm" disabled>
            ...
          </Button>
        )
      }
    }
    
    // Thêm các nút số trang
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>
      )
    }
    
    // Thêm nút trang cuối và dấu chấm lửng nếu cần
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <Button key="ellipsis2" variant="outline" size="sm" disabled>
            ...
          </Button>
        )
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={totalPages === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => goToPage(totalPages)}
        >
          {totalPages}
        </Button>
      )
    }
    
    // Nút Next
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Sau
      </Button>
    )
    
    return buttons
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý thương hiệu</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => router.push("/dashboard/brands/new")}
        >
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
                  <Input 
                    type="search" 
                    placeholder="Tìm kiếm thương hiệu..." 
                    className="pl-8 w-full" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
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
                    <DropdownMenuItem>Số lượng sản phẩm</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Select onValueChange={handleItemsPerPageChange} defaultValue="10">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Hiển thị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 mục</SelectItem>
                    <SelectItem value="20">20 mục</SelectItem>
                    <SelectItem value="50">50 mục</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                        <Checkbox 
                          checked={paginatedBrands.length > 0 && selectedBrands.length === paginatedBrands.length} 
                          onCheckedChange={toggleSelectAll} 
                        />
                    </TableHead>
                    <TableHead>Thương hiệu</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Số sản phẩm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedBrands.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          Không tìm thấy thương hiệu nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedBrands.map((brand) => (
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
                                src={brand.imageUrl || "/placeholder.svg"}
                            alt={brand.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{brand.name}</span>
                                <span className="text-xs text-muted-foreground">ID: {brand.id}</span>
                          </div>
                        </div>
                      </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {brand.description || `${brand.name} - Thương hiệu`}
                          </TableCell>
                      <TableCell>{brand.productCount}</TableCell>
                      <TableCell>
                            <Badge className={`${getStatusColor(brand.productCount)} text-white`}>
                              {brand.productCount > 0 ? "Hiển thị" : "Ẩn"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => router.push(`/dashboard/brands/${brand.id}`)}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4" />
                                  Chỉnh sửa
                            </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                                    >
                                      <Trash className="h-4 w-4" />
                                      Xóa
                            </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Xác nhận xóa thương hiệu</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bạn có chắc chắn muốn xóa thương hiệu này? Hành động này không thể hoàn tác.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteBrand(brand.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Xóa
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                      ))
                    )}
                </TableBody>
              </Table>
            </div>
            
            {/* Phân trang */}
            {filteredBrands.length > 0 && (
              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {paginatedBrands.length} / {filteredBrands.length} thương hiệu
                </div>
                <div className="flex gap-1">
                  {renderPaginationButtons()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
