"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle, Info, X, Filter } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Notification {
  id: number
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  category: "order" | "product" | "user" | "system"
}

export function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<"all" | "unread" | "order" | "product" | "user" | "system">("all")

  useEffect(() => {
    // TODO: Fetch notifications from API
    // Mock data for now
    const mockNotifications: Notification[] = [
      {
        id: 1,
        type: "success",
        title: "Đơn hàng mới",
        message: "Đơn hàng #ORD-123456 đã được đặt thành công",
        timestamp: new Date(),
        read: false,
        category: "order"
      },
      {
        id: 2,
        type: "warning",
        title: "Sản phẩm sắp hết hàng",
        message: "Sản phẩm 'iPhone 14 Pro Max' chỉ còn 5 sản phẩm trong kho",
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        category: "product"
      },
      {
        id: 3,
        type: "info",
        title: "Người dùng mới",
        message: "Có 5 người dùng mới đăng ký trong ngày hôm nay",
        timestamp: new Date(Date.now() - 7200000),
        read: true,
        category: "user"
      },
      {
        id: 4,
        type: "error",
        title: "Lỗi hệ thống",
        message: "Có lỗi xảy ra khi xử lý thanh toán đơn hàng #ORD-123455",
        timestamp: new Date(Date.now() - 10800000),
        read: false,
        category: "system"
      },
    ]
    setNotifications(mockNotifications)
  }, [])

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true
    if (filter === "unread") return !notif.read
    return notif.category === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-rose-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getCategoryLabel = (category: Notification["category"]) => {
    switch (category) {
      case "order":
        return "Đơn hàng"
      case "product":
        return "Sản phẩm"
      case "user":
        return "Người dùng"
      case "system":
        return "Hệ thống"
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Thông báo
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} chưa đọc
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Quản lý và xem tất cả thông báo hệ thống</CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Tất cả
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Chưa đọc ({unreadCount})
            </Button>
            <Button
              variant={filter === "order" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("order")}
            >
              Đơn hàng
            </Button>
            <Button
              variant={filter === "product" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("product")}
            >
              Sản phẩm
            </Button>
            <Button
              variant={filter === "user" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("user")}
            >
              Người dùng
            </Button>
            <Button
              variant={filter === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("system")}
            >
              Hệ thống
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Không có thông báo nào
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-colors",
                !notification.read && "bg-accent/50 border-primary/20"
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold">{notification.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(notification.category)}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(notification.timestamp, "dd/MM/yyyy HH:mm", { locale: vi })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Đánh dấu đã đọc
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}





















