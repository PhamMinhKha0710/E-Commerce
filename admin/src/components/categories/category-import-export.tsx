"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Download, Upload, FileUp, AlertTriangle, CheckCircle, X } from "lucide-react";

interface CategoryImportExportProps {
  onClose: () => void;
}

interface ImportResult {
  success: boolean;
  total: number;
  imported: number;
  errors: number;
  warnings: number;
  details?: Array<{
    type: "error" | "warning";
    row: number;
    message: string;
    field: string;
  }>;
}

interface ImportOptions {
  updateExisting: boolean;
  createNew: boolean;
  fixInvalidSlugs: boolean;
  skipErrors: boolean;
}

export function CategoryImportExport({ onClose }: CategoryImportExportProps) {
  const [importFormat, setImportFormat] = useState<"csv" | "excel">("csv");
  const [exportFormat, setExportFormat] = useState<"csv" | "excel">("csv");
  const [includeProducts, setIncludeProducts] = useState(true);
  const [includeAttributes, setIncludeAttributes] = useState(true);
  const [includeSeo, setIncludeSeo] = useState(true);
  const [flattenStructure, setFlattenStructure] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    updateExisting: true,
    createNew: true,
    fixInvalidSlugs: true,
    skipErrors: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file để nhập",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearInterval(progressInterval);
      setUploadProgress(100);

      setImportResult({
        success: true,
        total: 45,
        imported: 42,
        errors: 2,
        warnings: 1,
        details: [
          {
            type: "error",
            row: 12,
            message: "Slug đã tồn tại: dien-thoai-di-dong",
            field: "slug",
          },
          {
            type: "error",
            row: 23,
            message: "Danh mục cha không tồn tại: CAT-9999",
            field: "parent",
          },
          {
            type: "warning",
            row: 8,
            message: "Slug không hợp lệ, đã tự động sửa: 'điện thoại' -> 'dien-thoai'",
            field: "slug",
          },
        ],
      });

      toast({
        title: "Thành công",
        description: "Đã nhập dữ liệu danh mục thành công",
      });
    } catch (error) {
      console.error("Import error:", error);
      clearInterval(progressInterval);

      toast({
        title: "Lỗi",
        description: "Không thể nhập dữ liệu danh mục. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Thành công",
        description: `Đã xuất dữ liệu danh mục sang định dạng ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xuất dữ liệu danh mục. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    toast({
      title: "Thành công",
      description: `Đã tải xuống file mẫu định dạng ${importFormat.toUpperCase()}`,
    });
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportResult(null);
    setUploadProgress(0);
  };

  return (
    <Tabs defaultValue="import" className="w-full">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="import">Nhập danh mục</TabsTrigger>
        <TabsTrigger value="export">Xuất danh mục</TabsTrigger>
      </TabsList>

      <TabsContent value="import" className="space-y-4 mt-4">
        {!importResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Nhập danh mục từ file</CardTitle>
              <CardDescription>
                Nhập danh mục từ file CSV hoặc Excel. Hệ thống sẽ tự động phân tích và nhập dữ liệu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="import-format">Định dạng file</Label>
                  <Select value={importFormat} onValueChange={(value: "csv" | "excel") => setImportFormat(value)}>
                    <SelectTrigger id="import-format">
                      <SelectValue placeholder="Chọn định dạng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx, .xls)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Chọn file</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file-upload"
                      type="file"
                      accept={importFormat === "csv" ? ".csv" : ".xlsx,.xls"}
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={downloadTemplate}>
                      <Download className="h-4 w-4 mr-2" />
                      Tải mẫu
                    </Button>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Đã chọn: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">Tùy chọn nhập</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="update-existing"
                      checked={importOptions.updateExisting}
                      onCheckedChange={(checked) =>
                        setImportOptions({ ...importOptions, updateExisting: checked })
                      }
                    />
                    <Label htmlFor="update-existing">Cập nhật danh mục hiện có</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="create-new"
                      checked={importOptions.createNew}
                      onCheckedChange={(checked) => setImportOptions({ ...importOptions, createNew: checked })}
                    />
                    <Label htmlFor="create-new">Tạo danh mục mới</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fix-slugs"
                      checked={importOptions.fixInvalidSlugs}
                      onCheckedChange={(checked) =>
                        setImportOptions({ ...importOptions, fixInvalidSlugs: checked })
                      }
                    />
                    <Label htmlFor="fix-slugs">Tự động sửa slug không hợp lệ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="skip-errors"
                      checked={importOptions.skipErrors}
                      onCheckedChange={(checked) => setImportOptions({ ...importOptions, skipErrors: checked })}
                    />
                    <Label htmlFor="skip-errors">Bỏ qua lỗi khi nhập</Label>
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Đang xử lý...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="bg-muted/50 rounded-md p-4">
                <h4 className="font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  Lưu ý khi nhập danh mục
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• File CSV phải được mã hóa UTF-8 để hỗ trợ tiếng Việt</li>
                  <li>• Các cột bắt buộc: name, slug</li>
                  <li>• Cột parent_id dùng để xác định danh mục cha</li>
                  <li>• Cột display_order dùng để sắp xếp thứ tự hiển thị</li>
                  <li>• Cột is_active nhận giá trị 0 hoặc 1</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button onClick={handleImport} disabled={!selectedFile || isUploading}>
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Nhập danh mục
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {importResult.success ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                )}
                Kết quả nhập danh mục
              </CardTitle>
              <CardDescription>
                {importResult.success
                  ? "Đã nhập dữ liệu danh mục thành công với một số lưu ý"
                  : "Đã xảy ra lỗi khi nhập dữ liệu danh mục"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted rounded-md p-3 text-center">
                  <div className="text-2xl font-bold">{importResult.total}</div>
                  <div className="text-sm text-muted-foreground">Tổng số</div>
                </div>
                <div className="bg-green-50 rounded-md p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{importResult.imported}</div>
                  <div className="text-sm text-green-600">Thành công</div>
                </div>
                <div className="bg-red-50 rounded-md p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">{importResult.errors}</div>
                  <div className="text-sm text-red-600">Lỗi</div>
                </div>
                <div className="bg-amber-50 rounded-md p-3 text-center">
                  <div className="text-2xl font-bold text-amber-600">{importResult.warnings}</div>
                  <div className="text-sm text-amber-600">Cảnh báo</div>
                </div>
              </div>

              {importResult.details && importResult.details.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Loại
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Dòng
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Trường
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Thông báo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {importResult.details.map((detail, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                detail.type === "error" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {detail.type === "error" ? "Lỗi" : "Cảnh báo"}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">{detail.row}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{detail.field}</td>
                          <td className="px-4 py-2">{detail.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetImport}>
                <X className="h-4 w-4 mr-2" />
                Nhập lại
              </Button>
              <Button onClick={onClose}>Đóng</Button>
            </CardFooter>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="export" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Xuất danh mục ra file</CardTitle>
            <CardDescription>
              Xuất danh mục ra file CSV hoặc Excel để sao lưu hoặc chỉnh sửa ngoại tuyến.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="export-format">Định dạng file</Label>
                <Select value={exportFormat} onValueChange={(value: "csv" | "excel") => setExportFormat(value)}>
                  <SelectTrigger id="export-format">
                    <SelectValue placeholder="Chọn định dạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Tùy chọn xuất</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="include-products" checked={includeProducts} onCheckedChange={setIncludeProducts} />
                  <Label htmlFor="include-products">Bao gồm số lượng sản phẩm</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-attributes"
                    checked={includeAttributes}
                    onCheckedChange={setIncludeAttributes}
                  />
                  <Label htmlFor="include-attributes">Bao gồm thuộc tính danh mục</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="include-seo" checked={includeSeo} onCheckedChange={setIncludeSeo} />
                  <Label htmlFor="include-seo">Bao gồm dữ liệu SEO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="flatten-structure" checked={flattenStructure} onCheckedChange={setFlattenStructure} />
                  <Label htmlFor="flatten-structure">Làm phẳng cấu trúc cây</Label>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-3">Xem trước cấu trúc file</h3>
              <div className="bg-muted rounded-md p-3 overflow-x-auto">
                <div className="text-sm font-mono whitespace-nowrap">
                  id, name, slug, description, parent_id, display_order, is_active
                  {includeProducts && ", product_count"}
                  {includeSeo && ", meta_title, meta_description, meta_keywords"}
                  {includeAttributes && ", attributes"}
                  {flattenStructure && ", level, path"}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Tổng số: <span className="font-medium">45 danh mục</span> sẽ được xuất
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleExport}>
              <FileUp className="h-4 w-4 mr-2" />
              Xuất danh mục
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}