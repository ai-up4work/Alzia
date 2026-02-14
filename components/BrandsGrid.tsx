"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Award, Star, Shield, TrendingUp, Heart, AlertCircle, RefreshCw } from 'lucide-react';
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
      'x-client-info': 'brands-grid'
    }
  }
});

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  product_count?: number;
}

export default function BrandsGrid() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const fetchAttemptRef = useRef(0);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
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

      // Fetch brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('id, name, slug, logo_url')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (brandsError) {
        throw new Error(`Brands error: ${brandsError.message}`);
      }

      if (!brandsData || brandsData.length === 0) {
        setBrands([]);
        setLoading(false);
        setRetryCount(0);
        return;
      }

      // Get product counts for each brand
      const { data: productCounts } = await supabase
        .from('products')
        .select('brand_id')
        .eq('status', 'published');

      // Count products per brand
      const countMap: Record<string, number> = {};
      if (productCounts) {
        productCounts.forEach((product: any) => {
          if (product.brand_id) {
            countMap[product.brand_id] = (countMap[product.brand_id] || 0) + 1;
          }
        });
      }

      // Add product counts to brands
      const brandsWithCounts = brandsData.map(brand => ({
        ...brand,
        product_count: countMap[brand.id] || 0
      }));

      setBrands(brandsWithCounts);
      setRetryCount(0);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching brands:', err);
      
      // Auto-retry for network errors
      if (retryCount < 3 && !err.message?.includes('Row level security')) {
        console.log(`Retrying... Attempt ${retryCount + 1}/3`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchBrands();
        }, 1000 * (retryCount + 1));
        return;
      }
      
      setError(err.message || 'Failed to load brands');
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-2xl h-48" />
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
            Unable to Load Brands
          </h3>
          <p className="text-muted-foreground mb-2">{error}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {retryCount > 0 && `Attempted ${retryCount} ${retryCount === 1 ? 'retry' : 'retries'}`}
          </p>
          <button 
            onClick={() => {
              setRetryCount(0);
              fetchBrands();
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
  if (brands.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 lg:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl text-foreground font-light mb-3">
            No Brands Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            We're building our brand portfolio. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Brands Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 mb-24">
        {brands.map((brand) => (
          <a
            key={brand.id}
            href={`/shop?brand=${brand.slug}`}
            className="group relative bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl"
          >
            <div className="relative aspect-square overflow-hidden bg-muted/30 p-8 flex items-center justify-center">
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="text-center">
                  <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">{brand.name}</p>
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-4 bg-background border-t border-border/50">
              <h3 className="font-medium text-foreground text-center mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              {brand.product_count > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  {brand.product_count} {brand.product_count === 1 ? 'product' : 'products'}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-full mb-6 border border-primary/10">
            <Award className="w-7 h-7 text-primary" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Trusted Brands</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Featuring the world's most respected beauty brands
          </p>
        </div>
        
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/5 rounded-full mb-6 border border-secondary/10">
            <Shield className="w-7 h-7 text-secondary" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Authentic Products</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            100% genuine products directly from brands
          </p>
        </div>
        
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/5 rounded-full mb-6 border border-accent/10">
            <Star className="w-7 h-7 text-accent" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Premium Quality</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Only the finest brands with proven results
          </p>
        </div>
      </div>
    </div>
  );
}