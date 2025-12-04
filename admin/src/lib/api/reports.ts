/**
 * Reports API client library
 * Contains functions for generating and downloading reports
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

export interface GenerateReportRequest {
  reportType: string; // revenue, orders, products, users, sales
  startDate: Date;
  endDate: Date;
  format: string; // csv, excel, pdf
}

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Generate and download a report
 */
export async function generateReport(request: GenerateReportRequest): Promise<void> {
  const token = getAuthToken();

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/admin/reports/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        reportType: request.reportType,
        startDate: request.startDate.toISOString(),
        endDate: request.endDate.toISOString(),
        format: request.format,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        throw new Error('Authentication expired. Please login again.');
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to generate report: ${response.status}`);
    }

    // Get the file blob
    const blob = await response.blob();
    
    // Get filename from Content-Disposition header if available, otherwise use default
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = `${request.reportType}_${request.startDate.toISOString().split('T')[0]}_${request.endDate.toISOString().split('T')[0]}.csv`;
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/['"]/g, '');
      }
    }
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

/**
 * Get list of generated reports
 */
export async function getReportsList(): Promise<any[]> {
  // TODO: Implement when backend supports report storage
  return [];
}

