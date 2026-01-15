import React from 'react';
import { ChevronRight, ArrowRight, Sparkles, Heart, Star, ShoppingBag } from 'lucide-react';
import { Footer } from 'react-day-picker';
import { Header } from '@/components/header';

export default function NewArrivalsPage() {
  const newProducts = [
    {
      id: 1,
      name: "Radiance Renewal Serum",
      brand: "Partner with Alzìa for wholesale cosmetics in Sri Lanka. Bulk makeup, skincare & beauty products at competitive rates. Fast delivery for retailers in Sri Lanka",
      price: 8999,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Velvet Matte Lipstick",
      brand: "Alzìa Makeup & Cosmetics",
      price: 2499,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: "Luminous Silk Foundation",
      brand: "Alzìa Makeup & Cosmetics",
      price: 4999,
      image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: "Rose Gold Highlighter",
      brand: "Alzìa Makeup & Cosmetics",
      price: 3499,
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.6,
      reviews: 78
    },
    {
      id: 5,
      name: "Hydrating Face Mist",
      brand: "Alzìa Makeup & Cosmetics",
      price: 2999,
      image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.8,
      reviews: 92
    },
    {
      id: 6,
      name: "Midnight Rose Parfum",
      brand: "Alzìa Makeup & Cosmetics",
      price: 12999,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=600&fit=crop",
      badge: "Limited",
      rating: 4.9,
      reviews: 203
    },
    {
      id: 7,
      name: "Nourishing Night Cream",
      brand: "Alzìa Makeup & Cosmetics",
      price: 6999,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.7,
      reviews: 145
    },
    {
      id: 8,
      name: "Precision Eyeliner Pen",
      brand: "Alzìa Makeup & Cosmetics",
      price: 1999,
      image: "https://images.unsplash.com/photo-1583241800698-c93b43cf3c02?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.8,
      reviews: 67
    },
    {
      id: 9,
      name: "Vitamin C Brightening Mask",
      brand: "Alzìa Makeup & Cosmetics",
      price: 4499,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
      badge: "New",
      rating: 4.9,
      reviews: 188
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
       <Header />
        <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4">New Arrivals</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the latest additions to our luxury beauty collection. Fresh launches and exclusive debuts, carefully curated for you.
          </p>
        </div>

        {/* Featured Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 rounded-3xl p-8 md:p-12 mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full mb-4 border border-primary/20">
                Just Launched
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">
                Spring 2026 Collection
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Experience our newest formulations featuring breakthrough ingredients and innovative technology for visible results.
              </p>
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop"
                alt="New Collection"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground font-light">
              Latest Products ({newProducts.length})
            </h2>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {newProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-500"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-medium text-white bg-primary px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors border border-border/30">
                      <Heart className="w-4 h-4 text-foreground" />
                    </button>
                    <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors border border-border/30">
                      <ShoppingBag className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                  <h3 className="font-medium text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "fill-accent text-accent"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <p className="text-lg font-medium text-foreground">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
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
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border rounded-full px-6 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-all flex-shrink-0 hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </div>  
      </div>
  );
}