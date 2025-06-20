'use client';
import React, { useState, useEffect } from 'react';
import { DocumentViewPage } from '@/lib/schemas';
import { Download, ExternalLink, Eye, AlertCircle } from 'lucide-react';
import { setDocumentDownload } from '@/actions/documents';

interface DocumentViewerProps {
  document: DocumentViewPage;
  currentUserId?: string;
}

export default function DocumentViewer({ document, currentUserId }: DocumentViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!currentUserId) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      await setDocumentDownload(document.id);
      
      // Open document in new tab for download
      window.open(document.fileKey, '_blank');
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Failed to download document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = () => {
    window.open(document.fileKey, '_blank');
  };

  const getDocumentViewer = () => {
    const fileUrl = document.fileKey;
    
    switch (document.documentType) {
      case 'pdf':
        return (
          <div className="w-full h-[600px] border rounded-lg overflow-hidden">
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              title={document.title}
              loading="lazy"
            />
          </div>
        );
      
      case 'docx':
      case 'pptx':
      case 'xlsx':
        return (
          <div className="w-full h-[600px] border rounded-lg overflow-hidden">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
              className="w-full h-full"
              title={document.title}
              loading="lazy"
            />
          </div>
        );
      
      default:
        return (
          <div className="w-full h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Preview not available
              </h3>
              <p className="text-gray-500 mb-4">
                This document type cannot be previewed in the browser.
              </p>
              <button
                onClick={handleViewDocument}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Document
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Viewer Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Document Preview
          </span>
          {document.previewImage && (
            <img
              src={document.previewImage}
              alt="Document preview"
              className="w-8 h-8 rounded object-cover"
            />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleViewDocument}
            className="inline-flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
          
          <button
            onClick={handleDownload}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
            ) : (
              <Download className="w-4 h-4 mr-1" />
            )}
            Download
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer */}
      <div className="p-4">
        {getDocumentViewer()}
      </div>

      {/* Document Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            File size: Loading... | Type: {document.documentType.toUpperCase()}
          </span>
          <span>
            Uploaded: {document.createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}