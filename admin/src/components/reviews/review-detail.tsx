"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { 
  ArrowLeft, 
  Check,
  MoreHorizontal, 
  Clock, 
  Edit, 
  Send, 
  Star, 
  X, 
  User,
  Box,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ExternalLink,
  Trash,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  getReviewById, 
  deleteReview, 
  updateReviewStatus, 
  addAdminReplyToReview, 
  updateReply, 
  deleteReply,
  ReviewDetailDto,
  ReviewReplyDto
} from "@/lib/api/reviews"

// Define interfaces for type safety
interface ReplyInterface {
  id: string;
  author: string;
  content: string;
  date: string;
  isAdmin: boolean;
  edited?: boolean;
  editDate?: string;
}

interface TimelineEvent {
  id: number;
  action: string;
  date: string;
  by: string;
}

interface ProductInfo {
  id: string | number;
  name: string;
  image: string;
  price: number;
  sku?: string;
  url?: string;
}

interface CustomerInfo {
  id: string | number;
  name: string;
  avatar?: string;
  initials: string;
  email: string;
  url?: string;
}

interface OrderInfo {
  id: string | number;
  date: string;
  url?: string;
}

interface UIReviewData {
  id: string | number;
  product: ProductInfo;
  customer: CustomerInfo;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  status: string;
  verified: boolean;
  helpful: number;
  unhelpful: number;
  replies: ReplyInterface[];
  timeline: TimelineEvent[];
  order: OrderInfo;
}

// Timeline component tạm thời 
const Timeline = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative flex flex-col gap-2">{children}</div>
}

const TimelineItem = ({ children, isLast }: { children: React.ReactNode, isLast?: boolean }) => {
  return <div className="flex relative">{children}</div>
}

const TimelineOppositeContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-4 py-2 flex-1 text-right text-sm text-muted-foreground">{children}</div>
}

const TimelineSeparator = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col items-center">{children}</div>
}

const TimelineDot = ({ 
  children, 
  color = "primary" 
}: { 
  children: React.ReactNode, 
  color?: "default" | "primary" | "secondary" | "success" | "error" | "info" | "warning" 
}) => {
  const getColorClass = () => {
    switch (color) {
      case "primary": return "bg-primary text-primary-foreground"
      case "secondary": return "bg-secondary text-secondary-foreground"
      case "success": return "bg-green-500 text-white"
      case "error": return "bg-red-500 text-white"
      case "info": return "bg-blue-500 text-white"
      case "warning": return "bg-yellow-500 text-white"
      default: return "bg-gray-400 text-white"
    }
  }

  return (
    <div className={`flex items-center justify-center rounded-full w-8 h-8 z-10 ${getColorClass()}`}>
      {children}
    </div>
  )
}

const TimelineConnector = ({ isLast }: { isLast?: boolean }) => {
  return !isLast && <div className="w-[2px] bg-border grow" />
}

const TimelineContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="px-4 py-2 flex-1">{children}</div>
}

export function ReviewDetail({ reviewId }: { reviewId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [review, setReview] = useState<UIReviewData | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedReply, setEditedReply] = useState("")
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch review data
  useEffect(() => {
    const fetchReviewData = async () => {
      setIsLoading(true)
      try {
        const data = await getReviewById(Number(reviewId))
        
        // Transform API data to match our UI format
        const transformedReview: UIReviewData = {
          id: data.id,
  product: {
            id: data.product.id,
            name: data.product.name,
            image: data.product.imageUrl || '/placeholder.svg?height=100&width=100',
            price: data.product.price
  },
  customer: {
            id: data.user.id,
            name: `${data.user.firstName} ${data.user.lastName}`,
            email: data.user.email,
            initials: getInitials(`${data.user.firstName} ${data.user.lastName}`),
            avatar: data.user.email ? `https://gravatar.com/avatar/${createMd5(data.user.email)}?d=mp` : undefined,
  },
          rating: data.ratingValue,
          comment: data.comment,
          date: new Date(data.created).toLocaleDateString('vi-VN'),
          status: formatStatus(data.isStatus),
          verified: data.isVerifiedPurchase || true,
          helpful: data.helpfulCount || 0,
          unhelpful: data.unhelpfulCount || 0,
          replies: data.replies ? data.replies.map(reply => ({
            id: reply.id.toString(),
            author: reply.authorName,
            content: reply.content,
            date: new Date(reply.created).toLocaleDateString('vi-VN'),
            isAdmin: reply.isAdmin,
            edited: reply.edited,
            editDate: reply.editDate ? new Date(reply.editDate).toLocaleDateString('vi-VN') : undefined
          })) : [],
  timeline: [
    {
      id: 1,
      action: "Đánh giá đã được tạo",
              date: formatDateTime(data.created),
              by: `${data.user.firstName} ${data.user.lastName}`
    },
            ...(data.isStatus ? [{
      id: 2,
      action: "Đánh giá đã được duyệt",
              date: data.approvedAt ? formatDateTime(data.approvedAt) : formatDateTime(data.created),
              by: "Admin"
            }] : []),
            ...(data.replies && data.replies.length > 0 ? [{
      id: 3,
      action: "Phản hồi đã được thêm",
              date: formatDateTime(data.replies[0].created),
              by: data.replies[0].authorName
            }] : [])
  ],
  order: {
            id: data.order.id,
            date: new Date(data.order.orderDate).toLocaleDateString('vi-VN')
          }
        }
        
        setReview(transformedReview)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch review:", err)
        setError("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.")
      } finally {
      setIsLoading(false)
      }
    }
    
    if (reviewId) {
      fetchReviewData()
    }
  }, [reviewId])
  
  // Utility functions for data formatting
  const createMd5 = (input: string): string => {
    // Simple replacement for MD5 - in a real app you'd use a library
    return Buffer.from(input).toString('base64')
  }
  
  const getInitials = (name: string): string => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const formatStatus = (isApproved: boolean): string => {
    return isApproved ? "Đã duyệt" : "Chờ duyệt"
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã duyệt":
        return "text-green-500"
      case "Chờ duyệt":
        return "text-yellow-500"
      case "Đã từ chối":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Fallback to the original string
    }
  }

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      await addAdminReplyToReview(Number(reviewId), replyText)
      
      // Update the UI with the new reply
      if (review) {
        const newReply: ReplyInterface = {
          id: `temp-${Date.now()}`, // Temporary ID - would be replaced when refetching
          author: "Admin", // Use the actual admin name if available
      content: replyText,
          date: new Date().toLocaleDateString('vi-VN'),
          isAdmin: true
    }

        setReview({
      ...review,
      replies: [...review.replies, newReply],
      timeline: [
        ...review.timeline,
        {
          id: review.timeline.length + 1,
          action: "Phản hồi đã được thêm",
              date: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi }),
              by: "Admin"
            }
          ]
        })
      }

    toast({
      title: "Phản hồi đã được gửi",
        description: "Phản hồi của bạn đã được thêm vào đánh giá.",
    })

      // Clear the reply text
      setReplyText("")
    } catch (error) {
      console.error("Failed to submit reply:", error)
      toast({
        title: "Lỗi",
        description: "Không thể gửi phản hồi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditReply = (replyId: string) => {
    const replyToEdit = review?.replies.find(reply => reply.id === replyId)
    if (replyToEdit) {
      setEditedReply(replyToEdit.content)
      setEditingReplyId(replyId)
      setIsEditing(true)
    }
  }

  const handleSaveEditedReply = async () => {
    if (!editingReplyId || !editedReply.trim() || !review) return
    
    setIsSubmitting(true)
    try {
      await updateReply(Number(editingReplyId), editedReply)
      
      // Update UI with edited reply
      const updatedReplies = review.replies.map(reply => {
        if (reply.id === editingReplyId) {
          return {
            ...reply,
            content: editedReply,
            edited: true,
            editDate: new Date().toLocaleDateString('vi-VN')
          }
        }
        return reply
      })

      setReview({
      ...review,
        replies: updatedReplies
      })
      
      toast({
        title: "Phản hồi đã được cập nhật",
        description: "Phản hồi đã được cập nhật thành công.",
      })
      
      // Reset editing state
      setIsEditing(false)
    setEditingReplyId(null)
    setEditedReply("")
    } catch (error) {
      console.error("Failed to update reply:", error)
    toast({
        title: "Lỗi",
        description: "Không thể cập nhật phản hồi. Vui lòng thử lại sau.",
        variant: "destructive",
    })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReply = async (replyId: string) => {
    if (!review) return
    
    setIsSubmitting(true)
    try {
      await deleteReply(Number(replyId))
      
      // Update UI by removing deleted reply
      const updatedReplies = review.replies.filter(reply => reply.id !== replyId)

      setReview({
      ...review,
        replies: updatedReplies
      })

    toast({
        title: "Phản hồi đã được xóa",
        description: "Phản hồi đã được xóa thành công.",
    })
    } catch (error) {
      console.error("Failed to delete reply:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa phản hồi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApproveReview = async () => {
    if (!review) return
    
    setIsSubmitting(true)
    try {
      await updateReviewStatus(Number(reviewId), true)
      
      // Update UI state
      setReview({
      ...review,
      status: "Đã duyệt",
      timeline: [
        ...review.timeline,
        {
          id: review.timeline.length + 1,
          action: "Đánh giá đã được duyệt",
            date: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi }),
            by: "Admin"
          }
        ]
      })

    toast({
      title: "Đánh giá đã được duyệt",
        description: "Đánh giá sẽ hiển thị công khai trên trang sản phẩm.",
      })
    } catch (error) {
      console.error("Failed to approve review:", error)
      toast({
        title: "Lỗi",
        description: "Không thể duyệt đánh giá. Vui lòng thử lại sau.",
        variant: "destructive",
    })
    } finally {
      setIsSubmitting(false)
      setShowApproveDialog(false)
    }
  }

  const handleRejectReview = async () => {
    if (!review) return
    
    setIsSubmitting(true)
    try {
      await updateReviewStatus(Number(reviewId), false)
      
      // Update UI state
      setReview({
      ...review,
        status: "Chờ duyệt",
      timeline: [
        ...review.timeline,
        {
          id: review.timeline.length + 1,
          action: "Đánh giá đã bị từ chối",
            date: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi }),
            by: "Admin"
          }
        ]
      })

    toast({
      title: "Đánh giá đã bị từ chối",
        description: "Đánh giá sẽ không hiển thị trên trang sản phẩm.",
      })
    } catch (error) {
      console.error("Failed to reject review:", error)
      toast({
        title: "Lỗi",
        description: "Không thể từ chối đánh giá. Vui lòng thử lại sau.",
      variant: "destructive",
    })
    } finally {
      setIsSubmitting(false)
      setShowRejectDialog(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!review) return
    
    setIsSubmitting(true)
    try {
      await deleteReview(Number(reviewId))
      
    toast({
        title: "Đánh giá đã được xóa",
        description: "Đánh giá đã được xóa thành công.",
      })
      
      // Navigate back to reviews list
      router.push('/dashboard/reviews')
    } catch (error) {
      console.error("Failed to delete review:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa đánh giá. Vui lòng thử lại sau.",
      variant: "destructive",
    })
    } finally {
      setIsSubmitting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
          <div className="space-y-6">
          <div className="flex items-center">
            <Skeleton className="h-8 w-8 mr-2" />
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {error ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-2" />
            <h3 className="text-lg font-medium">Có lỗi xảy ra</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-4">
              <Button onClick={() => window.location.reload()}>Thử lại</Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/reviews">Quay lại danh sách</Link>
          </Button>
        </div>
          </CardContent>
        </Card>
      ) : review ? (
        <>
          {/* Header với breadcrumb và nút back */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <Button variant="ghost" size="sm" className="mb-2" asChild>
                <Link href="/dashboard/reviews">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại danh sách đánh giá
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Chi tiết đánh giá #{review.id}</h1>
            </div>
            <div className="flex mt-4 sm:mt-0 gap-2">
              {review.status === "Chờ duyệt" ? (
            <>
              <Button 
                    variant="outline" 
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isSubmitting}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                  <Button 
                onClick={() => setShowApproveDialog(true)}
                    disabled={isSubmitting}
              >
                    <Check className="mr-2 h-4 w-4" />
                    Duyệt đánh giá
              </Button>
                </>
              ) : review.status === "Đã duyệt" ? (
              <Button 
                variant="outline" 
                onClick={() => setShowRejectDialog(true)}
                  disabled={isSubmitting}
              >
                  <X className="mr-2 h-4 w-4" />
                  Hủy duyệt
              </Button>
              ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                Xóa đánh giá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

          {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Customer and product details */}
            <div className="space-y-6">
              {/* Customer Card */}
          <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="mr-2 h-5 w-5" />
                    Thông tin khách hàng
                </CardTitle>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                  <AvatarImage src={review.customer.avatar} alt={review.customer.name} />
                  <AvatarFallback>{review.customer.initials}</AvatarFallback>
                </Avatar>
                    <div>
                      <p className="font-medium">{review.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{review.customer.email}</p>
                    </div>
                      </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/dashboard/users/${review.customer.id}`}>
                        Xem hồ sơ khách hàng
                      </Link>
                    </Button>
                    </div>
                </CardContent>
              </Card>

              {/* Product Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Box className="mr-2 h-5 w-5" />
                    Thông tin sản phẩm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                        <Image
                          src={review.product.image}
                          alt={review.product.name}
                        width={80} 
                        height={80} 
                        className="rounded-md object-cover" 
                        />
                      </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="font-medium">{review.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {review.product.sku || `ID: ${review.product.id}`}
                        </p>
                      </div>
                      <p className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(review.product.price)}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/dashboard/products/${review.product.id}`}>
                        Xem chi tiết sản phẩm
                      </Link>
                    </Button>
                </div>
                </CardContent>
              </Card>

              {/* Order Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Thông tin đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Đơn hàng #{review.order.id}</p>
                    <p className="text-sm text-muted-foreground">Ngày đặt: {review.order.date}</p>
                    {review.verified && (
                      <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Đã xác nhận mua hàng
                      </Badge>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/dashboard/orders/${review.order.id}`}>
                        Xem chi tiết đơn hàng
                      </Link>
                    </Button>
              </div>
            </CardContent>
          </Card>
            </div>

            {/* Right columns: Review details and replies */}
            <div className="lg:col-span-2 space-y-6">
              {/* Review Card */}
          <Card>
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Nội dung đánh giá</CardTitle>
                    <CardDescription>Đã đăng vào {review.date}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(review.status)}>
                    {review.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {review.rating}/5
                      </span>
                    </div>
                    {review.title && (
                      <h3 className="font-medium">{review.title}</h3>
                    )}
                    <p className="text-sm whitespace-pre-line">{review.comment}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      <span>{review.helpful} người thấy hữu ích</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsDown className="mr-1 h-4 w-4" />
                      <span>{review.unhelpful} người không thấy hữu ích</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review Replies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Phản hồi ({review.replies.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {review.replies.length > 0 ? (
                <div className="space-y-4">
                  {review.replies.map((reply) => (
                        <div key={reply.id} className={`p-4 rounded-lg ${reply.isAdmin ? "bg-primary/5 border border-primary/10" : "bg-muted"}`}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium flex items-center">
                              {reply.isAdmin && (
                                <Badge variant="default" className="mr-2">Admin</Badge>
                              )}
                              {reply.author}
                            </div>
                            <div className="flex items-center">
                              <p className="text-xs text-muted-foreground">
                                {reply.date}
                                {reply.edited && (
                                  <span className="ml-2">(Đã chỉnh sửa{reply.editDate ? ` ${reply.editDate}` : ""})</span>
                                )}
                              </p>

                              {reply.isAdmin && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditReply(reply.id)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteReply(reply.id)}
                                      className="text-red-600"
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      Xóa
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                          {isEditing && editingReplyId === reply.id ? (
                            <div className="space-y-2">
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
                                    setIsEditing(false)
                                setEditingReplyId(null)
                              }}
                                  disabled={isSubmitting}
                            >
                              Hủy
                            </Button>
                                <Button
                                  size="sm"
                                  onClick={handleSaveEditedReply}
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Lưu thay đổi
                                </Button>
                              </div>
                          </div>
                          ) : (
                            <p className="whitespace-pre-line">{reply.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <MessageSquare className="mx-auto h-10 w-10 mb-2 opacity-50" />
                      <p>Chưa có phản hồi nào</p>
                </div>
              )}

                  {/* Add Reply Form */}
              <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Thêm phản hồi của quản trị viên</h3>
                    <div className="space-y-4">
                  <Textarea
                    placeholder="Nhập phản hồi của bạn..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitReply}
                          disabled={!replyText.trim() || isSubmitting}
                    >
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          <Send className="mr-2 h-4 w-4" />
                      Gửi phản hồi
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

              {/* Timeline */}
          <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="mr-2 h-5 w-5" />
                    Lịch sử đánh giá
                  </CardTitle>
            </CardHeader>
            <CardContent>
                  <Timeline>
                {review.timeline.map((event, index) => (
                      <TimelineItem key={event.id} isLast={index === review.timeline.length - 1}>
                        <TimelineOppositeContent>
                          {event.date}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineDot color={
                            event.action.includes("tạo") ? "primary" :
                            event.action.includes("duyệt") ? "success" :
                            event.action.includes("từ chối") ? "error" :
                            "default"
                          }>
                            {event.action.includes("tạo") ? <Star className="h-5 w-5" /> :
                             event.action.includes("duyệt") ? <Check className="h-5 w-5" /> :
                             event.action.includes("từ chối") ? <X className="h-5 w-5" /> :
                             event.action.includes("phản hồi") ? <MessageSquare className="h-5 w-5" /> :
                             <Clock className="h-5 w-5" />}
                          </TimelineDot>
                          <TimelineConnector isLast={index === review.timeline.length - 1} />
                        </TimelineSeparator>
                        <TimelineContent>
                          <p>{event.action}</p>
                          <p className="text-sm text-muted-foreground">bởi {event.by}</p>
                        </TimelineContent>
                      </TimelineItem>
                ))}
                  </Timeline>
            </CardContent>
          </Card>
        </div>
      </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy đánh giá</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/reviews">Quay lại danh sách</Link>
          </Button>
        </div>
      )}

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duyệt đánh giá này?</AlertDialogTitle>
            <AlertDialogDescription>
              Đánh giá sẽ được hiển thị công khai trên trang sản phẩm. Hành động này có thể được hoàn tác sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveReview} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {review?.status === "Đã duyệt" ? "Hủy duyệt đánh giá này?" : "Từ chối đánh giá này?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Đánh giá sẽ không được hiển thị công khai trên trang sản phẩm. Hành động này có thể được hoàn tác sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectReview}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đánh giá này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Đánh giá và tất cả các phản hồi sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
