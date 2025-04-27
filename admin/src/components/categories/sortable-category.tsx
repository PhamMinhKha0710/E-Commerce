"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, Grip, MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  children: Category[];
  productCount: number;
  displayOrder?: number;
}

interface SortableCategoryProps {
  category: Category;
  expandedCategories: string[];
  toggleCategory: (id: string) => void;
  level: number;
  sortMode: boolean;
}

export function SortableCategory({
  category,
  expandedCategories,
  toggleCategory,
  level,
  sortMode,
}: SortableCategoryProps) {
  const router = useRouter();
  const isExpanded = expandedCategories.includes(category.id);
  const hasChildren = category.children && category.children.length > 0;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
    data: {
      category,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    paddingLeft: `${level * 20 + 8}px`,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex items-center p-2 rounded-md ${
          isDragging ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
        } ${level > 0 ? "ml-6" : ""}`}
        {...attributes}
      >
        <div className="flex items-center flex-1 gap-2">
          {hasChildren && (
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => toggleCategory(category.id)}>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          {sortMode ? (
            <div className="cursor-grab" {...listeners}>
              <Grip className="h-4 w-4 text-primary" />
            </div>
          ) : (
            <Grip className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">{category.name}</span>
          <span className="text-xs text-muted-foreground">({category.productCount})</span>
          {sortMode && category.displayOrder && (
            <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">
              Thứ tự: {category.displayOrder}
            </span>
          )}
        </div>
        {!sortMode && (
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
        )}
      </div>
      {isExpanded && hasChildren && (
        <div>
          {category.children.map((child) => (
            <SortableCategory
              key={child.id}
              category={child}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              level={level + 1}
              sortMode={sortMode}
            />
          ))}
        </div>
      )}
    </>
  );
}