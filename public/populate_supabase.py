#!/usr/bin/env python3
"""
Supabase Product Import Script - RLS Compatible
Uses SERVICE ROLE key to bypass RLS policies during import
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
    def __init__(self, url: str, service_key: str):
        # Use service_role key to bypass RLS
        self.client: Client = create_client(url, service_key)
        self.categories_cache: Dict[str, str] = {}
        self.brands_cache: Dict[str, str] = {}
        
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
            # Get or create category and brand
            category_id = self.get_or_create_category(row.get('category', '').strip())
            brand_id = self.get_or_create_brand(row.get('brand', '').strip())
            
            # Prepare product data
            product_data = {
                'sku': row.get('sku', '').strip(),
                'name': row.get('name', '').strip(),
                'slug': row.get('slug', '').strip() or slugify(row.get('name', '')),
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
            
            # Check if product already exists
            try:
                existing = self.client.table('products').select('id').eq('sku', product_data['sku']).execute()
                
                if existing.data:
                    # Update existing product
                    product_id = existing.data[0]['id']
                    self.client.table('products').update(product_data).eq('id', product_id).execute()
                    print(f"✓ Updated product: {product_data['name']} (SKU: {product_data['sku']})")
                else:
                    # Insert new product
                    result = self.client.table('products').insert(product_data).execute()
                    if result.data:
                        product_id = result.data[0]['id']
                        print(f"✓ Created product: {product_data['name']} (SKU: {product_data['sku']})")
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
        print(f"{'='*60}\n")
        
        success_count = 0
        error_count = 0
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                if self.import_product(row):
                    success_count += 1
                else:
                    error_count += 1
        
        print(f"\n{'='*60}")
        print(f"Import completed!")
        print(f"{'='*60}")
        print(f"✓ Successfully imported: {success_count} products")
        print(f"✗ Errors: {error_count} products")
        print(f"{'='*60}\n")

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
    
    try:
        importer = SupabaseImporter(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        importer.import_csv(csv_file)
    except Exception as e:
        print(f"\n✗ Fatal error: {str(e)}\n")

if __name__ == "__main__":
    main()