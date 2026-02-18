"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

type PendingImage = {
  url: string
  alt_text: string
  display_order: number
  is_primary: boolean
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error: productError } = await supabase
    .from("products")
    .update({
      name:                formData.get("name")             as string,
      slug:                formData.get("slug")             as string,
      sku:                 formData.get("sku")              as string || null,
      description:         formData.get("description")      as string || null,
      category_id:         formData.get("category_id")      as string || null,
      brand_id:            formData.get("brand_id")         as string || null,
      retail_price:        parseFloat(formData.get("retail_price")      as string) || 0,
      wholesale_price:     parseFloat(formData.get("wholesale_price")   as string) || null,
      cost_price:          parseFloat(formData.get("cost_price")        as string) || null,
      stock_quantity:      parseInt(formData.get("stock_quantity")      as string) || 0,
      low_stock_threshold: parseInt(formData.get("low_stock_threshold") as string) || 10,
      status:              formData.get("status")           as string || "draft",
      is_featured:         formData.get("is_featured") === "true",
    })
    .eq("id", id)

  if (productError) throw new Error(productError.message)

  const imagesJson = formData.get("images_json") as string
  if (imagesJson !== null) {
    await supabase.from("product_images").delete().eq("product_id", id)
    const images: PendingImage[] = JSON.parse(imagesJson)
    if (images.length > 0) {
      const { error: imgError } = await supabase.from("product_images").insert(
        images.map((img) => ({
          product_id:    id,
          image_url:     img.url,
          alt_text:      img.alt_text || null,
          display_order: img.display_order,
          is_primary:    img.is_primary,
        }))
      )
      if (imgError) throw new Error(imgError.message)
    }
  }

  redirect("/admin/products")
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw new Error(error.message)
  redirect("/admin/products")
}