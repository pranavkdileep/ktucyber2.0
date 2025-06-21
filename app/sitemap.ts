import { MetadataRoute } from 'next'
import { sql } from '@/lib/db';

const URL = 'https://www.ktucyber.com'; // Replace with your actual domain if different

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all subjects
  const subjects = await sql`SELECT slug, updated_at FROM subjects`;
  const subjectUrls = subjects.map((sub) => ({
    url: `${URL}/${sub.slug}`,
    lastModified: new Date(sub.updated_at),
  }));

  // Fetch all documents with their corresponding subject slugs
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