"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  Box,
  CircleUser,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Percent,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  Users,
  X,
  Bell,
  HelpCircle,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/layout/sidebar-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getUserInfo, isAuthenticated, logout, getCurrentUser } from "@/lib/api/auth"
import { useEffect, useState } from "react"
import { getUsers } from "@/lib/api/users"
import { fetchAdminOrders } from "@/lib/api/orders"
import { getProducts } from "@/lib/api/products"

// Type cho route navigation
interface NavRoute {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  active: boolean;
  badge?: string;
}

interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: "order" | "product" | "user" | "system";
  read?: boolean;
}

const formatNotificationTime = (dateInput?: string) => {
  const date = dateInput ? new Date(dateInput) : new Date()
  if (Number.isNaN(date.getTime())) {
    return "Vừa xong"
  }
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter();
  const { isOpen, isMobileOpen, toggleSidebar, toggleMobileSidebar, closeMobileSidebar } = useSidebar()
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra xác thực khi component được mount
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Lấy thông tin người dùng từ API để có thông tin đầy đủ và kiểm tra role
    const fetchUserInfo = async () => {
      try {
        // Thử lấy từ API trước
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // Kiểm tra role admin - BẢO VỆ CLIENT-SIDE
          const userRole = currentUser.role?.toLowerCase();
          if (userRole !== 'admin') {
            // User không phải admin, xóa token và redirect
            logout();
            toast.error("Bạn không có quyền truy cập khu vực quản trị!", {
              description: "Chỉ có role Admin mới được phép truy cập.",
              duration: 5000,
            });
            router.push('/403?error=access_denied&from=' + encodeURIComponent(pathname));
            return;
          }
          
          // Tạo name từ firstName và lastName nếu có
          const displayName = currentUser.name || 
            (currentUser.firstName && currentUser.lastName 
              ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
              : currentUser.firstName || currentUser.lastName || '');
          
          setUser({
            name: displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
          });
        } else {
          // Fallback: lấy từ localStorage và kiểm tra role
          const userInfo = getUserInfo();
          if (userInfo) {
            const userRole = userInfo.role?.toLowerCase();
            if (userRole !== 'admin') {
              // User không phải admin, xóa token và redirect
              logout();
              toast.error("Bạn không có quyền truy cập khu vực quản trị!", {
                description: "Chỉ có role Admin mới được phép truy cập.",
                duration: 5000,
              });
              router.push('/403?error=access_denied&from=' + encodeURIComponent(pathname));
              return;
            }
            
            const displayName = userInfo.name || 
              (userInfo.firstName && userInfo.lastName 
                ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
                : userInfo.firstName || userInfo.lastName || '');
            
            setUser({
              name: displayName || userInfo.email.split('@')[0],
              email: userInfo.email,
            });
          } else {
            // Không có thông tin user, redirect về login
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Fallback: lấy từ localStorage và kiểm tra role
        const userInfo = getUserInfo();
        if (userInfo) {
          const userRole = userInfo.role?.toLowerCase();
          if (userRole !== 'admin') {
            // User không phải admin, xóa token và redirect
            logout();
            toast.error("Bạn không có quyền truy cập khu vực quản trị!", {
              description: "Chỉ có role Admin mới được phép truy cập.",
              duration: 5000,
            });
            router.push('/403?error=access_denied&from=' + encodeURIComponent(pathname));
            return;
          }
          
          const displayName = userInfo.name || 
            (userInfo.firstName && userInfo.lastName 
              ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
              : userInfo.firstName || userInfo.lastName || '');
          
          setUser({
            name: displayName || userInfo.email.split('@')[0],
            email: userInfo.email,
          });
        } else {
          router.push('/login');
        }
      }
    };
    
    fetchUserInfo();
    
    // Fetch user count for badge
    const fetchUserCount = async () => {
      try {
        const response = await getUsers({ page: 1, pageSize: 1 });
        setUserCount(response.total);
      } catch (error) {
        console.error('Error fetching user count:', error);
        // Silently fail - don't show badge if error
      }
    };
    
    fetchUserCount();
  }, [router, pathname]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotificationsLoading(true)
      setNotificationsError(null)
      try {
        const [ordersResponse, productsResponse, usersResponse] = await Promise.all([
          fetchAdminOrders({ page: 1, pageSize: 5 }),
          getProducts(1, 25),
          getUsers({ page: 1, pageSize: 5 }),
        ])

        const orderNotifications: DashboardNotification[] = (ordersResponse.orders || [])
          .slice(0, 3)
          .map((order) => ({
            id: `order-${order.orderId}`,
            title: "Đơn hàng mới",
            description: `Đơn hàng ${order.orderNumber} của ${order.customerName} vừa được tạo`,
            timestamp: order.orderDate,
            category: "order" as const,
          }))

        const lowStockNotifications: DashboardNotification[] = (productsResponse.products || [])
          .filter((product) => typeof product.stock === "number" && product.stock <= 5)
          .slice(0, 3)
          .map((product) => ({
            id: `product-${product.id}`,
            title: "Sản phẩm sắp hết hàng",
            description: `'${product.name}' chỉ còn ${product.stock} sản phẩm trong kho`,
            timestamp: (product as any).updatedAt || new Date().toISOString(),
            category: "product" as const,
          }))

        const userNotifications: DashboardNotification[] = (usersResponse.users || [])
          .slice(0, 3)
          .map((user) => ({
            id: `user-${user.id}`,
            title: "Người dùng mới",
            description: `${user.name || user.email} vừa đăng ký tài khoản`,
            timestamp: user.createdAt,
            category: "user" as const,
          }))

        const merged = [...orderNotifications, ...lowStockNotifications, ...userNotifications]

        setNotifications((prev) => {
          const readMap = new Map(prev.map((notification) => [notification.id, notification.read]))
          const next = merged
            .map((notification) => ({
              ...notification,
              read: readMap.get(notification.id) ?? false,
            }))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          return next
        })
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setNotificationsError("Không thể tải thông báo. Vui lòng thử lại sau.")
      } finally {
        setNotificationsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
    router.push('/login');
  };

  const mainRoutes: NavRoute[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Người dùng",
      icon: Users,
      href: "/dashboard/users",
      active: pathname === "/dashboard/users",
      badge: userCount !== null ? (userCount > 99 ? "99+" : userCount.toString()) : undefined,
    },
    {
      label: "Sản phẩm",
      icon: Package,
      href: "/dashboard/products",
      active: pathname === "/dashboard/products",
    },
  ]

  const catalogRoutes: NavRoute[] = [
    {
      label: "Danh mục",
      icon: Tag,
      href: "/dashboard/categories",
      active: pathname === "/dashboard/categories",
    },
    {
      label: "Thương hiệu",
      icon: Box,
      href: "/dashboard/brands",
      active: pathname === "/dashboard/brands",
    },
  ]

  const salesRoutes: NavRoute[] = [
    {
      label: "Đơn hàng",
      icon: ShoppingBag,
      href: "/dashboard/orders",
      active: pathname === "/dashboard/orders",
      // badge: undefined, // Removed hardcoded badge - can be added later with real data
    },
    {
      label: "Đánh giá",
      icon: Star,
      href: "/dashboard/reviews",
      active: pathname === "/dashboard/reviews",
      // badge: undefined, // Removed hardcoded badge - can be added later with real data
    },
    {
      label: "Báo cáo",
      icon: BarChart3,
      href: "/dashboard/reports",
      active: pathname === "/dashboard/reports",
    },
    {
      label: "Khuyến mãi",
      icon: Percent,
      href: "/dashboard/promotions",
      active: pathname === "/dashboard/promotions",
    },
  ]

  const sidebarVariants = {
    open: { width: "18rem", transition: { duration: 0.3 } },
    closed: { width: "5rem", transition: { duration: 0.3 } },
  }

  const textVariants = {
    open: { opacity: 1, display: "block", transition: { delay: 0.1, duration: 0.2 } },
    closed: { opacity: 0, display: "none", transition: { duration: 0.2 } },
  }

  const renderNavLinks = (routes: NavRoute[], sectionName = "") => (
    <>
      {sectionName && isOpen && (
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{sectionName}</p>
        </div>
      )}
      <div className="space-y-1 px-3">
        {routes.map((route) => (
          <TooltipProvider key={route.href} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground relative group",
                    route.active
                      ? "bg-accent text-accent-foreground dark:bg-accent/80"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <route.icon className="h-5 w-5 flex-shrink-0" />
                  <motion.span
                    variants={textVariants}
                    animate={isOpen ? "open" : "closed"}
                    initial={isOpen ? "open" : "closed"}
                    className="flex-1 truncate"
                  >
                    {route.label}
                  </motion.span>
                  {route.badge && (
                    <motion.div
                      variants={textVariants}
                      animate={isOpen ? "open" : "closed"}
                      initial={isOpen ? "open" : "closed"}
                    >
                      <Badge variant="secondary" className="ml-auto">
                        {route.badge}
                      </Badge>
                    </motion.div>
                  )}
                  {!isOpen && route.badge && (
                    <Badge
                      variant="secondary"
                      className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {route.badge}
                    </Badge>
                  )}
                </Link>
              </TooltipTrigger>
              {!isOpen && <TooltipContent side="right">{route.label}</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </>
  )

  const renderUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar || undefined} alt="Avatar" />
            <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderNotificationDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Thông báo</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Bạn đã xem tất cả thông báo"}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-xs" onClick={markAllNotificationsAsRead}>
            Đánh dấu tất cả
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notificationsLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải thông báo...
            </div>
          ) : notificationsError ? (
            <div className="px-4 py-6 text-center text-sm text-destructive">
              {notificationsError}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Hiện chưa có thông báo nào
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                className={cn(
                  "w-full px-4 py-3 text-left transition-colors hover:bg-muted",
                  !notification.read && "bg-muted/40",
                )}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatNotificationTime(notification.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Badge variant="outline">
                    {notification.category === "order" && "Đơn hàng"}
                    {notification.category === "product" && "Sản phẩm"}
                    {notification.category === "user" && "Người dùng"}
                    {notification.category === "system" && "Hệ thống"}
                  </Badge>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-green-500" />}
                </div>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="h-full relative">
      <motion.div
        className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-background border-r"
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        initial={isOpen ? "open" : "closed"}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <motion.span
                variants={textVariants}
                animate={isOpen ? "open" : "closed"}
                initial={isOpen ? "open" : "closed"}
                className="font-bold"
              >
                SmartMile
              </motion.span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar} aria-label="Toggle sidebar">
              <ChevronRight className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
            </Button>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto py-4 scrollbar-thin">
            <nav className="flex-1 px-2">
              {renderNavLinks(mainRoutes)}

              <div className="my-4 px-3">
                <motion.div
                  variants={textVariants}
                  animate={isOpen ? "open" : "closed"}
                  initial={isOpen ? "open" : "closed"}
                >
                  <div className="h-px bg-border" />
                </motion.div>
              </div>

              {renderNavLinks(catalogRoutes, "Quản lý danh mục")}

              <div className="my-4 px-3">
                <motion.div
                  variants={textVariants}
                  animate={isOpen ? "open" : "closed"}
                  initial={isOpen ? "open" : "closed"}
                >
                  <div className="h-px bg-border" />
                </motion.div>
              </div>

              {renderNavLinks(salesRoutes, "Bán hàng")}
            </nav>
            <div className="px-3 mt-auto">
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  <motion.span
                    variants={textVariants}
                    animate={isOpen ? "open" : "closed"}
                    initial={isOpen ? "open" : "closed"}
                  >
                    Cài đặt hệ thống
                  </motion.span>
                </Button>
              </Link>
              <motion.div
                variants={textVariants}
                animate={isOpen ? "open" : "closed"}
                initial={isOpen ? "open" : "closed"}
                className="mt-2"
              >
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Trợ giúp & Hỗ trợ
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      <div
        className={cn("transition-all duration-300 ease-in-out", {
          "md:ml-72": isOpen,
          "md:ml-20": !isOpen,
        })}
      >
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-6">
          <Sheet open={isMobileOpen} onOpenChange={toggleMobileSidebar}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="h-16 flex items-center px-6 border-b">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <span>SmartMile</span>
                </Link>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={closeMobileSidebar}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 px-3 py-4">
                <div className="space-y-1">
                  {mainRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                        route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                      {route.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {route.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="my-4">
                  <div className="h-px bg-border" />
                </div>

                <div className="space-y-1">
                  {catalogRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                        route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                    </Link>
                  ))}
                </div>

                <div className="my-4">
                  <div className="h-px bg-border" />
                </div>

                <div className="space-y-1">
                  {salesRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                        route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                      {route.label}
                      {route.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {route.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="flex-1 flex items-center gap-4 md:gap-8">
            <form className="flex-1 flex items-center">
              <div className="relative w-full md:w-64 lg:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-8 bg-background border-muted focus-visible:ring-primary/20"
                />
              </div>
            </form>
            <div className="flex items-center gap-2">
              {renderNotificationDropdown()}
              <ModeToggle />
              {renderUserMenu()}
            </div>
          </div>
        </header>
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
