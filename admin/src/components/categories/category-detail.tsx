"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Trash2,
  FolderPlus,
  ImageIcon,
  FileText,
  Settings,
  Layers,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  children: Category[];
  productCount: number;
  image?: string;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  displayOrder: number;
  attributes: CategoryAttribute[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryAttribute {
  id: string;
  name: string;
  type: "text" | "number" | "boolean" | "select";
  required: boolean;
  options?: string[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  stock: number;
  isActive: boolean;
}

interface CategoryDetailProps {
  categoryId: string;
  initialCategory: Category;
  initialProducts: Product[];
  initialParentCategories: { id: string; name: string }[];
}

export function CategoryDetail({
  initialCategory,
  initialProducts,
  initialParentCategories,
}: CategoryDetailProps) {
  const router = useRouter();
  const [category, setCategory] = useState<Category>(initialCategory);
  const [products] = useState<Product[]>(initialProducts);
  const [parentCategories] = useState(initialParentCategories);
  const [isSaving, setIsSaving] = useState(false);
  const [editedCategory, setEditedCategory] = useState<Category>(initialCategory);
  const [newAttribute, setNewAttribute] = useState<Partial<CategoryAttribute>>({
    name: "",
    type: "text",
    required: false,
  });
  const [attributeOptions, setAttributeOptions] = useState<string>("");

  const handleSave = async () => {
    if (!editedCategory) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCategory(editedCategory);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin danh mục.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật danh mục. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedCategory(category);
  };

  const handleDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục.",
        variant: "default",
      });
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa danh mục. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleAddAttribute = () => {
    if (!editedCategory || !newAttribute.name) return;

    const attribute: CategoryAttribute = {
      id: `ATTR-${Date.now()}`,
      name: newAttribute.name,
      type: newAttribute.type as "text" | "number" | "boolean" | "select",
      required: newAttribute.required || false,
      options: newAttribute.type === "select" ? attributeOptions.split(",").map((opt) => opt.trim()) : undefined,
    };

    setEditedCategory({
      ...editedCategory,
      attributes: [...(editedCategory?.attributes || []), attribute],
    });

    setNewAttribute({
      name: "",
      type: "text",
      required: false,
    });
    setAttributeOptions("");

    toast({
      title: "Thành công",
      description: "Đã thêm thuộc tính mới.",
      variant: "default",
    });
  };

  const handleRemoveAttribute = (attributeId: string) => {
    if (!editedCategory) return;

    setEditedCategory({
      ...editedCategory,
      attributes: editedCategory?.attributes?.filter((attr) => attr.id !== attributeId) || [],
    });

    toast({
      title: "Thành công",
      description: "Đã xóa thuộc tính.",
      variant: "default",
    });
  };

  const handleInputChange = (field: keyof Category, value: string | number | boolean | null) => {
    if (!editedCategory) return;

    setEditedCategory({
      ...editedCategory,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/categories")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Chi tiết danh mục</h2>
        </div>
        <div className="flex items-center gap-2">
          {editedCategory !== category ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang lưu...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
                  </div>
                )}
              </Button>
            </>
          ) : (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa danh mục
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
                      {category?.children && category.children.length > 0 && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>
                            Danh mục này có {category?.children?.length} danh mục con. Nếu xóa, tất cả danh mục con sẽ bị
                            xóa theo.
                          </span>
                        </div>
                      )}
                      {category?.productCount > 0 && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>
                            Danh mục này có {category.productCount} sản phẩm. Nếu xóa, tất cả sản phẩm sẽ không còn
                            thuộc danh mục này.
                          </span>
                        </div>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                      Xác nhận xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={() => setEditedCategory({ ...category })}>Chỉnh sửa</Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="general">Thông tin chung</TabsTrigger>
          <TabsTrigger value="subcategories">Danh mục con</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="attributes">Thuộc tính</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Thông tin cơ bản của danh mục sản phẩm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên danh mục</Label>
                  <Input
                    id="name"
                    value={editedCategory?.name ?? category.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={editedCategory === category}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={editedCategory?.slug ?? category.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    disabled={editedCategory === category}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent">Danh mục cha</Label>
                  <Select
                    disabled={editedCategory === category}
                    value={editedCategory?.parent || category.parent || ""}
                    onValueChange={(value) => handleInputChange("parent", value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không có danh mục cha</SelectItem>
                      {parentCategories.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={editedCategory?.displayOrder ?? category.displayOrder}
                    onChange={(e) => handleInputChange("displayOrder", Number.parseInt(e.target.value))}
                    disabled={editedCategory === category}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={editedCategory?.description ?? category.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={editedCategory === category}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={editedCategory?.isActive ?? category.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  disabled={editedCategory === category}
                />
                <Label htmlFor="isActive">Hiển thị danh mục</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh danh mục</CardTitle>
              <CardDescription>Hình ảnh đại diện cho danh mục sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="border rounded-md w-[200px] h-[200px] flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={200}
                        height={200}
                        style={{ objectFit: "cover" }}
                        priority={false}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span>Chưa có hình ảnh</span>
                      </div>
                    )}
                  </div>
                </div>

                {editedCategory !== category && (
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">URL hình ảnh</Label>
                      <Input
                        id="image"
                        value={editedCategory?.image || ""}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Chọn hình ảnh
                      </Button>
                      {editedCategory?.image && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleInputChange("image", "")}
                        >
                          Xóa hình ảnh
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin bổ sung</CardTitle>
              <CardDescription>Thông tin thêm về danh mục sản phẩm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Số lượng sản phẩm</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{category?.productCount || 0} sản phẩm</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Ngày tạo</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {category?.createdAt ? new Date(category.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Cập nhật lần cuối</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {category?.updatedAt ? new Date(category.updatedAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subcategories" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Danh mục con</CardTitle>
                <CardDescription>Quản lý các danh mục con thuộc danh mục này</CardDescription>
              </div>
              {editedCategory !== category && (
                <Button>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Thêm danh mục con
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {category?.children?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Chưa có danh mục con</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Danh mục này chưa có danh mục con nào. Bạn có thể thêm danh mục con mới.
                  </p>
                  {editedCategory !== category && (
                    <Button className="mt-4">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Thêm danh mục con
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category?.children?.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium">{subcategory.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{subcategory.description}</p>
                          </div>
                          <div className="flex items-center">
                            {subcategory.isActive ? (
                              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <Eye className="h-3 w-3 mr-1" />
                                Hiển thị
                              </div>
                            ) : (
                              <div className="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Ẩn
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-muted-foreground">
                          <Layers className="h-3.5 w-3.5 mr-1" />
                          <span>{subcategory.productCount} sản phẩm</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/dashboard/categories/${subcategory.id}`)}
                          >
                            Xem chi tiết
                          </Button>
                          {editedCategory !== category && (
                            <Button variant="outline" size="sm" className="flex-shrink-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Sản phẩm trong danh mục</CardTitle>
                <CardDescription>Quản lý các sản phẩm thuộc danh mục này</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">Thêm sản phẩm vào danh mục</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Hình ảnh</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Giá</TableHead>
                      <TableHead className="text-center">Tồn kho</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                            priority={false}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className="text-right">{product.price.toLocaleString("vi-VN")}₫</TableCell>
                        <TableCell className="text-center">{product.stock}</TableCell>
                        <TableCell className="text-center">
                          {product.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Hiển thị
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="h-3 w-3 mr-1" />
                              Ẩn
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/products/${product.id}`)}
                          >
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị {products?.length || 0} / {category?.productCount || 0} sản phẩm
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                <Button variant="outline" size="sm">
                  Tiếp
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="attributes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Thuộc tính danh mục</CardTitle>
              <CardDescription>Quản lý các thuộc tính sản phẩm trong danh mục này</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {category?.attributes?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Chưa có thuộc tính</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Danh mục này chưa có thuộc tính nào. Bạn có thể thêm thuộc tính mới.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên thuộc tính</TableHead>
                          <TableHead>Loại</TableHead>
                          <TableHead className="text-center">Bắt buộc</TableHead>
                          <TableHead>Tùy chọn</TableHead>
                          {editedCategory !== category && <TableHead className="text-right">Thao tác</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editedCategory?.attributes?.map((attribute) => (
                          <TableRow key={attribute.id}>
                            <TableCell className="font-medium">{attribute.name}</TableCell>
                            <TableCell>
                              {attribute.type === "text" && "Văn bản"}
                              {attribute.type === "number" && "Số"}
                              {attribute.type === "boolean" && "Có/Không"}
                              {attribute.type === "select" && "Lựa chọn"}
                            </TableCell>
                            <TableCell className="text-center">
                              {attribute.required ? (
                                <Check className="h-4 w-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell>
                              {attribute.type === "select" && attribute.options ? (
                                <div className="flex flex-wrap gap-1">
                                  {attribute.options.map((option, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted"
                                    >
                                      {option}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            {editedCategory !== category && (
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAttribute(attribute.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {editedCategory !== category && (
                  <div className="border rounded-md p-4 space-y-4">
                    <h3 className="font-medium">Thêm thuộc tính mới</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="attributeName">Tên thuộc tính</Label>
                        <Input
                          id="attributeName"
                          value={newAttribute.name}
                          onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                          placeholder="Nhập tên thuộc tính"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="attributeType">Loại thuộc tính</Label>
                        <Select
                          value={newAttribute.type}
                          onValueChange={(value: "text" | "number" | "boolean" | "select") =>
                            setNewAttribute({ ...newAttribute, type: value })
                          }
                        >
                          <SelectTrigger id="attributeType">
                            <SelectValue placeholder="Chọn loại thuộc tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Văn bản</SelectItem>
                            <SelectItem value="number">Số</SelectItem>
                            <SelectItem value="boolean">Có/Không</SelectItem>
                            <SelectItem value="select">Lựa chọn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 h-full pt-8">
                        <Switch
                          id="attributeRequired"
                          checked={newAttribute.required}
                          onCheckedChange={(checked) => setNewAttribute({ ...newAttribute, required: checked })}
                        />
                        <Label htmlFor="attributeRequired">Bắt buộc</Label>
                      </div>
                    </div>

                    {newAttribute.type === "select" && (
                      <div className="space-y-2">
                        <Label htmlFor="attributeOptions">Tùy chọn (phân cách bằng dấu phẩy)</Label>
                        <Textarea
                          id="attributeOptions"
                          value={attributeOptions}
                          onChange={(e) => setAttributeOptions(e.target.value)}
                          placeholder="Ví dụ: Đỏ, Xanh, Vàng, Đen"
                        />
                      </div>
                    )}

                    <Button onClick={handleAddAttribute} disabled={!newAttribute.name}>
                      Thêm thuộc tính
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt SEO</CardTitle>
              <CardDescription>Tối ưu hóa danh mục cho công cụ tìm kiếm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Tiêu đề Meta</Label>
                <Input
                  id="metaTitle"
                  value={editedCategory?.metaTitle ?? category?.metaTitle ?? ""}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  disabled={editedCategory === category}
                />
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Tiêu đề hiển thị trên kết quả tìm kiếm</span>
                  <span className={`${(editedCategory?.metaTitle?.length || 0) > 60 ? "text-red-500" : ""}`}>
                    {(editedCategory?.metaTitle?.length || 0)}/60
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Mô tả Meta</Label>
                <Textarea
                  id="metaDescription"
                  rows={3}
                  value={editedCategory?.metaDescription ?? category?.metaDescription ?? ""}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  disabled={editedCategory === category}
                />
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Mô tả hiển thị trên kết quả tìm kiếm</span>
                  <span className={`${(editedCategory?.metaDescription?.length || 0) > 160 ? "text-red-500" : ""}`}>
                    {(editedCategory?.metaDescription?.length || 0)}/160
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Từ khóa Meta</Label>
                <Textarea
                  id="metaKeywords"
                  rows={2}
                  value={editedCategory?.metaKeywords ?? category?.metaKeywords ?? ""}
                  onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                  disabled={editedCategory === category}
                />
                <div className="text-xs text-muted-foreground">Các từ khóa phân cách bằng dấu phẩy</div>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">Xem trước kết quả tìm kiếm</h3>
                <div className="space-y-2 p-4 border rounded-md bg-slate-50">
                  <div className="text-blue-600 text-lg font-medium line-clamp-1">
                    {editedCategory?.metaTitle || category?.metaTitle || category?.name || ""}
                  </div>
                  <div className="text-green-700 text-sm">
                    {typeof window !== "undefined" ? `${window.location.origin}/danh-muc/` : ""}{category?.slug || ""}
                  </div>
                  <div className="text-slate-700 text-sm line-clamp-2">
                    {editedCategory?.metaDescription || category?.metaDescription || category?.description || ""}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}