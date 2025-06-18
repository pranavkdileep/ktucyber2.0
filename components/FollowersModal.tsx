'use client';
import React, { useState, useEffect } from 'react';
import { getUserFollowers, getUserFollowing } from '@/actions/profile';
import { X, User } from 'lucide-react';
import Link from 'next/link';

interface FollowUser {
  id: string;
  username: string;
  full_name: string;
  profile_picture: string;
  created_at: string;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialTab: 'followers' | 'following';
  followerCount: number;
  followingCount: number;
}

export default function FollowersModal({ 
  isOpen, 
  onClose, 
  userId, 
  initialTab, 
  followerCount, 
  followingCount 
}: FollowersModalProps) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setCurrentPage(1);
      loadUsers();
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [activeTab, currentPage]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let result;
      if (activeTab === 'followers') {
        result = await getUserFollowers(userId, currentPage, pageSize);
        setUsers(result.followers);
      } else {
        result = await getUserFollowing(userId, currentPage, pageSize);
        setUsers(result.following);
      }
      setTotalPages(Math.ceil(result.totalCount / pageSize));
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'followers' | 'following') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange('followers')}
              className={`text-sm font-medium ${
                activeTab === 'followers'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Followers ({followerCount})
            </button>
            <button
              onClick={() => handleTabChange('following')}
              className={`text-sm font-medium ${
                activeTab === 'following'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Following ({followingCount})
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No {activeTab} found.</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-full bg-center bg-cover bg-no-repeat flex-shrink-0"
                    style={{
                      backgroundImage: `url("${user.profile_picture || '/placeholder.svg?height=48&width=48'}")`
                    }}
                  >
                    {!user.profile_picture && (
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={20} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{user.username}
                    </p>
                    <p className="text-xs text-gray-400">
                      {activeTab === 'followers' ? 'Followed' : 'Following'} {formatDate(user.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}