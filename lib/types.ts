export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  brand_id: string | null
  retail_price: number
  wholesale_price: number
  cost_price: number | null
  min_wholesale_qty: number
  stock_quantity: number
  low_stock_threshold: number
  ingredients: string | null
  usage_instructions: string | null
  tags: string[] | null
  status: "draft" | "published" | "archived"
  is_featured: boolean
  rating_avg: number
  rating_count: number
  created_at: string
  updated_at: string
  category?: Category
  brand?: Brand
  images?: ProductImage[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  display_order: number
  is_primary: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  display_order: number
  is_active: boolean
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  is_active: boolean
}

export interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  customer_type: "retail" | "wholesale"
  status: "active" | "blocked" | "inactive"
  total_spent: number
  order_count: number
  created_at: string
}

export interface CustomerAddress {
  id: string
  customer_id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  pin_code: string
  landmark: string | null
  address_type: "home" | "office" | "other"
  is_default: boolean
}

export interface Order {
  id: string
  order_number: string
  customer_id: string | null
  customer_email: string
  customer_name: string
  customer_phone: string | null
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "packed"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: string | null
  subtotal: number
  discount_amount: number
  delivery_charge: number
  tax_amount: number
  total_amount: number
  shipping_address: CustomerAddress
  billing_address: CustomerAddress | null
  delivery_date: string | null
  delivery_slot: string | null
  delivery_instructions: string | null
  internal_notes: string | null
  coupon_code: string | null
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string
  product_image: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Discount {
  id: string
  name: string
  description: string | null
  code: string | null
  discount_type: "percentage" | "fixed" | "quantity_based"
  discount_value: number
  min_purchase_amount: number
  max_discount_amount: number | null
  customer_type: "retail" | "wholesale" | "all" | null
  is_active: boolean
  start_date: string | null
  end_date: string | null
}

export interface DeliveryZone {
  id: string
  name: string
  pin_codes: string[]
  delivery_charge: number
  free_delivery_threshold: number | null
  estimated_days: number
  is_active: boolean
}
