import React from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function NavBar() {
  return (
    <div>
      <header className="sticky top-0 z-10 bg-white border-b border-[#e5e8eb]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center font-bold text-[#121417]"
            >
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
                <Link
                  href="/explore"
                  className="text-[#61758a] hover:text-[#121417] text-sm"
                >
                  Explore
                </Link>
                <Link
                  href="/upload"
                  className="text-[#61758a] hover:text-[#121417] text-sm"
                >
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
                <Link href="/signup">
                  <Button className="bg-[#3d99f5] hover:bg-[#3d99f5]/90 text-white rounded-full px-4 py-2 text-sm">
                    Sign up
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-[#121417] hover:bg-[#f0f2f5] rounded-full px-4 py-2 text-sm"
                  >
                    Log in
                  </Button>
                </Link>
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
    </div>
  );
}

export default NavBar;
