import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

/**
 * Middleware để bảo vệ các routes admin (/dashboard và /admin)
 * Chỉ cho phép user có role === "admin" truy cập
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Chỉ bảo vệ các routes admin
  const isAdminRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  // Cho phép truy cập trang login và 403
  if (pathname === '/login' || pathname === '/403' || pathname === '/access-denied') {
    return NextResponse.next()
  }

  // Lấy token từ cookie
  const token = request.cookies.get('auth_token')?.value

  // Nếu không có token, redirect về login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Decode JWT để lấy role (không verify signature - chỉ để check nhanh)
    // Client-side sẽ verify lại bằng API call
    const decoded = decodeJwt(token) as { 
      role?: string; 
      Role?: string; 
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'?: string;
      exp?: number;
      [key: string]: any;
    }

    // Lấy role từ các claim có thể có:
    // - role (camelCase)
    // - Role (PascalCase)  
    // - http://schemas.microsoft.com/ws/2008/06/identity/claims/role (ClaimTypes.Role full URI)
    // - http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role (alternative)
    const userRole = decoded.role 
      || decoded.Role 
      || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
      || ''
    
    // Debug: Log tất cả claims để kiểm tra (chỉ trong development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Decoded JWT claims:', Object.keys(decoded))
      console.log('[Middleware] All claims:', decoded)
      console.log('[Middleware] User role from token:', userRole)
    }

    // Kiểm tra token hết hạn
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      // Token đã hết hạn
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('expired', 'true')
      loginUrl.searchParams.set('redirect', pathname)
      
      // Xóa cookie
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth_token')
      return response
    }

    // Kiểm tra role admin
    if (userRole.toLowerCase() !== 'admin') {
      // User không phải admin, redirect về trang 403
      const deniedUrl = new URL('/403', request.url)
      deniedUrl.searchParams.set('error', 'access_denied')
      deniedUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(deniedUrl)
    }

    // User là admin, cho phép truy cập
    return NextResponse.next()
  } catch (error) {
    // Token không hợp lệ hoặc không thể decode
    console.error('Error decoding token in middleware:', error)
    
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', 'invalid_token')
    loginUrl.searchParams.set('redirect', pathname)
    
    // Xóa cookie không hợp lệ
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('auth_token')
    return response
  }
}

/**
 * Cấu hình matcher để middleware chỉ chạy trên các routes cần bảo vệ
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

