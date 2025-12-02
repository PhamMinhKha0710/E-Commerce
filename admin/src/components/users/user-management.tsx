"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Download, Filter, MoreHorizontal, Search, Trash, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUsers, type User } from "@/lib/api/users"
import { toast } from "@/components/ui/use-toast"

export function UserManagement() {
  const router = useRouter()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [page, pageSize, searchKeyword, selectedRole, selectedStatus])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await getUsers({
        keyword: searchKeyword || undefined,
        role: selectedRole || undefined,
        status: selectedStatus || undefined,
        page,
        pageSize,
      })
      setUsers(response.users)
      setTotal(response.total)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tải danh sách người dùng",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    setPage(1) // Reset to first page when searching
  }

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role)
    setPage(1)
  }

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status)
    setPage(1)
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.filter(user => user?.id != null).map((user) => user.id.toString()))
    }
  }

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Chưa có"
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

  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return "bg-green-500"
      case "Bị khóa":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
        <Button className="flex items-center gap-2" onClick={() => router.push("/dashboard/users/add")}>
          <UserPlus className="h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Quản lý tất cả người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm người dùng..."
                    className="pl-8 w-full"
                    value={searchKeyword}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Lọc
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Lọc theo vai trò</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRoleFilter("")}>Tất cả</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleFilter("Khách hàng")}>Khách hàng</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleFilter("Người bán")}>Người bán</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleFilter("Quản trị viên")}>Quản trị viên</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusFilter("")}>Tất cả</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("Hoạt động")}>Hoạt động</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("Bị khóa")}>Bị khóa</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Xuất
                </Button>
                <Select 
                  value={pageSize?.toString() || "10"} 
                  onValueChange={(value) => { 
                    const newPageSize = Number(value) || 10
                    setPageSize(newPageSize)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                <span className="text-sm">{selectedUsers.length} người dùng đã chọn</span>
                <Button variant="outline" size="sm" className="gap-1 ml-auto">
                  <Trash className="h-3 w-3" />
                  Xóa
                </Button>
              </div>
            )}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={users.length > 0 && selectedUsers.length === users.length}
                        onCheckedChange={toggleSelectAll}
                        disabled={loading}
                      />
                    </TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hoạt động cuối</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">Đang tải...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không tìm thấy người dùng nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.filter(user => user?.id != null).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user.id?.toString() || "")}
                            onCheckedChange={() => toggleSelectUser(user.id?.toString() || "")}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusColor(user.status)} text-white border-none`}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.lastActive)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/users/${user.id}`}>Xem chi tiết</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "Hoạt động" ? (
                                <DropdownMenuItem className="text-red-600">Khóa tài khoản</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">Mở khóa tài khoản</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị {total > 0 ? `${(page - 1) * (pageSize || 10) + 1}-${Math.min(page * (pageSize || 10), total)}` : "0"} của {total} người dùng
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1 || loading}
                  onClick={() => setPage(page - 1)}
                >
                  Trước
                </Button>
                {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant="outline"
                      size="sm"
                      className={page === pageNum ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage(page + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
