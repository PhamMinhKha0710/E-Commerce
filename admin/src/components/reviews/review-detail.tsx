"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, ChevronDown, Clock, Edit, MoreHorizontal, Send, Star, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
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

// Giả lập dữ liệu đánh giá
const reviewData = {
  id: "REV-1001",
  product: {
    id: "PRD-1001",
    name: "Điện thoại Samsung Galaxy S23",
    image: "/placeholder.svg?height=100&width=100",
    price: 18500000,
    sku: "SS-GS23-BLK-128",
    url: "/dashboard/products/PRD-1001",
  },
  customer: {
    id: "USR-1001",
    name: "Nguyễn Văn A",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "NA",
    email: "nguyenvana@example.com",
    url: "/dashboard/users/USR-1001",
  },
  rating: 4,
  title: "Sản phẩm tốt, đáng tiền",
  comment:
    "Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Camera chụp đẹp, pin trâu. Tuy nhiên, sạc hơi nóng khi sử dụng lâu và giá hơi cao so với các sản phẩm cùng phân khúc.",
  date: "15/04/2023",
  status: "Đã duyệt",
  verified: true,
  helpful: 12,
  unhelpful: 2,
  replies: [
    {
      id: "REP-1001",
      author: "Admin",
      content:
        "Cảm ơn bạn đã đánh giá sản phẩm. Chúng tôi rất vui khi bạn hài lòng với sản phẩm. Về vấn đề sạc nóng, đây là hiện tượng bình thường khi sạc nhanh, bạn có thể sử dụng sạc chậm hơn nếu muốn tránh tình trạng này.",
      date: "16/04/2023",
      isAdmin: true,
    },
  ],
  timeline: [
    {
      id: 1,
      action: "Đánh giá đã được tạo",
      date: "15/04/2023 10:30",
      by: "Nguyễn Văn A",
    },
    {
      id: 2,
      action: "Đánh giá đã được duyệt",
      date: "15/04/2023 14:45",
      by: "Admin",
    },
    {
      id: 3,
      action: "Phản hồi đã được thêm",
      date: "16/04/2023 09:15",
      by: "Admin",
    },
  ],
  order: {
    id: "ORD-1234",
    date: "10/04/2023",
    url: "/dashboard/orders/ORD-1234",
  },
}

export function ReviewDetail({ reviewId }: { reviewId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [review, setReview] = useState(reviewData)
  const [replyText, setReplyText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedReply, setEditedReply] = useState("")
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null)

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã duyệt":
        return "bg-green-500"
      case "Chờ duyệt":
        return "bg-yellow-500"
      case "Đã từ chối":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Handle reply submission
  const handleSubmitReply = () => {
    if (!replyText.trim()) return

    const newReply = {
      id: `REP-${Date.now()}`,
      author: "Admin",
      content: replyText,
      date: new Date().toLocaleDateString("vi-VN"),
      isAdmin: true,
    }

    const updatedReview = {
      ...review,
      replies: [...review.replies, newReply],
      timeline: [
        ...review.timeline,
        {
          id: review.timeline.length + 1,
          action: "Phản hồi đã được thêm",
          date: new Date().toLocaleString("vi-VN"),
          by: "Admin",
        },
      ],
    }

    setReview(updatedReview)
    setReplyText("")

    toast({
      title: "Phản hồi đã được gửi",
      description: "Phản hồi của bạn đã được thêm vào đánh giá này.",
    })
  }

  // Handle reply edit
  const handleEditReply = (replyId: string) => {
    const replyToEdit = review.replies.find((reply) => reply.id === replyId)
    if (replyToEdit) {
      setEditingReplyId(replyId)
      setEditedReply(replyToEdit.content)
    }
  }

  // Handle save edited reply
  const handleSaveEditedReply = () => {
    if (!editedReply.trim() || !editingReplyId) return

    const updatedReplies = review.replies.map((reply) =>
      reply.id === editingReplyId
        ? {
            ...reply,
            content: editedReply,
            edited: true,
            editDate: new Date().toLocaleDateString("vi-VN"),
          }
        : reply,
    )

    const updatedReview = {
      ...review,
      replies: updatedReplies,
      timeline: [
        ...review.timeline,
        {
          id: review.timeline.length + 1,
          action: "Phản hồi đã được chỉnh sửa",
          date: new Date().toLocaleString("vi-VN"),
          by: "Admin",
        },
      ],
    }

    setReview(updatedReview)
    setEditingReplyId(null)
    setEditedReply("")

    toast({
      title: "Phản hồi đã được cập nhật",
      description: "Phản hồi của bạn đã được cập nhật thành công.",
    })
  }

  // Handle delete reply
  const handleDeleteReply = (replyId: string) => {
    const updatedReplies = review.replies.filter((reply) => reply.id !== replyId)

    const updatedReview = {
      ...review,
      replies: updatedReplies,
      timeline: [
        ...review.timeline,
        {
          id: review.timeline.length + 1,
          action: "Phản hồi đã bị xóa",
          date: new Date().toLocaleString("vi-VN"),
          by: "Admin",
        },
      ],
    }

    setReview(updatedReview)

    toast({
      title: "Phản hồi đã bị xóa",
      description: "Phản hồi đã bị xóa khỏi đánh giá này.",
    })
  }

  // Handle approve review
  const handleApproveReview = () => {
    const updatedReview = {
      ...review,
      status: "Đã duyệt",
      timeline: [
        ...review.timeline,
        {
          id: review.timeline.length + 1,
          action: "Đánh giá đã được duyệt",
          date: new Date().toLocaleString("vi-VN"),
          by: "Admin",
        },
      ],
    }

    setReview(updatedReview)

    toast({
      title: "Đánh giá đã được duyệt",
      description: "Đánh giá này đã được duyệt và sẽ hiển thị công khai.",
    })
  }

  // Handle reject review
  const handleRejectReview = () => {
    const updatedReview = {
      ...review,
      status: "Đã từ chối",
      timeline: [
        ...review.timeline,
        {
          id: review.timeline.length + 1,
          action: "Đánh giá đã bị từ chối",
          date: new Date().toLocaleString("vi-VN"),
          by: "Admin",
        },
      ],
    }

    setReview(updatedReview)

    toast({
      title: "Đánh giá đã bị từ chối",
      description: "Đánh giá này đã bị từ chối và sẽ không hiển thị công khai.",
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
            <Link href="/dashboard/reviews">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Chi tiết đánh giá #{reviewId}</h2>
          <Badge variant="outline" className={`${getStatusColor(review.status)} text-white border-none ml-2`}>
            {review.status}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {review.status === "Chờ duyệt" && (
            <>
              <Button variant="default" className="gap-2" onClick={handleApproveReview}>
                <Check className="h-4 w-4" /> Duyệt
              </Button>
              <Button variant="outline" className="gap-2 text-red-500" onClick={handleRejectReview}>
                <X className="h-4 w-4" /> Từ chối
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Thao tác <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Thao tác đánh giá</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Gửi email đến khách hàng
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <X className="h-4 w-4" /> Xóa đánh giá
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc chắn muốn xóa đánh giá này?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Đánh giá này sẽ bị xóa vĩnh viễn khỏi hệ thống.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        toast({
                          title: "Đánh giá đã bị xóa",
                          description: "Đánh giá này đã bị xóa khỏi hệ thống.",
                          variant: "destructive",
                        })
                        router.push("/dashboard/reviews")
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Xác nhận xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="review" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="review">Nội dung đánh giá</TabsTrigger>
              <TabsTrigger value="replies">Phản hồi</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>
            <TabsContent value="review" className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Nội dung đánh giá</CardTitle>
                  <CardDescription>Chi tiết đánh giá từ khách hàng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.customer.avatar || "/placeholder.svg"} alt={review.customer.name} />
                        <AvatarFallback>{review.customer.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {renderStars(review.rating)}
                      {review.verified && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                          <Check className="h-3 w-3" />
                          <span>Đã mua hàng</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{review.title}</h3>
                    <p className="mt-2 whitespace-pre-line text-sm">{review.comment}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>{review.helpful}</span>
                      <span>người thấy hữu ích</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{review.unhelpful}</span>
                      <span>người không thấy hữu ích</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="replies" className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Phản hồi</CardTitle>
                  <CardDescription>Các phản hồi cho đánh giá này</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {review.replies.length > 0 ? (
                    <div className="space-y-4">
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="rounded-md border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                {reply.isAdmin ? (
                                  <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
                                ) : (
                                  <AvatarFallback>{review.customer.initials}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {reply.author}{" "}
                                  {reply.isAdmin && (
                                    <Badge variant="outline" className="ml-2 bg-primary text-primary-foreground">
                                      Admin
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">{reply.date}</div>
                              </div>
                            </div>
                            {reply.isAdmin && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Mở menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditReply(reply.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                                        <X className="mr-2 h-4 w-4" />
                                        Xóa
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Xác nhận xóa phản hồi</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Bạn có chắc chắn muốn xóa phản hồi này? Hành động này không thể hoàn tác.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteReply(reply.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Xóa
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          {editingReplyId === reply.id ? (
                            <div className="mt-2 space-y-2">
                              <Textarea
                                value={editedReply}
                                onChange={(e) => setEditedReply(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingReplyId(null)
                                    setEditedReply("")
                                  }}
                                >
                                  Hủy
                                </Button>
                                <Button variant="default" size="sm" onClick={handleSaveEditedReply}>
                                  Lưu
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="whitespace-pre-line text-sm">{reply.content}</p>
                          )}
                          {reply.edited && (
                            <div className="mt-1 text-xs text-muted-foreground">Đã chỉnh sửa {reply.editDate}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                      <p className="text-muted-foreground">Chưa có phản hồi nào cho đánh giá này</p>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="reply">Thêm phản hồi mới</Label>
                    <Textarea
                      id="reply"
                      placeholder="Nhập phản hồi của bạn..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleSubmitReply} disabled={!replyText.trim()}>
                        Gửi phản hồi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Lịch sử đánh giá</CardTitle>
                  <CardDescription>Theo dõi các thay đổi của đánh giá này</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative ml-3 space-y-4 py-2 before:absolute before:inset-y-0 before:left-[-7px] before:w-[2px] before:bg-muted">
                    {review.timeline.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="relative pl-6 before:absolute before:left-[-7px] before:top-1 before:h-2 before:w-2 before:rounded-full before:border before:border-muted-foreground before:bg-background"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium">{item.action}</div>
                            <div className="text-sm text-muted-foreground">Bởi: {item.by}</div>
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
          </Tabs>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Thông tin sản phẩm</CardTitle>
              <CardDescription>Sản phẩm được đánh giá</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <img
                  src={review.product.image || "/placeholder.svg"}
                  alt={review.product.name}
                  className="h-20 w-20 rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="font-medium">{review.product.name}</div>
                    <div className="text-sm text-muted-foreground">SKU: {review.product.sku}</div>
                  </div>
                  <div className="text-sm font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(review.product.price)}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={review.product.url}>Xem chi tiết sản phẩm</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Thông tin khách hàng</CardTitle>
              <CardDescription>Người đánh giá sản phẩm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.customer.avatar || "/placeholder.svg"} alt={review.customer.name} />
                  <AvatarFallback>{review.customer.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.customer.name}</div>
                  <div className="text-sm text-muted-foreground">{review.customer.email}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={review.customer.url}>Xem hồ sơ khách hàng</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Thông tin đơn hàng</CardTitle>
              <CardDescription>Đơn hàng liên quan đến đánh giá</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã đơn hàng:</span>
                  <span className="font-medium">{review.order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đặt hàng:</span>
                  <span className="font-medium">{review.order.date}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={review.order.url}>Xem chi tiết đơn hàng</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Thống kê đánh giá</CardTitle>
              <CardDescription>Số liệu thống kê về đánh giá</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đánh giá:</span>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                  <span className="ml-2 font-medium">{review.rating}/5</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hữu ích:</span>
                <span className="font-medium">{review.helpful} người</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Không hữu ích:</span>
                <span className="font-medium">{review.unhelpful} người</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phản hồi:</span>
                <span className="font-medium">{review.replies.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <Badge variant="outline" className={`${getStatusColor(review.status)} text-white border-none`}>
                  {review.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
