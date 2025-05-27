"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, UserRound } from "lucide-react";
import { verifyToken, logoutUser } from "../../actions/auth";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "./ProfileDropdown";

function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const response = await verifyToken();
      if (response.success) {
        setIsAuthenticated(true);
        setUserData(response.payload);
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      console.log("Logging out user...");
      const result = await logoutUser();
      if (result.success) {
        setIsAuthenticated(false);
        setUserData(null);
        setIsDropdownOpen(false);
        router.push('/');
        router.refresh(); // Important to re-fetch server components and update state
      } else {
        // Handle logout failure, e.g., show a notification
        console.error("Logout failed:", result.message);
        // Optionally, inform the user
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally, inform the user
    }
  };

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

              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <Button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    variant="ghost"
                    className="rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <UserRound className="h-6 w-6 text-[#121417]" />
                  </Button>
                  {isDropdownOpen && (
                    <ProfileDropdown
                      userData={userData}
                      onLogout={handleLogout}
                    />
                  )}
                </div>
              ) : (
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
              )}

              {/* Mobile navigation */}
              <div className="sm:hidden flex items-center">
                <Button variant="ghost" size="sm" className="p-1 mr-2"> {/* Menu icon button */}
                  <Menu className="h-5 w-5" />
                </Button>
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}> {/* Assign ref here as well for mobile */}
                    <Button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      variant="ghost"
                      className="rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <UserRound className="h-6 w-6 text-[#121417]" />
                    </Button>
                    {isDropdownOpen && (
                      <ProfileDropdown
                        userData={userData}
                        onLogout={handleLogout}
                      />
                    )}
                  </div>
                ) : (
                  // Ensure Link is used for navigation, not just a Button if it's meant to navigate
                  <Link href="/signup"> 
                    <Button className="bg-[#3d99f5] hover:bg-[#3d99f5]/90 text-white rounded-full px-3 py-1 text-xs">
                      Sign up
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile navigation links - always visible for now */}
          {/* Consider if these links should be hidden or adjusted when user is authenticated */}
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
