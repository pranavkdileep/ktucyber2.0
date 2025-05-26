import Image from "next/image"
import Link from "next/link"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import  "@/actions/db_init"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-[#e5e8eb]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center font-bold text-[#121417]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              KtuCyber
            </Link>

            <div className="flex items-center">
              <nav className="hidden sm:flex items-center space-x-6 mr-4">
                <Link href="/" className="text-[#121417] font-medium text-sm">
                  Home
                </Link>
                <Link href="/explore" className="text-[#61758a] hover:text-[#121417] text-sm">
                  Explore
                </Link>
                <Link href="/upload" className="text-[#61758a] hover:text-[#121417] text-sm">
                  Upload
                </Link>
              </nav>

              <div className="hidden md:flex items-center relative rounded-full bg-[#f0f2f5] px-3 py-1.5 mr-3">
                <Search className="h-4 w-4 text-[#61758a]" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent border-none outline-none pl-2 text-sm text-[#121417] placeholder-[#61758a] w-40"
                />
              </div>

              <div className="hidden sm:flex items-center space-x-2">
                <Button className="bg-[#3d99f5] hover:bg-[#3d99f5]/90 text-white rounded-full px-4 py-2 text-sm">
                  Sign up
                </Button>
                <Button variant="ghost" className="text-[#121417] hover:bg-[#f0f2f5] rounded-full px-4 py-2 text-sm">
                  Log in
                </Button>
              </div>

              {/* Mobile navigation */}
              <div className="sm:hidden flex items-center">
                <Button variant="ghost" size="sm" className="p-1 mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
                <Button className="bg-[#3d99f5] hover:bg-[#3d99f5]/90 text-white rounded-full px-3 py-1 text-xs">
                  Sign up
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile navigation links - always visible for now */}
          <div className="flex sm:hidden justify-between mt-3 pb-1 overflow-x-auto">
            <Link
              href="/"
              className="text-[#121417] font-medium text-sm whitespace-nowrap px-3 py-1 bg-[#f0f2f5] rounded-full"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-[#61758a] hover:text-[#121417] text-sm whitespace-nowrap px-3 py-1 ml-2"
            >
              Explore
            </Link>
            <Link
              href="/upload"
              className="text-[#61758a] hover:text-[#121417] text-sm whitespace-nowrap px-3 py-1 ml-2"
            >
              Upload
            </Link>
          </div>
        </div>
      </header>

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

      <footer className="bg-[#f0f2f5] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2 text-[#121417]"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="font-bold text-[#121417]">KtuCyber</span>
            </div>
            <div className="flex flex-wrap justify-center space-x-4 text-sm text-[#61758a]">
              <Link href="/about" className="hover:text-[#121417] mb-2">
                About
              </Link>
              <Link href="/terms" className="hover:text-[#121417] mb-2">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-[#121417] mb-2">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-[#121417] mb-2">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-[#61758a]">© 2023 KtuCyber. All rights reserved.</div>
        </div>
      </footer>
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
