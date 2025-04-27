"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const orders = [
  {
    id: "ORD-1234",
    customer: "Nguyễn Văn A",
    status: "Đã giao hàng",
    date: "15/04/2023",
    total: "₫1,250,000",
  },
  {
    id: "ORD-1235",
    customer: "Trần Thị B",
    status: "Đang xử lý",
    date: "15/04/2023",
    total: "₫2,345,000",
  },
  {
    id: "ORD-1236",
    customer: "Lê Văn C",
    status: "Đang vận chuyển",
    date: "14/04/2023",
    total: "₫890,000",
  },
  {
    id: "ORD-1237",
    customer: "Phạm Thị D",
    status: "Đã hủy",
    date: "14/04/2023",
    total: "₫1,750,000",
  },
  {
    id: "ORD-1238",
    customer: "Hoàng Văn E",
    status: "Đã giao hàng",
    date: "13/04/2023",
    total: "₫3,450,000",
  },
]

export function RecentOrdersTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã giao hàng":
        return "bg-green-500"
      case "Đang xử lý":
        return "bg-blue-500"
      case "Đang vận chuyển":
        return "bg-yellow-500"
      case "Đã hủy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã đơn</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày</TableHead>
          <TableHead className="text-right">Tổng tiền</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>
              <Badge variant="outline" className={`${getStatusColor(order.status)} text-white border-none`}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell className="text-right">{order.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
