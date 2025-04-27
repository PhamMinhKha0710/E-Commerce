"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const users = [
  {
    name: "Nguyễn Thị Hương",
    email: "huong.nguyen@example.com",
    date: "15/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "NH",
  },
  {
    name: "Trần Văn Minh",
    email: "minh.tran@example.com",
    date: "15/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "TM",
  },
  {
    name: "Lê Thị Lan",
    email: "lan.le@example.com",
    date: "14/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "LL",
  },
  {
    name: "Phạm Văn Đức",
    email: "duc.pham@example.com",
    date: "14/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "PĐ",
  },
  {
    name: "Hoàng Thị Mai",
    email: "mai.hoang@example.com",
    date: "13/04/2023",
    avatar: "/placeholder-user.jpg",
    initials: "HM",
  },
]

export function NewUsersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Người dùng</TableHead>
          <TableHead>Ngày đăng ký</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.email}>
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
            <TableCell>{user.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
