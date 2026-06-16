import { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pages = ['', '/about', '/agenda', '/speakers', '/contact', '/register', '/privacy', '/terms', '/refund'];
  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));
}
