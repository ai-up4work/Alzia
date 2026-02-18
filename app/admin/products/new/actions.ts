"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

type PendingImage = {
  url: string
  alt_text: string
  display_order: number
  is_primary: boolean
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  // 1. Insert product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name:                formData.get("name")              as string,
      slug:                formData.get("slug")              as string,
      sku:                 formData.get("sku")               as string || null,
      description:         formData.get("description")       as string || null,
      category_id:         formData.get("category_id")       as string || null,
      brand_id:            formData.get("brand_id")          as string || null,
      retail_price:        parseFloat(formData.get("retail_price")      as string) || 0,
      wholesale_price:     parseFloat(formData.get("wholesale_price")   as string) || null,
      cost_price:          parseFloat(formData.get("cost_price")        as string) || null,
      stock_quantity:      parseInt(formData.get("stock_quantity")      as string) || 0,
      low_stock_threshold: parseInt(formData.get("low_stock_threshold") as string) || 10,
      status:              formData.get("status")            as string || "draft",
      is_featured:         formData.get("is_featured") === "true",
    })
    .select("id")
    .single()

  if (productError) throw new Error(productError.message)

  // 2. Insert product_images rows
  const imagesJson = formData.get("images_json") as string
  if (imagesJson) {
    const images: PendingImage[] = JSON.parse(imagesJson)
    if (images.length > 0) {
      const { error: imgError } = await supabase.from("product_images").insert(
        images.map((img) => ({
          product_id:    product.id,
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