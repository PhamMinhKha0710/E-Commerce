"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  ChevronDown,
  Check,
  Clock,
  CreditCard,
  Download,
  Edit,
  MapPin,
  Package,
  Printer,
  Save,
  Send,
  User,
  X,
  Mail,
  Phone,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

// Giả lập dữ liệu đơn hàng
const orderData = {
  id: "ORD-1234",
  date: "15/04/2023",
  status: "Đang xử lý",
  paymentStatus: "Đã thanh toán",
  paymentMethod: "Thẻ tín dụng",
  shippingMethod: "Giao hàng tiêu chuẩn",
  total: 1250000,
  subtotal: 1200000,
  tax: 50000,
  shippingCost: 0,
  discount: 0,
  customer: {
    id: "CUS-5678",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0912345678",
    address: {
      street: "123 Đường Lê Lợi",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      country: "Việt Nam",
      postalCode: "700000",
    },
  },
  items: [
    {
      id: "PROD-001",
      name: "Laptop Dell XPS 13",
      sku: "DELL-XPS13-001",
      price: 850000,
      quantity: 1,
      total: 850000,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "PROD-002",
      name: "Chuột không dây Logitech MX Master 3",
      sku: "LOG-MXM3-001",
      price: 350000,
      quantity: 1,
      total: 350000,
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  timeline: [
    {
      id: 1,
      status: "Đơn hàng đã tạo",
      date: "15/04/2023 08:30",
      description: "Đơn hàng đã được tạo thành công",
      icon: Calendar,
    },
    {
      id: 2,
      status: "Thanh toán thành công",
      date: "15/04/2023 08:35",
      description: "Thanh toán qua thẻ tín dụng đã được xác nhận",
      icon: CreditCard,
    },
    {
      id: 3,
      status: "Đang xử lý",
      date: "15/04/2023 09:15",
      description: "Đơn hàng đang được xử lý tại kho",
      icon: Package,
      current: true,
    },
  ],
  notes: [
    {
      id: 1,
      author: "Nhân viên CSKH",
      date: "15/04/2023 10:30",
      content: "Khách hàng yêu cầu giao hàng vào buổi chiều",
    },
  ],
}

// Các trạng thái đơn hàng
const orderStatuses = [
  { value: "pending", label: "Đang xử lý", color: "bg-blue-500" },
  { value: "processing", label: "Đang chuẩn bị hàng", color: "bg-yellow-500" },
  { value: "shipping", label: "Đang vận chuyển", color: "bg-purple-500" },
  { value: "delivered", label: "Đã giao hàng", color: "bg-green-500" },
  { value: "cancelled", label: "Đã hủy", color: "bg-red-500" },
  { value: "returned", label: "Đã hoàn trả", color: "bg-orange-500" },
]

// Các trạng thái thanh toán
const paymentStatuses = [
  { value: "paid", label: "Đã thanh toán", color: "bg-green-500" },
  { value: "pending", label: "Chờ thanh toán", color: "bg-yellow-500" },
  { value: "failed", label: "Thanh toán thất bại", color: "bg-red-500" },
  { value: "refunded", label: "Đã hoàn tiền", color: "bg-blue-500" },
]

export function OrderDetail({ orderId }: { orderId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState(orderData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedOrder, setEditedOrder] = useState(orderData)
  const [newNote, setNewNote] = useState("")

  const [selectedStatus, setSelectedStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const [notifyCustomer, setNotifyCustomer] = useState(true)

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    const foundStatus = orderStatuses.find((s) => s.label === status)
    return foundStatus ? foundStatus.color : "bg-gray-500"
  }

  // Lấy màu cho trạng thái thanh toán
  const getPaymentStatusColor = (status: string) => {
    const foundStatus = paymentStatuses.find((s) => s.label === status)
    return foundStatus ? foundStatus.color : "bg-gray-500"
  }

  // Xử lý cập nhật đơn hàng
  const handleUpdateOrder = () => {
    setOrder(editedOrder)
    setIsEditing(false)
    toast({
      title: "Cập nhật thành công",
      description: `Đơn hàng ${orderId} đã được cập nhật.`,
    })
  }

  // Xử lý thêm ghi chú mới
  const handleAddNote = () => {
    if (!newNote.trim()) return

    const updatedOrder = {
      ...order,
      notes: [
        ...order.notes,
        {
          id: order.notes.length + 1,
          author: "Admin",
          date: new Date().toLocaleString("vi-VN"),
          content: newNote,
        },
      ],
    }

    setOrder(updatedOrder)
    setEditedOrder(updatedOrder)
    setNewNote("")
    toast({
      title: "Đã thêm ghi chú",
      description: "Ghi chú mới đã được thêm vào đơn hàng.",
    })
  }

  // Xử lý cập nhật trạng thái
  const handleUpdateStatus = (status: string, note?: string, notify?: boolean) => {
    const timestamp = new Date().toLocaleString("vi-VN")

    const updatedOrder = {
      ...order,
      status,
      timeline: [
        ...order.timeline,
        {
          id: order.timeline.length + 1,
          status,
          date: timestamp,
          description: note ? note : `Đơn hàng đã được cập nhật sang trạng thái: ${status}`,
          icon: Package,
          current: true,
          notified: notify || false,
        },
      ],
    }

    // Cập nhật current cho timeline
    updatedOrder.timeline = updatedOrder.timeline.map((item, index) => ({
      ...item,
      current: index === updatedOrder.timeline.length - 1,
    }))

    setOrder(updatedOrder)
    setEditedOrder(updatedOrder)

    // Thêm ghi chú nếu có
    if (note && note.trim()) {
      const updatedOrderWithNote = {
        ...updatedOrder,
        notes: [
          ...updatedOrder.notes,
          {
            id: updatedOrder.notes.length + 1,
            author: "Admin",
            date: timestamp,
            content: `[Cập nhật trạng thái] ${note}`,
          },
        ],
      }
      setOrder(updatedOrderWithNote)
      setEditedOrder(updatedOrderWithNote)
    }

    toast({
      title: "Cập nhật trạng thái",
      description: `Đơn hàng đã được cập nhật sang trạng thái: ${status}${notify ? " và đã thông báo cho khách hàng" : ""}`,
    })
  }

  // Xử lý hủy đơn hàng
  const handleCancelOrder = () => {
    const updatedOrder = {
      ...order,
      status: "Đã hủy",
      timeline: [
        ...order.timeline,
        {
          id: order.timeline.length + 1,
          status: "Đã hủy",
          date: new Date().toLocaleString("vi-VN"),
          description: "Đơn hàng đã bị hủy",
          icon: X,
          current: true,
        },
      ],
    }

    // Cập nhật current cho timeline
    updatedOrder.timeline = updatedOrder.timeline.map((item, index) => ({
      ...item,
      current: index === updatedOrder.timeline.length - 1,
    }))

    setOrder(updatedOrder)
    setEditedOrder(updatedOrder)
    toast({
      title: "Đơn hàng đã hủy",
      description: `Đơn hàng ${orderId} đã bị hủy.`,
      variant: "destructive",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Chi tiết đơn hàng #{orderId}</h2>
          <Badge variant="outline" className={`${getStatusColor(order.status)} text-white border-none ml-2`}>
            {order.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isEditing ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Cập nhật trạng thái <ChevronDown className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
                    <DialogDescription>
                      Thay đổi trạng thái đơn hàng và thông báo cho khách hàng nếu cần.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Trạng thái mới</Label>
                      <Select
                        defaultValue={orderStatuses.find((s) => s.label === order.status)?.value}
                        onValueChange={(value) => {
                          const selectedStatus = orderStatuses.find((s) => s.value === value)
                          setSelectedStatus(selectedStatus?.label || "")
                        }}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${status.color}`} />
                                <span>{status.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status-note">Ghi chú (tùy chọn)</Label>
                      <Textarea
                        id="status-note"
                        placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="notify-customer"
                        checked={notifyCustomer}
                        onCheckedChange={(checked) => setNotifyCustomer(checked as boolean)}
                      />
                      <Label htmlFor="notify-customer">Thông báo cho khách hàng</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedStatus("")
                        setStatusNote("")
                        setNotifyCustomer(true)
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => {
                        if (selectedStatus) {
                          handleUpdateStatus(selectedStatus, statusNote, notifyCustomer)
                          setSelectedStatus("")
                          setStatusNote("")
                          setNotifyCustomer(true)
                        }
                      }}
                    >
                      Cập nhật
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" /> Chỉnh sửa
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Thao tác <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Thao tác đơn hàng</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Printer className="h-4 w-4" /> In đơn hàng
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Tải xuống PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> Gửi email xác nhận
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <X className="h-4 w-4" /> Hủy đơn hàng
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn hủy đơn hàng này?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Đơn hàng sẽ bị hủy và thông báo sẽ được gửi đến khách hàng.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700">
                          Xác nhận hủy đơn
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="default" className="gap-2" onClick={handleUpdateOrder}>
                <Save className="h-4 w-4" /> Lưu thay đổi
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" /> Hủy
              </Button>
            </>
          )}
        </div>
      </div>

      {order.status === "Đã hủy" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Đơn hàng đã bị hủy</AlertTitle>
          <AlertDescription>
            Đơn hàng này đã bị hủy và không thể tiếp tục xử lý. Vui lòng liên hệ với khách hàng nếu cần thiết.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Chi tiết đơn hàng</TabsTrigger>
              <TabsTrigger value="timeline">Lịch sử đơn hàng</TabsTrigger>
              <TabsTrigger value="notes">Ghi chú</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Sản phẩm</CardTitle>
                  <CardDescription>Danh sách sản phẩm trong đơn hàng</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Hình ảnh</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-right">Giá</TableHead>
                        <TableHead className="text-center">Số lượng</TableHead>
                        <TableHead className="text-right">Tổng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-center">
                            {isEditing ? (
                              <Input
                                type="number"
                                min="1"
                                className="w-16 text-center mx-auto"
                                value={editedOrder.items.find((i) => i.id === item.id)?.quantity || item.quantity}
                                onChange={(e) => {
                                  const quantity = Number.parseInt(e.target.value) || 1
                                  const updatedItems = editedOrder.items.map((i) =>
                                    i.id === item.id ? { ...i, quantity, total: i.price * quantity } : i,
                                  )

                                  // Recalculate totals
                                  const subtotal = updatedItems.reduce((sum, i) => sum + i.total, 0)

                                  setEditedOrder({
                                    ...editedOrder,
                                    items: updatedItems,
                                    subtotal,
                                    total: subtotal + editedOrder.tax + editedOrder.shippingCost - editedOrder.discount,
                                  })
                                }}
                              />
                            ) : (
                              item.quantity
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
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
                          Thuế
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(order.tax)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-right">
                          Phí vận chuyển
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(order.shippingCost)}</TableCell>
                      </TableRow>
                      {order.discount > 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-right">
                            Giảm giá
                          </TableCell>
                          <TableCell className="text-right">-{formatCurrency(order.discount)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold">
                          Tổng cộng
                        </TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(order.total)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Thêm sản phẩm</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm sản phẩm vào đơn hàng</DialogTitle>
                          <DialogDescription>Tìm kiếm và thêm sản phẩm vào đơn hàng hiện tại.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="relative">
                            <Input placeholder="Tìm kiếm sản phẩm..." />
                          </div>
                          <div className="max-h-[300px] overflow-auto border rounded-md">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[40px]"></TableHead>
                                  <TableHead>Sản phẩm</TableHead>
                                  <TableHead className="text-right">Giá</TableHead>
                                  <TableHead className="text-right">Tồn kho</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    <img
                                      src="/placeholder.svg?height=40&width=40"
                                      alt="Sản phẩm"
                                      className="h-10 w-10 rounded-md object-cover"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-medium">Bàn phím cơ Keychron K2</div>
                                    <div className="text-sm text-muted-foreground">SKU: KEY-K2-001</div>
                                  </TableCell>
                                  <TableCell className="text-right">1.200.000₫</TableCell>
                                  <TableCell className="text-right">15</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    <img
                                      src="/placeholder.svg?height=40&width=40"
                                      alt="Sản phẩm"
                                      className="h-10 w-10 rounded-md object-cover"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-medium">Tai nghe Sony WH-1000XM4</div>
                                    <div className="text-sm text-muted-foreground">SKU: SONY-WH1000XM4</div>
                                  </TableCell>
                                  <TableCell className="text-right">5.490.000₫</TableCell>
                                  <TableCell className="text-right">8</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Thêm vào đơn hàng</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                )}
              </Card>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Thông tin thanh toán</CardTitle>
                        <CardDescription>Chi tiết thanh toán đơn hàng</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getPaymentStatusColor(order.paymentStatus)} text-white border-none`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-status">Trạng thái thanh toán</Label>
                          <Select
                            value={paymentStatuses.find((s) => s.label === editedOrder.paymentStatus)?.value}
                            onValueChange={(value) => {
                              const status = paymentStatuses.find((s) => s.value === value)?.label || ""
                              setEditedOrder({ ...editedOrder, paymentStatus: status })
                            }}
                          >
                            <SelectTrigger id="payment-status">
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentStatuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${status.color}`} />
                                    <span>{status.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="payment-method">Phương thức thanh toán</Label>
                          <Select
                            value={editedOrder.paymentMethod}
                            onValueChange={(value) => setEditedOrder({ ...editedOrder, paymentMethod: value })}
                          >
                            <SelectTrigger id="payment-method">
                              <SelectValue placeholder="Chọn phương thức" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Thẻ tín dụng">Thẻ tín dụng</SelectItem>
                              <SelectItem value="Ví điện tử">Ví điện tử</SelectItem>
                              <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                              <SelectItem value="COD">COD (Thanh toán khi nhận hàng)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phương thức:</span>
                          <span className="font-medium">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày thanh toán:</span>
                          <span className="font-medium">{order.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tổng thanh toán:</span>
                          <span className="font-medium">{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Thông tin vận chuyển</CardTitle>
                    <CardDescription>Chi tiết vận chuyển đơn hàng</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="shipping-method">Phương thức vận chuyển</Label>
                          <Select
                            value={editedOrder.shippingMethod}
                            onValueChange={(value) => setEditedOrder({ ...editedOrder, shippingMethod: value })}
                          >
                            <SelectTrigger id="shipping-method">
                              <SelectValue placeholder="Chọn phương thức" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Giao hàng tiêu chuẩn">Giao hàng tiêu chuẩn</SelectItem>
                              <SelectItem value="Giao hàng nhanh">Giao hàng nhanh</SelectItem>
                              <SelectItem value="Giao hàng hỏa tốc">Giao hàng hỏa tốc</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tracking-number">Mã vận đơn</Label>
                          <Input
                            id="tracking-number"
                            placeholder="Nhập mã vận đơn"
                            value={editedOrder.trackingNumber || ""}
                            onChange={(e) => setEditedOrder({ ...editedOrder, trackingNumber: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phương thức:</span>
                          <span className="font-medium">{order.shippingMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã vận đơn:</span>
                          <span className="font-medium">{order.trackingNumber || "Chưa có"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                        </div>
                        <div className="rounded-md bg-muted p-3 text-sm">
                          <div className="font-medium">{order.customer.name}</div>
                          <div>{order.customer.address.street}</div>
                          <div>
                            {order.customer.address.ward}, {order.customer.address.district}
                          </div>
                          <div>
                            {order.customer.address.city}, {order.customer.address.country}{" "}
                            {order.customer.address.postalCode}
                          </div>
                          <div className="mt-1">{order.customer.phone}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                  <CardDescription>Theo dõi trạng thái đơn hàng theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative ml-3 space-y-4 py-2 before:absolute before:inset-y-0 before:left-[-7px] before:w-[2px] before:bg-muted">
                    {order.timeline.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`relative pl-6 ${
                          item.current
                            ? "before:absolute before:left-[-8px] before:top-1 before:h-2 before:w-2 before:rounded-full before:bg-primary before:ring-2 before:ring-primary/25"
                            : "before:absolute before:left-[-7px] before:top-1 before:h-2 before:w-2 before:rounded-full before:border before:border-muted-foreground before:bg-background"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium">{item.status}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                            {item.notified && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                                <Check className="h-3 w-3" />
                                <span>Đã thông báo cho khách hàng</span>
                              </div>
                            )}
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

            <TabsContent value="notes" className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Ghi chú đơn hàng</CardTitle>
                  <CardDescription>Ghi chú nội bộ về đơn hàng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {order.notes.map((note) => (
                      <div key={note.id} className="rounded-md border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="font-medium">{note.author}</div>
                          <div className="text-sm text-muted-foreground">{note.date}</div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
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
              <CardDescription>Chi tiết về khách hàng đặt hàng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-sm text-muted-foreground">Mã KH: {order.customer.id}</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div>{order.customer.address.street}</div>
                    <div>
                      {order.customer.address.ward}, {order.customer.address.district}
                    </div>
                    <div>
                      {order.customer.address.city}, {order.customer.address.country}
                    </div>
                    <div>{order.customer.address.postalCode}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/users/${order.customer.id}`}>Xem hồ sơ</Link>
                </Button>
                <Button variant="outline" size="sm">
                  Liên hệ
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Thông tin đơn hàng</CardTitle>
              <CardDescription>Tóm tắt đơn hàng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đặt hàng:</span>
                  <span className="font-medium">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số lượng sản phẩm:</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng số lượng:</span>
                  <span className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Đơn hàng liên quan</CardTitle>
              <CardDescription>Các đơn hàng khác của khách hàng này</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md border p-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">ORD-1230</div>
                    <Badge variant="outline" className="bg-green-500 text-white border-none">
                      Đã giao hàng
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">10/04/2023</span>
                    <span className="font-medium">₫1,850,000</span>
                  </div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">ORD-1180</div>
                    <Badge variant="outline" className="bg-green-500 text-white border-none">
                      Đã giao hàng
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">25/03/2023</span>
                    <span className="font-medium">₫950,000</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Lịch sử cập nhật gần đây</CardTitle>
              <CardDescription>Các thay đổi trạng thái gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.timeline
                  .slice(-3)
                  .reverse()
                  .map((item) => (
                    <div key={item.id} className="flex items-start gap-2 text-sm">
                      <div className={`mt-0.5 h-2 w-2 rounded-full ${getStatusColor(item.status)}`} />
                      <div className="flex-1">
                        <div className="font-medium">{item.status}</div>
                        <div className="text-xs text-muted-foreground">{item.date}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
