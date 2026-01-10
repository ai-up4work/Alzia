-- Row Level Security Policies for Cosmetics E-Commerce

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products, categories, brands are public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC READ POLICIES
-- =============================================

-- Anyone can view published products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'published');

-- Anyone can view active categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

-- Anyone can view active brands
CREATE POLICY "Brands are viewable by everyone" ON brands
  FOR SELECT USING (is_active = true);

-- Anyone can view product images
CREATE POLICY "Product images are viewable by everyone" ON product_images
  FOR SELECT USING (true);

-- Anyone can view active delivery zones
CREATE POLICY "Delivery zones are viewable by everyone" ON delivery_zones
  FOR SELECT USING (is_active = true);

-- Anyone can view active discounts
CREATE POLICY "Active discounts are viewable by everyone" ON discounts
  FOR SELECT USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

-- Anyone can view approved reviews
CREATE POLICY "Approved reviews are viewable by everyone" ON product_reviews
  FOR SELECT USING (is_approved = true);

-- =============================================
-- CUSTOMER POLICIES
-- =============================================

-- Customers can view their own profile
CREATE POLICY "Users can view own profile" ON customers
  FOR SELECT USING (auth.uid()::text = id::text);

-- Customers can update their own profile
CREATE POLICY "Users can update own profile" ON customers
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Customers can view their own addresses
CREATE POLICY "Users can view own addresses" ON customer_addresses
  FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Customers can manage their own addresses
CREATE POLICY "Users can insert own addresses" ON customer_addresses
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can update own addresses" ON customer_addresses
  FOR UPDATE USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can delete own addresses" ON customer_addresses
  FOR DELETE USING (auth.uid()::text = customer_id::text);

-- =============================================
-- ORDER POLICIES
-- =============================================

-- Customers can view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Customers can create orders
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Customers can view their own order items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND auth.uid()::text = orders.customer_id::text
    )
  );

-- =============================================
-- WISHLIST POLICIES
-- =============================================

-- Customers can manage their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlists
  FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can add to wishlist" ON wishlists
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Users can remove from wishlist" ON wishlists
  FOR DELETE USING (auth.uid()::text = customer_id::text);

-- =============================================
-- CART POLICIES
-- =============================================

-- Users can manage their own cart
CREATE POLICY "Users can view own cart" ON carts
  FOR SELECT USING (auth.uid()::text = customer_id::text OR session_id IS NOT NULL);

CREATE POLICY "Users can create cart" ON carts
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text OR session_id IS NOT NULL);

CREATE POLICY "Users can update own cart" ON carts
  FOR UPDATE USING (auth.uid()::text = customer_id::text OR session_id IS NOT NULL);

-- Cart items policies
CREATE POLICY "Users can view own cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (auth.uid()::text = carts.customer_id::text OR carts.session_id IS NOT NULL)
    )
  );

CREATE POLICY "Users can manage cart items" ON cart_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (auth.uid()::text = carts.customer_id::text OR carts.session_id IS NOT NULL)
    )
  );

-- =============================================
-- REVIEW POLICIES
-- =============================================

-- Users can create reviews for products they purchased
CREATE POLICY "Users can create reviews" ON product_reviews
  FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON product_reviews
  FOR UPDATE USING (auth.uid()::text = customer_id::text);

-- =============================================
-- ADMIN USERS SETUP
-- =============================================

-- Create admins table to store admin users
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can view all admins" ON admins;

-- Admins can view all admins
CREATE POLICY "Admins can view all admins" ON admins
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admins)
  );

-- =============================================
-- ADMIN CHECK FUNCTION
-- =============================================

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- CUSTOMERS TABLE - Admin Access
-- =============================================

DROP POLICY IF EXISTS "Admins can view all customers" ON customers;
DROP POLICY IF EXISTS "Admins can insert customers" ON customers;
DROP POLICY IF EXISTS "Admins can update all customers" ON customers;
DROP POLICY IF EXISTS "Admins can delete customers" ON customers;

CREATE POLICY "Admins can view all customers" ON customers
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert customers" ON customers
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update all customers" ON customers
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete customers" ON customers
  FOR DELETE USING (is_admin());

-- =============================================
-- CUSTOMER ADDRESSES - Admin Access
-- =============================================

DROP POLICY IF EXISTS "Admins can view all addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Admins can manage all addresses" ON customer_addresses;

CREATE POLICY "Admins can view all addresses" ON customer_addresses
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all addresses" ON customer_addresses
  FOR ALL USING (is_admin());

-- =============================================
-- ORDERS - Admin Access
-- =============================================

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can insert orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert orders" ON orders
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete orders" ON orders
  FOR DELETE USING (is_admin());

-- =============================================
-- ORDER ITEMS - Admin Access
-- =============================================

DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;

CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage order items" ON order_items
  FOR ALL USING (is_admin());

-- =============================================
-- PRODUCTS - Admin Full Access
-- =============================================

DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can create products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can create products" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (is_admin());

-- =============================================
-- CATEGORIES - Admin Full Access
-- =============================================

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin());

-- =============================================
-- BRANDS - Admin Full Access
-- =============================================

DROP POLICY IF EXISTS "Admins can manage brands" ON brands;

CREATE POLICY "Admins can manage brands" ON brands
  FOR ALL USING (is_admin());

-- =============================================
-- PRODUCT IMAGES - Admin Full Access
-- =============================================

DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;

CREATE POLICY "Admins can manage product images" ON product_images
  FOR ALL USING (is_admin());

-- =============================================
-- DISCOUNTS - Admin Full Access
-- =============================================

DROP POLICY IF EXISTS "Admins can manage discounts" ON discounts;

CREATE POLICY "Admins can manage discounts" ON discounts
  FOR ALL USING (is_admin());

-- =============================================
-- DELIVERY ZONES - Admin Full Access
-- =============================================

DROP POLICY IF EXISTS "Admins can manage delivery zones" ON delivery_zones;

CREATE POLICY "Admins can manage delivery zones" ON delivery_zones
  FOR ALL USING (is_admin());

-- =============================================
-- REVIEWS - Admin Access
-- =============================================

DROP POLICY IF EXISTS "Admins can view all reviews" ON product_reviews;
DROP POLICY IF EXISTS "Admins can approve/manage reviews" ON product_reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON product_reviews;

CREATE POLICY "Admins can view all reviews" ON product_reviews
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can approve/manage reviews" ON product_reviews
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete reviews" ON product_reviews
  FOR DELETE USING (is_admin());

-- =============================================
-- WISHLISTS - Admin Access
-- =============================================

DROP POLICY IF EXISTS "Admins can view all wishlists" ON wishlists;
DROP POLICY IF EXISTS "Admins can manage wishlists" ON wishlists;

CREATE POLICY "Admins can view all wishlists" ON wishlists
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage wishlists" ON wishlists
  FOR ALL USING (is_admin());

-- =============================================
-- CARTS - Admin Access
-- =============================================

DROP POLICY IF EXISTS "Admins can view all carts" ON carts;
DROP POLICY IF EXISTS "Admins can manage all carts" ON carts;
DROP POLICY IF EXISTS "Admins can view all cart items" ON cart_items;
DROP POLICY IF EXISTS "Admins can manage all cart items" ON cart_items;

CREATE POLICY "Admins can view all carts" ON carts
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all carts" ON carts
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can view all cart items" ON cart_items
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can manage all cart items" ON cart_items
  FOR ALL USING (is_admin());


-- INSERT INTO admins (id, email, full_name)
-- SELECT id, email, 'Admin User'
-- FROM auth.users 
-- WHERE id = 'replace-with-user-uuid';