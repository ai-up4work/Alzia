-- Seed Data for Cosmetics E-Commerce Platform

-- =============================================
-- SEED CATEGORIES
-- =============================================
INSERT INTO categories (id, name, slug, description, display_order, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Skincare', 'skincare', 'Complete skincare solutions for radiant skin', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'Makeup', 'makeup', 'Premium makeup for every occasion', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'Haircare', 'haircare', 'Luxurious haircare for beautiful tresses', 3, true),
  ('44444444-4444-4444-4444-444444444444', 'Fragrance', 'fragrance', 'Exquisite fragrances that captivate', 4, true),
  ('55555555-5555-5555-5555-555555555555', 'Body Care', 'body-care', 'Indulgent body care essentials', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories
INSERT INTO categories (name, slug, description, parent_id, display_order, is_active) VALUES
  ('Cleansers', 'cleansers', 'Gentle cleansing formulas', '11111111-1111-1111-1111-111111111111', 1, true),
  ('Serums', 'serums', 'Concentrated treatment serums', '11111111-1111-1111-1111-111111111111', 2, true),
  ('Moisturizers', 'moisturizers', 'Hydrating moisturizers', '11111111-1111-1111-1111-111111111111', 3, true),
  ('Lipsticks', 'lipsticks', 'Long-lasting lip colors', '22222222-2222-2222-2222-222222222222', 1, true),
  ('Foundations', 'foundations', 'Flawless foundation formulas', '22222222-2222-2222-2222-222222222222', 2, true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED BRANDS
-- =============================================
INSERT INTO brands (id, name, slug, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Lumière Paris', 'lumiere-paris', true),
  ('22222222-2222-2222-2222-222222222222', 'Belle Naturelle', 'belle-naturelle', true),
  ('33333333-3333-3333-3333-333333333333', 'Éclat Royal', 'eclat-royal', true),
  ('44444444-4444-4444-4444-444444444444', 'Rose de Mai', 'rose-de-mai', true),
  ('55555555-5555-5555-5555-555555555555', 'Jardin Secret', 'jardin-secret', true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED PRODUCTS
-- =============================================
INSERT INTO products (id, sku, name, slug, description, short_description, category_id, brand_id, retail_price, wholesale_price, cost_price, min_wholesale_qty, stock_quantity, low_stock_threshold, ingredients, usage_instructions, tags, status, is_featured, rating_avg, rating_count) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'LP-SER-001',
    'Radiance Renewal Serum',
    'radiance-renewal-serum',
    'A luxurious vitamin C serum that brightens and evens skin tone while reducing the appearance of fine lines. Formulated with 15% stabilized vitamin C and hyaluronic acid for maximum efficacy.',
    'Brightening vitamin C serum for radiant skin',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    2450.00,
    1960.00,
    980.00,
    10,
    150,
    20,
    'Aqua, Ascorbic Acid, Sodium Hyaluronate, Glycerin, Niacinamide, Ferulic Acid',
    'Apply 3-4 drops to clean skin morning and evening. Follow with moisturizer.',
    ARRAY['vitamin-c', 'brightening', 'anti-aging', 'bestseller'],
    'published',
    true,
    4.8,
    124
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'BN-CRM-001',
    'Hydra-Silk Moisturizer',
    'hydra-silk-moisturizer',
    'An ultra-rich yet lightweight moisturizer that delivers 72-hour hydration. Infused with silk proteins and botanical extracts for a silky-smooth finish.',
    'Luxurious 72-hour hydrating cream',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    1850.00,
    1480.00,
    740.00,
    10,
    200,
    25,
    'Aqua, Glycerin, Squalane, Silk Amino Acids, Shea Butter, Vitamin E',
    'Apply generously to face and neck after serum. Use morning and evening.',
    ARRAY['hydrating', 'moisturizer', 'silk', 'luxury'],
    'published',
    true,
    4.6,
    89
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'ER-LIP-001',
    'Velvet Rouge Lipstick',
    'velvet-rouge-lipstick',
    'A creamy, long-wearing lipstick with intense color payoff. The velvet formula glides on smoothly and stays put for up to 8 hours without drying.',
    'Intense color velvet-finish lipstick',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    1200.00,
    960.00,
    480.00,
    15,
    300,
    30,
    'Ricinus Communis Oil, Cera Alba, Pigments, Vitamin E, Jojoba Oil',
    'Apply directly to lips. Can be layered for more intense color.',
    ARRAY['lipstick', 'long-lasting', 'velvet', 'rouge'],
    'published',
    true,
    4.7,
    156
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'RM-PRF-001',
    'Eau de Rose Parfum',
    'eau-de-rose-parfum',
    'A captivating rose fragrance with notes of Turkish rose, bergamot, and sandalwood. This elegant scent evokes the romance of a Parisian garden at dusk.',
    'Elegant rose eau de parfum',
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    4500.00,
    3600.00,
    1800.00,
    5,
    80,
    10,
    'Alcohol Denat, Parfum, Rosa Damascena, Citrus Bergamia, Santalum Album',
    'Spray on pulse points: wrists, neck, and behind ears.',
    ARRAY['perfume', 'rose', 'luxury', 'gift'],
    'published',
    true,
    4.9,
    67
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'JS-CLN-001',
    'Gentle Foaming Cleanser',
    'gentle-foaming-cleanser',
    'A sulfate-free foaming cleanser that removes makeup and impurities without stripping the skin. Enriched with chamomile and aloe vera for a soothing cleanse.',
    'Sulfate-free gentle foaming cleanser',
    '11111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555555',
    950.00,
    760.00,
    380.00,
    10,
    250,
    30,
    'Aqua, Cocamidopropyl Betaine, Chamomilla Recutita, Aloe Barbadensis, Glycerin',
    'Massage onto damp skin, lather, and rinse thoroughly.',
    ARRAY['cleanser', 'gentle', 'foaming', 'sensitive-skin'],
    'published',
    false,
    4.5,
    203
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'LP-FND-001',
    'Flawless Finish Foundation',
    'flawless-finish-foundation',
    'A buildable, medium-to-full coverage foundation with a natural satin finish. Enriched with skincare ingredients for a flawless look that lasts all day.',
    'Buildable satin-finish foundation',
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    2200.00,
    1760.00,
    880.00,
    10,
    180,
    20,
    'Aqua, Cyclopentasiloxane, Titanium Dioxide, Niacinamide, Hyaluronic Acid',
    'Apply with brush or sponge. Build coverage as desired.',
    ARRAY['foundation', 'full-coverage', 'satin', 'long-wear'],
    'published',
    false,
    4.4,
    178
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED PRODUCT IMAGES
-- =============================================
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
  ('11111111-1111-1111-1111-111111111111', '/placeholder.svg?height=600&width=600', 'Radiance Renewal Serum', 0, true),
  ('22222222-2222-2222-2222-222222222222', '/placeholder.svg?height=600&width=600', 'Hydra-Silk Moisturizer', 0, true),
  ('33333333-3333-3333-3333-333333333333', '/placeholder.svg?height=600&width=600', 'Velvet Rouge Lipstick', 0, true),
  ('44444444-4444-4444-4444-444444444444', '/placeholder.svg?height=600&width=600', 'Eau de Rose Parfum', 0, true),
  ('55555555-5555-5555-5555-555555555555', '/placeholder.svg?height=600&width=600', 'Gentle Foaming Cleanser', 0, true),
  ('66666666-6666-6666-6666-666666666666', '/placeholder.svg?height=600&width=600', 'Flawless Finish Foundation', 0, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DELIVERY ZONES
-- =============================================
INSERT INTO delivery_zones (name, pin_codes, delivery_charge, free_delivery_threshold, estimated_days, is_active) VALUES
  ('Metro Cities', ARRAY['110001', '400001', '560001', '600001', '500001'], 0, 999, 2, true),
  ('Tier 1 Cities', ARRAY['141001', '380001', '302001', '226001'], 50, 1499, 3, true),
  ('Rest of India', ARRAY['*'], 99, 1999, 5, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DISCOUNTS
-- =============================================
INSERT INTO discounts (name, description, code, discount_type, discount_value, min_purchase_amount, max_discount_amount, customer_type, usage_limit, start_date, end_date, is_active) VALUES
  ('Welcome Discount', '10% off on your first order', 'WELCOME10', 'percentage', 10, 500, 500, 'all', 1000, NOW(), NOW() + INTERVAL '1 year', true),
  ('Wholesale Special', '15% off for wholesale orders above 5000', 'WHOLESALE15', 'percentage', 15, 5000, 2000, 'wholesale', NULL, NOW(), NOW() + INTERVAL '6 months', true),
  ('Free Shipping', 'Free delivery on orders above 999', 'FREESHIP', 'fixed', 99, 999, 99, 'all', NULL, NOW(), NOW() + INTERVAL '3 months', true)
ON CONFLICT DO NOTHING;
