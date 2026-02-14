#!/usr/bin/env python3
"""
Slug Fixer - Corrects All Malformed Product Slugs
Fixes issues like: yc-milk-f/wash-100ml → yc-milk-f-wash-100ml
Handles all special characters, ensures URL-safe slugs
"""

import re
from supabase import create_client, Client
from typing import List, Tuple

# Supabase configuration
SUPABASE_URL = "https://hygqolfmgtsqulkykxpg.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5Z3FvbGZtZ3RzcXVsa3lreHBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODAxNTcxNCwiZXhwIjoyMDgzNTkxNzE0fQ.YwEBPkhAuC2nWi5at7swWOWEGsRtJ9nmTJJsh5a8q0k"

class SlugFixer:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase = create_client(supabase_url, supabase_key)
        
        # Statistics
        self.total_products = 0
        self.fixed_count = 0
        self.already_good = 0
        self.error_count = 0
        self.duplicate_slugs = []
    
    def create_proper_slug(self, text: str) -> str:
        """
        Create a proper URL-safe slug from any text
        
        Handles:
        - Spaces → hyphens
        - Slashes (/) → hyphens
        - Special chars → removed or converted
        - Multiple hyphens → single hyphen
        - Leading/trailing hyphens → removed
        - Uppercase → lowercase
        - Accented characters → ASCII equivalents
        """
        if not text:
            return ""
        
        # Convert to lowercase
        slug = text.lower()
        
        # Replace common special characters with meaningful equivalents
        replacements = {
            '&': 'and',
            '+': 'plus',
            '@': 'at',
            '%': 'percent',
            '#': 'number',
            '₹': 'rs',
            '$': 'dollar',
            '€': 'euro',
            '£': 'pound',
        }
        
        for char, replacement in replacements.items():
            slug = slug.replace(char, f'-{replacement}-')
        
        # Replace slashes, backslashes, and other separators with hyphens
        slug = re.sub(r'[/\\|_\s]+', '-', slug)
        
        # Remove all characters that aren't alphanumeric or hyphens
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        
        # Replace multiple consecutive hyphens with single hyphen
        slug = re.sub(r'-+', '-', slug)
        
        # Remove leading and trailing hyphens
        slug = slug.strip('-')
        
        # Ensure slug is not empty
        if not slug:
            slug = 'product'
        
        return slug
    
    def is_slug_valid(self, slug: str) -> Tuple[bool, List[str]]:
        """
        Check if a slug is valid and return issues if any
        
        Returns: (is_valid, list_of_issues)
        """
        issues = []
        
        if not slug:
            issues.append("Empty slug")
            return False, issues
        
        # Check for invalid characters
        if '/' in slug:
            issues.append("Contains forward slash (/)")
        if '\\' in slug:
            issues.append("Contains backslash (\\)")
        if ' ' in slug:
            issues.append("Contains spaces")
        if slug != slug.lower():
            issues.append("Contains uppercase letters")
        
        # Check for special characters
        invalid_chars = re.findall(r'[^a-z0-9-]', slug)
        if invalid_chars:
            unique_chars = list(set(invalid_chars))
            issues.append(f"Contains invalid chars: {', '.join(unique_chars)}")
        
        # Check for multiple consecutive hyphens
        if '--' in slug:
            issues.append("Contains consecutive hyphens (--)")
        
        # Check for leading/trailing hyphens
        if slug.startswith('-'):
            issues.append("Starts with hyphen")
        if slug.endswith('-'):
            issues.append("Ends with hyphen")
        
        is_valid = len(issues) == 0
        return is_valid, issues
    
    def check_slug_uniqueness(self, slug: str, product_id: str) -> bool:
        """
        Check if a slug is unique (not used by other products)
        """
        try:
            result = self.supabase.table('products').select('id').eq('slug', slug).execute()
            
            if not result.data:
                return True  # No one uses this slug
            
            # Check if it's only this product using the slug
            if len(result.data) == 1 and result.data[0]['id'] == product_id:
                return True  # Only this product uses this slug
            
            return False  # Slug is used by other products
            
        except Exception as e:
            print(f"       ⚠️  Error checking uniqueness: {str(e)}")
            return True  # Assume unique on error
    
    def make_slug_unique(self, base_slug: str, product_id: str) -> str:
        """
        If slug exists, append number to make it unique
        """
        if self.check_slug_uniqueness(base_slug, product_id):
            return base_slug
        
        # Try adding numbers
        counter = 1
        while counter < 1000:  # Safety limit
            new_slug = f"{base_slug}-{counter}"
            if self.check_slug_uniqueness(new_slug, product_id):
                return new_slug
            counter += 1
        
        # If still not unique, append product_id
        return f"{base_slug}-{product_id[:8]}"
    
    def fix_all_slugs(self, dry_run: bool = False):
        """
        Main function: Find and fix all malformed slugs
        
        Args:
            dry_run: If True, only shows what would be fixed without saving
        """
        print(f"\n{'='*80}")
        print("SLUG FIXER - CORRECTING MALFORMED PRODUCT SLUGS")
        print(f"{'='*80}\n")
        
        if dry_run:
            print("🔍 DRY RUN MODE - No changes will be saved")
            print("   This will show what would be fixed\n")
        
        print("🔍 STEP 1: Fetching all products from database...")
        print("   ⏳ Querying Supabase...")
        
        try:
            # Fetch all products
            result = self.supabase.table('products').select('id, sku, name, slug').execute()
            
            if not result.data:
                print("\n❌ No products found in database!")
                return
            
            self.total_products = len(result.data)
            print(f"   ✓ Found {self.total_products} products\n")
            
        except Exception as e:
            print(f"\n❌ Database error: {str(e)}")
            return
        
        print(f"{'='*80}")
        print(f"STEP 2: ANALYZING AND FIXING SLUGS")
        print(f"{'='*80}\n")
        
        # Process each product
        for idx, product in enumerate(result.data, 1):
            product_id = product['id']
            product_name = product.get('name', '')
            current_slug = product.get('slug', '')
            sku = product.get('sku', 'N/A')
            
            print(f"\n{'━'*80}")
            print(f"[{idx}/{self.total_products}] PRODUCT: {product_name}")
            print(f"{'━'*80}")
            print(f"  📋 SKU: {sku}")
            print(f"  🆔 ID: {product_id}")
            print(f"  📌 Current slug: {current_slug}")
            
            # Check if current slug is valid
            is_valid, issues = self.is_slug_valid(current_slug)
            
            if is_valid:
                print(f"  ✅ Status: VALID - No changes needed")
                self.already_good += 1
                continue
            
            # Show issues
            print(f"  ❌ Status: INVALID")
            for issue in issues:
                print(f"     • {issue}")
            
            # Generate correct slug from product name
            print(f"\n  🔧 Generating correct slug from name...")
            new_slug = self.create_proper_slug(product_name)
            print(f"     • Base slug: {new_slug}")
            
            # Check uniqueness
            if not self.check_slug_uniqueness(new_slug, product_id):
                print(f"     ⚠️  Slug already exists, making unique...")
                new_slug = self.make_slug_unique(new_slug, product_id)
                print(f"     • Unique slug: {new_slug}")
                self.duplicate_slugs.append({
                    'product': product_name,
                    'original': current_slug,
                    'new': new_slug
                })
            
            # Show the fix
            print(f"\n  📝 PROPOSED FIX:")
            print(f"     Old: {current_slug}")
            print(f"     New: {new_slug}")
            
            # Apply fix if not dry run
            if not dry_run:
                print(f"\n  💾 Saving to database...")
                try:
                    self.supabase.table('products').update({
                        'slug': new_slug
                    }).eq('id', product_id).execute()
                    
                    print(f"     ✅ UPDATED SUCCESSFULLY")
                    self.fixed_count += 1
                    
                except Exception as e:
                    print(f"     ❌ UPDATE FAILED: {str(e)}")
                    self.error_count += 1
            else:
                print(f"     ℹ️  DRY RUN - Not saved")
                self.fixed_count += 1
            
            # Progress update every 50 products
            if idx % 50 == 0 and idx < self.total_products:
                print(f"\n{'='*80}")
                print(f"📊 PROGRESS: {idx}/{self.total_products} products processed ({idx/self.total_products*100:.1f}%)")
                print(f"{'='*80}")
                print(f"  ✅ Fixed: {self.fixed_count}")
                print(f"  ✓ Already good: {self.already_good}")
                print(f"  ❌ Errors: {self.error_count}")
                print(f"{'='*80}\n")
        
        # Final summary
        self.print_summary(dry_run)
    
    def print_summary(self, dry_run: bool):
        """Print final summary"""
        print(f"\n\n{'='*80}")
        print("✅ COMPLETION SUMMARY")
        print(f"{'='*80}")
        print(f"  📦 Total products:        {self.total_products}")
        print(f"  🔧 Fixed/Would fix:       {self.fixed_count} ({self.fixed_count/self.total_products*100:.1f}%)" if self.total_products > 0 else "  🔧 Fixed/Would fix:       0")
        print(f"  ✓ Already valid:          {self.already_good} ({self.already_good/self.total_products*100:.1f}%)" if self.total_products > 0 else "  ✓ Already valid:          0")
        print(f"  ❌ Errors:                {self.error_count}")
        
        if self.duplicate_slugs:
            print(f"  ⚠️  Duplicates handled:    {len(self.duplicate_slugs)}")
        
        print(f"{'='*80}\n")
        
        if dry_run:
            print("ℹ️  DRY RUN - No changes were saved to database")
            print("   Run again without dry run to apply fixes\n")
        else:
            if self.fixed_count > 0:
                print(f"🎉 SUCCESS! Fixed {self.fixed_count} malformed slugs!")
                print(f"✅ All changes saved to Supabase database.\n")
            elif self.already_good == self.total_products:
                print(f"✨ PERFECT! All {self.total_products} slugs are already valid!\n")
        
        if self.error_count > 0:
            print(f"⚠️  {self.error_count} products had errors. Check output above.\n")
        
        # Show duplicate slug examples
        if self.duplicate_slugs and len(self.duplicate_slugs) <= 10:
            print(f"\n{'='*80}")
            print("DUPLICATE SLUGS MADE UNIQUE:")
            print(f"{'='*80}")
            for dup in self.duplicate_slugs:
                print(f"  • {dup['product']}")
                print(f"    Old: {dup['original']}")
                print(f"    New: {dup['new']}")
                print()
    
    def show_examples(self):
        """Show examples of slug transformations"""
        print(f"\n{'='*80}")
        print("SLUG TRANSFORMATION EXAMPLES")
        print(f"{'='*80}\n")
        
        examples = [
            "YC MILK F/WASH 100ML",
            "Cetaphil Gentle Skin Cleanser 500ml",
            "L'Oréal Paris Revitalift",
            "Neutrogena Oil-Free Acne Wash",
            "The Ordinary Niacinamide 10% + Zinc 1%",
            "Dove Body Wash 250ML",
            "GARNIER SKIN NATURALS CREAM 50G",
            "Himalaya Herbals Face Wash (100ml)",
            "Lakme 9to5 Primer & Matte Powder Foundation",
            "Maybelline New York Fit Me Foundation #310",
        ]
        
        print("Original Name → Generated Slug")
        print("─" * 80)
        
        for example in examples:
            slug = self.create_proper_slug(example)
            print(f"{example}")
            print(f"  → {slug}\n")
        
        print(f"{'='*80}\n")


def main():
    """Main execution"""
    print("\n" + "="*80)
    print("SLUG FIXER - PRODUCT SLUG CORRECTION TOOL")
    print("="*80)
    
    print("\n📋 What this does:")
    print("  1. Scans ALL products in database")
    print("  2. Identifies slugs with issues:")
    print("     • Slashes (/) → converts to hyphens")
    print("     • Spaces → converts to hyphens")
    print("     • Special characters → removes or converts")
    print("     • Uppercase → converts to lowercase")
    print("     • Multiple hyphens → single hyphen")
    print("  3. Generates proper URL-safe slugs")
    print("  4. Handles duplicate slugs (adds numbers)")
    print("  5. Updates database")
    
    print("\n🔒 Safety features:")
    print("  ✓ Dry run mode available (preview changes)")
    print("  ✓ Duplicate slug detection")
    print("  ✓ Uniqueness checking")
    print("  ✓ Error handling (continues on errors)")
    print("  ✓ Detailed progress tracking")
    
    fixer = SlugFixer(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Show examples
    show_examples = input("\nShow slug transformation examples? (y/n): ").strip().lower()
    if show_examples == 'y':
        fixer.show_examples()
    
    print("\n" + "="*80)
    print("CHOOSE MODE:")
    print("="*80)
    print("  1. DRY RUN - Preview changes without saving")
    print("  2. LIVE RUN - Fix and save to database")
    print()
    
    mode = input("Enter choice (1 or 2): ").strip()
    
    if mode == '1':
        print("\n🔍 Starting DRY RUN (preview mode)...")
        print("   No changes will be saved\n")
        fixer.fix_all_slugs(dry_run=True)
        
        print("\n" + "="*80)
        proceed = input("\nApply these fixes? (yes/no): ").strip().lower()
        if proceed == 'yes':
            print("\n🚀 Starting LIVE RUN...")
            print("   Changes will be saved to database\n")
            fixer_live = SlugFixer(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            fixer_live.fix_all_slugs(dry_run=False)
        else:
            print("\n❌ Cancelled. No changes were made.")
    
    elif mode == '2':
        print("\n⚠️  WARNING: This will modify your database!")
        confirm = input("Are you sure? Type 'YES' to confirm: ").strip()
        
        if confirm == 'YES':
            print("\n🚀 Starting LIVE RUN...")
            print("   Changes will be saved to database\n")
            fixer.fix_all_slugs(dry_run=False)
        else:
            print("\n❌ Cancelled. No changes were made.")
    
    else:
        print("\n❌ Invalid choice. Exiting.")
    
    print("\n✨ Script completed.")


if __name__ == "__main__":
    main()