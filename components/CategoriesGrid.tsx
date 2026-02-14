"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Package, Grid3x3, AlertCircle, RefreshCw, Star, Heart, Palette } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl!, supabaseKey!, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      'x-client-info': 'categories-grid'
    }
  }
});

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  product_count?: number;
  subcategories?: Category[];
}

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showOnlyParents, setShowOnlyParents] = useState(true);
  const fetchAttemptRef = useRef(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const currentAttempt = ++fetchAttemptRef.current;
    
    try {
      setLoading(true);
      setError(null);

      // Add a small delay to prevent rapid requests
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if this is still the latest fetch attempt
      if (currentAttempt !== fetchAttemptRef.current) {
        console.log('Fetch cancelled - newer request in progress');
        return;
      }

      // Fetch all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url, parent_id, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (categoriesError) {
        throw new Error(`Categories error: ${categoriesError.message}`);
      }

      if (!categoriesData || categoriesData.length === 0) {
        setCategories([]);
        setLoading(false);
        setRetryCount(0);
        return;
      }

      // Get product counts for each category
      const { data: productCounts } = await supabase
        .from('products')
        .select('category_id')
        .eq('status', 'published');

      // Count products per category
      const countMap: Record<string, number> = {};
      if (productCounts) {
        productCounts.forEach((product: any) => {
          if (product.category_id) {
            countMap[product.category_id] = (countMap[product.category_id] || 0) + 1;
          }
        });
      }

      // Build category hierarchy
      const categoryMap: Record<string, Category> = {};
      const parentCategories: Category[] = [];

      // First pass: create all categories with counts
      categoriesData.forEach((cat: any) => {
        categoryMap[cat.id] = {
          ...cat,
          product_count: countMap[cat.id] || 0,
          subcategories: []
        };
      });

      // Second pass: organize hierarchy
      categoriesData.forEach((cat: any) => {
        if (cat.parent_id && categoryMap[cat.parent_id]) {
          // Add to parent's subcategories
          categoryMap[cat.parent_id].subcategories!.push(categoryMap[cat.id]);
        } else if (!cat.parent_id) {
          // Add to parent categories
          parentCategories.push(categoryMap[cat.id]);
        }
      });

      setCategories(parentCategories);
      setRetryCount(0);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      
      // Auto-retry for network errors
      if (retryCount < 3 && !err.message?.includes('Row level security')) {
        console.log(`Retrying... Attempt ${retryCount + 1}/3`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchCategories();
        }, 1000 * (retryCount + 1));
        return;
      }
      
      setError(err.message || 'Failed to load categories');
      setLoading(false);
    }
  };

  // Get all categories (including subcategories) for display
  const getDisplayCategories = (): Category[] => {
    if (showOnlyParents) {
      return categories;
    }
    
    // Flatten all categories including subcategories
    const allCategories: Category[] = [];
    categories.forEach(parent => {
      allCategories.push(parent);
      if (parent.subcategories && parent.subcategories.length > 0) {
        allCategories.push(...parent.subcategories);
      }
    });
    return allCategories;
  };

  const displayCategories = getDisplayCategories();

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-2xl h-80" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 lg:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-serif text-2xl text-foreground font-light mb-3">
            Unable to Load Categories
          </h3>
          <p className="text-muted-foreground mb-2">{error}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {retryCount > 0 && `Attempted ${retryCount} ${retryCount === 1 ? 'retry' : 'retries'}`}
          </p>
          <button 
            onClick={() => {
              setRetryCount(0);
              fetchCategories();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (categories.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 lg:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Grid3x3 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl text-foreground font-light mb-3">
            No Categories Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            We're organizing our product categories. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Filter Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 bg-muted/30 rounded-full p-1 border border-border/50">
          <button
            onClick={() => setShowOnlyParents(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              showOnlyParents
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Main Categories
          </button>
          <button
            onClick={() => setShowOnlyParents(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              !showOnlyParents
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Categories
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
        {displayCategories.map((category) => {
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          const isSubcategory = category.parent_id !== null;
          
          return (
            <div
              key={category.id}
              className="group relative bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden bg-muted">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                    <Package className="w-16 h-16 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {isSubcategory && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-xs font-medium rounded-full shadow-lg">
                    Subcategory
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-light text-white mb-1">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-white/90 font-medium uppercase tracking-wider">
                    {category.product_count > 0 && (
                      <span>{category.product_count} {category.product_count === 1 ? 'Product' : 'Products'}</span>
                    )}
                    {hasSubcategories && showOnlyParents && (
                      <>
                        {category.product_count > 0 && <span>•</span>}
                        <span>{category.subcategories!.length} Subcategories</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-background">
                {category.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {category.description}
                  </p>
                )}

                {hasSubcategories && showOnlyParents && (
                  <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-500">
                    {category.subcategories!.slice(0, 4).map((subcat) => (
                      <span
                        key={subcat.id}
                        className="px-3 py-1 bg-primary/5 text-primary text-xs rounded-full border border-primary/10"
                      >
                        {subcat.name}
                      </span>
                    ))}
                    {category.subcategories!.length > 4 && (
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{category.subcategories!.length - 4} more
                      </span>
                    )}
                  </div>
                )}
                
                <a 
                  href={`/shop?category=${category.slug}`} 
                  className="absolute inset-0" 
                  aria-label={`Shop ${category.name}`}
                />
                <div className="flex items-center justify-between pt-3 border-t border-border/50 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Shop {category.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-full mb-6 border border-primary/10">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Organized Selection</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Find exactly what you need with our intuitive categories
          </p>
        </div>
        
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/5 rounded-full mb-6 border border-secondary/10">
            <Palette className="w-7 h-7 text-secondary" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Wide Variety</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From skincare to makeup, we have everything you need
          </p>
        </div>
        
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/5 rounded-full mb-6 border border-accent/10">
            <Star className="w-7 h-7 text-accent" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Quality Products</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every category features our carefully curated products
          </p>
        </div>
      </div>
    </div>
  );
}