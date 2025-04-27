import { SettingsPage } from "@/components/settings/settings-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cài đặt hệ thống | SmartMile Admin",
  description: "Cấu hình và cài đặt hệ thống SmartMile",
}

export default function Settings() {
  return <SettingsPage />
}
