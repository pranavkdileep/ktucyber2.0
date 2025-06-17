'use client';
import React, { useState, useEffect, useRef } from 'react';
import { verifyToken } from '@/actions/auth';
import { getUserProfile, updateUserProfile } from '@/actions/profile';
import { uploadProfilePicture } from '@/actions/r2operations';
import { UserProfile } from '@/lib/schemas';
import Link from 'next/link';
import { ArrowLeft, Camera, Save, User, Mail, Globe, Bell, Palette, Trash2 } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roles: 'user' | 'admin' | 'superadmin';
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'social'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    bio: '',
    profilePicture: '',
    theme: 'light' as 'light' | 'dark',
    socialLinks: {
      twitter: '',
      github: '',
      linkedin: '',
      website: '',
      instagram: ''
    },
    notifications: {
      emailNotifications: false,
      pushNotifications: false
    }
  });

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    try {
      const tokenResult = await verifyToken();
      if (!tokenResult.success || !tokenResult.payload) {
        window.location.href = '/auth/login';
        return;
      }

      const userData = tokenResult.payload as unknown as User;
      setUser(userData);

      const userProfile = await getUserProfile(userData.id);
      if (userProfile) {
        setProfile(userProfile);
        console.log(userProfile);
        setFormData({
          username: userProfile.username || userData.username,
          fullName: userProfile.fullName || `${userData.firstName} ${userData.lastName}`,
          email: userProfile.email || userData.email,
          bio: userProfile.bio || '',
          profilePicture: userProfile.profilePicture || '',
          theme: userProfile.theme || 'light',
          socialLinks: {
            twitter: userProfile.socialLinks?.twitter ?? '',
            github: userProfile.socialLinks?.github ?? '',
            linkedin: userProfile.socialLinks?.linkedin ?? '',
            website: userProfile.socialLinks?.website ?? '',
            instagram: userProfile.socialLinks?.instagram ?? ''
          },
          notifications: userProfile.notifications || {
            emailNotifications: false,
            pushNotifications: false
          }
        });
      }
    } catch (error) {
      console.error('Error initializing page:', error);
      window.location.href = '/auth/login';
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentValue = prev[parent as keyof typeof prev] as Record<string, unknown>;
        return {
          ...prev,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadProfilePicture(user.id, file, formData.profilePicture);
      setFormData(prev => ({
        ...prev,
        profilePicture: imageUrl
      }));
      setMessage('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Failed to upload image');
    } finally {
      setUploadingImage(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const success = await updateUserProfile(user.id, formData);
      if (success) {
        setMessage('Profile updated successfully');
        // Refresh profile data
        const updatedProfile = await getUserProfile(user.id);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-6 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-3">
              <Link href="/user/dashboard" className="text-[#111418]">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-[#111418] text-2xl font-bold leading-tight tracking-[-0.015em]">
                Settings
              </h1>
            </div>

            {/* Message */}
            {message && (
              <div className={`mx-4 p-3 rounded-lg text-sm ${
                message.includes('success') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Tabs */}
            <div className="px-4 py-3">
              <div className="flex border-b border-[#dbe0e6] gap-6 overflow-x-auto">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'preferences', label: 'Preferences', icon: Palette },
                  { id: 'social', label: 'Social Links', icon: Globe }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 border-b-[3px] pb-3 pt-4 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-b-[#111418] text-[#111418]'
                          : 'border-b-transparent text-[#60758a]'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="px-4 space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-4 py-6">
                  <div className="relative">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-32 h-32 border-4 border-white shadow-lg"
                      style={{
                        backgroundImage: `url("${formData.profilePicture || ''}")`
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-600 text-center">
                    Click the camera icon to update your profile picture
                  </p>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#111418] mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full px-3 py-2 border border-[#dbe0e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111418] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-[#dbe0e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111418] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-[#dbe0e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111418] mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-[#dbe0e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="px-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#111418] mb-4">Appearance</h3>
                  <div>
                    <label className="block text-sm font-medium text-[#111418] mb-2">
                      Theme
                    </label>
                    <select
                      value={formData.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-[#dbe0e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#111418] mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.notifications.emailNotifications}
                        onChange={(e) => handleInputChange('notifications.emailNotifications', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-[#111418]">Email notifications</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.notifications.pushNotifications}
                        onChange={(e) => handleInputChange('notifications.pushNotifications', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-[#111418]">Push notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <div className="px-4 space-y-6">
                <h3 className="text-lg font-semibold text-[#111418]">Social Links</h3>
                <div className="space-y-4">
                  {Object.entries(formData.socialLinks).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-[#111418] mb-2 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleInputChange(`socialLinks.${platform}`, e.target.value)}
                        className="w-full px-3 py-2 border border-[#dbe0e6] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter your ${platform} URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="px-4 py-6 border-t border-[#dbe0e6] mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}