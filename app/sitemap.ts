import { MetadataRoute } from 'next'
import { sql } from '@/lib/db';

const URL = 'https://www.ktucyber.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const subjects = await sql`SELECT slug, updated_at FROM subjects`;
  const subjectUrls = subjects.map((sub) => ({
    url: `${URL}/${sub.slug}`,
    lastModified: new Date(sub.updated_at),
  }));

  const documents = await sql`
    SELECT
        d.slug,
        d.updated_at,
        s.slug AS subject_slug
    FROM documents d
    JOIN subjects s ON d.subject_id = s.id
    WHERE d.is_public = true
  `;
  const documentUrls = documents.map((doc) => ({
    url: `${URL}/${doc.subject_slug}/${doc.slug}`,
    lastModified: new Date(doc.updated_at),
  }));

  const staticUrls = [
    { url: URL, lastModified: new Date() },
  ];

  return [
    ...staticUrls,
    ...subjectUrls,
    ...documentUrls,
  ];
}