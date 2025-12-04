"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, BarChart3, TrendingUp, Printer, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { generateReport } from "@/lib/api/reports"

export function ReportsTab() {
  const [reportType, setReportType] = useState<string>("revenue")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [exportFormat, setExportFormat] = useState<string>("csv")
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    { value: "revenue", label: "Báo cáo doanh thu", description: "Báo cáo chi tiết về doanh thu theo thời gian" },
    { value: "orders", label: "Báo cáo đơn hàng", description: "Thống kê và phân tích đơn hàng" },
    { value: "products", label: "Báo cáo sản phẩm", description: "Báo cáo về sản phẩm bán chạy và tồn kho" },
    { value: "users", label: "Báo cáo người dùng", description: "Thống kê người dùng và hoạt động" },
    { value: "sales", label: "Báo cáo bán hàng", description: "Phân tích chi tiết về bán hàng" },
  ]

  const handleGenerateReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn khoảng thời gian",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true)
      toast({
        title: "Đang tạo báo cáo",
        description: `Đang tạo báo cáo ${reportTypes.find(r => r.value === reportType)?.label}...`,
      })
      
      await generateReport({
        reportType: reportType,
        startDate: dateRange.from!,
        endDate: dateRange.to!,
        format: exportFormat,
      })

      toast({
        title: "Thành công",
        description: "Báo cáo đã được tạo và tải xuống thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tạo báo cáo",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn khoảng thời gian",
        variant: "destructive",
      })
      return
    }

    await handleGenerateReport()
  }

  return (
    <div className="space-y-4">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Tạo báo cáo</CardTitle>
          <CardDescription>Chọn loại báo cáo và khoảng thời gian để tạo báo cáo chi tiết</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loại báo cáo</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Định dạng xuất</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel" disabled>Excel (Sắp có)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Khoảng thời gian</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
              <PopoverContent className="w-auto p-0" align="start">
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
          </div>
          <div className="flex gap-2">
            <Button onClick={handleGenerateReport} className="flex-1" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Tạo báo cáo
                </>
              )}
            </Button>
            <Button onClick={handleExportReport} variant="outline" disabled={isGenerating}>
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((type) => (
          <Card key={type.value} className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{type.label}</CardTitle>
                {type.value === "revenue" && <TrendingUp className="h-5 w-5 text-muted-foreground" />}
                {type.value === "orders" && <BarChart3 className="h-5 w-5 text-muted-foreground" />}
                {type.value === "products" && <FileText className="h-5 w-5 text-muted-foreground" />}
                {type.value === "users" && <FileText className="h-5 w-5 text-muted-foreground" />}
                {type.value === "sales" && <BarChart3 className="h-5 w-5 text-muted-foreground" />}
              </div>
              <CardDescription className="text-xs">{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isGenerating}
                onClick={() => {
                  setReportType(type.value)
                  handleGenerateReport()
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Tạo báo cáo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo đã tạo</CardTitle>
          <CardDescription>Danh sách các báo cáo đã được tạo gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Báo cáo doanh thu tháng 12/2024</p>
                  <p className="text-xs text-muted-foreground">Đã tạo: 15/12/2024 10:30</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-center py-4 text-sm text-muted-foreground">
              Chưa có báo cáo nào được tạo
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

