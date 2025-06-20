"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, UserRound, X } from "lucide-react";
import { verifyToken, logoutUser } from "../../actions/auth";
import { Button } from "@/components/ui/button";
import ProfileDropdown from "./ProfileDropdown";
import { getUserProfile } from "@/actions/profile";
import { searchSubjects } from "@/actions/documents";

function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState<any[]>([]);
  const [showMobileSearchResults, setShowMobileSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const response = await verifyToken();
      if (response.success) {
        setIsAuthenticated(true);
        setUserData(response.payload);
        if(response.payload && response.payload.id){
          const profiledata = await getUserProfile(response.payload.id as string)
          if(profiledata?.profilePicture){
            setProfilePicture(profiledata.profilePicture)
          }
        }
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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowMobileSearchResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen, showSearchResults, showMobileSearchResults]);

  const handleSearch = async (query: string, isMobile: boolean = false) => {
    if (query.trim().length === 0) {
      if (isMobile) {
        setMobileSearchResults([]);
        setShowMobileSearchResults(false);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
      return;
    }

    try {
      const results = await searchSubjects(query, 5);
      if (isMobile) {
        setMobileSearchResults(results);
        setShowMobileSearchResults(true);
      } else {
        setSearchResults(results);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>, isMobile: boolean = false) => {
    const query = e.target.value;
    if (isMobile) {
      setMobileSearchQuery(query);
    } else {
      setSearchQuery(query);
    }
    handleSearch(query, isMobile);
  };

  const handleSubjectSelect = (slug: string) => {
    setShowSearchResults(false);
    setShowMobileSearchResults(false);
    setSearchQuery("");
    setMobileSearchQuery("");
    router.push(`/${slug}`);
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out user...");
      const result = await logoutUser();
      if (result.success) {
        setIsAuthenticated(false);
        setUserData(null);
        setIsDropdownOpen(false);
        router.push('/');
        router.refresh();
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
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
                {/* <Link
                  href="/explore"
                  className="text-[#61758a] hover:text-[#121417] text-sm"
                >
                  Explore
                </Link> */}
                <Link
                  href="/user/upload"
                  className="text-[#61758a] hover:text-[#121417] text-sm"
                >
                  Upload
                </Link>
              </nav>

              <div className="hidden md:flex items-center relative mr-3" ref={searchRef}>
                <div className="flex items-center relative rounded-full bg-[#f0f2f5] px-3 py-1.5">
                  <Search className="h-4 w-4 text-[#61758a]" />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e, false)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    className="bg-transparent border-none outline-none pl-2 text-sm text-[#121417] placeholder-[#61758a] w-40"
                  />
                </div>
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                    {searchResults.map((subject) => (
                      <div
                        key={subject.id}
                        onClick={() => handleSubjectSelect(subject.slug)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium text-[#121417]">{subject.name}</div>
                        <div className="text-xs text-[#61758a]">{subject.code}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <Button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    variant="ghost"
                    className="rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    {profilePicture ? (
                      <Image
                        src={profilePicture}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="rounded-full h-6 w-6"
                      />
                    ) : (
                      <UserRound className="h-6 w-6 text-[#121417]" />
                    )}
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

              <div className="sm:hidden flex items-center">
                <Button variant="ghost" size="sm" className="p-1 mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                {isAuthenticated ? (
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      variant="ghost"
                      className="rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      {profilePicture ? (
                      <Image
                        src={profilePicture}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="rounded-full h-6 w-6"
                      />
                    ) : (
                      <UserRound className="h-6 w-6 text-[#121417]" />
                    )}
                    </Button>
                    {isDropdownOpen && (
                      <ProfileDropdown
                        userData={userData}
                        onLogout={handleLogout}
                      />
                    )}
                  </div>
                ) : (
                  <Link href="/signup"> 
                    <Button className="bg-[#3d99f5] hover:bg-[#3d99f5]/90 text-white rounded-full px-3 py-1 text-xs">
                      Sign up
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {isMobileMenuOpen && (
        <div className="absolute w-full sm:hidden border-t border-[#e5e8eb] bg-white shadow-lg z-20">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2 mb-4">
              <Link href="/" className="text-[#121417] font-medium text-sm py-2.5 hover:bg-gray-100 rounded-md px-3">
                Home
              </Link>
              {/* <Link
                href="/explore"
                className="text-[#61758a] hover:text-[#121417] text-sm py-2.5 hover:bg-gray-100 rounded-md px-3"
              >
                Explore
              </Link> */}
              <Link
                href="/user/upload"
                className="text-[#61758a] hover:text-[#121417] text-sm py-2.5 hover:bg-gray-100 rounded-md px-3"
              >
                Upload
              </Link>
            </nav>
            <div className="relative" ref={mobileSearchRef}>
              <div className="flex items-center relative rounded-full bg-[#f0f2f5] px-3 py-2 w-full">
                <Search className="h-5 w-5 text-[#61758a]" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={mobileSearchQuery}
                  onChange={(e) => handleSearchInputChange(e, true)}
                  onFocus={() => mobileSearchQuery && setShowMobileSearchResults(true)}
                  className="bg-transparent border-none outline-none pl-2.5 text-sm text-[#121417] placeholder-[#61758a] w-full"
                />
              </div>
              {showMobileSearchResults && mobileSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                  {mobileSearchResults.map((subject) => (
                    <div
                      key={subject.id}
                      onClick={() => handleSubjectSelect(subject.slug)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm font-medium text-[#121417]">{subject.name}</div>
                      <div className="text-xs text-[#61758a]">{subject.code}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;