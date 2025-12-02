"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, Check, Clock, Download, MapPin, Printer, Send, User, Mail, Phone } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchAdminOrderDetail, updateAdminOrderNote, updateAdminOrderStatus, type AdminOrderDetail } from "@/lib/api/orders"

const statusPalette = [
  { value: "pending", label: "Chờ thanh toán", color: "bg-amber-500" },
  { value: "processing", label: "Đang xử lý", color: "bg-blue-500" },
  { value: "confirmed", label: "Đã xác nhận", color: "bg-indigo-500" },
  { value: "shipping", label: "Đang vận chuyển", color: "bg-purple-500" },
  { value: "completed", label: "Đã giao hàng", color: "bg-green-500" },
  { value: "cancelled", label: "Đã hủy", color: "bg-red-500" },
  { value: "refunded", label: "Đã hoàn tiền", color: "bg-rose-500" },
]

const paymentPalette = [
  { value: "paid", label: "Đã thanh toán", color: "bg-green-500" },
  { value: "pending", label: "Chờ thanh toán", color: "bg-yellow-500" },
  { value: "failed", label: "Thanh toán thất bại", color: "bg-red-500" },
  { value: "refunded", label: "Đã hoàn tiền", color: "bg-blue-500" },
]

type OrderLine = AdminOrderDetail["items"][number]
type StatusHistoryItem = AdminOrderDetail["statusHistory"][number]
type TimelineEntry = {
  id: number
  status: string
  description?: string
  date: string
  current: boolean
}

const resolveStatusValue = (status?: string) => {
  const value = status?.toLowerCase() ?? ""
  if (value.includes("pending") || value.includes("waiting")) return "pending"
  if (value.includes("confirm")) return "confirmed"
  if (value.includes("process")) return "processing"
  if (value.includes("ship") || value.includes("transport")) return "shipping"
  if (value.includes("complete") || value.includes("deliver") || value.includes("success")) return "completed"
  if (value.includes("refund")) return "refunded"
  if (value.includes("cancel")) return "cancelled"
  return "processing"
}

const resolvePaymentValue = (status?: string) => {
  const value = status?.toLowerCase() ?? ""
  if (value.includes("paid") || value.includes("success")) return "paid"
  if (value.includes("pending") || value.includes("unpaid")) return "pending"
  if (value.includes("refund")) return "refunded"
  if (value.includes("fail")) return "failed"
  return "pending"
}

const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount ?? 0)

const formatDateTime = (value?: string) =>
  value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "Không rõ"

const formatDate = (value?: string) =>
  value ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(new Date(value)) : "Không rõ"

const normalizeText = (value?: string | null, fallback = "Không rõ") => {
  if (!value) return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

const normalizeAddress = (raw: unknown): string => {
  if (!raw) return "Không có địa chỉ"
  if (typeof raw === "string") {
    const trimmed = raw.trim()
    return trimmed.length > 0 ? trimmed : "Không có địa chỉ"
  }
  if (typeof raw === "object") {
    const entries = Object.values(raw as Record<string, unknown>)
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter((value) => value.length > 0)
    if (entries.length > 0) return entries.join(", ")
  }
  return "Không có địa chỉ"
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const { toast } = useToast()
  const [statusNote, setStatusNote] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [newNote, setNewNote] = useState("")

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR(orderId ? ["admin-order", orderId] : null, () => fetchAdminOrderDetail(Number(orderId)), {
    revalidateOnFocus: false,
  })

  const order = data

  const currentStatus = useMemo(() => {
    const value = resolveStatusValue(order?.status)
    return statusPalette.find((s) => s.value === value) ?? statusPalette[0]
  }, [order?.status])

  const currentPaymentStatus = useMemo(() => {
    const value = resolvePaymentValue(order?.paymentStatus)
    return paymentPalette.find((s) => s.value === value) ?? paymentPalette[0]
  }, [order?.paymentStatus])

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !order) return
    try {
      await updateAdminOrderStatus(order.orderId, {
        status: selectedStatus,
        adminNote: statusNote || undefined,
        notifyCustomer,
      })
      toast({ title: "Đã cập nhật", description: "Trạng thái đơn hàng đã được thay đổi." })
      setSelectedStatus(null)
      setStatusNote("")
      setNotifyCustomer(true)
      await mutate()
    } catch (err) {
      console.error(err)
      toast({ title: "Không thể cập nhật", description: "Vui lòng thử lại.", variant: "destructive" })
    }
  }

  const handleAddNote = async () => {
    if (!order || !newNote.trim()) return
    try {
      await updateAdminOrderNote(order.orderId, newNote.trim())
      toast({ title: "Đã thêm ghi chú" })
      setNewNote("")
      await mutate()
    } catch (err) {
      console.error(err)
      toast({ title: "Không thể thêm ghi chú", description: "Vui lòng thử lại.", variant: "destructive" })
  }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
        <div className="grid gap-4 lg:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <Card key={idx} className="h-64 animate-pulse bg-muted/40" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không tải được dữ liệu</AlertTitle>
        <AlertDescription>Vui lòng kiểm tra lại kết nối hoặc thử reload trang.</AlertDescription>
      </Alert>
    )
  }

  const customerName = normalizeText(order.customerName, normalizeText(order.shippingContactName))
  const customerEmail = normalizeText(order.customerEmail)
  const customerPhone = normalizeText(order.customerPhone ?? order.shippingContactPhone)
  const shippingContactName = normalizeText(order.shippingContactName, customerName)
  const shippingContactPhone = normalizeText(order.shippingContactPhone, customerPhone)
  const shippingAddressText = normalizeAddress(order.shippingAddress)

  const statusTimeline: TimelineEntry[] | undefined = order.statusHistory?.map((item: StatusHistoryItem, idx: number) => ({
    id: idx,
    status: item.displayName || item.status,
    description: item.displayName,
    date: formatDateTime(item.changedAt),
    current: idx === 0,
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Chi tiết đơn hàng #{order.orderNumber}</h2>
          <Badge variant="outline" className={`${currentStatus.color} text-white border-none ml-2`}>
            {currentStatus.label}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
              <Button variant="outline">Cập nhật trạng thái</Button>
                </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                <DialogDescription>Chọn trạng thái mới và ghi chú nếu cần.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Trạng thái mới</Label>
                  <Select value={selectedStatus ?? currentStatus.value} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                      {statusPalette.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${status.color}`} />
                            {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Textarea value={statusNote} onChange={(e) => setStatusNote(e.target.value)} placeholder="Nhập ghi chú..." />
                    </div>
                    <div className="flex items-center space-x-2">
                  <Checkbox id="notify" checked={notifyCustomer} onCheckedChange={(checked) => setNotifyCustomer(!!checked)} />
                  <Label htmlFor="notify">Thông báo cho khách hàng</Label>
                    </div>
                  </div>
                  <DialogFooter>
                <Button onClick={handleStatusUpdate}>Cập nhật</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" /> In đơn
              </Button>
                  <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Tải PDF
                  </Button>
          <Button variant="outline" className="gap-2">
            <Send className="h-4 w-4" /> Gửi email
              </Button>
        </div>
      </div>

      {resolveStatusValue(order.status) === "cancelled" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Đơn hàng đã bị hủy</AlertTitle>
          <AlertDescription>Đơn hàng này đã hủy nên không thể thao tác thêm.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
              <TabsTrigger value="timeline">Lịch sử</TabsTrigger>
              <TabsTrigger value="notes">Ghi chú</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Sản phẩm</CardTitle>
                  <CardDescription>Danh sách sản phẩm trong đơn</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hình ảnh</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-center">SL</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead className="text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items?.map((item: OrderLine) => (
                        <TableRow key={item.orderLineId}>
                          <TableCell>
                            <img
                              src={item.imageUrl || "/placeholder.svg"}
                              alt={item.productName}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-xs text-muted-foreground">SKU: {item.sku ?? "N/A"}</div>
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.lineTotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right">
                          Tổng phụ
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(order.subtotal)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right">
                          Phí vận chuyển
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(order.shippingAmount)}</TableCell>
                      </TableRow>
                      {order.discountAmount > 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-right">
                            Giảm giá
                          </TableCell>
                          <TableCell className="text-right">-{formatCurrency(order.discountAmount)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-semibold">
                          Tổng cộng
                        </TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(order.total)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid gap-5 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div>
                      <CardTitle>Thanh toán</CardTitle>
                      <CardDescription>Thông tin thanh toán</CardDescription>
                    </div>
                    <Badge variant="outline" className={`${currentPaymentStatus.color} text-white border-none`}>
                      {currentPaymentStatus.label}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phương thức:</span>
                      <span className="font-medium">{order.paymentMethod || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <span className="font-medium">{formatDate(order.orderDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tổng thanh toán:</span>
                          <span className="font-medium">{formatCurrency(order.total)}</span>
                        </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Vận chuyển</CardTitle>
                    <CardDescription>Chi tiết giao hàng</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phương thức:</span>
                          <span className="font-medium">{order.shippingMethod}</span>
                        </div>
                        <div className="flex justify-between">
                      <span className="text-muted-foreground">Người nhận:</span>
                      <span className="font-medium">{shippingContactName}</span>
                        </div>
                        <div className="flex justify-between">
                      <span className="text-muted-foreground">Số điện thoại:</span>
                      <span className="font-medium">{shippingContactPhone}</span>
                        </div>
                    <Separator />
                    <div className="space-y-1 text-sm rounded-md bg-muted p-3">
                      <div className="font-medium">Địa chỉ giao hàng</div>
                      <div>{shippingAddressText}</div>
                      </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                  <CardDescription>Sắp xếp theo thời gian cập nhật</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative ml-3 space-y-4 py-2 before:absolute before:inset-y-0 before:left-[-7px] before:w-[2px] before:bg-muted">
                    {statusTimeline?.map((item: TimelineEntry, index: number) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className={`relative pl-6 ${
                          index === 0
                            ? "before:absolute before:left-[-8px] before:top-1 before:h-2 before:w-2 before:rounded-full before:bg-primary before:ring-2 before:ring-primary/30"
                            : "before:absolute before:left-[-7px] before:top-1 before:h-2 before:w-2 before:rounded-full before:border before:border-muted-foreground before:bg-background"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium">{item.status}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Ghi chú nội bộ</CardTitle>
                  <CardDescription>Thêm ghi chú cho đội CSKH</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {order.adminNote ? (
                      <div className="rounded-md border p-4 text-sm leading-relaxed">{order.adminNote}</div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Chưa có ghi chú nào.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-note">Thêm ghi chú mới</Label>
                    <Textarea
                      id="new-note"
                      placeholder="Nhập ghi chú..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Thêm ghi chú
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Thông tin khách hàng</CardTitle>
              <CardDescription>Chi tiết liên hệ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                    <div className="font-medium">{customerName}</div>
                    <div className="text-sm text-muted-foreground">{customerEmail}</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm leading-relaxed">
                  <MapPin className="mt-[2px] h-4 w-4 text-muted-foreground" />
                  <span>{shippingAddressText}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
              <CardDescription>Thông tin nhanh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn:</span>
                <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày đặt:</span>
                <span className="font-medium">{formatDate(order.orderDate)}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-muted-foreground">Số sản phẩm:</span>
                <span className="font-medium">{order.items?.length ?? 0}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng cộng:</span>
                <span className="font-semibold">{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Thông tin hệ thống</CardTitle>
              <CardDescription>Mã nội bộ & thời gian</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>ID nội bộ</span>
                <span className="font-medium">{order.orderId}</span>
                  </div>
              <div className="flex justify-between">
                <span>Tạo lúc</span>
                <span>{formatDateTime(order.orderDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cập nhật gần nhất</span>
                <span>{formatDateTime(order.statusHistory?.[0]?.changedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
