"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, Globe, Lock, Save, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserProfile, updateUserProfile, getUserInfo, getAuthToken, type UserProfile } from "@/lib/api/auth"

export function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isSecuritySaving, setIsSecuritySaving] = useState(false)
  const [isNotificationSaving, setIsNotificationSaving] = useState(false)
  const [isGeneralSaving, setIsGeneralSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  })
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    sms2FA: false,
    app2FA: true,
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailOrders: true,
    emailReviews: true,
    emailUsers: false,
    systemAlerts: true,
    systemUpdates: true,
  })
  const [generalSettings, setGeneralSettings] = useState({
    language: "vi",
    timezone: "asia-ho_chi_minh",
    dateFormat: "dd-mm-yyyy",
  })

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        
        // Check if token exists first
        const token = getAuthToken()
        
        if (!token) {
          console.warn('No auth token found. User may need to login.')
          // Try to get from localStorage as fallback
          const userInfo = getUserInfo()
          if (userInfo) {
            console.log('Using cached user info')
            setFormData({
              firstName: userInfo.firstName || "",
              lastName: userInfo.lastName || "",
              email: userInfo.email || "",
              bio: userInfo.bio || "",
            })
            setIsLoading(false)
            return
          } else {
            toast.error("Vui lòng đăng nhập để xem thông tin tài khoản.")
            setIsLoading(false)
            return
          }
        }
        
        const userProfile = await getUserProfile()
        
        if (userProfile) {
          setProfile(userProfile)
          const formDataToSet = {
            firstName: userProfile.firstName || "",
            lastName: userProfile.lastName || "",
            email: userProfile.email || "",
            bio: userProfile.bio || "",
          }
          setFormData(formDataToSet)
        } else {
          console.warn('No profile data received')
          // Try to get from localStorage as fallback
          const userInfo = getUserInfo()
          if (userInfo) {
            console.log('Using cached user info')
            setFormData({
              firstName: userInfo.firstName || "",
              lastName: userInfo.lastName || "",
              email: userInfo.email || "",
              bio: userInfo.bio || "",
            })
          } else {
            toast.error("Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.")
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Đã xảy ra lỗi khi tải thông tin người dùng")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAccountSave = async () => {
    if (!profile) {
      toast.error("Không tìm thấy thông tin tài khoản để cập nhật.")
      return
    }

    setIsSaving(true)
    try {
      const updatedProfile = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        bio: formData.bio,
      })

      setProfile(updatedProfile)
      toast.success("Cập nhật thông tin thành công!")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(error?.message || "Cập nhật thông tin thất bại. Vui lòng thử lại.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSecuritySave = async () => {
    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin mật khẩu.")
      return
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp.")
      return
    }

    setIsSecuritySaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Cập nhật bảo mật thành công!")
      setSecurityForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
    } catch (error) {
      toast.error("Không thể cập nhật bảo mật. Vui lòng thử lại.")
    } finally {
      setIsSecuritySaving(false)
    }
  }

  const handleNotificationSave = async () => {
    setIsNotificationSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      toast.success("Đã lưu cài đặt thông báo.")
    } catch (error) {
      toast.error("Không thể lưu cài đặt thông báo.")
    } finally {
      setIsNotificationSaving(false)
    }
  }

  const handleGeneralSave = async () => {
    setIsGeneralSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      toast.success("Đã cập nhật cài đặt chung.")
    } catch (error) {
      toast.error("Không thể lưu cài đặt chung.")
    } finally {
      setIsGeneralSaving(false)
    }
  }

  const buttonClass = "bg-emerald-600 hover:bg-emerald-700 text-white"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <motion.h2
          className="text-3xl font-bold tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Cài đặt hệ thống
        </motion.h2>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Quản lý cài đặt và tùy chỉnh hệ thống
        </motion.p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="account" className="data-[state=active]:bg-background">
            <User className="mr-2 h-4 w-4" />
            Tài khoản
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-background">
            <Lock className="mr-2 h-4 w-4" />
            Bảo mật
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
            <Bell className="mr-2 h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-background">
            <Globe className="mr-2 h-4 w-4" />
            Chung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân và hồ sơ của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Họ</Label>
                      <Input
                        id="first-name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Nhập họ của bạn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Tên</Label>
                      <Input
                        id="last-name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Nhập tên của bạn"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                      placeholder="Email của bạn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Giới thiệu</Label>
                    <Textarea
                      id="bio"
                      placeholder="Viết một vài dòng về bạn"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleAccountSave} disabled={isSaving || isLoading} className={buttonClass}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Quản lý mật khẩu và cài đặt bảo mật tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) =>
                      setSecurityForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) =>
                        setSecurityForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Xác thực hai yếu tố</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p>Xác thực hai yếu tố qua SMS</p>
                    <p className="text-sm text-muted-foreground">Nhận mã xác thực qua tin nhắn SMS</p>
                  </div>
                  <Switch
                    checked={securityForm.sms2FA}
                    onCheckedChange={(checked) =>
                      setSecurityForm((prev) => ({ ...prev, sms2FA: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p>Xác thực hai yếu tố qua ứng dụng</p>
                    <p className="text-sm text-muted-foreground">Sử dụng ứng dụng xác thực như Google Authenticator</p>
                  </div>
                  <Switch
                    checked={securityForm.app2FA}
                    onCheckedChange={(checked) =>
                      setSecurityForm((prev) => ({ ...prev, app2FA: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSecuritySave} disabled={isSecuritySaving} className={buttonClass}>
                {isSecuritySaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
              <CardDescription>Cấu hình cài đặt thông báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Đơn hàng mới</p>
                      <p className="text-sm text-muted-foreground">Nhận thông báo khi có đơn hàng mới</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailOrders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, emailOrders: checked }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Đánh giá mới</p>
                      <p className="text-sm text-muted-foreground">Nhận thông báo khi có đánh giá mới</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailReviews}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, emailReviews: checked }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Người dùng mới</p>
                      <p className="text-sm text-muted-foreground">Nhận thông báo khi có người dùng mới đăng ký</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailUsers}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, emailUsers: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Hệ thống</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Cảnh báo hệ thống</p>
                      <p className="text-sm text-muted-foreground">Nhận thông báo về các vấn đề hệ thống</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, systemAlerts: checked }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p>Cập nhật hệ thống</p>
                      <p className="text-sm text-muted-foreground">Nhận thông báo khi có cập nhật mới</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, systemUpdates: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNotificationSave} disabled={isNotificationSaving} className={buttonClass}>
                {isNotificationSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>Cấu hình cài đặt chung cho hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Ngôn ngữ</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) =>
                      setGeneralSettings((prev) => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngôn ngữ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) =>
                      setGeneralSettings((prev) => ({ ...prev, timezone: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn múi giờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-ho_chi_minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                      <SelectItem value="asia-bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                      <SelectItem value="asia-singapore">Asia/Singapore (GMT+8)</SelectItem>
                      <SelectItem value="america-new_york">America/New_York (GMT-5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Định dạng ngày</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) =>
                      setGeneralSettings((prev) => ({ ...prev, dateFormat: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn định dạng ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleGeneralSave} disabled={isGeneralSaving} className={buttonClass}>
                {isGeneralSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
