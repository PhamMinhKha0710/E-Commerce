"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Eye, MoveDown, MoveUp, Trash } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

// Type definitions for API integration
interface Report {
  id: string
  title: string
  type: string
  description: string
  status: string
  createdBy: string
  createdAt: string
  updatedAt: string
  data: ReportData
}

interface ReportData {
  timeRange: string
  chartType: string
  dimensions: string[]
  metrics: string[]
  filters: Filter[]
}

interface Filter {
  field: string
  operator: string
  value: string
}

// Mock data function - will be replaced with API fetch
const fetchReport = async (id: string): Promise<Report> => {
  // Example API call:
  // return await fetch(`/api/reports/${id}`).then(res => res.json())
  return {
    id,
    title: "Báo cáo doanh thu theo danh mục",
    type: "Doanh thu",
    description: "Phân tích doanh thu theo danh mục sản phẩm trong 3 tháng gần nhất",
    status: "Đã xuất bản",
    createdBy: "Admin",
    createdAt: "2023-06-15",
    updatedAt: "2023-08-22",
    data: {
      timeRange: "3 tháng gần nhất",
      chartType: "Bar chart",
      dimensions: ["Danh mục", "Thời gian"],
      metrics: ["Doanh thu", "Số đơn hàng"],
      filters: [
        { field: "Danh mục", operator: "IN", value: "Điện thoại, Laptop, Tablet" }
      ]
    }
  }
}

// Mock update function - will be replaced with API call
const updateReport = async (id: string, data: Report): Promise<Report> => {
  // Example API call:
  // return await fetch(`/api/reports/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => res.json())
  console.log("Updating report:", id, data)
  return data
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedReport, setEditedReport] = useState<Report | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const reportData = await fetchReport(params.id)
        setReport(reportData)
        setEditedReport(reportData)
      } catch (error) {
        console.error("Error loading report data:", error)
      }
    }
    
    loadData()
  }, [params.id])

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave()
    } else {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!editedReport) return
    
    setIsLoading(true)
    try {
      const updated = await updateReport(params.id, editedReport)
      setReport(updated)
      setIsEditing(false)
      // Success notification could be added here
    } catch (error) {
      console.error("Error updating report:", error)
      // Error notification could be added here
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof Report, value: any) => {
    if (!editedReport) return
    setEditedReport({ ...editedReport, [field]: value })
  }

  const handleDataChange = (field: keyof ReportData, value: any) => {
    if (!editedReport) return
    setEditedReport({
      ...editedReport,
      data: {
        ...editedReport.data,
        [field]: value
      }
    })
  }

  if (!report || !editedReport) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết báo cáo</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Thông tin báo cáo</CardTitle>
                <CardDescription>Xem và chỉnh sửa thông tin chi tiết</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button onClick={handleEditToggle} disabled={isLoading}>
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                ) : (
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleEditToggle}>
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề báo cáo</Label>
                    <Input 
                      id="title" 
                      value={editedReport.title} 
                      onChange={e => handleChange("title", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại báo cáo</Label>
                    <Select 
                      value={editedReport.type} 
                      onValueChange={value => handleChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại báo cáo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doanh thu">Doanh thu</SelectItem>
                        <SelectItem value="Sản phẩm">Sản phẩm</SelectItem>
                        <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                        <SelectItem value="Đơn hàng">Đơn hàng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea 
                      id="description" 
                      rows={3} 
                      value={editedReport.description} 
                      onChange={e => handleChange("description", e.target.value)} 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tiêu đề báo cáo</p>
                      <p className="font-medium">{report.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loại báo cáo</p>
                      <p className="font-medium">{report.type}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Mô tả</p>
                      <p className="font-medium">{report.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trạng thái</p>
                      <Badge variant="outline" className={`${
                        report.status === "Đã xuất bản" ? "bg-green-500" : 
                        report.status === "Nháp" ? "bg-yellow-500" :
                        "bg-gray-500"
                      } text-white border-none mt-1`}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cấu hình báo cáo</CardTitle>
              <CardDescription>Thông tin cấu hình và dữ liệu báo cáo</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time-range">Khoảng thời gian</Label>
                    <Select 
                      value={editedReport.data.timeRange} 
                      onValueChange={value => handleDataChange("timeRange", value)}
                    >
                      <SelectTrigger id="time-range">
                        <SelectValue placeholder="Chọn khoảng thời gian" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7 ngày gần nhất">7 ngày gần nhất</SelectItem>
                        <SelectItem value="30 ngày gần nhất">30 ngày gần nhất</SelectItem>
                        <SelectItem value="3 tháng gần nhất">3 tháng gần nhất</SelectItem>
                        <SelectItem value="6 tháng gần nhất">6 tháng gần nhất</SelectItem>
                        <SelectItem value="12 tháng gần nhất">12 tháng gần nhất</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chart-type">Loại biểu đồ</Label>
                    <Select 
                      value={editedReport.data.chartType} 
                      onValueChange={value => handleDataChange("chartType", value)}
                    >
                      <SelectTrigger id="chart-type">
                        <SelectValue placeholder="Chọn loại biểu đồ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bar chart">Bar chart</SelectItem>
                        <SelectItem value="Line chart">Line chart</SelectItem>
                        <SelectItem value="Pie chart">Pie chart</SelectItem>
                        <SelectItem value="Area chart">Area chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Kích thước</Label>
                    <div className="flex flex-col gap-2">
                      {editedReport.data.dimensions.map((dimension, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            value={dimension} 
                            onChange={e => {
                              const newDimensions = [...editedReport.data.dimensions]
                              newDimensions[index] = e.target.value
                              handleDataChange("dimensions", newDimensions)
                            }} 
                          />
                          <Button variant="outline" size="icon" type="button" onClick={() => {
                            const newDimensions = [...editedReport.data.dimensions]
                            newDimensions.splice(index, 1)
                            handleDataChange("dimensions", newDimensions)
                          }}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => {
                          handleDataChange("dimensions", [...editedReport.data.dimensions, ""])
                        }}
                      >
                        Thêm kích thước
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Số liệu</Label>
                    <div className="flex flex-col gap-2">
                      {editedReport.data.metrics.map((metric, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            value={metric} 
                            onChange={e => {
                              const newMetrics = [...editedReport.data.metrics]
                              newMetrics[index] = e.target.value
                              handleDataChange("metrics", newMetrics)
                            }} 
                          />
                          <Button variant="outline" size="icon" type="button" onClick={() => {
                            const newMetrics = [...editedReport.data.metrics]
                            newMetrics.splice(index, 1)
                            handleDataChange("metrics", newMetrics)
                          }}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => {
                          handleDataChange("metrics", [...editedReport.data.metrics, ""])
                        }}
                      >
                        Thêm số liệu
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Khoảng thời gian</p>
                      <p className="font-medium">{report.data.timeRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loại biểu đồ</p>
                      <p className="font-medium">{report.data.chartType}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Kích thước</p>
                    <div className="flex flex-wrap gap-2">
                      {report.data.dimensions.map((dimension, index) => (
                        <Badge key={index} variant="outline">{dimension}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Số liệu</p>
                    <div className="flex flex-wrap gap-2">
                      {report.data.metrics.map((metric, index) => (
                        <Badge key={index} variant="outline">{metric}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Bộ lọc</p>
                    {report.data.filters.length > 0 ? (
                      <div className="space-y-2">
                        {report.data.filters.map((filter, index) => (
                          <div key={index} className="p-2 border rounded-md">
                            <p className="text-sm">
                              <span className="font-medium">{filter.field}</span>
                              {" "}
                              <span>{filter.operator}</span>
                              {" "}
                              <span>{filter.value}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Không có bộ lọc nào được áp dụng</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xem trước báo cáo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="bg-muted/50 rounded-md w-full aspect-video flex items-center justify-center">
                <p className="text-muted-foreground">Biểu đồ {report.data.chartType}</p>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Xem đầy đủ
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Mã báo cáo</p>
                  <p className="font-medium">{report.id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Tạo bởi</p>
                  <p className="font-medium">{report.createdBy}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{report.createdAt}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="font-medium">{report.updatedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full flex items-center gap-2" variant="outline">
                <MoveUp className="h-4 w-4" />
                Xuất báo cáo
              </Button>
              <Button className="w-full flex items-center gap-2" variant="outline">
                <MoveDown className="h-4 w-4" />
                Tải xuống PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Xóa báo cáo</CardTitle>
              <CardDescription>Hành động này không thể khôi phục</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full flex items-center gap-2">
                    <Trash className="h-4 w-4" />
                    Xóa báo cáo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bạn có chắc chắn muốn xóa?</DialogTitle>
                    <DialogDescription>
                      Hành động này sẽ xóa vĩnh viễn báo cáo "{report.title}" và không thể khôi phục.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline">Hủy</Button>
                    <Button variant="destructive">Xóa vĩnh viễn</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
