"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Heart, Leaf, Droplets, Palette, Wind, Star, Zap, Gift, TrendingUp, Award, Shield, Clock, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with better error handling
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
      'x-client-info': 'collections-grid'
    }
  }
});

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  'Sparkles': Sparkles,
  'Heart': Heart,
  'Leaf': Leaf,
  'Droplets': Droplets,
  'Palette': Palette,
  'Wind': Wind,
  'Star': Star,
  'Zap': Zap,
  'Gift': Gift,
  'TrendingUp': TrendingUp,
  'Award': Award,
  'Shield': Shield,
  'Clock': Clock,
  'Users': Users,
};

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  displayOrder?: number;
}

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: React.ElementType;
  iconName: string;
  isFeatured: boolean;
  categories: Category[];
  categoryCount: number;
  categoryIds: number[];
}

export default function SupabaseCollectionsGrid() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredCollection, setFeaturedCollection] = useState<Collection | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const fetchAttemptRef = useRef(0);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const currentAttempt = ++fetchAttemptRef.current;
    
    try {
      setLoading(true);
      setError(null);

      // Add a small delay to prevent rapid requests
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if this is still the latest fetch attempt
      if (currentAttempt !== fetchAttemptRef.current) {
        // console.log('Fetch cancelled - newer request in progress');
        return;
      }

      // Step 1: Fetch collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('id, name, slug, description, image_url, icon_name, display_order, is_featured')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (collectionsError) {
        throw new Error(`Collections error: ${collectionsError.message}`);
      }

      if (!collectionsData || collectionsData.length === 0) {
        setCollections([]);
        setFeaturedCollection(null);
        setLoading(false);
        setRetryCount(0);
        return;
      }

      // Step 2: Fetch collection_categories
      const { data: ccData, error: ccError } = await supabase
        .from('collection_categories')
        .select('collection_id, category_id, display_order');

      if (ccError) {
        console.warn('Collection categories error:', ccError);
        // Continue without categories
      }

      // Step 3: Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug, image_url');

      if (categoriesError) {
        console.warn('Categories error:', categoriesError);
        // Continue without category details
      }

      // Build category lookup
      const categoryLookup: Record<number, Category> = {};
      if (categoriesData) {
        categoriesData.forEach((cat: any) => {
          categoryLookup[cat.id] = cat;
        });
      }

      // Build collection categories lookup
      const collectionCategoriesLookup: Record<number, Array<{categoryId: number, displayOrder: number}>> = {};
      if (ccData) {
        ccData.forEach((cc: any) => {
          if (!collectionCategoriesLookup[cc.collection_id]) {
            collectionCategoriesLookup[cc.collection_id] = [];
          }
          collectionCategoriesLookup[cc.collection_id].push({
            categoryId: cc.category_id,
            displayOrder: cc.display_order || 0
          });
        });
      }

      // Transform collections
      const transformedCollections: Collection[] = collectionsData.map(collection => {
        const collectionCats = collectionCategoriesLookup[collection.id] || [];
        
        const categories: Category[] = collectionCats
          .map(cc => {
            const cat = categoryLookup[cc.categoryId];
            if (!cat) return null;
            return {
              ...cat,
              displayOrder: cc.displayOrder
            };
          })
          .filter((cat): cat is Category => cat !== null)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

        const categoryIds = categories.map(cat => cat.id);

        return {
          id: collection.id,
          name: collection.name,
          slug: collection.slug,
          description: collection.description || 'Discover our curated selection of beauty products.',
          image: collection.image_url || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop',
          icon: iconMap[collection.icon_name] || Sparkles,
          iconName: collection.icon_name || 'Sparkles',
          isFeatured: collection.is_featured || false,
          categories: categories,
          categoryCount: categories.length,
          categoryIds: categoryIds,
        };
      });

      const featured = transformedCollections.find(c => c.isFeatured);
      
      setCollections(transformedCollections);
      setFeaturedCollection(featured || transformedCollections[0] || null);
      setRetryCount(0);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching collections:', err);
      
      // Auto-retry for network errors
      if (retryCount < 3 && !err.message?.includes('Row level security')) {
        // console.log(`Retrying... Attempt ${retryCount + 1}/3`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchCollections();
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      setError(err.message || 'Failed to load collections');
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-2xl h-96" />
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
            Unable to Load Collections
          </h3>
          <p className="text-muted-foreground mb-2">{error}</p>
          <p className="text-sm text-muted-foreground mb-6">
            {retryCount > 0 && `Attempted ${retryCount} ${retryCount === 1 ? 'retry' : 'retries'}`}
          </p>
          <button 
            onClick={() => {
              setRetryCount(0);
              fetchCollections();
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
  if (collections.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 lg:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-serif text-2xl text-foreground font-light mb-3">
            No Collections Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            We're currently curating our collections. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Collections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
        {collections.map((collection) => {
          const IconComponent = collection.icon;
          
          return (
            <div
              key={collection.id}
              className="group relative bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl"
            >
              <div className="relative h-72 overflow-hidden bg-muted">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/30 shadow-lg">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>

                {collection.isFeatured && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-lg">
                    Featured
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-light text-white mb-1">
                    {collection.name}
                  </h3>
                  <span className="text-xs text-white/90 font-medium uppercase tracking-wider">
                    {collection.categoryCount} {collection.categoryCount === 1 ? 'Category' : 'Categories'}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-background">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {collection.description}
                </p>

                {collection.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-500">
                    {collection.categories.slice(0, 6).map((category) => (
                      <span
                        key={category.id}
                        className="px-3 py-1 bg-primary/5 text-primary text-xs rounded-full border border-primary/10"
                      >
                        {category.name}
                      </span>
                    ))}
                    {collection.categories.length > 6 && (
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{collection.categories.length - 6} more
                      </span>
                    )}
                  </div>
                )}
                
                <a 
                  href={collection.categoryIds.length > 0 ? `/shop?categories=${collection.categoryIds.join(',')}` : `/shop?collection=${collection.slug}`} 
                  className="absolute inset-0" 
                  aria-label={`Explore ${collection.name} Collection`}
                />
                <div className="flex items-center justify-between pt-3 border-t border-border/50 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Explore Collection
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured CTA */}
      {featuredCollection && (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 rounded-3xl p-12 md:p-16 lg:p-20 mb-24">
          <div className="relative text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8 border border-primary/20">
              {React.createElement(featuredCollection.icon, { className: "w-10 h-10 text-primary" })}
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-light mb-6">
              Not Sure Where to Start?
            </h2>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10">
              {featuredCollection.description}
            </p>
            
            <a 
              href={featuredCollection.categoryIds.length > 0 
                ? `/shop?categories=${featuredCollection.categoryIds.join(',')}` 
                : `/shop?collection=${featuredCollection.slug}`
              }
            >
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
                <span>Explore {featuredCollection.name}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </a>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-full mb-6 border border-primary/10">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Curated Selection</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each collection is thoughtfully curated by our beauty experts
          </p>
        </div>
        
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/5 rounded-full mb-6 border border-secondary/10">
            <Palette className="w-7 h-7 text-secondary" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Premium Quality</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Only the finest ingredients and formulations
          </p>
        </div>
        
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/5 rounded-full mb-6 border border-accent/10">
            <Heart className="w-7 h-7 text-accent" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Proven Results</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Customer-tested and loved worldwide
          </p>
        </div>
      </div>
    </div>
  );
}