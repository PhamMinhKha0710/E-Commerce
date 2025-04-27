"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Save, Trash, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

// Mock user data - in a real app, this would come from an API
const userData = {
  id: "USR-1001",
  name: "Nguyễn Văn An",
  email: "an.nguyen@example.com",
  phone: "0912345678",
  role: "Khách hàng",
  status: "Hoạt động",
  lastActive: "15/04/2023",
  avatar: "/placeholder-user.jpg",
  initials: "NA",
  address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  bio: "Khách hàng thân thiết từ năm 2020",
  createdAt: "01/01/2020",
  orders: 15,
  totalSpent: "₫12,500,000",
  wishlist: 8,
  notifications: {
    email: true,
    sms: false,
    app: true,
  },
  permissions: {
    canReview: true,
    canSell: false,
  },
};

// Type for form data
interface FormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastActive: string;
  avatar: string;
  initials: string;
  address: string;
  bio: string;
  createdAt: string;
  orders: number;
  totalSpent: string;
  wishlist: number;
  notifications: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
  permissions: {
    canReview: boolean;
    canSell: boolean;
  };
}

// Type for nested keys (notifications or permissions)
type NestedKeys = "notifications" | "permissions";

export function UserDetail() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({ ...userData });

  // Handle input changes for text fields and textarea
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch changes for nested properties (e.g., notifications.email)
  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [NestedKeys, string];
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  // Handle save action
  const handleSave = () => {
    setIsSaving(true);

    // Validate required fields
    if (!formData.name || !formData.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc (Họ và tên, Email).",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast({
        title: "Thành công!",
        description: "Thông tin người dùng đã được cập nhật.",
      });
    }, 1000);
  };

  // Handle delete action
  const handleDelete = () => {
    // Simulate API call
    setTimeout(() => {
      router.push("/dashboard/users");
      toast({
        title: "Đã xóa người dùng",
        description: "Người dùng đã được xóa khỏi hệ thống.",
        variant: "destructive",
      });
    }, 500);
  };

  // Get status color using Tailwind CSS variables
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return "bg-primary";
      case "Bị khóa":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/users")}
            aria-label="Quay lại danh sách người dùng"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <motion.h2
            className="text-3xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Chi tiết người dùng
          </motion.h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                aria-label="Hủy chỉnh sửa"
              >
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                aria-label="Lưu thay đổi"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          ) : (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    aria-label="Xóa người dùng"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bạn có chắc chắn muốn xóa?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Người dùng này sẽ bị xóa
                      vĩnh viễn khỏi hệ thống.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                onClick={() => setIsEditing(true)}
                aria-label="Chỉnh sửa thông tin người dùng"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Thông tin cá nhân của người dùng</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage
                src={formData.avatar || "/placeholder.svg"}
                alt={formData.name}
              />
              <AvatarFallback className="text-2xl">
                {formData.initials}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{formData.name}</h3>
            <p className="text-sm text-muted-foreground">{formData.email}</p>
            <div className="mt-2">
              <Badge
                variant="outline"
                className={`${getStatusColor(formData.status)} text-white border-none`}
              >
                {formData.status}
              </Badge>
            </div>
            <div className="mt-4 w-full">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">ID</span>
                <span className="font-medium">{formData.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Vai trò</span>
                <span className="font-medium">{formData.role}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Ngày tham gia</span>
                <span className="font-medium">{formData.createdAt}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Hoạt động cuối</span>
                <span className="font-medium">{formData.lastActive}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Đơn hàng</span>
                <span className="font-medium">{formData.orders}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Chi tiết người dùng</CardTitle>
            <CardDescription>Xem và chỉnh sửa thông tin chi tiết</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
                <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Vai trò</Label>
                    {isEditing ? (
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleSelectChange("role", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                          <SelectItem value="Người bán">Người bán</SelectItem>
                          <SelectItem value="Quản trị viên">
                            Quản trị viên
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input id="role" value={formData.role} disabled />
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Ghi chú</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="orders" className="pt-4">
                <div className="rounded-md border">
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-medium">Tổng quan đơn hàng</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">
                          Tổng đơn hàng
                        </p>
                        <p className="text-2xl font-bold">{formData.orders}</p>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">
                          Tổng chi tiêu
                        </p>
                        <p className="text-2xl font-bold">
                          {formData.totalSpent}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="p-4 text-center">
                    <p className="text-muted-foreground">
                      Để xem chi tiết đơn hàng, vui lòng truy cập mục Đơn hàng
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => router.push("/dashboard/orders")}
                    >
                      Xem đơn hàng
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Trạng thái tài khoản</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Trạng thái</p>
                      <p className="text-sm text-muted-foreground">
                        Kích hoạt hoặc khóa tài khoản người dùng
                      </p>
                    </div>
                    {isEditing ? (
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                          <SelectItem value="Bị khóa">Bị khóa</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(formData.status)} text-white border-none`}
                      >
                        {formData.status}
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Thông báo</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Email</p>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo qua email
                      </p>
                    </div>
                    <Switch
                      checked={formData.notifications.email}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("notifications.email", checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>SMS</p>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo qua tin nhắn SMS
                      </p>
                    </div>
                    <Switch
                      checked={formData.notifications.sms}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("notifications.sms", checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Ứng dụng</p>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo qua ứng dụng
                      </p>
                    </div>
                    <Switch
                      checked={formData.notifications.app}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("notifications.app", checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Quyền hạn</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Đánh giá sản phẩm</p>
                      <p className="text-sm text-muted-foreground">
                        Cho phép người dùng đánh giá sản phẩm
                      </p>
                    </div>
                    <Switch
                      checked={formData.permissions.canReview}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("permissions.canReview", checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Bán hàng</p>
                      <p className="text-sm text-muted-foreground">
                        Cho phép người dùng đăng bán sản phẩm
                      </p>
                    </div>
                    <Switch
                      checked={formData.permissions.canSell}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("permissions.canSell", checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}