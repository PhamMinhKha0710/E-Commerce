"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Check, 
  ChevronDown, 
  Filter, 
  MoreHorizontal, 
  Search, 
  Star, 
  X, 
  Calendar, 
  Inbox,
  Clock,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Layers,
  Loader2,
  MessageSquare
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Skeleton } from "@/components/ui/skeleton"
import { getReviews, updateReviewStatus, ReviewDto, ReviewsListDto } from "@/lib/api/reviews"

// Define a type for our transformed review structure that's friendlier to our UI
interface UIReview {
  id: string;
  product: string;
  productId: number;
  customer: string;
  customerId: number;
  avatar?: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
  helpfulCount?: number;
  unhelpfulCount?: number;
  hasReplies?: boolean;
}

export function ReviewManagement() {
  const { toast } = useToast()
  const [reviewsList, setReviewsList] = useState<UIReview[]>([])
  const [reviewsData, setReviewsData] = useState<ReviewsListDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRating, setFilterRating] = useState("all")
  const [reviewToAction, setReviewToAction] = useState<string | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const data = await getReviews(currentPage, pageSize)
        setReviewsData(data)
        
        // Transform API data to match our UI format
        const transformedReviews = data.reviews.map(review => ({
          id: review.id.toString(),
          product: review.product.name,
          productId: review.product.id,
          customer: `${review.user.firstName} ${review.user.lastName}`,
          customerId: review.user.id,
          avatar: review.user.email ? `https://gravatar.com/avatar/${createMd5(review.user.email)}?d=mp` : undefined,
          initials: getInitials(`${review.user.firstName} ${review.user.lastName}`),
          rating: review.ratingValue,
          comment: review.comment,
          date: new Date(review.created).toLocaleDateString('vi-VN'),
          status: formatStatus(review.isStatus),
          hasReplies: false // We'll assume no replies since the DTO doesn't include this information
        }))
        
        setReviewsList(transformedReviews)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch reviews:", err)
        setError("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReviews()
  }, [currentPage, pageSize])
  
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
  
  // Filter reviews based on search term and filters
  const filteredReviews = reviewsList.filter(review => {
    const matchesSearch = 
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.id.toLowerCase().includes(searchTerm.toLowerCase())
      
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "pending" && review.status === "Chờ duyệt") ||
      (filterStatus === "approved" && review.status === "Đã duyệt") ||
      (filterStatus === "rejected" && review.status === "Đã từ chối")
      
    const matchesRating =
      filterRating === "all" ||
      (filterRating === "5" && review.rating === 5) ||
      (filterRating === "4" && review.rating === 4) ||
      (filterRating === "3" && review.rating === 3) ||
      (filterRating === "2" && review.rating === 2) ||
      (filterRating === "1" && review.rating === 1)
      
    return matchesSearch && matchesStatus && matchesRating
  })
  
  // Count reviews by status
  const pendingCount = reviewsList.filter(r => r.status === "Chờ duyệt").length
  const approvedCount = reviewsList.filter(r => r.status === "Đã duyệt").length
  const rejectedCount = reviewsList.filter(r => r.status === "Đã từ chối").length

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }
  
  const handleApproveReview = async () => {
    if (!reviewToAction) return

    setIsLoading(true)
    try {
      const reviewId = parseInt(reviewToAction, 10)
      await updateReviewStatus(reviewId, true)
      
      // Update local state to reflect the change
      setReviewsList(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewToAction 
            ? { ...review, status: "Đã duyệt" } 
            : review
        )
      )
      
      toast({
        title: "Đánh giá đã được duyệt",
        description: "Đánh giá sẽ hiển thị công khai trên trang sản phẩm",
      })
    } catch (error) {
      console.error("Failed to approve review:", error)
      toast({
        title: "Lỗi",
        description: "Không thể duyệt đánh giá. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowApproveDialog(false)
      setReviewToAction(null)
    }
  }
  
  const handleRejectReview = async () => {
    if (!reviewToAction) return

    setIsLoading(true)
    try {
      const reviewId = parseInt(reviewToAction, 10)
      await updateReviewStatus(reviewId, false)
      
      // Update local state to reflect the change
      setReviewsList(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewToAction 
            ? { ...review, status: "Chờ duyệt" } 
            : review
        )
      )
      
      toast({
        title: "Đánh giá đã bị từ chối",
        description: "Đánh giá sẽ không hiển thị trên trang sản phẩm",
      })
    } catch (error) {
      console.error("Failed to reject review:", error)
      toast({
        title: "Lỗi",
        description: "Không thể từ chối đánh giá. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowRejectDialog(false)
      setReviewToAction(null)
    }
  }
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Lọc
          </Button>
          <Button variant="outline" size="sm">
            Xuất Excel
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng đánh giá</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold">{reviewsData?.totalCount || 0}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đánh giá chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              <div className="text-2xl font-bold">{pendingCount}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đánh giá thấp (1-2 sao)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              <div className="text-2xl font-bold">
                {reviewsList.filter(r => r.rating <= 2).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              Chờ duyệt
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-2">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
            <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Select
              value={filterRating}
              onValueChange={setFilterRating}
            >
              <SelectTrigger className="w-[120px]">
                <Star className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sao</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">4 sao</SelectItem>
                <SelectItem value="3">3 sao</SelectItem>
                <SelectItem value="2">2 sao</SelectItem>
                <SelectItem value="1">1 sao</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm..."
                className="pl-8 w-[200px] sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[70%]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                <h3 className="text-lg font-medium">Có lỗi xảy ra</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Thử lại</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {filteredReviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <Inbox className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">Không có đánh giá nào</h3>
                      <p className="text-sm text-muted-foreground">Không tìm thấy đánh giá phù hợp với bộ lọc.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã</TableHead>
                          <TableHead>Khách hàng</TableHead>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead>Đánh giá</TableHead>
                          <TableHead>Nội dung</TableHead>
                          <TableHead>Ngày tạo</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell className="font-medium">{review.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={review.avatar} alt={review.customer} />
                                  <AvatarFallback>{review.initials}</AvatarFallback>
                                </Avatar>
                                <div>{review.customer}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[200px] truncate" title={review.product}>
                                {review.product}
                              </div>
                            </TableCell>
                            <TableCell>{renderStars(review.rating)}</TableCell>
                            <TableCell>
                              <div className="max-w-[200px] truncate" title={review.comment}>
                                {review.comment}
                              </div>
                            </TableCell>
                            <TableCell>{review.date}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className="flex items-center gap-1.5 w-fit"
                              >
                                <span 
                                  className={`h-2 w-2 rounded-full ${getStatusColor(review.status)}`} 
                                  aria-hidden="true" 
                                />
                                {review.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Mở menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/reviews/${review.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Xem chi tiết
                                    </Link>
                                  </DropdownMenuItem>
                                  {review.status === "Chờ duyệt" && (
                                    <>
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          setReviewToAction(review.id)
                                          setShowApproveDialog(true)
                                        }}
                                      >
                                        <Check className="mr-2 h-4 w-4" />
                                        Duyệt đánh giá
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => {
                                          setReviewToAction(review.id)
                                          setShowRejectDialog(true)
                                        }}
                                      >
                                        <X className="mr-2 h-4 w-4" />
                                        Từ chối
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {review.status === "Đã duyệt" && (
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setReviewToAction(review.id)
                                        setShowRejectDialog(true)
                                      }}
                                    >
                                      <X className="mr-2 h-4 w-4" />
                                      Hủy duyệt
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {reviewsData && reviewsData.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  {[...Array(reviewsData.totalPages)].map((_, i) => (
                    <Button 
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === reviewsData.totalPages}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {/* Similar content as "all" but filtered for pending */}
          {/* For brevity, we're not duplicating the full content */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewsList
                    .filter(r => r.status === "Chờ duyệt")
                    .map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={review.avatar} alt={review.customer} />
                              <AvatarFallback>{review.initials}</AvatarFallback>
                            </Avatar>
                            <div>{review.customer}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={review.product}>
                            {review.product}
                          </div>
                        </TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={review.comment}>
                            {review.comment}
                          </div>
                        </TableCell>
                        <TableCell>{review.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/dashboard/reviews/${review.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Chi tiết
                              </Link>
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setReviewToAction(review.id)
                                setShowApproveDialog(true)
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
        
        {/* Similar content for "approved" and "rejected" tabs */}
        <TabsContent value="approved" className="mt-6">
          {/* Approved reviews content */}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {/* Rejected reviews content */}
        </TabsContent>
      </Tabs>
      
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
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveReview} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Từ chối đánh giá này?</AlertDialogTitle>
            <AlertDialogDescription>
              Đánh giá sẽ không được hiển thị công khai trên trang sản phẩm. Hành động này có thể được hoàn tác sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRejectReview} 
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
