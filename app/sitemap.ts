import { MetadataRoute } from 'next';
import { getAllServices } from '@/app/models/service.model';
import { getAllBlogs } from '@/app/models/blog.model';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paksolartech.com';

  // Static routes
  const staticRoutes = [
    '',
    '/services',
    '/about',
    '/contact',
    '/calculator',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : (route === '/calculator' ? 0.9 : 0.8),
  }));


  // Dynamic service routes
  const services = await getAllServices();
  const serviceRoutes = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(s.updated_at || s.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic blog routes
  let blogRoutes: any[] = [];
  try {
    const blogs = await getAllBlogs({ publishedOnly: true });
    blogRoutes = (blogs as any[]).map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch blogs', error);
  }

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
