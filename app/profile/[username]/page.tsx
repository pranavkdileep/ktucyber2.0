"use client";
import React, { useState, useEffect } from "react";
import { verifyToken } from "@/actions/auth";
import {
  getUserProfile as getPublicUserProfile,
  getUserUploadedDocuments as getPublicUserUploadedDocuments,
} from "@/actions/public";
import { UserProfile, Document } from "@/lib/schemas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, UserMinus, ArrowLeft } from "lucide-react";
import { followUser, isUserFollowing, unfollowUser } from "@/actions/profile";
import FollowersModal from "@/components/FollowersModal";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roles: "user" | "admin" | "superadmin";
}

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<
    "followers" | "following"
  >("followers");

  const handleShowFollowers = () => {
    setModalInitialTab("followers");
    setIsFollowersModalOpen(true);
  };

  const handleShowFollowing = () => {
    setModalInitialTab("following");
    setIsFollowersModalOpen(true);
  };

  const pageSize = 5;

  useEffect(() => {
    initializePage();
  }, [username]);

  useEffect(() => {
    if (profileUser) {
      loadDocuments();
    }
  }, [currentPage, profileUser]);

  const initializePage = async () => {
    try {
      setLoading(true);
      const { username } = await params;
      if (!username) {
        router.push("/404");
        return;
      }
      setUsername(username);

      // Get current user if logged in
      const tokenResult = await verifyToken();
      let currentUserData = null;
      if (tokenResult.success && tokenResult.payload) {
        currentUserData = tokenResult.payload as unknown as User;
        setCurrentUser(currentUserData);
      }

      // Get profile user data
      const userProfile = await getPublicUserProfile(username);
      if (!userProfile) {
        // User not found, redirect to 404 or show error
        router.push("/404");
        return;
      }

      setProfileUser(userProfile);

      // Check if this is the current user's own profile
      if (currentUserData && currentUserData.username === username) {
        setIsOwnProfile(true);
        // Redirect to dashboard if viewing own profile
        router.push("/user/dashboard");
        return;
      }

      // Check if current user is following this profile user
      if (currentUserData) {
        //You'll need to implement this function in your actions
        const followStatus = await isUserFollowing(userProfile.id);
        setIsFollowing(followStatus);
      }
    } catch (error) {
      console.error("Error initializing profile page:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    if (!profileUser) return;

    try {
      const result = await getPublicUserUploadedDocuments(
        profileUser.username,
        currentPage,
        pageSize
      );
      setDocuments(result.documents);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
    } catch (error) {
      console.error("Error loading documents:", error);
      setDocuments([]);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !profileUser) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    setFollowLoading(true);
    try {
      // You'll need to implement these functions in your actions
      if (isFollowing) {
        const result = await unfollowUser(profileUser.id);
        if (result) {
          setIsFollowing(false);
          setProfileUser((prev) =>
            prev ? { ...prev, totalFollowers: prev.totalFollowers - 1 } : null
          );
        }
      } else {
        const result = await followUser(profileUser.id);
        if (result) {
          setIsFollowing(true);
          setProfileUser((prev) =>
            prev ? { ...prev, totalFollowers: prev.totalFollowers + 1 } : null
          );
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The user you're looking for doesn't exist.
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-6 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Back Button */}
            <div className="flex items-center gap-4 p-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            </div>

            {/* Profile Section */}
            <div className="flex p-4">
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-24 h-24 sm:min-h-32 sm:w-32 flex-shrink-0"
                    style={{
                      backgroundImage: `url("${
                        profileUser.profilePicture ||
                        "/placeholder.svg?height=128&width=128"
                      }")`,
                    }}
                  ></div>
                  <div className="flex flex-col justify-center flex-1">
                    <p className="text-[#111418] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      {profileUser.fullName || "User"}
                    </p>
                    <p className="text-[#60758a] text-sm sm:text-base font-normal leading-normal">
                      @{profileUser.username}
                    </p>
                    <p className="text-[#60758a] text-sm sm:text-base font-normal leading-normal">
                      Joined{" "}
                      {profileUser.dateOfJoining
                        ? formatDate(profileUser.dateOfJoining)
                        : "Recently"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {currentUser && !isOwnProfile && (
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg w-full sm:w-auto transition-colors ${
                        isFollowing
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      } disabled:opacity-50`}
                    >
                      {followLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <>
                          {isFollowing ? (
                            <UserMinus size={16} />
                          ) : (
                            <UserPlus size={16} />
                          )}
                          {isFollowing ? "Unfollow" : "Follow"}
                        </>
                      )}
                    </button>
                  )}
                  {!currentUser && (
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                    >
                      <UserPlus size={16} />
                      Follow
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[#111418] text-sm sm:text-base font-normal leading-normal pb-3 pt-1 px-4">
              {profileUser.bio ||
                "Passionate about sharing knowledge and helping others succeed. Let's learn together!"}
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-3 px-4 py-3">
              <button
                onClick={handleShowFollowers}
                className="flex flex-1 flex-col gap-2 rounded-lg border border-[#dbe0e6] p-3 items-start hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <p className="text-[#111418] tracking-light text-xl sm:text-2xl font-bold leading-tight">
                  {profileUser?.totalFollowers || 0}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[#60758a] text-sm font-normal leading-normal">
                    Followers
                  </p>
                </div>
              </button>
              <button
                onClick={handleShowFollowing}
                className="flex flex-1 flex-col gap-2 rounded-lg border border-[#dbe0e6] p-3 items-start hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <p className="text-[#111418] tracking-light text-xl sm:text-2xl font-bold leading-tight">
                  {profileUser?.totalFollowing || 0}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[#60758a] text-sm font-normal leading-normal">
                    Following
                  </p>
                </div>
              </button>

              <div className="flex flex-1 flex-col gap-2 rounded-lg border border-[#dbe0e6] p-3 items-start">
                <p className="text-[#111418] tracking-light text-xl sm:text-2xl font-bold leading-tight">
                  {profileUser.totalUploadedDocuments || 0}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[#60758a] text-sm font-normal leading-normal">
                    Uploads
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Materials */}
            <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Uploaded Materials
            </h3>

            {documents.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                No uploaded materials found.
              </div>
            ) : (
              documents.map((document) => (
                <div key={document.id} className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-4 rounded-xl">
                    <div className="flex flex-1 flex-col gap-4 order-2 sm:order-1">
                      <div className="flex flex-col gap-1">
                        <p className="text-[#60758a] text-xs sm:text-sm font-normal leading-normal">
                          Subject: {document.subjectName || "N/A"}{" "}
                          {document.subjectCode && `(${document.subjectCode})`}
                        </p>
                        <p className="text-[#60758a] text-xs sm:text-sm font-normal leading-normal">
                          University: {document.universityName || "N/A"}{" "}
                        </p>
                        <p className="text-[#111418] text-sm sm:text-base font-bold leading-tight">
                          {document.title}
                        </p>
                        <p className="text-[#60758a] text-xs sm:text-sm font-normal leading-normal">
                          Uploaded on{" "}
                          {formatDate(document.createdAt.toString())}
                        </p>
                      </div>
                      <Link href={`/${document.subjectSlug}/${document.slug}`}>
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-medium leading-normal w-fit">
                          <span className="truncate">View</span>
                        </button>
                      </Link>
                    </div>
                    <div
                      className="w-full sm:w-48 bg-center bg-no-repeat aspect-video bg-cover rounded-xl order-1 sm:order-2"
                      style={{
                        backgroundImage: `url("${
                          document.previewImage ||
                          "/placeholder.svg?height=200&width=300"
                        }")`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center p-4 gap-1 sm:gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex size-8 sm:size-10 items-center justify-center disabled:opacity-50"
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

                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`text-xs sm:text-sm font-medium leading-normal flex size-8 sm:size-10 items-center justify-center rounded-full ${
                        currentPage === pageNum
                          ? "text-[#111418] bg-[#f0f2f5] font-bold"
                          : "text-[#111418]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex size-8 sm:size-10 items-center justify-center disabled:opacity-50"
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
          </div>
        </div>
      </div>
      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        userId={profileUser?.id || ""}
        initialTab={modalInitialTab}
        followerCount={profileUser?.totalFollowers || 0}
        followingCount={profileUser?.totalFollowing || 0}
      />
    </div>
  );
}
