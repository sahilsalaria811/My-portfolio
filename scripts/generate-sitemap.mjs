import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PLACEHOLDER_BLOGS } from '../src/utils/constants.js';
import { slugify } from '../src/utils/slugify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = (process.env.VITE_SITE_URL || 'https://sahil-portfolio-751a1.web.app').replace(/\/+$/, '');
const DIST_DIR = path.resolve(__dirname, '../dist');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml');
const ROBOTS_PATH = path.join(DIST_DIR, 'robots.txt');

const firestoreBaseUrl = ({ projectId, apiKey }) => {
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
  return apiKey ? `${base}?key=${apiKey}` : base;
};

const parseFirestoreTimestamp = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value.timestampValue) return value.timestampValue;
  if (value.stringValue) return value.stringValue;
  return null;
};

const normalizeBlog = (blog, index = 0) => {
  const fallbackSlug = slugify(blog.title) || `post-${index + 1}`;
  return {
    id: blog.id,
    slug: blog.slug || fallbackSlug,
    updatedAt: blog.lastUpdated || blog.date || new Date().toISOString()
  };
};

async function fetchPublishedBlogsFromFirestore() {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    return [];
  }

  const apiKey = process.env.VITE_FIREBASE_API_KEY;

  try {
    const response = await fetch(firestoreBaseUrl({ projectId, apiKey }), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'blogs' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'published' },
              op: 'EQUAL',
              value: { booleanValue: true }
            }
          },
          orderBy: [
            {
              field: { fieldPath: 'date' },
              direction: 'DESCENDING'
            }
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Firestore query failed (${response.status}): ${response.statusText}`);
    }

    const results = await response.json();
    const blogs = [];

    for (const entry of results) {
      if (!entry.document?.fields) continue;

      const { fields } = entry.document;
      const id = entry.document.name?.split('/').pop();
      const published = fields.published?.booleanValue !== false;

      if (!id || !published) continue;

      blogs.push({
        id,
        slug: fields.slug?.stringValue,
        title: fields.title?.stringValue || id,
        date: parseFirestoreTimestamp(fields.date),
        lastUpdated: parseFirestoreTimestamp(fields.lastUpdated)
      });
    }

    return blogs;
  } catch (error) {
    console.warn('Falling back to placeholder blog data for sitemap generation:', error.message);
    return [];
  }
}

async function ensureDistDir() {
  await fs.mkdir(DIST_DIR, { recursive: true });
}

function buildSitemapXml(urls) {
  const urlEntries = urls
    .map(
      ({ loc, lastmod, priority, changefreq }) => `
  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}${changefreq ? `\n    <changefreq>${changefreq}</changefreq>` : ''}${priority ? `\n    <priority>${priority}</priority>` : ''}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

async function writeSitemap(blogs) {
  const urls = [
    {
      loc: `${SITE_URL}/`,
      priority: '1.0',
      changefreq: 'weekly'
    },
    {
      loc: `${SITE_URL}/blog`,
      priority: '0.8',
      changefreq: 'weekly'
    }
  ];

  blogs.forEach((blog, index) => {
    const normalized = normalizeBlog(blog, index);
    urls.push({
      loc: `${SITE_URL}/blog/${normalized.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: normalized.updatedAt
    });
  });

  const xml = buildSitemapXml(urls);
  await fs.writeFile(SITEMAP_PATH, xml.trim(), 'utf8');
  console.log(`✅ Sitemap generated at ${SITEMAP_PATH}`);
}

async function writeRobots() {
  const content = `User-agent: *
Allow: /

Disallow: /create-blog
Disallow: /login

Sitemap: ${SITE_URL}/sitemap.xml
`;
  await fs.writeFile(ROBOTS_PATH, content, 'utf8');
  console.log(`✅ robots.txt generated at ${ROBOTS_PATH}`);
}

async function run() {
  await ensureDistDir();
  const firestoreBlogs = await fetchPublishedBlogsFromFirestore();

  const blogs =
    firestoreBlogs.length > 0
      ? firestoreBlogs
      : PLACEHOLDER_BLOGS.map((blog, index) => ({
          id: blog.id || String(index + 1),
          slug: blog.slug || slugify(blog.title),
          title: blog.title,
          date: blog.date,
          lastUpdated: blog.date
        }));

  await writeSitemap(blogs);
  await writeRobots();
}

run().catch((error) => {
  console.error('❌ Failed to generate sitemap/robots:', error);
  process.exit(1);
});

