import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://www.akamevilla.com.cy/', changeFrequency: 'monthly', priority: 1 }];
}
