"use client";
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
//import '@/actions/db_init'
import { useEffect, useState } from "react"
import { getRecentDocuments, getTrendingSubjects } from "@/actions/public"

export default function Home() {
  const [ternding_subjects, setTrendingSubjects] = useState<{name: string, slug: string, imageUrl: string}[] | null>(null)
  const [recent_documents, setRecentDocuments] = useState<{previewImage: string, name: string, slug: string}[] | null>(null)


  useEffect(() => {
    async function fetchData() {
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

  return (
    <div className="min-h-screen bg-white">
      
      <main className="container mx-auto px-4 py-6">
        {/* Main Search */}
        <div className="relative max-w-3xl mx-auto mb-8">
          <div className="flex items-center relative rounded-full bg-[#f0f2f5] px-4 py-3">
            <Search className="h-5 w-5 text-[#61758a]" />
            <input
              type="text"
              placeholder="Search for documents, subjects, universities..."
              className="bg-transparent border-none outline-none pl-2 text-[#121417] placeholder-[#61758a] w-full"
            />
          </div>
        </div>

        {/* Recent documents - Highlighted on mobile */}
        <section className="mb-10 bg-[#f8f9fa] p-4 rounded-lg">
          <h2 className="text-xl font-bold text-[#121417] mb-4">Recent documents</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {/* <DocumentCard
              name="Introduction to Programming"
              imageUrl="/placeholder.svg?height=150&width=150&query=programming code on dark background"
              featured
            /> */}
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
            {/* <SubjectCard
              name="Computer Science"
              imageUrl="/placeholder.svg?height=150&width=150&query=computer on desk with code"
            /> */}
            {ternding_subjects ? ternding_subjects.map((sub) => (
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
    <Link href={slug ? slug:"#"} className="group">
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
