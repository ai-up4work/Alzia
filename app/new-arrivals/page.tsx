"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Heart, Star, ShoppingBag, AlertCircle, RefreshCw, Filter, SlidersHorizontal, Check } from 'lucide-react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { createClient } from '@supabase/supabase-js';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  retail_price: number;
  wholesale_price: number;
  stock_quantity: number;
  rating_avg: number;
  rating_count: number;
  is_featured: boolean;
  created_at: string;
  brand?: Brand;
  category?: Category;
  images?: Array<{ image_url: string }>;
}

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null); // Track which product is being added
  
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    sortProducts();
  }, [sortBy, products]);

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    setAddingToCart(product.id);
    
    // Add to cart
    addItem(product, 1);
    
    // Show success toast
    toast.success('Added to cart!', {
      description: product.name,
      action: {
        label: "View Cart",
        onClick: () => router.push("/account/cart"),
      },
    });
    
    // Reset adding state
    setTimeout(() => {
      setAddingToCart(null);
    }, 1000);
  };

  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date 30 days ago for "new" products
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Fetch products created in the last 30 days
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          id,
          sku,
          name,
          slug,
          description,
          short_description,
          retail_price,
          wholesale_price,
          stock_quantity,
          rating_avg,
          rating_count,
          is_featured,
          created_at,
          brand:brands (
            id,
            name,
            slug
          ),
          category:categories (
            id,
            name,
            slug
          ),
          images:product_images (
            image_url
          )
        `)
        .eq('status', 'published')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProducts(data || []);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching new arrivals:', err);
      setError(err.message || 'Failed to load products');
      setLoading(false);
    }
  };

  const sortProducts = () => {
    let sorted = [...products];

    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        sorted.sort((a, b) => a.retail_price - b.retail_price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.retail_price - a.retail_price);
        break;
      case 'popular':
        sorted.sort((a, b) => {
          const scoreA = (a.rating_avg || 0) * (a.rating_count || 0);
          const scoreB = (b.rating_avg || 0) * (b.rating_count || 0);
          return scoreB - scoreA;
        });
        break;
    }

    setFilteredProducts(sorted);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getProductImage = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0].image_url;
    }
    return 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop';
  };

  const getDaysOld = (createdAt: string): number => {
    const created = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getProductBadge = (product: Product): string => {
    const daysOld = getDaysOld(product.created_at);
    
    if (daysOld <= 7) return 'Just In';
    if (product.is_featured) return 'Featured';
    if (daysOld <= 14) return 'New';
    return 'Fresh';
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Page Header Skeleton */}
            <div className="text-center mb-12">
              <div className="h-12 bg-muted rounded-lg w-64 mx-auto mb-4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
            </div>

            {/* Banner Skeleton */}
            <div className="h-64 bg-muted rounded-3xl mb-12 animate-pulse" />

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8 lg:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="font-serif text-2xl text-foreground font-light mb-3">
                Oops! Something went wrong
              </h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <button 
                onClick={fetchNewArrivals}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 lg:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-2xl text-foreground font-light mb-3">
                No New Arrivals Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                We're working on bringing you the latest products. Check back soon!
              </p>
              <Link href="/shop">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
                  <span>Browse All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light mb-4">
              New Arrivals
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the latest additions to our luxury beauty collection. Fresh launches and exclusive debuts, carefully curated for you.
            </p>
          </div>

          {/* Featured Banner */}
          {products.length > 0 && (
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 rounded-3xl p-8 md:p-12 mb-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full mb-4 border border-primary/20">
                    Just Launched
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">
                    Latest Collection
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Experience our newest formulations featuring breakthrough ingredients and innovative technology for visible results.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    <span className="font-semibold text-foreground">{products.length}</span> new products added in the last 30 days
                  </p>
                </div>
                <div className="hidden md:block">
                  <img
                    src={getProductImage(products[0])}
                    alt="New Collection"
                    className="rounded-2xl shadow-lg object-cover w-full h-64"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sort & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground font-light">
              Latest Products ({filteredProducts.length})
            </h2>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => {
                const daysOld = getDaysOld(product.created_at);
                
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-medium text-white bg-primary px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                          {getProductBadge(product)}
                        </span>
                      </div>

                      {/* Days Old Indicator */}
                      {daysOld <= 7 && (
                        <div className="absolute bottom-3 left-3">
                          <span className="text-xs font-medium text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                            {daysOld} {daysOld === 1 ? 'day' : 'days'} ago
                          </span>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to wishlist logic
                            toast.info('Wishlist feature coming soon!');
                          }}
                          className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors border border-border/30 shadow-lg"
                          aria-label="Add to wishlist"
                        >
                          <Heart className="w-4 h-4 text-foreground" />
                        </button>
                        <button 
                          onClick={(e) => handleQuickAddToCart(e, product)}
                          disabled={product.stock_quantity === 0 || addingToCart === product.id}
                          className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors border border-border/30 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Quick add to cart"
                        >
                          {addingToCart === product.id ? (
                            <Check className="w-4 h-4 text-green-600 animate-in zoom-in" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Stock Indicator */}
                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white font-medium text-sm">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {product.brand && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 line-clamp-1">
                          {product.brand.name}
                        </p>
                      )}
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      {product.rating_count > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating_avg)
                                    ? "fill-accent text-accent"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.rating_count})
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-foreground">
                          {formatPrice(product.retail_price)}
                        </p>
                        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                          <span className="text-xs text-orange-600 font-medium">
                            Only {product.stock_quantity} left
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 border border-primary/20">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">
                Be First to Know
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Subscribe to get notified about new arrivals, exclusive launches, and special offers.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background border border-border rounded-full px-6 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required
                />
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-all flex-shrink-0 hover:shadow-lg"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}