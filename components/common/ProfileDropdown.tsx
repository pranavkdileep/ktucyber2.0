import Link from 'next/link';
import React from 'react';

interface UserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

interface ProfileDropdownProps {
  userData: UserData | null;
  onLogout: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userData, onLogout }) => {
  if (!userData) {
    return null; 
  }

  const displayName = userData.firstName && userData.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData.username 
    ? userData.username 
    : userData.email;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 mb-1">
        <p className="font-semibold">{displayName}</p>
        { (userData.firstName || userData.username) && userData.email && 
          <p className="text-xs text-gray-500">{userData.email}</p> 
        }
      </div>
      <Link href="/user/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        Profile
      </Link>
      <Link href="/user/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        Settings
      </Link>
      <button
        onClick={onLogout}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Logout
      </button>
      
    </div>
  );
};

export default ProfileDropdown;
