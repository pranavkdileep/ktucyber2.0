'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSubjectDocuments } from '@/actions/public';
import { SubjectPublicDocument } from '@/lib/schemas';
import { Calendar, User } from 'lucide-react';

interface RelatedDocumentsProps {
  subjectSlug: string;
  currentDocumentId: string;
}

export default function RelatedDocuments({ subjectSlug, currentDocumentId }: RelatedDocumentsProps) {
  const [documents, setDocuments] = useState<SubjectPublicDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedDocuments();
  }, [subjectSlug]);

  const loadRelatedDocuments = async () => {
    try {
      setLoading(true);
      const result = await getSubjectDocuments(subjectSlug, null, 1, 6);
      
      // Filter out current document and limit to 5
      const filteredDocs = result.documents
        .filter(doc => doc.id !== currentDocumentId)
        .slice(0, 5);
      
      setDocuments(filteredDocs);
    } catch (error) {
      console.error('Error loading related documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
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

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Related Documents
      </h3>
      
      <div className="space-y-4">
        {documents.map((document) => (
          <Link
            key={document.id}
            href={`/${document.subjectSlug}/${document.slug}`}
            className="block group"
          >
            <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div
                className="w-16 h-16 bg-gray-200 rounded-lg bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: `url("${
                    document.previewImage ||
                    '/placeholder.svg?height=64&width=64'
                  }")`,
                }}
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {document.title}
                </h4>
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {document.description}
                </p>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    @{document.username}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(document.createdAt.toString())}
                  </span>
                </div>
                
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {document.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {document.tags.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{document.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href={`/${subjectSlug}`}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all documents in this subject →
        </Link>
      </div>
    </div>
  );
}