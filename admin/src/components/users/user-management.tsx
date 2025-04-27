"use client"

import { useState } from "react"
import { ChevronDown, Download, Filter, MoreHorizontal, Search, Trash, UserPlus } from "lucide-react"
import Link from "next/link"

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

const users = [
  {
    id: "USR-1001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    role: "Khách hàng",
    status: "Hoạt động",
    lastActive: "15/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "NA",
  },
  {
    id: "USR-1002",
    name: "Trần Thị Bình",
    email: "binh.tran@example.com",
    role: "Khách hàng",
    status: "Hoạt động",
    lastActive: "14/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "TB",
  },
  {
    id: "USR-1003",
    name: "Lê Văn Cường",
    email: "cuong.le@example.com",
    role: "Người bán",
    status: "Hoạt động",
    lastActive: "13/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "LC",
  },
  {
    id: "USR-1004",
    name: "Phạm Thị Dung",
    email: "dung.pham@example.com",
    role: "Người bán",
    status: "Bị khóa",
    lastActive: "10/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "PD",
  },
  {
    id: "USR-1005",
    name: "Hoàng Văn Em",
    email: "em.hoang@example.com",
    role: "Quản trị viên",
    status: "Hoạt động",
    lastActive: "15/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "HE",
  },
  {
    id: "USR-1006",
    name: "Ngô Thị Phương",
    email: "phuong.ngo@example.com",
    role: "Khách hàng",
    status: "Hoạt động",
    lastActive: "12/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "NP",
  },
  {
    id: "USR-1007",
    name: "Vũ Văn Giang",
    email: "giang.vu@example.com",
    role: "Khách hàng",
    status: "Bị khóa",
    lastActive: "08/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "VG",
  },
  {
    id: "USR-1008",
    name: "Đặng Thị Hoa",
    email: "hoa.dang@example.com",
    role: "Người bán",
    status: "Hoạt động",
    lastActive: "14/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "ĐH",
  },
]

export function UserManagement() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map((user) => user.id))
    }
  }

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

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
        <Button className="flex items-center gap-2">
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
                  <Input type="search" placeholder="Tìm kiếm người dùng..." className="pl-8 w-full" />
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
                    <DropdownMenuLabel>Lọc theo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Vai trò</DropdownMenuItem>
                    <DropdownMenuItem>Trạng thái</DropdownMenuItem>
                    <DropdownMenuItem>Ngày đăng ký</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Xuất
                </Button>
                <Select defaultValue="10">
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
                      <Checkbox checked={selectedUsers.length === users.length} onCheckedChange={toggleSelectAll} />
                    </TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hoạt động cuối</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
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
                      <TableCell>{user.lastActive}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Hiển thị 1-8 của 125 người dùng</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
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
