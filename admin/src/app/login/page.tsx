import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { LoginToastHandler } from "@/components/auth/login-toast-handler";

export const metadata: Metadata = {
  title: "Đăng nhập | SmartMile Admin",
  description: "Đăng nhập vào trang quản trị hệ thống SmartMile",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoginToastHandler />
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">SmartMile Admin</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Đăng nhập để quản lý hệ thống
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
} 