import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Save, Package } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { updateProduct, deleteProduct } from "./actions"
import { DeleteProductButton } from "./DeleteProductButton"
import { ProductImageUploader } from "@/components/admin/products/ProductImageUploader"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }, { data: brands }, { data: existingImages }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*, categories(name), brands(name)")
        .eq("id", id)
        .single(),
      supabase.from("categories").select("id, name").eq("is_active", true).order("name"),
      supabase.from("brands").select("id, name").order("name"),
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("display_order"),
    ])

  if (!product) notFound()

  const updateProductWithId = updateProduct.bind(null, id)
  const deleteProductWithId = deleteProduct.bind(null, id)

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button type="button" variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Edit Product
            </h1>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
        </div>

        {/* Delete — separate form so it doesn't interfere with the main save */}
        <form action={deleteProductWithId}>
          <DeleteProductButton productName={product.name} />
        </form>
      </div>

      <form action={updateProductWithId}>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ── Left (main info) ─────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Core product details shown to customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={product.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={product.slug}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly identifier. Must be unique.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    defaultValue={product.sku ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={product.description ?? ""}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set retail, wholesale, and cost prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { id: "retail_price",    label: "Retail Price *",   value: product.retail_price,    required: true  },
                    { id: "wholesale_price", label: "Wholesale Price",  value: product.wholesale_price, required: false },
                    { id: "cost_price",      label: "Cost Price",       value: product.cost_price,      required: false },
                  ].map(({ id: fieldId, label, value, required }) => (
                    <div key={fieldId} className="space-y-2">
                      <Label htmlFor={fieldId}>{label}</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          $
                        </span>
                        <Input
                          id={fieldId}
                          name={fieldId}
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={value ?? ""}
                          placeholder="0.00"
                          className="pl-7"
                          required={required}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Track stock levels and low-stock alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      name="stock_quantity"
                      type="number"
                      min="0"
                      defaultValue={product.stock_quantity ?? 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                    <Input
                      id="low_stock_threshold"
                      name="low_stock_threshold"
                      type="number"
                      min="0"
                      defaultValue={product.low_stock_threshold ?? 10}
                    />
                    <p className="text-xs text-muted-foreground">
                      Highlighted red when stock falls below this.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <ProductImageUploader
              productId={id}
              initialImages={
                existingImages?.map((img) => ({
                  id:            img.id,
                  url:           img.image_url,
                  alt_text:      img.alt_text ?? "",
                  display_order: img.display_order,
                  is_primary:    img.is_primary,
                })) ?? []
              }
            />
          </div>

          {/* ── Right (meta) ─────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={product.status ?? "draft"}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_featured">Featured</Label>
                  <Select
                    name="is_featured"
                    defaultValue={product.is_featured ? "true" : "false"}
                  >
                    <SelectTrigger id="is_featured">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No</SelectItem>
                      <SelectItem value="true">Yes — show on homepage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Button type="submit" className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Link href="/admin/products" className="w-full">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Organisation */}
            <Card>
              <CardHeader>
                <CardTitle>Organisation</CardTitle>
                <CardDescription>Category and brand assignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select name="category_id" defaultValue={product.category_id ?? ""}>
                    <SelectTrigger id="category_id">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand_id">Brand</Label>
                  <Select name="brand_id" defaultValue={product.brand_id ?? ""}>
                    <SelectTrigger id="brand_id">
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Meta info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono text-xs truncate max-w-[140px]">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{new Date(product.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images</span>
                  <span>{existingImages?.length ?? 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}