import { getAuthToken } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5130"

export interface AdminOrderListItem {
  orderId: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  orderDate: string
  orderTotal: number
  shippingAmount: number
  discountAmount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  adminNote?: string | null
}

export interface AdminOrderListResponse {
  orders: AdminOrderListItem[]
  total: number
  page: number
  pageSize: number
}

export interface AdminOrderFilters {
  keyword?: string
  status?: string
  paymentStatus?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface AdminOrderDetail extends AdminOrderListItem {
  subtotal: number
  total: number
  shippingContactName: string
  shippingContactPhone?: string | null
  shippingAddress?: string | null
  shippingMethod: string
  items: Array<{
    orderLineId: number
    productItemId: number
    productId: number
    productName: string
    sku?: string | null
    imageUrl?: string | null
    price: number
    quantity: number
    lineTotal: number
  }>
  statusHistory: Array<{
    status: string
    displayName: string
    changedAt: string
  }>
  payments: Array<{
    method: string
    status: string
    amount: number
    transactionId?: string | null
    createdAt: string
  }>
}

export interface UpdateOrderStatusPayload {
  status: string
  adminNote?: string
  notifyCustomer?: boolean
}

function buildHeaders() {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function fetchAdminOrders(filters: AdminOrderFilters = {}): Promise<AdminOrderListResponse> {
  const params = new URLSearchParams()
  if (filters.keyword) params.set("keyword", filters.keyword)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)
  if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus)
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
  if (filters.dateTo) params.set("dateTo", filters.dateTo)
  params.set("page", String(filters.page ?? 1))
  params.set("pageSize", String(filters.pageSize ?? 10))

  const response = await fetch(`${API_URL}/api/admin/orders?${params.toString()}`, {
    headers: buildHeaders(),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch admin orders (${response.status})`)
  }

  return response.json()
}

export async function fetchAdminOrderDetail(orderId: number): Promise<AdminOrderDetail> {
  const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
    headers: buildHeaders(),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch order #${orderId}`)
  }

  return response.json()
}

export async function updateAdminOrderStatus(orderId: number, payload: UpdateOrderStatusPayload) {
  const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Failed to update order #${orderId}`)
  }
}

export async function updateAdminOrderNote(orderId: number, note: string) {
  const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/note`, {
    method: "PUT",
    headers: buildHeaders(),
    body: JSON.stringify({ note }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Failed to update note for order #${orderId}`)
  }
}

export async function deleteAdminOrder(orderId: number) {
  const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
    method: "DELETE",
    headers: buildHeaders(),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Failed to delete order #${orderId}`)
  }
}

