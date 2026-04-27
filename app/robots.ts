import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/cart', '/vendor', '/login', '/register'],
    },
    sitemap: 'https://paksolartech.com/sitemap.xml',
  };
}
