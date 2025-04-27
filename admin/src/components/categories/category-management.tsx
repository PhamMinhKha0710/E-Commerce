"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Grip,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
  FileSpreadsheet,
  Save,
} from "lucide-react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategoryImportExport } from "@/components/categories/category-import-export"
import { SortableCategory } from "@/components/categories/sortable-category"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  parent: string | null
  children: Category[]
  productCount: number
  displayOrder?: number
}

// Định nghĩa props cho CategoryManagement
interface CategoryManagementProps {
  initialCategories: Category[]
}

export function CategoryManagement({ initialCategories }: CategoryManagementProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>(initialCategories) // Sử dụng prop initialCategories
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showImportExport, setShowImportExport] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [draggedParent, setDraggedParent] = useState<string | null>(null)
  const [sortMode, setSortMode] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Expand all categories when entering sort mode
  useEffect(() => {
    if (sortMode) {
      const allCategoryIds = getAllCategoryIds(categories)
      setExpandedCategories(allCategoryIds)
    }
  }, [sortMode, categories])

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId))
    } else {
      setExpandedCategories([...expandedCategories, categoryId])
    }
  }

  const expandAll = () => {
    const allCategoryIds = getAllCategoryIds(categories)
    setExpandedCategories(allCategoryIds)
  }

  const collapseAll = () => {
    setExpandedCategories([])
  }

  const getAllCategoryIds = (cats: Category[]): string[] => {
    let ids: string[] = []
    cats.forEach((cat) => {
      ids.push(cat.id)
      if (cat.children.length > 0) {
        ids = [...ids, ...getAllCategoryIds(cat.children)]
      }
    })
    return ids
  }

  const filteredCategories = searchTerm ? filterCategories(categories, searchTerm.toLowerCase()) : categories

  function filterCategories(cats: Category[], term: string): Category[] {
    return cats
      .map((cat) => {
        const matchesSearch = cat.name.toLowerCase().includes(term) || cat.description.toLowerCase().includes(term)
        const filteredChildren = filterCategories(cat.children, term)
        if (matchesSearch || filteredChildren.length > 0) {
          return { ...cat, children: filteredChildren }
        }
        return null
      })
      .filter((cat): cat is Category => cat !== null)
  }

  // Find a category by ID in the nested structure
  const findCategoryById = (cats: Category[], id: string): Category | null => {
    for (const cat of cats) {
      if (cat.id === id) return cat
      if (cat.children.length > 0) {
        const found = findCategoryById(cat.children, id)
        if (found) return found
      }
    }
    return null
  }

  // Find parent category that contains a specific child category
  const findParentCategory = (cats: Category[], childId: string): Category | null => {
    for (const cat of cats) {
      if (cat.children.some((child) => child.id === childId)) return cat
      if (cat.children.length > 0) {
        const found = findParentCategory(cat.children, childId)
        if (found) return found
      }
    }
    return null
  }

  // Get all categories at the same level (siblings)
  const getSiblingCategories = (cats: Category[], categoryId: string): Category[] => {
    if (cats.some((cat) => cat.id === categoryId)) {
      return cats
    }
    const parent = findParentCategory(cats, categoryId)
    if (parent) {
      return parent.children
    }
    return []
  }

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const categoryId = active.id as string
    const category = findCategoryById(categories, categoryId)
    if (category) {
      setActiveCategory(category)
      setIsDragging(true)
      const parent = findParentCategory(categories, categoryId)
      setDraggedParent(parent ? parent.id : null)
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const activeId = active.id as string
      const overId = over.id as string
      const siblings = getSiblingCategories(categories, activeId)
      const activeIndex = siblings.findIndex((cat) => cat.id === activeId)
      const overIndex = siblings.findIndex((cat) => cat.id === overId)
      if (activeIndex !== -1 && overIndex !== -1) {
        const newSiblings = arrayMove(siblings, activeIndex, overIndex)
        newSiblings.forEach((cat, index) => {
          cat.displayOrder = index + 1
        })
        if (draggedParent) {
          setCategories((prevCategories) => {
            return updateCategoryChildren(prevCategories, draggedParent, newSiblings)
          })
        } else {
          setCategories(newSiblings)
        }
        setHasChanges(true)
      }
    }
    setIsDragging(false)
    setActiveCategory(null)
    setDraggedParent(null)
  }

  // Helper function to update children of a specific category
  const updateCategoryChildren = (cats: Category[], parentId: string, newChildren: Category[]): Category[] => {
    return cats.map((cat) => {
      if (cat.id === parentId) {
        return { ...cat, children: newChildren }
      }
      if (cat.children.length > 0) {
        return { ...cat, children: updateCategoryChildren(cat.children, parentId, newChildren) }
      }
      return cat
    })
  }

  // Save the new category order
  const saveOrder = async () => {
    setIsSaving(true)
    try {
      // Gọi API để lưu thứ tự danh mục (nếu có)
      // await updateCategoryOrder(categories)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Thành công",
        description: "Đã lưu thứ tự danh mục mới.",
        variant: "default",
      })
      setHasChanges(false)
    } catch (error) {
      console.error("Error saving category order:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu thứ tự danh mục. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Toggle sort mode
  const toggleSortMode = () => {
    if (sortMode && hasChanges) {
      if (confirm("Bạn có muốn lưu thay đổi thứ tự danh mục không?")) {
        saveOrder()
      }
    }
    setSortMode(!sortMode)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h2>
        <div className="flex items-center gap-2">
          {sortMode ? (
            <>
              <Button variant="outline" className="flex items-center gap-2" onClick={toggleSortMode}>
                Hủy
              </Button>
              <Button className="flex items-center gap-2" onClick={saveOrder} disabled={!hasChanges || isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu thứ tự</span>
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowImportExport(true)}>
                <FileSpreadsheet className="h-4 w-4" />
                Nhập/Xuất
              </Button>
              <Button className="flex items-center gap-2" onClick={() => router.push("/dashboard/categories/add")}>
                <FolderPlus className="h-4 w-4" />
                Thêm danh mục
              </Button>
            </>
          )}
        </div>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cây danh mục</CardTitle>
              <CardDescription>Quản lý cấu trúc danh mục sản phẩm</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sort-mode" checked={sortMode} onCheckedChange={toggleSortMode} />
              <Label htmlFor="sort-mode">Chế độ sắp xếp</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Tìm kiếm danh mục..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={sortMode}
                />
              </div>
              <Button variant="outline" onClick={expandAll}>
                Mở rộng tất cả
              </Button>
              <Button variant="outline" onClick={collapseAll} disabled={sortMode}>
                Thu gọn tất cả
              </Button>
            </div>
            <div className="border rounded-md">
              {sortMode ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div className="p-2">
                    {filteredCategories.length > 0 ? (
                      <div>
                        {filteredCategories.map((category) => (
                          <SortableCategory
                            key={category.id}
                            category={category}
                            expandedCategories={expandedCategories}
                            toggleCategory={toggleCategory}
                            level={0}
                            sortMode={sortMode}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">Không tìm thấy danh mục nào phù hợp</div>
                    )}
                  </div>
                  {isDragging && activeCategory && (
                    <DragOverlay adjustScale={true} className="z-50">
                      <div className="flex items-center p-2 bg-primary/10 border border-primary/30 rounded-md shadow-md">
                        <Grip className="h-4 w-4 text-primary mr-2" />
                        <span className="font-medium">{activeCategory.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({activeCategory.productCount})</span>
                      </div>
                    </DragOverlay>
                  )}
                </DndContext>
              ) : (
                <div className="p-2">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <div key={category.id}>
                        <div className={`flex items-center p-2 hover:bg-muted rounded-md`}>
                          <div className="flex items-center flex-1 gap-2">
                            {category.children.length > 0 ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => toggleCategory(category.id)}
                              >
                                {expandedCategories.includes(category.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            ) : (
                              <div className="w-5"></div>
                            )}
                            <Grip className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{category.name}</span>
                            <span className="text-xs text-muted-foreground">({category.productCount})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => router.push(`/dashboard/categories/${category.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/categories/${category.id}`)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Chỉnh sửa</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Plus className="mr-2 h-4 w-4" />
                                  <span>Thêm danh mục con</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  <span>Xóa danh mục</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        {expandedCategories.includes(category.id) && category.children.length > 0 && (
                          <div>
                            {category.children.map((child) => (
                              <div key={child.id}>
                                <div
                                  className={`flex items-center p-2 hover:bg-muted rounded-md ml-6`}
                                  style={{ paddingLeft: `20px` }}
                                >
                                  <div className="flex items-center flex-1 gap-2">
                                    {child.children.length > 0 ? (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5"
                                        onClick={() => toggleCategory(child.id)}
                                      >
                                        {expandedCategories.includes(child.id) ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </Button>
                                    ) : (
                                      <div className="w-5"></div>
                                    )}
                                    <Grip className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{child.name}</span>
                                    <span className="text-xs text-muted-foreground">({child.productCount})</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => router.push(`/dashboard/categories/${child.id}`)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() => router.push(`/dashboard/categories/${child.id}`)}
                                        >
                                          <Pencil className="mr-2 h-4 w-4" />
                                          <span>Chỉnh sửa</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Plus className="mr-2 h-4 w-4" />
                                          <span>Thêm danh mục con</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                          <Trash className="mr-2 h-4 w-4" />
                                          <span>Xóa danh mục</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                {expandedCategories.includes(child.id) && child.children.length > 0 && (
                                  <div>
                                    {child.children.map((grandchild) => (
                                      <div key={grandchild.id} className="ml-12">
                                        {/* Render grandchildren if needed */}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">Không tìm thấy danh mục nào phù hợp</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showImportExport} onOpenChange={setShowImportExport}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nhập/Xuất Danh Mục</DialogTitle>
            <DialogDescription>Nhập danh mục từ file CSV/Excel hoặc xuất danh mục ra file</DialogDescription>
          </DialogHeader>
          <CategoryImportExport onClose={() => setShowImportExport(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}