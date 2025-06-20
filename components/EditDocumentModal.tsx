'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const editDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isPublic: z.boolean(),
  tags: z.string().optional(),
});

type EditDocumentFormData = z.infer<typeof editDocumentSchema>;

interface Document {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  tags?: string[];
}

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSave: (documentId: string, updatedData: EditDocumentFormData) => Promise<void>;
}

export default function EditDocumentModal({ 
  isOpen, 
  onClose, 
  document,
  onSave 
}: EditDocumentModalProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditDocumentFormData>({
    resolver: zodResolver(editDocumentSchema),
  });

  useEffect(() => {
    if (isOpen && document) {
      setValue("title", document.title);
      setValue("description", document.description);
      setValue("isPublic", document.isPublic);
      setValue("tags", document.tags ? document.tags.join(", ") : "");
    }
  }, [isOpen, document, setValue]);

  const onSubmit = async (data: EditDocumentFormData) => {
    if (!document) return;

    setSaving(true);
    setMessage("");
    
    try {
      await onSave(document.id, data);
      setMessage("Document updated successfully!");
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1500);
    } catch (error) {
      console.error('Error updating document:', error);
      setMessage("Failed to update document. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      reset();
      setMessage("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Edit Document</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Title *
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="Enter document title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe the document content"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                {...register("tags")}
                type="text"
                placeholder="Enter tags separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate tags with commas (e.g., calculus, mathematics, exam)
              </p>
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

            {/* Message */}
            {message && (
              <div className={`text-sm p-2 rounded ${
                message.includes("success") 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}