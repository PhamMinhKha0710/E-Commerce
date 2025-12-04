/**
 * Dashboard API client library
 * Contains functions for fetching dashboard statistics
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

export interface DashboardStats {
  totalRevenue: number;
  revenueChangePercent: number;
  totalOrders: number;
  ordersChangePercent: number;
  totalProducts: number;
  productsChangePercent: number;
  newUsers: number;
  newUsersChangePercent: number;
}

export interface RecentOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  status: string;
  orderDate: string;
  orderTotal: number;
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  imageUrl: string | null;
  salesCount: number;
  revenue: number;
  progressPercent: number;
}

export interface RevenueChartData {
  period: string;
  revenue: number;
}

export interface NewUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl: string | null;
  initials: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  topSellingProducts: TopSellingProduct[];
  revenueChartData: RevenueChartData[];
  newUsers: NewUser[];
}

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Get dashboard statistics and data
 */
export async function getDashboardStats(
  startDate?: Date,
  endDate?: Date
): Promise<DashboardData> {
  const token = getAuthToken();
  const queryParams = new URLSearchParams();
  
  if (startDate) queryParams.append('startDate', startDate.toISOString());
  if (endDate) queryParams.append('endDate', endDate.toISOString());

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/admin/dashboard/stats?${queryParams.toString()}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        throw new Error('Authentication expired. Please login again.');
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to get dashboard stats: ${response.status}`);
    }

    const data = await response.json();
    
    // Map API response to match frontend interface
    return {
      stats: {
        totalRevenue: data.stats?.totalRevenue ?? data.stats?.TotalRevenue ?? 0,
        revenueChangePercent: data.stats?.revenueChangePercent ?? data.stats?.RevenueChangePercent ?? 0,
        totalOrders: data.stats?.totalOrders ?? data.stats?.TotalOrders ?? 0,
        ordersChangePercent: data.stats?.ordersChangePercent ?? data.stats?.OrdersChangePercent ?? 0,
        totalProducts: data.stats?.totalProducts ?? data.stats?.TotalProducts ?? 0,
        productsChangePercent: data.stats?.productsChangePercent ?? data.stats?.ProductsChangePercent ?? 0,
        newUsers: data.stats?.newUsers ?? data.stats?.NewUsers ?? 0,
        newUsersChangePercent: data.stats?.newUsersChangePercent ?? data.stats?.NewUsersChangePercent ?? 0,
      },
      recentOrders: (data.recentOrders || []).map((order: any) => ({
        orderId: order.orderId ?? order.OrderId ?? 0,
        orderNumber: order.orderNumber ?? order.OrderNumber ?? '',
        customerName: order.customerName ?? order.CustomerName ?? '',
        status: order.status ?? order.Status ?? '',
        orderDate: order.orderDate ?? order.OrderDate ?? '',
        orderTotal: order.orderTotal ?? order.OrderTotal ?? 0,
      })),
      topSellingProducts: (data.topSellingProducts || []).map((product: any) => ({
        productId: product.productId ?? product.ProductId ?? 0,
        productName: product.productName ?? product.ProductName ?? '',
        imageUrl: product.imageUrl ?? product.ImageUrl ?? null,
        salesCount: product.salesCount ?? product.SalesCount ?? 0,
        revenue: product.revenue ?? product.Revenue ?? 0,
        progressPercent: product.progressPercent ?? product.ProgressPercent ?? 0,
      })),
      revenueChartData: (data.revenueChartData || []).map((item: any) => ({
        period: item.period ?? item.Period ?? '',
        revenue: item.revenue ?? item.Revenue ?? 0,
      })),
      newUsers: (data.newUsers || []).map((user: any) => ({
        id: user.id ?? user.Id ?? 0,
        name: user.name ?? user.Name ?? '',
        email: user.email ?? user.Email ?? '',
        createdAt: user.createdAt ?? user.CreatedAt ?? '',
        avatarUrl: user.avatarUrl ?? user.AvatarUrl ?? null,
        initials: user.initials ?? user.Initials ?? '',
      })),
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}














