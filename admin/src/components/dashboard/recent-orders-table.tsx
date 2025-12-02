"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RecentOrder } from "@/lib/api/dashboard"

interface RecentOrdersTableProps {
  orders: RecentOrder[]
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }
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
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              Không có đơn hàng nào
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getStatusColor(order.status)} text-white border-none`}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(order.orderDate)}</TableCell>
              <TableCell className="text-right">{formatCurrency(order.orderTotal)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
