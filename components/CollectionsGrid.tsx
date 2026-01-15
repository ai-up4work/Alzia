import React from 'react';
import { ArrowRight, Sparkles, Heart, Leaf, Gift, TrendingUp, Stars } from 'lucide-react';

const collections = [
  {
    id: "skincare-essentials",
    name: "Skincare Essentials",
    description: "The foundation of radiant skin. Our bestselling skincare collection featuring cleansers, serums, and moisturizers.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop",
    products: 12,
    icon: Sparkles,
    productImages: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400&h=400&fit=crop"
    ]
  },
  {
    id: "makeup-artistry",
    name: "Makeup Artistry",
    description: "Express yourself with our color and beauty collection. From everyday to evening, find your perfect shades.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
    products: 18,
    icon: Heart,
    productImages: [
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583241800698-c93b43cf3c02?w=400&h=400&fit=crop"
    ]
  },
  {
    id: "fragrance-journey",
    name: "Fragrance Journey",
    description: "Discover scents that tell your story. Our exclusive fragrance collection for every mood and moment.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop",
    products: 8,
    icon: Stars,
    productImages: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59bd9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&h=400&fit=crop"
    ]
  },
  {
    id: "gift-sets",
    name: "Gift Sets",
    description: "Perfect gifts for the beauty lover. Thoughtfully curated sets with elegant packaging.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=800&fit=crop",
    products: 6,
    icon: Gift,
    productImages: [
      "https://images.unsplash.com/photo-1608181922522-d8f2d7e0ad1d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512637480062-ac8cdc18ff47?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop"
    ]
  },
  {
    id: "natural-beauty",
    name: "Natural Beauty",
    description: "Pure, natural ingredients. Our collection of botanical and clean beauty products.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop",
    products: 15,
    icon: Leaf,
    productImages: [
      "https://images.unsplash.com/photo-1564442038901-4f9a19d3d456?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1620756726574-8e7ae6d3c0b4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop"
    ]
  },
  {
    id: "bestsellers",
    name: "Bestsellers",
    description: "Customer favorites that deliver results. Discover why these products are loved worldwide.",
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=800&fit=crop",
    products: 20,
    icon: TrendingUp,
    productImages: [
      "https://images.unsplash.com/photo-1505944357793-35a0e67cc990?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1491498933979-9b9714f108bc?w=400&h=400&fit=crop"
    ]
  },
];

export default function CollectionsGrid() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Collections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
        {collections.map((collection) => {
          const IconComponent = collection.icon;
          return (
            <button
              key={collection.id}
              className="group relative bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl text-left"
            >
              {/* Main Image Section */}
              <div className="relative h-72 overflow-hidden bg-muted">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/30">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>

                {/* Collection Title & Product Count */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-light text-white mb-1">
                    {collection.name}
                  </h3>
                  <span className="text-xs text-white/80 font-medium uppercase tracking-wider">
                    {collection.products} Products
                  </span>
                </div>
              </div>

              {/* Expandable Content on Hover */}
              <div className="p-6 bg-background">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {collection.description}
                </p>

                {/* Product Image Grid - Shows on Hover */}
                <div className="grid grid-cols-3 gap-2 mb-4 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-500">
                  {collection.productImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted border border-border/30">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
                
                {/* CTA */}
                <a href={`/shop?collections=${collection.id}`} className="absolute inset-0" aria-label={`Explore ${collection.name} Collection`} />
                <div className="flex items-center justify-between pt-3 border-t border-border/50 opacity-60 group-hover:opacity-100 transition-opacity duration-300" >
                  <span className="text-sm text-muted-foreground">Explore Collection</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Featured CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 rounded-3xl p-12 md:p-16 lg:p-20 mb-24">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8 border border-primary/20">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-light mb-6">
            Not Sure Where to Start?
          </h2>
          
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10">
            Our skincare essentials collection is perfect for anyone looking to build a solid beauty foundation with timeless, effective products.
          </p>
          
          <a href="/shop?collections=skincare-essentials" aria-label="Explore Skincare Essentials">
            <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
              <span>Explore Skincare Essentials</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </a>
        </div>
      </div>

      {/* Additional Info Section */}
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
            <Stars className="w-7 h-7 text-secondary" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Premium Quality</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Only the finest ingredients and formulations make it to our collections
          </p>
        </div>
        
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/5 rounded-full mb-6 border border-accent/10">
            <Heart className="w-7 h-7 text-accent" />
          </div>
          <h4 className="font-serif text-xl font-light text-foreground mb-3">Proven Results</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Customer-tested and loved by thousands worldwide
          </p>
        </div>
      </div>
    </div>
  );
}