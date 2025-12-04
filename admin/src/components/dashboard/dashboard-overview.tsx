"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, DollarSign, Package, ShoppingBag, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table"
import { TopSellingProducts } from "@/components/dashboard/top-selling-products"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { NewUsersTable } from "@/components/dashboard/new-users-table"
import { getDashboardStats, type DashboardData } from "@/lib/api/dashboard"
import { toast } from "@/components/ui/use-toast"

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await getDashboardStats()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải dữ liệu dashboard",
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : dashboardData ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`${dashboardData.stats.revenueChangePercent >= 0 ? "text-emerald-500" : "text-rose-500"} inline-flex items-center`}>
                        {dashboardData.stats.revenueChangePercent >= 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {formatPercent(dashboardData.stats.revenueChangePercent)}
                      </span>{" "}
                      so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{dashboardData.stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`${dashboardData.stats.ordersChangePercent >= 0 ? "text-emerald-500" : "text-rose-500"} inline-flex items-center`}>
                        {dashboardData.stats.ordersChangePercent >= 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {formatPercent(dashboardData.stats.ordersChangePercent)}
                      </span>{" "}
                      so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.stats.totalProducts.toLocaleString("vi-VN")}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`${dashboardData.stats.productsChangePercent >= 0 ? "text-emerald-500" : "text-rose-500"} inline-flex items-center`}>
                        {dashboardData.stats.productsChangePercent >= 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {formatPercent(dashboardData.stats.productsChangePercent)}
                      </span>{" "}
                      so với tháng trước
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+{dashboardData.stats.newUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className={`${dashboardData.stats.newUsersChangePercent >= 0 ? "text-emerald-500" : "text-rose-500"} inline-flex items-center`}>
                        {dashboardData.stats.newUsersChangePercent >= 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {formatPercent(dashboardData.stats.newUsersChangePercent)}
                      </span>{" "}
                      so với tháng trước
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Doanh thu theo thời gian</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <RevenueChart data={dashboardData.revenueChartData} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Sản phẩm bán chạy</CardTitle>
                    <CardDescription>Top 5 sản phẩm bán chạy nhất tháng này</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopSellingProducts products={dashboardData.topSellingProducts} />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Đơn hàng gần đây</CardTitle>
                    <CardDescription>Danh sách 5 đơn hàng mới nhất</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentOrdersTable orders={dashboardData.recentOrders} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Người dùng mới</CardTitle>
                    <CardDescription>Danh sách người dùng mới đăng ký</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NewUsersTable users={dashboardData.newUsers} />
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu để hiển thị
            </div>
          )}
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích chi tiết</CardTitle>
              <CardDescription>Xem phân tích chi tiết về doanh thu, đơn hàng và người dùng</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Đang phát triển...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo</CardTitle>
              <CardDescription>Tạo và xem các báo cáo chi tiết</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Đang phát triển...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
              <CardDescription>Xem tất cả thông báo hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Đang phát triển...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
