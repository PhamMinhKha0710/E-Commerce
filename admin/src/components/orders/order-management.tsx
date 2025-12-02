"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, Download, Eye, Filter, MoreHorizontal, Search, Trash } from "lucide-react"

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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { deleteAdminOrder, fetchAdminOrders, updateAdminOrderStatus, type AdminOrderListItem } from "@/lib/api/orders"

export function OrderManagement() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<AdminOrderListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingOrder, setEditingOrder] = useState<AdminOrderListItem | null>(null)
  const [updateStatusValue, setUpdateStatusValue] = useState("processing")
  const [updateNote, setUpdateNote] = useState("")

  const statusOptions = useMemo(
    () => [
      { value: "pending", label: "Chờ thanh toán", color: "bg-yellow-500" },
      { value: "processing", label: "Đang xử lý", color: "bg-blue-500" },
      { value: "confirmed", label: "Đã xác nhận", color: "bg-indigo-500" },
      { value: "shipping", label: "Đang vận chuyển", color: "bg-purple-500" },
      { value: "completed", label: "Đã giao hàng", color: "bg-green-500" },
      { value: "cancelled", label: "Đã hủy", color: "bg-red-500" },
      { value: "refunded", label: "Hoàn tiền", color: "bg-rose-500" },
    ],
    [],
  )

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)

  const formatDate = (value: string) => new Intl.DateTimeFormat("vi-VN").format(new Date(value))

  const getStatusValue = (status: string) => {
    const normalized = status.toLowerCase()
    if (normalized.includes("pending") || normalized.includes("waiting")) return "pending"
    if (normalized.includes("confirm")) return "confirmed"
    if (normalized.includes("shipping") || normalized.includes("transport")) return "shipping"
    if (normalized.includes("complete") || normalized.includes("deliver") || normalized.includes("success")) return "completed"
    if (normalized.includes("refund")) return "refunded"
    if (normalized.includes("cancel")) return "cancelled"
    return "processing"
  }

  const refreshOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetchAdminOrders({
        keyword,
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        pageSize,
      })
      setOrders(response.orders)
      setTotal(response.total)
      setSelectedOrders([])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Không thể tải đơn hàng",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, statusFilter, keyword])

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((order) => order.orderId.toString()))
    }
  }

  const toggleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  const getStatusColor = (status: string) => {
    const value = getStatusValue(status)
    return statusOptions.find((opt) => opt.value === value)?.color || "bg-gray-500"
  }

  const getPaymentColor = (payment: string) => {
    switch (payment) {
      case "completed":
      case "paid":
        return "bg-green-500"
      case "pending":
      case "waiting":
        return "bg-yellow-500"
      case "refunded":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleOpenStatusDialog = (order: AdminOrderListItem) => {
    setEditingOrder(order)
    setUpdateStatusValue(getStatusValue(order.status))
    setUpdateNote(order.adminNote || "")
  }

  const handleUpdateStatus = async () => {
    if (!editingOrder) return
    try {
      await updateAdminOrderStatus(editingOrder.orderId, {
        status: updateStatusValue,
        adminNote: updateNote,
      })
      toast({
        title: "Cập nhật thành công",
        description: `Đơn hàng ${editingOrder.orderNumber} đã được cập nhật.`,
      })
      setEditingOrder(null)
      refreshOrders()
    } catch (error) {
      console.error("Failed to update order:", error)
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật trạng thái đơn hàng.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSelected = async (ids?: string[]) => {
    const targets = ids ?? selectedOrders
    if (!targets.length) {
      toast({ title: "Chưa chọn đơn hàng", description: "Hãy chọn ít nhất một đơn trước khi xóa." })
      return
    }

    const confirmMessage =
      targets.length === 1
        ? "Bạn có chắc chắn muốn xóa đơn hàng đã chọn?"
        : `Bạn có chắc chắn muốn xóa ${targets.length} đơn hàng đã chọn?`

    if (!window.confirm(confirmMessage)) return

    try {
      setIsDeleting(true)
      await Promise.all(targets.map((id) => deleteAdminOrder(Number(id))))
      toast({
        title: "Đã xóa",
        description: `${targets.length} đơn hàng đã được xóa khỏi hệ thống.`,
      })
      await refreshOrders()
    } catch (error) {
      console.error("Failed to delete orders:", error)
      toast({
        title: "Không thể xóa đơn hàng",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn hàng</h2>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Xuất dữ liệu
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách đơn hàng</CardTitle>
          <CardDescription>Quản lý tất cả đơn hàng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm đơn hàng..."
                    className="pl-8 w-full"
                    value={keyword}
                    onChange={(e) => {
                      setPage(1)
                      setKeyword(e.target.value)
                    }}
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
                    <DropdownMenuItem>Trạng thái</DropdownMenuItem>
                    <DropdownMenuItem>Thanh toán</DropdownMenuItem>
                    <DropdownMenuItem>Phương thức thanh toán</DropdownMenuItem>
                    <DropdownMenuItem>Ngày đặt hàng</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                  <Select
                  value={statusFilter}
                    onValueChange={(value) => {
                    setPage(1)
                    setStatusFilter(value)
                    }}
                  >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Ngày
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPage(1)
                    setPageSize(Number(value))
                  }}
                >
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
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                <span className="text-sm">{selectedOrders.length} đơn hàng đã chọn</span>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 ml-auto"
                  onClick={() => handleDeleteSelected()}
                  disabled={isDeleting}
                >
                  <Trash className="h-3 w-3" />
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </Button>
              </div>
            )}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox checked={selectedOrders.length === orders.length && orders.length > 0} onCheckedChange={toggleSelectAll} />
                    </TableHead>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                          Đang tải dữ liệu...
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        Không có đơn hàng nào.
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading &&
                    orders.map((order) => {
                      const key = order.orderId.toString()
                      return (
                        <TableRow key={key}>
                        <TableCell>
                          <Checkbox
                          checked={selectedOrders.includes(key)}
                          onCheckedChange={() => toggleSelectOrder(key)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                          <span className="text-sm font-medium">{order.customerName || "Khách hàng"}</span>
                            <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                          </div>
                        </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>{formatCurrency(order.orderTotal)}</TableCell>
                        <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(order.status)} text-white border-none`}>
                          {statusOptions.find((opt) => opt.value === getStatusValue(order.status))?.label || order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                        <Badge variant="outline" className={`${getPaymentColor(order.paymentStatus.toLowerCase())} text-white border-none`}>
                          {order.paymentStatus}
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
                              <Link href={`/dashboard/orders/${order.orderId}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault()
                                handleOpenStatusDialog(order)
                                }}
                              >
                                Cập nhật trạng thái
                              </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={(e) => {
                                e.preventDefault()
                                handleDeleteSelected([key])
                              }}
                            >
                              Xóa đơn hàng
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, total)} của {total} đơn hàng
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                  Trước
                </Button>
                <span className="text-sm">
                  Trang {page}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingOrder} onOpenChange={(open) => !open && setEditingOrder(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            {editingOrder && <DialogDescription>Thay đổi trạng thái đơn hàng {editingOrder.orderNumber}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status-select">Trạng thái mới</Label>
              <Select value={updateStatusValue} onValueChange={setUpdateStatusValue}>
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
              <Textarea id="note" placeholder="Nhập ghi chú về việc thay đổi trạng thái..." value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateStatus}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
