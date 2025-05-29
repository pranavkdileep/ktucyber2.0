import Image from "next/image"
import Link from "next/link"
import { Search, Menu } from "lucide-react"


export default function Home() {
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
            <DocumentCard
              name="Introduction to Programming"
              imageUrl="/placeholder.svg?height=150&width=150&query=programming code on dark background"
              featured
            />
            <DocumentCard
              name="Calculus I"
              imageUrl="/placeholder.svg?height=150&width=150&query=calculus textbook with formulas"
              featured
            />
            <DocumentCard
              name="Mechanics"
              imageUrl="/placeholder.svg?height=150&width=150&query=physics mechanics diagram"
            />
            <DocumentCard
              name="Cell Biology"
              imageUrl="/placeholder.svg?height=150&width=150&query=cell biology microscope image"
            />
            <DocumentCard
              name="Organic Chemistry"
              imageUrl="/placeholder.svg?height=150&width=150&query=organic chemistry lab equipment"
            />
            <DocumentCard
              name="Microeconomics"
              imageUrl="/placeholder.svg?height=150&width=150&query=microeconomics textbook cover"
            />
          </div>
        </section>

        {/* Popular this week */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#121417] mb-4">Popular this week</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <UniversityCard
              name="University of California, Berkeley"
              imageUrl="/placeholder.svg?height=200&width=300&query=university campus with trees and buildings"
            />
            <UniversityCard
              name="Stanford University"
              imageUrl="/placeholder.svg?height=200&width=300&query=stanford university campus with red roofs"
            />
            <UniversityCard
              name="Massachusetts Institute of Technology"
              imageUrl="/placeholder.svg?height=200&width=300&query=MIT campus with modern architecture"
            />
          </div>
        </section>

        {/* Trending universities */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#121417] mb-4">Trending universities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <UniversityCard
              name="University of California, Berkeley"
              imageUrl="/placeholder.svg?height=150&width=200&query=berkeley campus"
              small
            />
            <UniversityCard
              name="Stanford University"
              imageUrl="/placeholder.svg?height=150&width=200&query=stanford campus"
              small
            />
            <UniversityCard
              name="Massachusetts Institute of Technology"
              imageUrl="/placeholder.svg?height=150&width=200&query=MIT campus"
              small
            />
            <UniversityCard
              name="University of Oxford"
              imageUrl="/placeholder.svg?height=150&width=200&query=oxford university campus"
              small
            />
            <UniversityCard
              name="University of Cambridge"
              imageUrl="/placeholder.svg?height=150&width=200&query=cambridge university campus"
              small
            />
            <UniversityCard
              name="California Institute of Technology"
              imageUrl="/placeholder.svg?height=150&width=200&query=caltech campus"
              small
            />
          </div>
        </section>

        {/* Trending subjects */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#121417] mb-4">Trending subjects</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <SubjectCard
              name="Computer Science"
              imageUrl="/placeholder.svg?height=150&width=150&query=computer on desk with code"
            />
            <SubjectCard
              name="Mathematics"
              imageUrl="/placeholder.svg?height=150&width=150&query=math books and formulas"
            />
            <SubjectCard
              name="Physics"
              imageUrl="/placeholder.svg?height=150&width=150&query=physics concept with wings"
            />
            <SubjectCard
              name="Biology"
              imageUrl="/placeholder.svg?height=150&width=150&query=biology textbook with green cover"
            />
            <SubjectCard
              name="Chemistry"
              imageUrl="/placeholder.svg?height=150&width=150&query=chemistry lab equipment and plants"
            />
            <SubjectCard
              name="Economics"
              imageUrl="/placeholder.svg?height=150&width=150&query=hand holding economics concept"
            />
          </div>
        </section>
      </main>

      
    </div>
  )
}

function UniversityCard({ name, imageUrl, small = false }: { name: string; imageUrl: string; small?: boolean }) {
  return (
    <Link href="#" className="group">
      <div className="overflow-hidden rounded-lg aspect-video">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          width={small ? 200 : 300}
          height={small ? 150 : 200}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className={`mt-2 ${small ? "text-sm" : "text-base"} font-medium text-[#121417] line-clamp-2`}>{name}</h3>
    </Link>
  )
}

function SubjectCard({ name, imageUrl }: { name: string; imageUrl: string }) {
  return (
    <Link href="#" className="group">
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

function DocumentCard({ name, imageUrl, featured = false }: { name: string; imageUrl: string; featured?: boolean }) {
  return (
    <Link href="#" className={`group ${featured ? "ring-2 ring-[#3d99f5]/20 rounded-lg" : ""}`}>
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
