"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { RevenueChartData } from "@/lib/api/dashboard"

interface RevenueChartProps {
  data: RevenueChartData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map(item => ({
    name: item.period,
    revenue: item.revenue
  }))
  const formatRevenue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    return `${(value / 1000).toFixed(0)}K`
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        Không có dữ liệu để hiển thị
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatRevenue} />
        <Tooltip
          formatter={(value: number) => [`₫${value.toLocaleString("vi-VN")}`, "Doanh thu"]}
          labelFormatter={(label) => `Tháng ${label.substring(1)}`}
        />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
