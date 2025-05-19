"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, ImageIcon, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface ParentCategory {
  id: string;
  name: string;
}

interface ChildCategory {
  name: string;
  slug: string;
  displayOrder: number;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  parent: string;
  displayOrder: number;
  isActive: boolean;
  image: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  childCategories: ChildCategory[];
}

interface AddCategoryFormProps {
  initialParentCategories: ParentCategory[];
}

const ImagePreview = dynamic(
  () => import("./image-preview"),
  { ssr: false }
);

export function AddCategoryForm({ initialParentCategories }: AddCategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    parent: "",
    displayOrder: 0,
    isActive: true,
    image: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    childCategories: [],
  });

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (field === "name" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }

    if (field === "name" && !formData.metaTitle && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        metaTitle: value,
      }));
    }
  };

  const handleAddChildCategory = () => {
    setFormData({
      ...formData,
      childCategories: [
        ...formData.childCategories,
        {
          name: "",
          slug: "",
          displayOrder: formData.childCategories.length,
        },
      ],
    });
  };

  const handleRemoveChildCategory = (index: number) => {
    const updatedChildren = [...formData.childCategories];
    updatedChildren.splice(index, 1);
    
    // Update display order for remaining children
    const reorderedChildren = updatedChildren.map((child, idx) => ({
      ...child,
      displayOrder: idx,
    }));
    
    setFormData({
      ...formData,
      childCategories: reorderedChildren,
    });
  };

  const handleChildCategoryChange = (index: number, field: keyof ChildCategory, value: string | number) => {
    const updatedChildren = [...formData.childCategories];
    updatedChildren[index] = {
      ...updatedChildren[index],
      [field]: value,
    };

    // Auto-generate slug if name changes
    if (field === "name" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      updatedChildren[index].slug = slug;
    }

    setFormData({
      ...formData,
      childCategories: updatedChildren,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên danh mục",
        variant: "destructive",
      });
      return;
    }

    // Validate child categories if any exist
    const invalidChildCategory = formData.childCategories.find(child => !child.name);
    if (invalidChildCategory) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên cho tất cả các danh mục con",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Log to verify data being sent
      console.log("Submitting category with children:", formData);
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Thành công",
        description: "Đã tạo danh mục mới",
        variant: "default",
      });
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo danh mục. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/categories")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Thêm danh mục mới</h2>
        </div>
        <Button type="submit" form="category-form" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang lưu...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Lưu danh mục</span>
            </div>
          )}
        </Button>
      </div>

      <form id="category-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Thông tin cơ bản của danh mục sản phẩm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên danh mục <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="nhap-ten-danh-muc"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent">Danh mục cha</Label>
                  <Select value={formData.parent} onValueChange={(value) => handleInputChange("parent", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Không có danh mục cha</SelectItem>
                      {initialParentCategories.map((parent) => (
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
                    value={formData.displayOrder}
                    onChange={(e) => handleInputChange("displayOrder", Number.parseInt(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Nhập mô tả danh mục"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
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
              <div className="flex flex-col gap-4">
                <ImagePreview image={formData.image} />

                <div className="space-y-2">
                  <Label htmlFor="image">URL hình ảnh</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Chọn hình ảnh
                </Button>
              </div>
            </CardContent>
          </Card>

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
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                  placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm"
                />
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Tiêu đề hiển thị trên kết quả tìm kiếm</span>
                  <span className={`${formData.metaTitle.length > 60 ? "text-red-500" : ""}`}>
                    {formData.metaTitle.length}/60
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Mô tả Meta</Label>
                <Textarea
                  id="metaDescription"
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                  placeholder="Mô tả hiển thị trên kết quả tìm kiếm"
                />
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Mô tả hiển thị trên kết quả tìm kiếm</span>
                  <span className={`${formData.metaDescription.length > 160 ? "text-red-500" : ""}`}>
                    {formData.metaDescription.length}/160
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Từ khóa Meta</Label>
                <Textarea
                  id="metaKeywords"
                  rows={2}
                  value={formData.metaKeywords}
                  onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                  placeholder="Từ khóa phân cách bằng dấu phẩy"
                />
                <div className="text-xs text-muted-foreground">Các từ khóa phân cách bằng dấu phẩy</div>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">Xem trước kết quả tìm kiếm</h3>
                <div className="space-y-2 p-4 border rounded-md bg-slate-50">
                  <div className="text-blue-600 text-lg font-medium line-clamp-1">
                    {formData.metaTitle || formData.name || "Tiêu đề danh mục"}
                  </div>
                  <div className="text-green-700 text-sm">
                    {typeof window !== "undefined" ? `${window.location.origin}/danh-muc/` : ""}{formData.slug || "ten-danh-muc"}
                  </div>
                  <div className="text-slate-700 text-sm line-clamp-2">
                    {formData.metaDescription || formData.description || "Mô tả danh mục sản phẩm sẽ hiển thị ở đây"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Danh mục con</CardTitle>
              <CardDescription>Thêm các danh mục con cho danh mục này</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.childCategories.map((child, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative">
                    <div className="space-y-2">
                      <Label htmlFor={`child-name-${index}`}>
                        Tên danh mục con <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`child-name-${index}`}
                        value={child.name}
                        onChange={(e) => handleChildCategoryChange(index, "name", e.target.value)}
                        placeholder="Nhập tên danh mục con"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`child-slug-${index}`}>
                        Slug <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`child-slug-${index}`}
                        value={child.slug}
                        onChange={(e) => handleChildCategoryChange(index, "slug", e.target.value)}
                        placeholder="nhap-ten-danh-muc-con"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`child-order-${index}`}>Thứ tự hiển thị</Label>
                      <Input
                        id={`child-order-${index}`}
                        type="number"
                        value={child.displayOrder}
                        onChange={(e) => handleChildCategoryChange(index, "displayOrder", Number.parseInt(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-2" 
                      onClick={() => handleRemoveChildCategory(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddChildCategory} 
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm danh mục con
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}