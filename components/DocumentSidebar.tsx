'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DocumentViewPage } from '@/lib/schemas';
import { Bookmark, BookmarkCheck, Share2, User, Calendar, Eye } from 'lucide-react';
import { setDocumentBookmark, removeDocumentBookmark } from '@/actions/documents';

interface DocumentSidebarProps {
  document: DocumentViewPage;
  currentUserId?: string;
}

export default function DocumentSidebar({ document, currentUserId }: DocumentSidebarProps) {
  const [isBookmarked, setIsBookmarked] = useState(document.isBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const handleBookmark = async () => {
    if (!currentUserId) {
      window.location.href = '/login';
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeDocumentBookmark(document.id);
        setIsBookmarked(false);
      } else {
        await setDocumentBookmark(document.id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        
        <div className="space-y-3">
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50`}
          >
            {bookmarkLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 mr-2" />
            ) : (
              <Bookmark className="w-4 h-4 mr-2" />
            )}
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Author Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
        
        <Link href={`/profile/${document.username}`}>
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div
              className="w-12 h-12 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url("${
                  document.userProfile.profilePicture ||
                  '/placeholder.svg?height=48&width=48'
                }")`,
              }}
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">
                {document.userProfile.fullName || document.username}
              </h4>
              <p className="text-sm text-gray-500">@{document.username}</p>
            </div>
          </div>
        </Link>

        {document.userProfile.bio && (
          <p className="text-sm text-gray-600 mt-3">
            {document.userProfile.bio}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {document.userProfile.totalUploadedDocuments}
            </div>
            <div className="text-xs text-gray-500">Documents</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {document.userProfile.totalFollowers}
            </div>
            <div className="text-xs text-gray-500">Followers</div>
          </div>
        </div>
      </div>

      {/* Document Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm text-gray-600">
              <Eye className="w-4 h-4 mr-2" />
              Views
            </span>
            <span className="font-medium text-gray-900">{document.views}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              Uploaded
            </span>
            <span className="font-medium text-gray-900">
              {document.createdAt.toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              Type
            </span>
            <span className="font-medium text-gray-900">
              {document.documentType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Subject & University Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Info</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">{document.subject.name}</h4>
            <p className="text-sm text-gray-500">Code: {document.subject.code}</p>
            {document.subject.description && (
              <p className="text-sm text-gray-600 mt-1">
                {document.subject.description}
              </p>
            )}
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900">{document.university.name}</h4>
            {document.university.description && (
              <p className="text-sm text-gray-600 mt-1">
                {document.university.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}