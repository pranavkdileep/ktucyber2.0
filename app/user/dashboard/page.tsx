"use client";
import React, { useState, useEffect } from "react";
import { verifyToken, resetEmailVerificationToken } from "@/actions/auth";
import {
  getUserProfile,
  getUserUploadedDocuments,
  getUserDownloadedDocuments,
  getUserBookmarks,
} from "@/actions/profile";
import { UserProfile,Document } from "@/lib/schemas";
import Link from "next/link";
import { Upload, Settings, AlertCircle, RefreshCw } from "lucide-react";
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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<
    "uploads" | "downloads" | "bookmarks" | "contributions"
  >("uploads");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [message, setMessage] = useState("");
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
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadTabData();
    }
  }, [activeTab, currentPage, user?.id]);

  const initializePage = async () => {
    try {
      const tokenResult = await verifyToken();
      if (!tokenResult.success || !tokenResult.payload) {
        window.location.href = "/auth/login";
        return;
      }

      const userData = tokenResult.payload as unknown as User;
      setUser(userData);

      const userProfile = await getUserProfile(userData.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Error initializing page:", error);
      window.location.href = "/auth/login";
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      let result;
      switch (activeTab) {
        case "uploads":
          result = await getUserUploadedDocuments(
            user.id,
            currentPage,
            pageSize
          );
          break;
        case "downloads":
          result = await getUserDownloadedDocuments(
            user.id,
            currentPage,
            pageSize
          );
          break;
        case "bookmarks":
          result = await getUserBookmarks(user.id, currentPage, pageSize);
          break;
        default:
          result = { documents: [], totalCount: 0 };
      }
      setDocuments(result.documents);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
    } catch (error) {
      console.error("Error loading tab data:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.id) return;

    setResendingEmail(true);
    try {
      const result = await resetEmailVerificationToken(user.id);
      setMessage(result.message);
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("Error resending verification:", error);
      setMessage("Failed to resend verification email");
    } finally {
      setResendingEmail(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
        {/* Email Verification Banner */}
        {user && !user.isEmailVerified && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mx-4 sm:mx-6 lg:mx-10 mt-4 rounded">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center">
                <AlertCircle className="h-5 w-5 text-orange-400 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
                <div>
                  <p className="text-sm text-orange-700">
                    <strong>Email not verified.</strong> Please check your email
                    and click the verification link.
                  </p>
                  {message && (
                    <p className="text-xs text-green-600 mt-1">{message}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap"
              >
                {resendingEmail ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : null}
                Resend
              </button>
            </div>
          </div>
        )}

        <div className="px-4 sm:px-6 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Profile Section */}
            <div className="flex p-4">
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-24 h-24 sm:min-h-32 sm:w-32 flex-shrink-0"
                    style={{
                      backgroundImage: `url("${
                        profile?.profilePicture ||
                        "/placeholder.svg?height=128&width=128"
                      }")`,
                    }}
                  ></div>
                  <div className="flex flex-col justify-center flex-1">
                    <p className="text-[#111418] text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">
                      {profile?.fullName ||
                        `${user?.firstName} ${user?.lastName}` ||
                        "User"}
                    </p>
                    <p className="text-[#60758a] text-sm sm:text-base font-normal leading-normal">
                      @{profile?.username || user?.username || "username"}
                    </p>
                    <p className="text-[#60758a] text-sm sm:text-base font-normal leading-normal">
                      Joined{" "}
                      {profile?.dateOfJoining
                        ? formatDate(profile.dateOfJoining)
                        : "Recently"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Link
                    href="/user/upload"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                  >
                    <Upload size={16} />
                    Upload
                  </Link>
                  <Link
                    href="/user/settings"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 w-full sm:w-auto"
                  >
                    <Settings size={16} />
                    Edit
                  </Link>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-[#111418] text-sm sm:text-base font-normal leading-normal pb-3 pt-1 px-4">
              {profile?.bio ||
                "Passionate about sharing knowledge and helping others succeed. Let's learn together!"}
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-3 px-4 py-3">
              <button
                onClick={handleShowFollowers}
                className="flex flex-1 flex-col gap-2 rounded-lg border border-[#dbe0e6] p-3 items-start hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <p className="text-[#111418] tracking-light text-xl sm:text-2xl font-bold leading-tight">
                  {profile?.totalFollowers || 0}
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
                  {profile?.totalFollowing || 0}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-[#60758a] text-sm font-normal leading-normal">
                    Following
                  </p>
                </div>
              </button>
            </div>
            {/* Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#dbe0e6] px-4 gap-4 sm:gap-8 overflow-x-auto">
                {["uploads", "downloads", "bookmarks", "contributions"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab as any);
                        setCurrentPage(1);
                      }}
                      className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 whitespace-nowrap ${
                        activeTab === tab
                          ? "border-b-[#111418] text-[#111418]"
                          : "border-b-transparent text-[#60758a]"
                      }`}
                    >
                      <p
                        className={`text-xs sm:text-sm font-bold leading-normal tracking-[0.015em] capitalize ${
                          activeTab === tab
                            ? "text-[#111418]"
                            : "text-[#60758a]"
                        }`}
                      >
                        {tab}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Content */}
            {activeTab !== "contributions" ? (
              <>
                <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                  {activeTab === "uploads" && "Uploaded Materials"}
                  {activeTab === "downloads" && "Downloaded Materials"}
                  {activeTab === "bookmarks" && "Bookmarked Materials"}
                </h3>

                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">
                    No {activeTab} found.
                  </div>
                ) : (
                  documents.map((document) => (
                    <div key={document.id} className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-4 rounded-xl">
                        <div className="flex flex-1 flex-col gap-4 order-2 sm:order-1">
                          <div className="flex flex-col gap-1">
                            <p className="text-[#60758a] text-xs sm:text-sm font-normal leading-normal">
                              Subject: {document.subjectId}
                            </p>
                            <p className="text-[#111418] text-sm sm:text-base font-bold leading-tight">
                              {document.title}
                            </p>
                            <p className="text-[#60758a] text-xs sm:text-sm font-normal leading-normal">
                              {activeTab === "uploads" ? "Uploaded" : "Added"}{" "}
                              on {formatDate(document.createdAt.toString())}
                            </p>
                          </div>
                          <Link href={`/documents/${document.slug}`}>
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
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
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
              </>
            ) : (
              <>
                <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
                  Contributions
                </h3>
                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
                  <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-10 sm:size-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="sm:w-6 sm:h-6"
                    >
                      <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Zm-15.22,5-45.1,39.36a16,16,0,0,0-5.08,15.71L187.35,216v0l-51.07-31a15.9,15.9,0,0,0-16.54,0l-51,31h0L82.2,157.4a16,16,0,0,0-5.08-15.71L32,102.35a.37.37,0,0,1,0-.09l59.44-5.14a16,16,0,0,0,13.35-9.75L128,32.08l23.2,55.29a16,16,0,0,0,13.35,9.75L224,102.26S224,102.32,224,102.33Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111418] text-sm sm:text-base font-medium leading-normal line-clamp-1">
                      Reputation
                    </p>
                    <p className="text-[#60758a] text-xs sm:text-sm font-normal leading-normal line-clamp-2">
                      120 points
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
                  <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-10 sm:size-12">
                    <Upload size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111418] text-sm sm:text-base font-medium leading-normal line-clamp-1">
                      Materials Uploaded
                    </p>
                    <p className="text-[#60758a] text-xs sm:text-sm font-normal leading-normal line-clamp-2">
                      {profile?.totalUploadedDocuments || 0} uploads
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
                  <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f5] shrink-0 size-10 sm:size-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="sm:w-6 sm:h-6"
                    >
                      <path d="M240,136v64a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V136a16,16,0,0,1,16-16H72a8,8,0,0,1,0,16H32v64H224V136H184a8,8,0,0,1,0-16h40A16,16,0,0,1,240,136Zm-117.66-2.34a8,8,0,0,0,11.32,0l48-48a8,8,0,0,0-11.32-11.32L136,108.69V24a8,8,0,0,0-16,0v84.69L85.66,74.34A8,8,0,0,0,74.34,85.66ZM200,168a12,12,0,1,0-12,12A12,12,0,0,0,200,168Z"></path>
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111418] text-sm sm:text-base font-medium leading-normal line-clamp-1">
                      Materials Downloaded
                    </p>
                    <p className="text-[#60758a] text-xs sm:text-sm font-normal leading-normal line-clamp-2">
                      {profile?.totalDownloadedDocuments || 0} downloads
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        userId={user?.id || ""}
        initialTab={modalInitialTab}
        followerCount={profile?.totalFollowers || 0}
        followingCount={profile?.totalFollowing || 0}
      />
    </div>
  );
}
