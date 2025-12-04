"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, TrendingUp, TrendingDown, BarChart3, DollarSign, Package, ShoppingBag, Users } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { getDashboardStats, type DashboardData } from "@/lib/api/dashboard"
import { toast } from "@/components/ui/use-toast"
import { RevenueChart } from "./revenue-chart"

interface AnalyticsTabProps {
  initialData?: DashboardData | null
}

export function AnalyticsTab({ initialData }: AnalyticsTabProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [analyticsData, setAnalyticsData] = useState<DashboardData | null>(initialData || null)
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState<"revenue" | "orders" | "products" | "users">("revenue")

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchAnalyticsData()
    }
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const data = await getDashboardStats(dateRange.from, dateRange.to)
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải dữ liệu phân tích",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`
  }

  const exportReport = () => {
    // TODO: Implement export functionality
    toast({
      title: "Thông báo",
      description: "Tính năng xuất báo cáo đang được phát triển",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Đang tải dữ liệu phân tích...</span>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không có dữ liệu để hiển thị
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Date Range Picker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Phân tích chi tiết</CardTitle>
              <CardDescription>Xem phân tích chi tiết về doanh thu, đơn hàng và người dùng</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                      )
                    ) : (
                      <span>Chọn khoảng thời gian</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      })
                    }}
                    numberOfMonths={2}
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
              <Button onClick={exportReport} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* View Selector */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">
            <TrendingUp className="mr-2 h-4 w-4" />
            Doanh thu
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Đơn hàng
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="mr-2 h-4 w-4" />
            Sản phẩm
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Người dùng
          </TabsTrigger>
        </TabsList>

        {/* Revenue Analytics */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={cn(
                    "inline-flex items-center",
                    analyticsData.stats.revenueChangePercent >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {analyticsData.stats.revenueChangePercent >= 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {formatPercent(analyticsData.stats.revenueChangePercent)}
                  </span>{" "}
                  so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đơn hàng đã thanh toán</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={cn(
                    "inline-flex items-center",
                    analyticsData.stats.ordersChangePercent >= 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {analyticsData.stats.ordersChangePercent >= 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {formatPercent(analyticsData.stats.ordersChangePercent)}
                  </span>{" "}
                  so với kỳ trước
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giá trị đơn hàng trung bình</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.stats.totalOrders > 0
                    ? formatCurrency(analyticsData.stats.totalRevenue / analyticsData.stats.totalOrders)
                    : formatCurrency(0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Trung bình mỗi đơn hàng
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ doanh thu theo thời gian</CardTitle>
              <CardDescription>Xu hướng doanh thu trong khoảng thời gian đã chọn</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={analyticsData.revenueChartData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Analytics */}
        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê đơn hàng</CardTitle>
                <CardDescription>Phân tích đơn hàng trong kỳ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tổng số đơn hàng</span>
                    <span className="text-lg font-semibold">{analyticsData.stats.totalOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tổng doanh thu</span>
                    <span className="text-lg font-semibold">{formatCurrency(analyticsData.stats.totalRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Giá trị trung bình</span>
                    <span className="text-lg font-semibold">
                      {analyticsData.stats.totalOrders > 0
                        ? formatCurrency(analyticsData.stats.totalRevenue / analyticsData.stats.totalOrders)
                        : formatCurrency(0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <CardDescription>5 đơn hàng mới nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.recentOrders.map((order) => (
                    <div key={order.orderId} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="text-sm font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatCurrency(order.orderTotal)}</p>
                        <p className="text-xs text-muted-foreground">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Analytics */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
              <CardDescription>Top sản phẩm bán chạy nhất trong kỳ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topSellingProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Đã bán: {product.salesCount} sản phẩm
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.progressPercent.toFixed(1)}% tổng doanh thu
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Analytics */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Người dùng mới</CardTitle>
                <CardDescription>Thống kê người dùng mới đăng ký</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tổng người dùng mới</span>
                    <span className="text-lg font-semibold">{analyticsData.stats.newUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tỷ lệ tăng trưởng</span>
                    <span className={cn(
                      "text-lg font-semibold",
                      analyticsData.stats.newUsersChangePercent >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {formatPercent(analyticsData.stats.newUsersChangePercent)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Danh sách người dùng mới</CardTitle>
                <CardDescription>5 người dùng mới nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.newUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                          {user.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: vi })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

