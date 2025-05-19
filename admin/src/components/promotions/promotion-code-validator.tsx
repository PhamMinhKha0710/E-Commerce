"use client"

import { useState } from "react"
import { toast } from "sonner"
import { CheckCircle, Search, X, RefreshCw, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { checkPromotionAvailability, getPromotionById, incrementPromotionUsage, updatePromotionQuantity } from "@/lib/api/promotions"

interface PromotionCodeValidatorProps {
  title?: string
  description?: string
}

export function PromotionCodeValidator({ 
  title = "Kiểm tra mã khuyến mãi", 
  description = "Kiểm tra tính hợp lệ hoặc sử dụng mã khuyến mãi" 
}: PromotionCodeValidatorProps) {
  const [code, setCode] = useState("")
  const [promotionId, setPromotionId] = useState<number | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isIncrementing, setIsIncrementing] = useState(false)
  const [validationResult, setValidationResult] = useState<boolean | null>(null)
  const [incrementResult, setIncrementResult] = useState<boolean | null>(null)
  
  // Quantity management states
  const [quantityPromotionId, setQuantityPromotionId] = useState<number | null>(null)
  const [isLoadingPromotion, setIsLoadingPromotion] = useState(false)
  const [promotionDetails, setPromotionDetails] = useState<{
    name: string;
    totalQuantity: number;
    usedQuantity: number;
  } | null>(null)
  const [newTotalQuantity, setNewTotalQuantity] = useState<number>(0)
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false)

  const handleCheckCode = async () => {
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã khuyến mãi")
      return
    }

    setIsValidating(true)
    setValidationResult(null)
    
    try {
      const result = await checkPromotionAvailability(code.trim())
      setValidationResult(result)
      
      if (result) {
        toast.success("Mã khuyến mãi hợp lệ và có thể sử dụng")
      } else {
        toast.error("Mã khuyến mãi không hợp lệ hoặc đã hết hạn")
      }
    } catch (error) {
      console.error("Error checking promotion code:", error)
      toast.error("Có lỗi xảy ra khi kiểm tra mã khuyến mãi")
      setValidationResult(false)
    } finally {
      setIsValidating(false)
    }
  }

  const handleIncrementUsage = async () => {
    if (!promotionId) {
      toast.error("Vui lòng nhập ID khuyến mãi")
      return
    }

    setIsIncrementing(true)
    setIncrementResult(null)
    
    try {
      const result = await incrementPromotionUsage(promotionId)
      setIncrementResult(result)
      
      if (result) {
        toast.success("Đã tăng số lần sử dụng khuyến mãi thành công")
        
        // If we have promotion details loaded, update the used quantity
        if (promotionDetails && quantityPromotionId === promotionId) {
          setPromotionDetails({
            ...promotionDetails,
            usedQuantity: promotionDetails.usedQuantity + 1
          })
        }
      } else {
        toast.error("Không thể tăng số lần sử dụng. Khuyến mãi có thể đã hết hạn hoặc đạt giới hạn")
      }
    } catch (error) {
      console.error("Error incrementing promotion usage:", error)
      toast.error("Có lỗi xảy ra khi tăng số lần sử dụng")
      setIncrementResult(false)
    } finally {
      setIsIncrementing(false)
    }
  }

  const handleLoadPromotion = async () => {
    if (!quantityPromotionId) {
      toast.error("Vui lòng nhập ID khuyến mãi")
      return
    }

    setIsLoadingPromotion(true)
    setPromotionDetails(null)
    
    try {
      console.log("Loading promotion details for ID:", quantityPromotionId);
      const promotion = await getPromotionById(quantityPromotionId)
      console.log("Loaded promotion data:", promotion);
      
      setPromotionDetails({
        name: promotion.name,
        totalQuantity: promotion.totalQuantity ?? 0, // Use nullish coalescing to handle undefined
        usedQuantity: promotion.usedQuantity ?? 0 // Use nullish coalescing to handle undefined
      })
      setNewTotalQuantity(promotion.totalQuantity ?? 0)
    } catch (error) {
      console.error("Error loading promotion:", error)
      toast.error("Không thể tải thông tin khuyến mãi. Vui lòng kiểm tra ID và thử lại.")
    } finally {
      setIsLoadingPromotion(false)
    }
  }

  const handleUpdateQuantity = async () => {
    if (!quantityPromotionId || !promotionDetails) {
      return
    }

    // Validate the new quantity
    if (newTotalQuantity < 0) {
      toast.error(`Số lượng không thể là số âm`)
      return
    }
    
    if (newTotalQuantity > 0 && newTotalQuantity < promotionDetails.usedQuantity) {
      toast.error(`Tổng số lượng phải lớn hơn hoặc bằng số lượng đã sử dụng (${promotionDetails.usedQuantity})`)
      return
    }

    setIsUpdatingQuantity(true)
    
    try {
      console.log(`Updating promotion ${quantityPromotionId} quantity to: ${newTotalQuantity}`);
      const updated = await updatePromotionQuantity(quantityPromotionId, newTotalQuantity)
      console.log("Updated promotion data:", updated);
      
      setPromotionDetails({
        ...promotionDetails,
        totalQuantity: updated.totalQuantity
      })
      toast.success(newTotalQuantity === 0 
        ? "Đã cập nhật thành công. Mã khuyến mãi giờ không có giới hạn số lượng." 
        : `Đã cập nhật số lượng khuyến mãi thành công thành ${newTotalQuantity}`)
    } catch (error) {
      console.error("Error updating promotion quantity:", error)
      toast.error("Không thể cập nhật số lượng khuyến mãi")
    } finally {
      setIsUpdatingQuantity(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="promotion-code">Mã khuyến mãi</Label>
            <div className="flex mt-1">
              <Input
                id="promotion-code"
                placeholder="Nhập mã khuyến mãi cần kiểm tra"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-r-none"
              />
              <Button 
                onClick={handleCheckCode} 
                disabled={isValidating || !code.trim()}
                className="rounded-l-none"
              >
                {isValidating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2">Kiểm tra</span>
              </Button>
            </div>
          </div>

          {validationResult !== null && (
            <div className={`p-3 rounded-md flex items-center ${validationResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {validationResult ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Mã khuyến mãi hợp lệ và có thể sử dụng</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 mr-2" />
                  <span>Mã khuyến mãi không hợp lệ hoặc đã hết hạn</span>
                </>
              )}
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <Label htmlFor="promotion-id">Tăng số lần sử dụng khuyến mãi (theo ID)</Label>
          <div className="flex mt-1">
            <Input
              id="promotion-id"
              type="number"
              placeholder="Nhập ID khuyến mãi"
              value={promotionId || ''}
              onChange={(e) => setPromotionId(Number(e.target.value))}
              className="rounded-r-none"
            />
            <Button 
              onClick={handleIncrementUsage} 
              disabled={isIncrementing || !promotionId}
              className="rounded-l-none"
            >
              {isIncrementing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Tăng lượt sử dụng</span>
            </Button>
          </div>
          
          {incrementResult !== null && (
            <div className={`p-3 mt-2 rounded-md flex items-center ${incrementResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {incrementResult ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Đã tăng số lần sử dụng khuyến mãi thành công</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5 mr-2" />
                  <span>Không thể tăng số lần sử dụng. Khuyến mãi có thể đã hết hạn hoặc đạt giới hạn</span>
                </>
              )}
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-base font-medium">Quản lý số lượng mã khuyến mãi</h3>
          
          <div className="flex mt-1">
            <Input
              id="quantity-promotion-id"
              type="number"
              placeholder="Nhập ID khuyến mãi"
              value={quantityPromotionId || ''}
              onChange={(e) => setQuantityPromotionId(Number(e.target.value))}
              className="rounded-r-none"
            />
            <Button 
              onClick={handleLoadPromotion} 
              disabled={isLoadingPromotion || !quantityPromotionId}
              className="rounded-l-none"
            >
              {isLoadingPromotion ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Tải thông tin</span>
            </Button>
          </div>

          {promotionDetails && (
            <div className="p-4 border rounded-md bg-muted/20 space-y-4">
              <div>
                <h4 className="font-medium">{promotionDetails.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Đã sử dụng: {promotionDetails.usedQuantity} / {promotionDetails.totalQuantity === 0 ? "∞" : promotionDetails.totalQuantity} mã
                </p>
                {promotionDetails.totalQuantity > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(((promotionDetails.usedQuantity || 0) / (promotionDetails.totalQuantity || 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-quantity">Tổng số lượng mới</Label>
                <div className="flex">
                  <Input
                    id="new-quantity"
                    type="number"
                    min={promotionDetails.usedQuantity}
                    value={newTotalQuantity}
                    onChange={(e) => setNewTotalQuantity(Number(e.target.value))}
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={handleUpdateQuantity} 
                    disabled={isUpdatingQuantity || newTotalQuantity === promotionDetails.totalQuantity}
                    className="rounded-l-none"
                  >
                    {isUpdatingQuantity ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span className="ml-2">Cập nhật</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {promotionDetails.totalQuantity === 0 ? (
                    <>
                      Hiện tại mã không có giới hạn. Nhập số &gt; 0 để thiết lập giới hạn sử dụng.
                    </>
                  ) : (
                    <>
                      Số lượng mới phải lớn hơn hoặc bằng số lượng đã sử dụng ({promotionDetails.usedQuantity}). Nhập 0 để bỏ giới hạn.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Công cụ này cho phép kiểm tra tính hợp lệ của mã khuyến mãi, tăng số lần sử dụng và chỉnh sửa tổng số lượng mã.
      </CardFooter>
    </Card>
  )
} 