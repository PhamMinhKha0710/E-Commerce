import apiClient from '@/lib/apiClient';

export interface ProfileStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  shippingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface ProfileAddress {
  addressId: number;
  recipientName: string;
  phone: string;
  addressLine: string;
  isDefault: boolean;
}

export interface ProfileOrderLine {
  productName: string;
  quantity: number;
  lineTotal: number;
  imageUrl?: string | null;
}

export interface ProfileOrderSummary {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  orderTotal: number;
  status: string;
  items: ProfileOrderLine[];
}

export interface ProfileUser {
  id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  lastActive?: string | null;
  isLocked: boolean;
}

export interface ProfileOverviewResponse {
  user: ProfileUser;
  stats: ProfileStats;
  defaultAddress?: ProfileAddress | null;
  recentOrders: ProfileOrderSummary[];
}

export interface UserAccountInfo {
  id: number;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  lastActive?: string | null;
  isLocked: boolean;
}

export async function getProfileOverview(accessToken?: string): Promise<ProfileOverviewResponse> {
  // Token sẽ được tự động thêm bởi interceptor nếu không truyền
  const response = await apiClient.get<ProfileOverviewResponse>('/api/profile/overview', {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  return response.data;
}

export async function getUserAccount(accessToken?: string): Promise<UserAccountInfo> {
  // Token sẽ được tự động thêm bởi interceptor nếu không truyền
  const response = await apiClient.get<any>('/api/auth/me', {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  
  const data = response.data;
  
  // Map response to UserAccountInfo format (handle both possible response formats)
  return {
    id: data.id,
    email: data.email || '',
    phoneNumber: data.phoneNumber || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    avatarUrl: data.avatarUrl || null,
    role: data.role || '',
    isVerified: data.isVerified || false,
    createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? data.createdAt : new Date(data.createdAt).toISOString()) : new Date().toISOString(),
    lastActive: data.lastActive ? (typeof data.lastActive === 'string' ? data.lastActive : new Date(data.lastActive).toISOString()) : null,
    isLocked: data.isLocked || false,
  } as UserAccountInfo;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export async function updateProfile(accessToken: string | undefined, updateDto: UpdateProfileDto): Promise<UserAccountInfo> {
  // Token sẽ được tự động thêm bởi interceptor nếu không truyền
  const response = await apiClient.put<any>('/api/profile/update', updateDto, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  
  const data = response.data;
  
  // Map response to UserAccountInfo format (handle both possible response formats)
  return {
    id: data.id,
    email: data.email || '',
    phoneNumber: data.phoneNumber || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    avatarUrl: data.avatarUrl || null,
    role: data.role || '',
    isVerified: data.isVerified || false,
    createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? data.createdAt : new Date(data.createdAt).toISOString()) : new Date().toISOString(),
    lastActive: data.lastActive ? (typeof data.lastActive === 'string' ? data.lastActive : new Date(data.lastActive).toISOString()) : null,
    isLocked: data.isLocked || false,
  } as UserAccountInfo;
}

