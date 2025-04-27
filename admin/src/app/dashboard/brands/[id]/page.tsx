"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" // Nhập Image từ next/image
import { ArrowLeft, Edit, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Type definitions for API integration
interface Brand {
  id: string
  name: string
  logoUrl: string
  description: string
  website: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  name: string
  price: number
  status: string
  category: string
  brandId: string
  createdAt: string
}

// Mock data functions - will be replaced with actual API calls
const fetchBrand = async (id: string): Promise<Brand> => {
  // Example API call:
  // return await fetch(`/api/brands/${id}`).then(res => res.json())
  return {
    id,
    name: "Apple",
    logoUrl: "/brands/apple.png",
    description: "Apple Inc. is an American multinational technology company headquartered in Cupertino, California.",
    website: "https://www.apple.com",
    status: "active",
    createdAt: "2023-01-15",
    updatedAt: "2023-06-22"
  }
}

const fetchBrandProducts = async (brandId: string): Promise<Product[]> => {
  // Example API call:
  // return await fetch(`/api/products?brandId=${brandId}`).then(res => res.json())
  return [
    { id: "prod1", name: "iPhone 14 Pro", price: 999, status: "In Stock", category: "Smartphone", brandId, createdAt: "2023-02-10" },
    { id: "prod2", name: "MacBook Air M2", price: 1199, status: "In Stock", category: "Laptop", brandId, createdAt: "2023-03-15" },
    { id: "prod3", name: "iPad Pro", price: 799, status: "Low Stock", category: "Tablet", brandId, createdAt: "2023-04-20" },
    { id: "prod4", name: "AirPods Pro", price: 249, status: "In Stock", category: "Audio", brandId, createdAt: "2023-05-05" }
  ]
}

const updateBrand = async (id: string, data: Brand): Promise<Brand> => {
  // Example API call:
  // return await fetch(`/api/brands/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // }).then(res => res.json())
  console.log("Updating brand:", id, data)
  return data
}

export default function BrandDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedBrand, setEditedBrand] = useState<Brand | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const brandData = await fetchBrand(params.id)
        const productsData = await fetchBrandProducts(params.id)
        
        setBrand(brandData)
        setEditedBrand(brandData)
        setProducts(productsData)
      } catch (error) {
        console.error("Error loading brand data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [params.id])

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave()
    } else {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!editedBrand) return
    
    setIsSubmitting(true)
    try {
      const updated = await updateBrand(params.id, editedBrand)
      setBrand(updated)
      setIsEditing(false)
      // Success notification could be added here
    } catch (error) {
      console.error("Error updating brand:", error)
      // Error notification could be added here
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof Brand, value: string) => {
    if (!editedBrand) return
    setEditedBrand({ ...editedBrand, [field]: value })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading brand details...</p>
      </div>
    )
  }

  if (!brand || !editedBrand) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <p className="text-muted-foreground">Brand not found</p>
        <Button onClick={() => router.push('/dashboard/brands')}>Return to Brands</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/brands')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Brand Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>View and edit brand details</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button onClick={handleEditToggle} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                ) : (
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleEditToggle}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name</Label>
                    <Input 
                      id="name" 
                      value={editedBrand.name} 
                      onChange={e => handleChange("name", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input 
                      id="logoUrl" 
                      value={editedBrand.logoUrl} 
                      onChange={e => handleChange("logoUrl", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      value={editedBrand.website} 
                      onChange={e => handleChange("website", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editedBrand.status}
                      onChange={e => handleChange("status", e.target.value as "active" | "inactive")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      rows={3} 
                      value={editedBrand.description} 
                      onChange={e => handleChange("description", e.target.value)} 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Brand Name</p>
                      <p className="font-medium">{brand.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a 
                        href={brand.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {brand.website}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={brand.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                        {brand.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Logo</p>
                      {brand.logoUrl ? (
                        <div className="h-10 w-10 rounded overflow-hidden bg-muted mt-1">
                          <Image 
                            src={brand.logoUrl} 
                            alt={brand.name} 
                            width={40} 
                            height={40} 
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No logo available</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-medium">{brand.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Products</CardTitle>
              <CardDescription>Products associated with this brand</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(product => (
                      <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/dashboard/products/${product.id}`)}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No products found for this brand</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Brand ID</p>
                  <p className="font-medium">{brand.id}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="font-medium">{brand.createdAt}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{brand.updatedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Delete Brand</CardTitle>
              <CardDescription>This action cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full flex items-center gap-2">
                    <Trash className="h-4 w-4" />
                    Delete Brand
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to delete?</DialogTitle>
                    <DialogDescription>
                      This action will permanently delete the brand {brand.name} and cannot be recovered.
                      All products associated with this brand will be dissociated.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Delete Permanently</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}