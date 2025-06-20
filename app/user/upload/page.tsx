"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { verifyToken } from "@/actions/auth";
import { uploadDocument, searchUniversities, searchSubjects, createUniversity, createSubject } from "@/actions/documents";
import { uploadDocumentFile, uploadDocumentPreview } from "@/actions/r2operations";
import { Document,University,Subject } from "@/lib/schemas";
import { ArrowLeft, Upload, FileText, Image, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Upload form schema
const uploadSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    documentType: z.enum(['pdf', 'docx', 'pptx', 'xlsx'], {
      errorMap: () => ({ message: "Please select a valid document type" })
    }),
    isPublic: z.boolean(),  // Remove .default(true) here
    tags: z.string().optional(),
  });
  
  type UploadFormData = z.infer<typeof uploadSchema>;

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


export default function UploadPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  
  // University and Subject state
  const [universities, setUniversities] = useState<University[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [universityQuery, setUniversityQuery] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  // Create new university/subject modals
  const [showCreateUniversity, setShowCreateUniversity] = useState(false);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [newUniversityName, setNewUniversityName] = useState("");
  const [newUniversityDescription, setNewUniversityDescription] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      isPublic: true, 
      tags: "",
    },
  });

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    try {
      const tokenResult = await verifyToken();
      if (!tokenResult.success || !tokenResult.payload) {
        router.push("/login");
        return;
      }

      const userData = tokenResult.payload as unknown as User;
      setUser(userData);
    } catch (error) {
      console.error("Error initializing page:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleUniversitySearch = async (query: string) => {
    setUniversityQuery(query);
    if (query.length > 2) {
      try {
        setShowUniversityDropdown(true);
        const results = await searchUniversities(query, 10);
        setUniversities(results);
      } catch (error) {
        console.error("Error searching universities:", error);
      }
    } else {
      setShowUniversityDropdown(false);
    }
  };

  const handleSubjectSearch = async (query: string) => {
    setSubjectQuery(query);
    if (query.length > 2) {
      try {
        setShowSubjectDropdown(true);
        const results = await searchSubjects(query, 10);
        setSubjects(results);
      } catch (error) {
        console.error("Error searching subjects:", error);
      }
    } else {
      setShowSubjectDropdown(false);
    }
  };

  const handleCreateUniversity = async () => {
    if (!newUniversityName.trim()) return;
    
    try {
      const slug = newUniversityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();
      const newUniversity = await createUniversity(
        newUniversityName,
        "", // No image for now
        newUniversityDescription,
        slug
      );
      setSelectedUniversity(newUniversity as University);
      setUniversityQuery(newUniversity.name);
      setShowCreateUniversity(false);
      setNewUniversityName("");
      setNewUniversityDescription("");
    } catch (error) {
      console.error("Error creating university:", error);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim() || !newSubjectCode.trim()) return;
    
    try {
      const newSubject = await createSubject(
        newSubjectName,
        newSubjectDescription,
        newSubjectCode,
        newSubjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim()
      );
      setSelectedSubject(newSubject as Subject);
      setSubjectQuery(newSubject.name);
      setShowCreateSubject(false);
      setNewSubjectName("");
      setNewSubjectCode("");
      setNewSubjectDescription("");
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                           'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid document file (PDF, DOCX, PPTX, XLSX)");
        return;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
        return;
      }
      
      setDocumentFile(file);
    }
  };

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      
      setPreviewFile(file);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!user?.id) return;
    if (!documentFile) {
      alert("Please select a document file");
      return;
    }
    if (!selectedUniversity) {
      alert("Please select a university");
      return;
    }
    if (!selectedSubject) {
      alert("Please select a subject");
      return;
    }

    setUploading(true);
    try {
      setUploadProgress("Uploading document file...");
      
      // Upload document file
      const fileUrl = await uploadDocumentFile(user.id, documentFile, data.documentType);
      
      // Upload preview image if provided
      let previewUrl = "";
      if (previewFile) {
        setUploadProgress("Uploading preview image...");
        previewUrl = await uploadDocumentPreview(user.id, previewFile);
      }

      setUploadProgress("Creating document record...");
      
      // Create document record
      const documentId = crypto.randomUUID();
      const slug = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim()}-${documentId.slice(0, 8)}`;
      
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      const document: Document = {
        id: documentId,
        slug,
        userId: user.id,
        title: data.title,
        description: data.description,
        subjectId: selectedSubject.id,
        universityId: selectedUniversity.id,
        documentType: data.documentType,
        fileKey: fileUrl,
        isPublic: data.isPublic,
        tags,
        previewImage: previewUrl || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await uploadDocument(document);
      
      setUploadProgress("Upload completed successfully!");
      
      // Reset form
      reset();
      setDocumentFile(null);
      setPreviewFile(null);
      setSelectedUniversity(null);
      setSelectedSubject(null);
      setUniversityQuery("");
      setSubjectQuery("");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/user/dashboard");
      }, 2000);
      
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadProgress("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/user/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title *
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="Enter document title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe the document content, what topics it covers, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* University Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={universityQuery}
                  onChange={(e) => handleUniversitySearch(e.target.value)}
                  placeholder="Search for university..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              {showUniversityDropdown && universities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {universities.map((university) => (
                    <button
                      key={university.id}
                      type="button"
                      onClick={() => {
                        setSelectedUniversity(university);
                        setUniversityQuery(university.name);
                        setShowUniversityDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {university.name}
                    </button>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setShowCreateUniversity(true)}
                className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} />
                Add new university
              </button>
            </div>

            {/* Subject Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={subjectQuery}
                  onChange={(e) => handleSubjectSearch(e.target.value)}
                  placeholder="Search for subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              {showSubjectDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => {
                          setSelectedSubject(subject);
                          setSubjectQuery(`${subject.name} (${subject.code})`);
                          setShowSubjectDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-sm text-gray-500">{subject.code}</div>
                        </div>
                      </button>
                    ))) : (
                    <div className="px-4 py-2 text-gray-500">No subjects found Or Loading..</div>
                  )}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setShowCreateSubject(true)}
                className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} />
                Add new subject
              </button>
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                {...register("documentType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select document type</option>
                <option value="pdf">PDF</option>
                <option value="docx">Word Document (DOCX)</option>
                <option value="pptx">PowerPoint (PPTX)</option>
                <option value="xlsx">Excel (XLSX)</option>
              </select>
              {errors.documentType && (
                <p className="text-red-500 text-sm mt-1">{errors.documentType.message}</p>
              )}
            </div>

            {/* Document File */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document File *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      {documentFile ? documentFile.name : "Click to upload document"}
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, PPTX, XLSX (MAX. 50MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleDocumentFileChange}
                    accept=".pdf,.docx,.pptx,.xlsx"
                  />
                </label>
              </div>
            </div>

            {/* Preview Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Image (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Image className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      {previewFile ? previewFile.name : "Click to upload preview image"}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handlePreviewFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <input
                {...register("tags")}
                type="text"
                placeholder="Enter tags separated by commas (e.g., calculus, mathematics, exam)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Public/Private */}
            <div className="flex items-center">
              <input
                {...register("isPublic")}
                type="checkbox"
                id="isPublic"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Make this document public (visible to all users)
              </label>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-700">{uploadProgress}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Create University Modal */}
      {showCreateUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4">Add New University</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University Name *
                </label>
                <input
                  type="text"
                  value={newUniversityName}
                  onChange={(e) => setNewUniversityName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter university name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newUniversityDescription}
                  onChange={(e) => setNewUniversityDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter university description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateUniversity(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUniversity}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Subject Modal */}
      {showCreateSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4">Add New Subject</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject code (e.g., CS101)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newSubjectDescription}
                  onChange={(e) => setNewSubjectDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateSubject(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}