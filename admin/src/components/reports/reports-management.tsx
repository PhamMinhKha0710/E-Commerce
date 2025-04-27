"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  ChevronDown,
  Download,
  FileText,
  Filter,
  LineChart,
  MoreHorizontal,
  Printer,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const reports = [
  {
    id: "RPT-1001",
    name: "Báo cáo doanh thu tháng 4/2023",
    type: "Doanh thu",
    createdBy: "Nguyễn Văn A",
    createdAt: "15/04/2023",
    format: "Excel",
  },
  {
    id: "RPT-1002",
    name: "Báo cáo đơn hàng Q1/2023",
    type: "Đơn hàng",
    createdBy: "Trần Thị B",
    createdAt: "10/04/2023",
    format: "PDF",
  },
  {
    id: "RPT-1003",
    name: "Báo cáo sản phẩm bán chạy tháng 3/2023",
    type: "Sản phẩm",
    createdBy: "Lê Văn C",
    createdAt: "05/04/2023",
    format: "Excel",
  },
  {
    id: "RPT-1004",
    name: "Báo cáo người dùng mới Q1/2023",
    type: "Người dùng",
    createdBy: "Phạm Thị D",
    createdAt: "01/04/2023",
    format: "PDF",
  },
  {
    id: "RPT-1005",
    name: "Báo cáo tồn kho tháng 3/2023",
    type: "Tồn kho",
    createdBy: "Hoàng Văn E",
    createdAt: "28/03/2023",
    format: "Excel",
  },
  {
    id: "RPT-1006",
    name: "Báo cáo khuyến mãi Q1/2023",
    type: "Khuyến mãi",
    createdBy: "Ngô Thị F",
    createdAt: "25/03/2023",
    format: "PDF",
  },
  {
    id: "RPT-1007",
    name: "Báo cáo đánh giá sản phẩm Q1/2023",
    type: "Đánh giá",
    createdBy: "Vũ Văn G",
    createdAt: "20/03/2023",
    format: "Excel",
  },
  {
    id: "RPT-1008",
    name: "Báo cáo hiệu suất bán hàng tháng 3/2023",
    type: "Hiệu suất",
    createdBy: "Đặng Thị H",
    createdAt: "15/03/2023",
    format: "PDF",
  },
]

export function ReportsManagement() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Báo cáo & Thống kê</h2>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tạo báo cáo mới
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả báo cáo</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Danh sách báo cáo</CardTitle>
              <CardDescription>Quản lý tất cả báo cáo trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="search" placeholder="Tìm kiếm báo cáo..." className="pl-8 w-full" />
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
                        <DropdownMenuItem>Loại báo cáo</DropdownMenuItem>
                        <DropdownMenuItem>Định dạng</DropdownMenuItem>
                        <DropdownMenuItem>Người tạo</DropdownMenuItem>
                        <DropdownMenuItem>Ngày tạo</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" className="gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
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
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên báo cáo</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Người tạo</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Định dạng</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{report.name}</span>
                              <span className="text-xs text-muted-foreground">{report.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.createdBy}</TableCell>
                          <TableCell>{report.createdAt}</TableCell>
                          <TableCell>{report.format}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Tải xuống</span>
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Printer className="h-4 w-4" />
                                <span className="sr-only">In</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Mở menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/reports/${report.id}`}>Xem chi tiết</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/reports/${report.id}`}>Chỉnh sửa</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Chia sẻ</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">Xóa báo cáo</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Hiển thị 1-8 của 32 báo cáo</div>
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
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo doanh thu</CardTitle>
              <CardDescription>Xem và tạo báo cáo doanh thu theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Chọn thời gian để xem báo cáo doanh thu chi tiết</p>
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Chọn khoảng thời gian
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo đơn hàng</CardTitle>
              <CardDescription>Xem và tạo báo cáo đơn hàng theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Chọn thời gian để xem báo cáo đơn hàng chi tiết</p>
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Chọn khoảng thời gian
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo sản phẩm</CardTitle>
              <CardDescription>Xem và tạo báo cáo sản phẩm theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Chọn thời gian để xem báo cáo sản phẩm chi tiết</p>
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Chọn khoảng thời gian
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo người dùng</CardTitle>
              <CardDescription>Xem và tạo báo cáo người dùng theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Chọn thời gian để xem báo cáo người dùng chi tiết</p>
                <Button className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Chọn khoảng thời gian
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
