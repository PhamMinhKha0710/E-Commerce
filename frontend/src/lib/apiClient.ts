import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

// Tạo axios instance với cấu hình mặc định
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor: Tự động thêm token vào header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Chỉ thêm token nếu đang chạy ở client-side
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          try {
            // Thử refresh token
            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
            
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            localStorage.setItem('tokenExpiry', (Date.now() + expiresIn * 1000).toString());

            // Retry request với token mới
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh token thất bại, xóa tokens và redirect về login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiry');
            
            if (window.location.pathname !== '/auth/login') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          }
        } else {
          // Không có refresh token, redirect về login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('tokenExpiry');
          
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
          }
        }
      }
    }

    // Xử lý lỗi khác
    const errorMessage = 
      (error.response?.data as any)?.error ||
      (error.response?.data as any)?.message ||
      error.message ||
      'Đã xảy ra lỗi không xác định';

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
export { API_BASE_URL };

