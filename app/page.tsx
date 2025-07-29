"use client";
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { getRecentDocuments, getTrendingSubjects } from "@/actions/public"
import { searchSubjects } from "@/actions/documents"
import { useRouter } from "next/navigation"
import { dbInit } from "@/actions/db_init";

export default function Home() {
  const [trending_subjects, setTrendingSubjects] = useState<{name: string, slug: string, imageUrl: string}[] | null>(null)
  const [recent_documents, setRecentDocuments] = useState<{previewImage: string, name: string, slug: string}[] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      ///await dbInit();
      const subs = await getTrendingSubjects()
      if (subs) {
        setTrendingSubjects(subs.map((sub) => ({
          name: sub.name,
          slug: sub.slug,
          imageUrl:"/placeholder.svg?height=150&width=150&query=" + encodeURIComponent(sub.name)
        })))
      }
      const recentDoc = await getRecentDocuments()
      if (recentDoc) {
        setRecentDocuments(recentDoc.map((doc) => ({
          previewImage: doc.previewImage || "/placeholder.svg?height=150&width=150&query=document",
          name: doc.name,
          slug: doc.slug
        })))
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSearchResults]);

  const handleSearch = async (query: string) => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const results = await searchSubjects(query, 8);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSubjectSelect = (slug: string) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(`/${slug}`);
  };

  return (
    <div className="min-h-screen bg-white">
      
      <main className="container mx-auto px-4 py-6">
        {/* Main Search */}
        <div className="relative max-w-3xl mx-auto mb-8" ref={searchRef}>
          <div className="flex items-center relative rounded-full bg-[#f0f2f5] px-4 py-3">
            <Search className="h-5 w-5 text-[#61758a]" />
            <input
              type="text"
              placeholder="Search for subjects..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="bg-transparent border-none outline-none pl-2 text-[#121417] placeholder-[#61758a] w-full"
            />
          </div>
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
              <div className="p-2">
                <h3 className="text-sm font-medium text-[#121417] mb-2 px-2">Subjects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchResults.map((subject) => (
                    <div
                      key={subject.id}
                      onClick={() => handleSubjectSelect(subject.slug)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md border border-gray-100"
                    >
                      <div className="text-sm font-medium text-[#121417]">{subject.name}</div>
                      <div className="text-xs text-[#61758a]">{subject.code}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent documents - Highlighted on mobile */}
        <section className="mb-10 bg-[#f8f9fa] p-4 rounded-lg">
          <h2 className="text-xl font-bold text-[#121417] mb-4">Recent documents</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {recent_documents ? recent_documents.map((doc) => (
              <DocumentCard
                key={doc.slug}
                slug={doc.slug}
                name={doc.name}
                imageUrl={doc.previewImage}
                featured={false}
              />
            )) : (
              <p className="col-span-5 text-center text-gray-500">Loading recent documents...</p>
            )}
          </div>
        </section>

        {/* Trending subjects */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#121417] mb-4">Trending subjects</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {trending_subjects ? trending_subjects.map((sub) => (
              <SubjectCard
                key={sub.slug}
                slug={sub.slug}
                name={sub.name}
                imageUrl={sub.imageUrl}
              />
            )) : (
              <p className="col-span-6 text-center text-gray-500">Loading trending subjects...</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function SubjectCard({ name, imageUrl,slug }: { name: string; imageUrl: string; slug?: string }) {
  return (
    <Link href={slug ? `/${slug}`:"#"} className="group">
      <div className="overflow-hidden rounded-lg aspect-square">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          width={150}
          height={150}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-2 text-sm font-medium text-[#121417] text-center">{name}</h3>
    </Link>
  )
}

function DocumentCard({ name, imageUrl, featured = false,slug }: { name: string; imageUrl: string; featured?: boolean; slug:string }) {
  return (
    <Link href={slug} className={`group ${featured ? "ring-2 ring-[#3d99f5]/20 rounded-lg" : ""}`}>
      <div className={`overflow-hidden rounded-lg aspect-square ${featured ? "bg-white" : ""}`}>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          width={150}
          height={150}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className={`mt-2 text-sm font-medium text-[#121417] ${featured ? "font-semibold" : ""}`}>{name}</h3>
    </Link>
  )
}