import React from 'react'
import Link from "next/link"

function Footer() {
  return (
    <div>
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
          <div className="mt-6 text-center text-sm text-[#61758a]">© 2025 KtuCyber. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

export default Footer