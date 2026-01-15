import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Home & Core Pages
    {
      url: 'https://alzia.vercel.app',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    
    // Shop Pages (HIGH PRIORITY)
    {
      url: 'https://alzia.vercel.app/shop',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: 'https://alzia.vercel.app/collections',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://alzia.vercel.app/new-arrivals',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'daily',
      priority: 0.9,
    },

    // Static Pages
    {
      url: 'https://alzia.vercel.app/about',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://alzia.vercel.app/shipping',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://alzia.vercel.app/refund',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://alzia.vercel.app/privacy',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://alzia.vercel.app/faq',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://alzia.vercel.app/wholesale',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://alzia.vercel.app/terms',
      lastModified: new Date('2026-01-15'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}
