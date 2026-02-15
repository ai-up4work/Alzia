#!/usr/bin/env python3
"""
Supabase Product Import Script - RLS Compatible
Uses SERVICE ROLE key to bypass RLS policies during import

Features:
- Generates mock SKUs for products missing SKU field
- Two modes: SKIP existing products or UPDATE them
- In UPDATE mode: Preserves existing data - only overwrites fields that have values in CSV
  (e.g., if description is empty in CSV but exists in DB, it won't be erased)
"""

import csv
import os
from supabase import create_client, Client
from typing import Dict, List, Optional
import re

# CRITICAL: Use SERVICE ROLE key, not ANON key!
# Supabase configuration
SUPABASE_URL = "https://hygqolfmgtsqulkykxpg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z3FvbGZtZ3RzcXVsa3lreHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTU3MTQsImV4cCI6MjA4MzU5MTcxNH0.JDq1opBXlsHOPwS4L1vdGX8_epWg7h-SRmA0ZO5QQBU"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z3FvbGZtZ3RzcXVsa3lreHBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNTcxNCwiZXhwIjoyMDgzNTkxNzE0fQ.YwEBPkhAuC2nWi5at7swWOWEGsRtJ9nmTJJsh5a8q0k"

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

class SupabaseImporter:
    def __init__(self, url: str, service_key: str, skip_existing: bool = False):
        # Use service_role key to bypass RLS
        self.client: Client = create_client(url, service_key)
        self.categories_cache: Dict[str, str] = {}
        self.brands_cache: Dict[str, str] = {}
        self.mock_sku_counter: int = 1
        self.generated_skus: List[str] = []
        self.skip_existing: bool = skip_existing  # Whether to skip or update existing products
        
    def generate_mock_sku(self, product_name: str) -> str:
        """Generate a unique mock SKU for products without one"""
        base_sku = f"MOCK-{self.mock_sku_counter:04d}"
        
        # Try to add product name prefix if available
        if product_name:
            name_prefix = re.sub(r'[^A-Z0-9]', '', product_name.upper()[:4])
            if name_prefix:
                base_sku = f"{name_prefix}-{self.mock_sku_counter:04d}"
        
        # Ensure uniqueness
        while base_sku in self.generated_skus:
            self.mock_sku_counter += 1
            base_sku = f"MOCK-{self.mock_sku_counter:04d}"
        
        self.mock_sku_counter += 1
        self.generated_skus.append(base_sku)
        return base_sku
        
    def get_or_create_category(self, name: str) -> Optional[str]:
        """Get existing category or create new one, return UUID"""
        if not name:
            return None
            
        if name in self.categories_cache:
            return self.categories_cache[name]
        
        slug = slugify(name)
        
        try:
            result = self.client.table('categories').select('id').eq('slug', slug).execute()
            
            if result.data:
                category_id = result.data[0]['id']
                self.categories_cache[name] = category_id
                return category_id
            
            new_category = {
                'name': name,
                'slug': slug,
                'is_active': True
            }
            
            result = self.client.table('categories').insert(new_category).execute()
            
            if result.data:
                category_id = result.data[0]['id']
                self.categories_cache[name] = category_id
                print(f"✓ Created category: {name}")
                return category_id
        except Exception as e:
            print(f"⚠️  Category error for '{name}': {str(e)}")
        
        return None
    
    def get_or_create_brand(self, name: str) -> Optional[str]:
        """Get existing brand or create new one, return UUID"""
        if not name:
            return None
            
        if name in self.brands_cache:
            return self.brands_cache[name]
        
        slug = slugify(name)
        
        try:
            result = self.client.table('brands').select('id').eq('slug', slug).execute()
            
            if result.data:
                brand_id = result.data[0]['id']
                self.brands_cache[name] = brand_id
                return brand_id
            
            new_brand = {
                'name': name,
                'slug': slug,
                'is_active': True
            }
            
            result = self.client.table('brands').insert(new_brand).execute()
            
            if result.data:
                brand_id = result.data[0]['id']
                self.brands_cache[name] = brand_id
                print(f"✓ Created brand: {name}")
                return brand_id
        except Exception as e:
            print(f"⚠️  Brand error for '{name}': {str(e)}")
        
        return None
    
    def parse_tags(self, tags_str: str) -> Optional[List[str]]:
        """Parse tags string into array"""
        if not tags_str or tags_str.strip() == '':
            return None
        
        tags = [tag.strip() for tag in tags_str.split(',')]
        return [tag for tag in tags if tag]
    
    def safe_float(self, value: str, default: float = 0.0) -> float:
        """Safely convert string to float"""
        if not value or value.strip() == '':
            return default
        try:
            return float(value.strip())
        except ValueError:
            return default
    
    def safe_int(self, value: str, default: int = 0) -> int:
        """Safely convert string to int"""
        if not value or value.strip() == '':
            return default
        try:
            return int(float(value.strip()))
        except ValueError:
            return default
    
    def import_product(self, row: Dict[str, str]) -> bool:
        """Import a single product from CSV row"""
        try:
            # Get SKU or generate mock SKU if missing
            original_sku = row.get('sku', '').strip()
            product_name = row.get('name', '').strip()
            
            # Check if product has required non-null fields
            if not product_name:
                print(f"⚠️  Skipping product: Missing required 'name' field")
                return False
            
            # Generate mock SKU if missing
            if not original_sku:
                sku = self.generate_mock_sku(product_name)
                print(f"ℹ️  Generated mock SKU '{sku}' for product '{product_name}'")
            else:
                sku = original_sku
            
            # Get or create category and brand
            category_id = self.get_or_create_category(row.get('category', '').strip())
            brand_id = self.get_or_create_brand(row.get('brand', '').strip())
            
            # Prepare product data
            product_data = {
                'sku': sku,
                'name': product_name,
                'slug': row.get('slug', '').strip() or slugify(product_name),
                'description': row.get('description', '').strip() or None,
                'short_description': row.get('short description', '').strip() or None,
                'category_id': category_id,
                'brand_id': brand_id,
                'retail_price': self.safe_float(row.get('retail_price', '0')),
                'wholesale_price': self.safe_float(row.get('wholesale_price', '0')),
                'cost_price': self.safe_float(row.get('cost_price', '0')) or None,
                'min_wholesale_qty': self.safe_int(row.get('min_wholesale_qty', '10')),
                'stock_quantity': self.safe_int(row.get('stock_quantity', '0')),
                'low_stock_threshold': self.safe_int(row.get('low_stock_threshold', '10')),
                'weight': self.safe_float(row.get('weight', '0')) or None,
                'ingredients': row.get('ingredients', '').strip() or None,
                'usage_instructions': row.get('usage_instructions', '').strip() or None,
                'tags': self.parse_tags(row.get('tags', '')),
                'status': row.get('status', 'draft').strip() or 'draft',
            }
            
            # Map 'available' to 'published'
            if product_data['status'].lower() == 'available':
                product_data['status'] = 'published'
            
            # Check if product already exists (by SKU)
            try:
                existing = self.client.table('products').select('id').eq('sku', sku).execute()
                
                if existing.data:
                    if self.skip_existing:
                        # Skip existing product
                        print(f"⊘ Skipped existing product: {product_data['name']} (SKU: {sku})")
                        return True  # Return True since it's not an error, just skipped
                    else:
                        # Update existing product - only update fields with non-null values
                        product_id = existing.data[0]['id']
                        
                        # Build update dict with only non-null values to preserve existing data
                        update_data = {}
                        for key, value in product_data.items():
                            # Only include fields that have actual values
                            if value is not None and value != '' and value != []:
                                update_data[key] = value
                            # Always update these key fields even if empty
                            elif key in ['sku', 'name', 'slug', 'retail_price', 'wholesale_price', 'status']:
                                update_data[key] = value
                        
                        self.client.table('products').update(update_data).eq('id', product_id).execute()
                        print(f"✓ Updated product: {product_data['name']} (SKU: {sku})")
                else:
                    # Insert new product
                    result = self.client.table('products').insert(product_data).execute()
                    if result.data:
                        product_id = result.data[0]['id']
                        print(f"✓ Created product: {product_data['name']} (SKU: {sku})")
                    else:
                        print(f"✗ Failed to create product: {product_data['name']}")
                        return False
                
                # Handle product image
                image_url = row.get('image_url', '').strip()
                if image_url:
                    existing_image = self.client.table('product_images').select('id').eq('product_id', product_id).execute()
                    
                    if existing_image.data:
                        self.client.table('product_images').update({
                            'image_url': image_url,
                            'is_primary': True
                        }).eq('product_id', product_id).execute()
                    else:
                        self.client.table('product_images').insert({
                            'product_id': product_id,
                            'image_url': image_url,
                            'alt_text': product_data['name'],
                            'is_primary': True,
                            'display_order': 0
                        }).execute()
                
                return True
                
            except Exception as e:
                error_msg = str(e)
                if 'row-level security' in error_msg.lower():
                    print(f"✗ RLS ERROR for {product_data['name']}: Use SERVICE ROLE key, not ANON key!")
                else:
                    print(f"✗ Error importing product {product_data['name']}: {error_msg}")
                return False
            
        except Exception as e:
            print(f"✗ Error importing product {row.get('name', 'Unknown')}: {str(e)}")
            return False
    
    def import_csv(self, csv_file: str):
        """Import all products from CSV file"""
        print(f"\n{'='*60}")
        print(f"Starting import from: {csv_file}")
        if self.skip_existing:
            print(f"Mode: SKIP existing products")
        else:
            print(f"Mode: UPDATE existing products")
        print(f"{'='*60}\n")
        
        success_count = 0
        error_count = 0
        mock_sku_count = 0
        skipped_count = 0
        updated_count = 0
        created_count = 0
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            # Strip whitespace from headers
            reader.fieldnames = [field.strip() if field else field for field in reader.fieldnames]
            
            for row in reader:
                # Create a new row dict with stripped keys
                cleaned_row = {k.strip() if k else k: v for k, v in row.items()}
                
                # Track if this row has no SKU
                had_no_sku = not cleaned_row.get('sku', '').strip()
                
                if self.import_product(cleaned_row):
                    success_count += 1
                    if had_no_sku:
                        mock_sku_count += 1
                else:
                    error_count += 1
        
        print(f"\n{'='*60}")
        print(f"Import completed!")
        print(f"{'='*60}")
        print(f"✓ Successfully processed: {success_count} products")
        if mock_sku_count > 0:
            print(f"ℹ️  Products with generated mock SKUs: {mock_sku_count}")
        print(f"✗ Errors: {error_count} products")
        print(f"{'='*60}\n")
        
        if self.generated_skus:
            print("Generated SKUs:")
            print("-" * 60)
            for sku in self.generated_skus:
                print(f"  • {sku}")
            print()

def main():
    """Main execution function"""
    print("\n" + "="*60)
    print("SUPABASE PRODUCT IMPORTER")
    print("="*60 + "\n")
    
    # Check for environment variables
    if SUPABASE_URL == "your-supabase-url" or SUPABASE_SERVICE_KEY == "your-service-role-key":
        print("⚠️  CONFIGURATION REQUIRED\n")
        print("Please set your Supabase credentials:")
        print("\n  Option 1 - Environment Variables (Recommended):")
        print("  --------------------------------------------------")
        print("  export SUPABASE_URL='https://xxxxx.supabase.co'")
        print("  export SUPABASE_SERVICE_KEY='eyJhbG...your-service-role-key'")
        print("\n  Option 2 - Edit Script:")
        print("  -----------------------")
        print("  Edit lines 12-13 in this script\n")
        print("⚠️  IMPORTANT: Use SERVICE ROLE key (not anon key)")
        print("   Find it in: Settings → API → service_role (secret)\n")
        print("="*60 + "\n")
        return
    
    csv_file = 'E:/Business/up4work/Alzia/public/products.csv'
    
    if not os.path.exists(csv_file):
        print(f"\n✗ CSV file not found: {csv_file}")
        print("Please ensure the CSV file is in the same directory as this script.\n")
        return
    
    # Set skip_existing=True to only import NEW products (skip existing ones)
    # Set skip_existing=False to UPDATE existing products with new data
    skip_existing = True  # Change this to False if you want to update existing products
    
    try:
        importer = SupabaseImporter(SUPABASE_URL, SUPABASE_SERVICE_KEY, skip_existing=skip_existing)
        importer.import_csv(csv_file)
    except Exception as e:
        print(f"\n✗ Fatal error: {str(e)}\n")

if __name__ == "__main__":
    main()