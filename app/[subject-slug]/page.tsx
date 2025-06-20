"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  getSubjectBySlug, 
  getSubjectDocuments 
} from "@/actions/public";
import { Subject, SubjectPublicDocument } from "@/lib/schemas";
import Link from "next/link";
import { Search, FileText, Calendar, User, Eye, Download, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubjectPageProps {
  params: Promise<{
    "subject-slug": string;
  }>;
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [documents, setDocuments] = useState<SubjectPublicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectSlug, setSubjectSlug] = useState<string>("");

  const pageSize = 12;

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    if (subject) {
      loadDocuments();
    }
  }, [currentPage, searchQuery, subject]);

  const initializePage = async () => {
    try {
      setLoading(true);
      const { "subject-slug": slug } = await params;
      
      if (!slug) {
        router.push("/404");
        return;
      }
      
      setSubjectSlug(slug);
      
      // Get search query from URL params
      const urlSearchQuery = searchParams.get("search") || "";
      setSearchQuery(urlSearchQuery);
      
      // Get page from URL params
      const urlPage = parseInt(searchParams.get("page") || "1", 10);
      setCurrentPage(urlPage);

      // Fetch subject data
      const subjectData = await getSubjectBySlug(slug);
      setSubject(subjectData);
      
    } catch (error) {
      console.error("Error initializing subject page:", error);
      router.push("/404");
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    if (!subject) return;

    try {
      setSearchLoading(true);
      const result = await getSubjectDocuments(
        subject.slug,
        searchQuery || null,
        currentPage,
        pageSize
      );
      
      setDocuments(result.documents);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
    } catch (error) {
      console.error("Error loading documents:", error);
      setDocuments([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    
    // Update URL with search params
    const newSearchParams = new URLSearchParams();
    if (searchQuery.trim()) {
      newSearchParams.set("search", searchQuery.trim());
    }
    newSearchParams.set("page", "1");
    
    const newUrl = `/${subjectSlug}?${newSearchParams.toString()}`;
    router.push(newUrl);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL with new page
    const newSearchParams = new URLSearchParams();
    if (searchQuery.trim()) {
      newSearchParams.set("search", searchQuery.trim());
    }
    newSearchParams.set("page", page.toString());
    
    const newUrl = `/${subjectSlug}?${newSearchParams.toString()}`;
    router.push(newUrl);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "docx":
        return "📝";
      case "pptx":
        return "📊";
      case "xlsx":
        return "📈";
      default:
        return "📄";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading subject...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Subject Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The subject you're looking for doesn't exist.
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta tags would go in head, but since this is client component, you'd need to use next/head or move to server component */}
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Subject Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 md:p-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {subject.name}
            </h1>
            <p className="text-lg opacity-90 mb-2">
              Course Code: {subject.code}
            </p>
            {subject.description && (
              <p className="text-base opacity-80 max-w-3xl">
                {subject.description}
              </p>
            )}
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search documents in this subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {searchLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Search"
              )}
            </button>
          </form>
          
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600">
              Showing results for: <span className="font-medium">"{searchQuery}"</span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                  router.push(`/${subjectSlug}`);
                }}
                className="ml-2 text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Documents Grid */}
        {searchLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No documents found" : "No documents available"}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No documents match your search for "${searchQuery}"`
                : "There are no documents uploaded for this subject yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Document Preview */}
                  <div
                    className="w-full h-48 bg-center bg-cover bg-gray-100 relative"
                    style={{
                      backgroundImage: `url("${
                        document.previewImage ||
                        "/placeholder.svg?height=200&width=300"
                      }")`,
                    }}
                  >
                    
                  </div>

                  {/* Document Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {document.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {document.description}
                    </p>

                    {/* Meta Info */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        <span>by @{document.username}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Uploaded {formatDate(document.createdAt?.toString() || '')}</span>
                      </div>
                      {document.universityName && (
                        <div className="text-xs text-gray-500">
                          📍 {document.universityName}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {document.tags && document.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {document.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {document.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{document.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Link href={`/${subject.slug}/${document.slug}`}>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        View Document
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex size-8 sm:size-10 items-center justify-center disabled:opacity-50 hover:bg-gray-100 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="sm:w-[18px] sm:h-[18px]"
                  >
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`text-xs sm:text-sm font-medium leading-normal flex size-8 sm:size-10 items-center justify-center rounded-full ${
                        currentPage === pageNum
                          ? "text-white bg-blue-600 font-bold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex size-8 sm:size-10 items-center justify-center disabled:opacity-50 hover:bg-gray-100 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="sm:w-[18px] sm:h-[18px]"
                  >
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}