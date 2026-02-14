"use client";

import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ExternalLink } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { toast } from 'sonner';

export function WishlistDrawer() {
  const { items, isOpen, closeWishlist, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getProductImage = (product: any): string => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img: any) => img.is_primary);
      return primaryImage?.image_url || product.images[0].image_url;
    }
    return 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop';
  };

  const handleMoveToCart = (item: any) => {
    if (item.product.stock_quantity === 0) {
      toast.error('Out of stock', {
        description: 'This product is currently unavailable'
      });
      return;
    }

    addToCart(item.product, 1);
    removeItem(item.product.id);
    
    toast.success('Moved to cart!', {
      description: item.product.name
    });
  };

  const handleRemove = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success('Removed from wishlist', {
      description: productName
    });
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    
    clearWishlist();
    toast.success('Wishlist cleared', {
      description: `Removed ${items.length} ${items.length === 1 ? 'item' : 'items'}`
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeWishlist}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-foreground font-light">
                Wishlist
              </h2>
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            onClick={closeWishlist}
            className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl text-foreground font-light mb-2">
                Your Wishlist is Empty
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Start adding products you love to your wishlist!
              </p>
              <button
                onClick={closeWishlist}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Wishlist Items
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all group"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={closeWishlist}
                      className="relative flex-shrink-0 w-20 h-20 bg-muted rounded-lg overflow-hidden"
                    >
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeWishlist}
                        className="block"
                      >
                        <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      {item.product.brand && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {typeof item.product.brand === 'object' 
                            ? item.product.brand.name 
                            : item.product.brand}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">
                          {formatPrice(item.product.retail_price)}
                        </p>
                        
                        {item.product.stock_quantity === 0 && (
                          <span className="text-xs text-destructive font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={item.product.stock_quantity === 0}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => handleRemove(item.product.id, item.product.name)}
                      className="w-10 h-10 flex items-center justify-center border border-border hover:border-destructive hover:bg-destructive/5 rounded-lg transition-all"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-3">
            <button
              onClick={handleClearAll}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Wishlist</span>
            </button>
            
            <Link href="/wishlist" onClick={closeWishlist}>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-all">
                <ExternalLink className="w-4 h-4" />
                <span>View Full Wishlist</span>
              </button>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}