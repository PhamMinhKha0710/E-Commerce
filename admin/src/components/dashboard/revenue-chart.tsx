"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "T1",
    revenue: 32400000,
  },
  {
    name: "T2",
    revenue: 45600000,
  },
  {
    name: "T3",
    revenue: 78900000,
  },
  {
    name: "T4",
    revenue: 67800000,
  },
  {
    name: "T5",
    revenue: 89100000,
  },
  {
    name: "T6",
    revenue: 102300000,
  },
  {
    name: "T7",
    revenue: 123400000,
  },
  {
    name: "T8",
    revenue: 145600000,
  },
  {
    name: "T9",
    revenue: 134500000,
  },
  {
    name: "T10",
    revenue: 156700000,
  },
  {
    name: "T11",
    revenue: 178900000,
  },
  {
    name: "T12",
    revenue: 198700000,
  },
]

export function RevenueChart() {
  const formatRevenue = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    return `${(value / 1000).toFixed(0)}K`
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
