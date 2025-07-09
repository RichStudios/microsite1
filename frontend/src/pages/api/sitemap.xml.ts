import { NextApiRequest, NextApiResponse } from 'next';

interface SitemapPage {
  url: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
  images?: string[];
}

// Static pages that should be included in sitemap
const staticPages: Omit<SitemapPage, 'lastmod'>[] = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    url: '/compare',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    url: '/reviews',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    url: '/bonuses',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    url: '/blog',
    changefreq: 'daily',
    priority: 0.7,
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    url: '/faq',
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.5,
  },
];

// Mock data for dynamic pages (in production, fetch from API)
const mockBookmakers = [
  { slug: 'betway', updatedAt: '2024-01-15' },
  { slug: 'melbet', updatedAt: '2024-01-14' },
  { slug: '1xbet', updatedAt: '2024-01-13' },
  { slug: 'sportpesa', updatedAt: '2024-01-12' },
  { slug: 'betika', updatedAt: '2024-01-11' },
];

const mockBlogPosts = [
  { slug: 'melbet-vs-betway-comparison', updatedAt: '2024-01-15' },
  { slug: 'mpesa-betting-guide', updatedAt: '2024-01-14' },
  { slug: 'betting-mistakes-to-avoid', updatedAt: '2024-01-13' },
  { slug: 'understanding-betting-odds', updatedAt: '2024-01-12' },
];

const generateSitemapXML = (pages: any[]) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://betcompare.co.ke';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${page.images ? `
    ${page.images.map((img: string) => `<image:image>
      <image:loc>${siteUrl}${img}</image:loc>
    </image:image>`).join('')}` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start with static pages
    const allPages = staticPages.map(page => ({
      ...page,
      lastmod: currentDate,
    }));

    // Add bookmaker review pages
    mockBookmakers.forEach(bookmaker => {
      allPages.push({
        url: `/review/${bookmaker.slug}`,
        lastmod: bookmaker.updatedAt,
        changefreq: 'weekly',
        priority: 0.8,
        images: [`/images/logos/${bookmaker.slug}-logo.png`],
      });
    });

    // Add blog post pages
    mockBlogPosts.forEach(post => {
      allPages.push({
        url: `/blog/${post.slug}`,
        lastmod: post.updatedAt,
        changefreq: 'weekly',
        priority: 0.7,
        images: [`/images/blog/${post.slug}.jpg`],
      });
    });

    // In production, you would fetch dynamic pages from your API:
    // const bookmakers = await fetch(`${process.env.API_URL}/bookmakers`).then(r => r.json());
    // const blogPosts = await fetch(`${process.env.API_URL}/blog`).then(r => r.json());

    const sitemap = generateSitemapXML(allPages);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'Error generating sitemap' });
  }
} 