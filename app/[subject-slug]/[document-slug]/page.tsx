import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDocumentViewPage } from '@/actions/public';
import { verifyToken } from '@/actions/auth';
import DocumentViewer from '@/components/DocumentViewer';
import DocumentSidebar from '@/components/DocumentSidebar';
import RelatedDocuments from '@/components/RelatedDocuments';
import { updateViewCount } from '@/actions/documents';

interface DocumentPageProps {
  params: Promise<{
    'subject-slug': string;
    'document-slug': string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  try {
    const { 'document-slug': documentSlug } = await params;
    const document = await getDocumentViewPage(documentSlug);

    if (!document) {
      return {
        title: 'Document Not Found',
        description: 'The requested document could not be found.',
      };
    }

    const title = `${document.title} | ${document.subject.name} - ${document.university.name}`;
    const description = document.description.length > 160 
      ? document.description.substring(0, 157) + '...'
      : document.description;

    return {
      title,
      description,
      keywords: [
        document.subject.name,
        document.subject.code,
        document.university.name,
        document.documentType,
        ...(document.tags || [])
      ].join(', '),
      authors: [{ name: document.userProfile.fullName || document.username }],
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: document.createdAt.toISOString(),
        modifiedTime: document.updatedAt.toISOString(),
        authors: [document.userProfile.fullName || document.username],
        images: document.previewImage ? [
          {
            url: document.previewImage,
            width: 1200,
            height: 630,
            alt: document.title,
          }
        ] : [],
        siteName: 'KTU Cyber',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: document.previewImage ? [document.previewImage] : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Document Not Found',
      description: 'The requested document could not be found.',
    };
  }
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  try {
    const { 'document-slug': documentSlug } = await params;
    
    // Get current user if authenticated
    let currentUserId: string | undefined;
    try {
      const tokenResult = await verifyToken();
      if (tokenResult.success && tokenResult.payload?.id) {
        currentUserId = tokenResult.payload.id as string;
      }
    } catch (error) {
      // User not authenticated, continue as guest
      console.log('User not authenticated, proceeding as guest:');
      currentUserId = undefined;
    }

    const document = await getDocumentViewPage(documentSlug, currentUserId);

    if (!document) {
      notFound();
    }
    await updateViewCount(document.id);

    // Generate JSON-LD structured data for SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: document.title,
      description: document.description,
      author: {
        '@type': 'Person',
        name: document.userProfile.fullName || document.username,
        url: `/profile/${document.username}`,
      },
      datePublished: document.createdAt.toISOString(),
      dateModified: document.updatedAt.toISOString(),
      publisher: {
        '@type': 'Organization',
        name: 'KTU Cyber',
      },
      about: {
        '@type': 'Course',
        name: document.subject.name,
        courseCode: document.subject.code,
        provider: {
          '@type': 'Organization',
          name: document.university.name,
        },
      },
      keywords: document.tags?.join(', '),
      url: `/${document.subjectSlug}/${document.slug}`,
      image: document.previewImage,
      fileFormat: document.documentType.toUpperCase(),
    };

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Document Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {document.title}
                      </h1>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                        {document.description}
                      </p>
                    </div>
                  </div>

                  {/* Document Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      📚 {document.subject.name} ({document.subject.code})
                    </span>
                    <span className="flex items-center gap-1">
                      🏫 {document.university.name}
                    </span>
                    <span className="flex items-center gap-1">
                      📄 {document.documentType.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      👀 {document.views} views
                    </span>
                  </div>

                  {/* Tags */}
                  {document.tags && document.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {document.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Document Viewer */}
                <Suspense fallback={<DocumentViewerSkeleton />}>
                  <DocumentViewer 
                    document={document}
                    currentUserId={currentUserId}
                  />
                </Suspense>

                {/* Related Documents */}
                <Suspense fallback={<RelatedDocumentsSkeleton />}>
                  <RelatedDocuments 
                    subjectSlug={document.subjectSlug!}
                    currentDocumentId={document.id}
                  />
                </Suspense>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Suspense fallback={<DocumentSidebarSkeleton />}>
                  <DocumentSidebar 
                    document={document}
                    currentUserId={currentUserId}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading document page:', error);
    notFound();
  }
}

// Loading skeletons
function DocumentViewerSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

function DocumentSidebarSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function RelatedDocumentsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="h-16 w-16 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}