// Profile Page — View and manage shop owner details and basic shop parameters
// Includes options to log out and deactivate the account (soft-delete shop status)
// Handlers handle empty DB states and errors cleanly

'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faStore, faMapMarkerAlt,
  faClock, faEdit, faSignOutAlt, faTrashAlt, faSpinner,
  faSave, faTimes, faUpload, faImage, faTrash, faExclamationTriangle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { authAPI, shopAPI } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ProfileData {
  ownerName: string;
  email: string;
  phone: string;
  shopName: string;
  shopLogo: string;
  storeLocation: string;
  latitude: string;
  longitude: string;
  openingHours: string;
}

interface EditForm {
  ownerName: string;
  email: string;
  phone: string;
  shopName: string;
  openingHours: string;
  openingTime: string;
  closingTime: string;
  period: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('url');

  const [profileData, setProfileData] = useState<ProfileData>({
    ownerName: '',
    email: '',
    phone: '',
    shopName: '',
    shopLogo: '',
    storeLocation: '',
    latitude: '',
    longitude: '',
    openingHours: '',
  });

  const [editForm, setEditForm] = useState<EditForm>({
    ownerName: '',
    email: '',
    phone: '',
    shopName: '',
    openingHours: '',
    openingTime: '09:00',
    closingTime: '18:00',
    period: 'AM-PM',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Get current user data
      const userResponse = await authAPI.getCurrentUser();
      const userData = userResponse.data.data;

      // Use user ID as shop ID
      const shopId = userData.id;

      // Store shop ID in localStorage for other components
      localStorage.setItem('shopId', shopId);

      // Get shop data if exists
      let shopData = null;
      try {
        const shopResponse = await shopAPI.getShop(shopId);
        shopData = shopResponse.data.data;
      } catch (error) {
        // Shop might not exist yet, that's okay
        console.log('Shop not found, will use user data only');
      }

      setProfileData({
        ownerName: userData.full_name || userData.name || '',
        email: userData.email || '',
        phone: userData.phone || shopData?.phone || '',
        shopName: shopData?.name || '',
        shopLogo: shopData?.logo_url || '',
        storeLocation: shopData?.address || '',
        latitude: shopData?.latitude || '',
        longitude: shopData?.longitude || '',
        openingHours: shopData?.opening_hours || 'Not set',
      });

      setImagePreview(shopData?.logo_url || '');

      // Parse opening hours if available
      if (shopData?.opening_hours) {
        const hours = shopData.opening_hours.split(' - ');
        if (hours.length === 2) {
          setEditForm(prev => ({
            ...prev,
            openingTime: parseTo24Hour(hours[0]),
            closingTime: parseTo24Hour(hours[1]),
          }));
        }
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    const [storedOpen, storedClose] = profileData.openingHours.split(' - ');
    setEditForm({
      ownerName: profileData.ownerName,
      email: profileData.email,
      phone: profileData.phone,
      shopName: profileData.shopName,
      openingHours: profileData.openingHours,
      openingTime: storedOpen ? parseTo24Hour(storedOpen) : '09:00',
      closingTime: storedClose ? parseTo24Hour(storedClose) : '18:00',
      period: 'AM-PM',
    });
    setShowEditModal(true);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
  };

  const formatTime = (time: string) => {
    // Convert 24-hour format to 12-hour with AM/PM
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  // Converts a stored 12-hour string like '8:00 AM' or '6:00 PM' back into
  // the 24-hour 'HH:MM' format required by <input type="time">. Without
  // this, the edit form was assigning '8:00 AM' directly into a time input
  // (which silently fails to display it), and formatTime() would then
  // re-append AM/PM onto that already-formatted string on save, compounding
  // with every edit (e.g. '8:00 AM AM AM').
  const parseTo24Hour = (time12h: string): string => {
    // Collapse any repeated AM/PM suffixes left over from the previous bug
    // (e.g. '8:00 AM AM AM' -> '8:00 AM') so already-corrupted stored data
    // self-heals the next time it's edited, instead of failing to parse.
    const collapsed = time12h.trim().replace(/(\s*(AM|PM))+$/i, (match) => {
      const period = /PM/i.test(match) ? 'PM' : 'AM';
      return ` ${period}`;
    });

    const match = collapsed.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return time12h; // unrecognized format, leave as-is

    let [, hoursStr, minutes, period] = match;
    let hours = parseInt(hoursStr, 10);

    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const shopId = localStorage.getItem('shopId');
      if (!shopId) {
        toast.error('Shop ID not found');
        return;
      }

      // Format opening hours
      const openingHours = `${formatTime(editForm.openingTime)} - ${formatTime(editForm.closingTime)}`;

      const shopUpdateData = {
        name: editForm.shopName,
        phone: editForm.phone,
        opening_hours: openingHours,
        logo_url: imagePreview,
      };

      // Owner name (users.full_name) and shop fields are different entities
      // and need separate API calls — previously ownerName was collected in
      // the form but never actually sent anywhere.
      const [profileResponse, shopResponse] = await Promise.all([
        authAPI.updateProfile({ full_name: editForm.ownerName }),
        shopAPI.updateShop(shopId, shopUpdateData),
      ]);

      if (profileResponse.data.success && shopResponse.data.success) {
        toast.success('Profile updated successfully!');
        setShowEditModal(false);
        fetchProfileData();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth!);
      localStorage.removeItem('token');
      localStorage.removeItem('shopId');
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);

      const shopId = localStorage.getItem('shopId');
      if (shopId) {
        // Deactivate shop instead of deleting
        await shopAPI.updateShop(shopId, { status: 'inactive' });
      }

      toast.success('Account deactivated successfully');
      setShowDeleteModal(false);

      // Logout after deactivation
      setTimeout(() => {
        handleLogout();
      }, 1500);

    } catch (error) {
      console.error('Error deactivating account:', error);
      toast.error('Failed to deactivate account');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" style={{ color: '#E84E0F' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faUser} />
          Profile
        </h1>
        <p className="mt-2" style={{ color: '#888888' }}>
          Manage your account information and settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl p-8" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
        {/* Shop Logo/Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full flex items-center justify-center mb-4"
               style={{ backgroundColor: '#FEF0EB', border: '3px solid #E84E0F' }}>
            {profileData.shopLogo ? (
              <img
                src={profileData.shopLogo}
                alt="Shop Logo"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FontAwesomeIcon icon={faStore} className="text-5xl" style={{ color: '#E84E0F' }} />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white">{profileData.shopName || 'Shop Name'}</h2>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>{profileData.ownerName || 'Shop Owner'}</p>
        </div>

        {/* Account Information Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-6 pb-3" style={{ borderBottom: '1px solid #222222' }}>
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Name */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faUser} style={{ color: '#E84E0F' }} />
                <span className="text-sm font-semibold" style={{ color: '#888888' }}>Shop Owner Name</span>
              </div>
              <p className="text-white font-medium">{profileData.ownerName || 'Not set'}</p>
            </div>

            {/* Email */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faEnvelope} style={{ color: '#E84E0F' }} />
                <span className="text-sm font-semibold" style={{ color: '#888888' }}>Email</span>
              </div>
              <p className="text-white font-medium">{profileData.email || 'Not set'}</p>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faPhone} style={{ color: '#E84E0F' }} />
                <span className="text-sm font-semibold" style={{ color: '#888888' }}>Phone</span>
              </div>
              <p className="text-white font-medium">{profileData.phone || 'Not set'}</p>
            </div>

            {/* Shop Name */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faStore} style={{ color: '#E84E0F' }} />
                <span className="text-sm font-semibold" style={{ color: '#888888' }}>Shop Name</span>
              </div>
              <p className="text-white font-medium">{profileData.shopName || 'Not set'}</p>
            </div>

            {/* Store Location */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#E84E0F' }} />
                  <span className="text-sm font-semibold" style={{ color: '#888888' }}>Store Location</span>
                </div>
                <Link
                  href="/dashboard/map"
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-white transition hover:opacity-80"
                  style={{ backgroundColor: '#E84E0F' }}>
                  Set Location
                </Link>
              </div>
              <p className="text-white font-medium text-sm">{profileData.storeLocation || 'Not set'}</p>
              {profileData.latitude && profileData.longitude && (
                <p className="text-xs mt-1" style={{ color: '#666666' }}>
                  Lat: {parseFloat(profileData.latitude).toFixed(4)}, Lng: {parseFloat(profileData.longitude).toFixed(4)}
                </p>
              )}
            </div>

            {/* Opening Hours */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-3 mb-2">
                <FontAwesomeIcon icon={faClock} style={{ color: '#E84E0F' }} />
                <span className="text-sm font-semibold" style={{ color: '#888888' }}>Opening Hours</span>
              </div>
              <p className="text-white font-medium">{profileData.openingHours}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleEditClick}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#E84E0F' }}>
            <FontAwesomeIcon icon={faEdit} />
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl font-semibold transition hover:opacity-80 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#F44336' }}>
            <FontAwesomeIcon icon={faTrashAlt} />
            Delete Account
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
               style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition">
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Shop Logo Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">
                  Shop Logo / Image
                </label>

                {/* Image Input Type Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setImageInputType('upload')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      imageInputType === 'upload' ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: imageInputType === 'upload' ? '#E84E0F' : '#1A1A1A',
                      border: '1px solid #333333',
                    }}>
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputType('url')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      imageInputType === 'url' ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: imageInputType === 'url' ? '#E84E0F' : '#1A1A1A',
                      border: '1px solid #333333',
                    }}>
                    <FontAwesomeIcon icon={faImage} className="mr-2" />
                    Image URL
                  </button>
                </div>

                {/* Image Upload Input */}
                {imageInputType === 'upload' && (
                  <label
                    htmlFor="logo-upload"
                    className="flex flex-col items-center justify-center w-full h-40 rounded-xl cursor-pointer hover:opacity-80 transition"
                    style={{ backgroundColor: '#1A1A1A', border: '2px dashed #333333' }}>
                    <div className="flex flex-col items-center justify-center">
                      <FontAwesomeIcon icon={faUpload} className="text-3xl mb-2" style={{ color: '#888888' }} />
                      <p className="text-sm" style={{ color: '#888888' }}>
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#666666' }}>
                        PNG, JPG, JPEG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      id="logo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}

                {/* Image URL Input */}
                {imageInputType === 'url' && (
                  <input
                    type="url"
                    value={imagePreview}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                    placeholder="https://example.com/logo.jpg"
                  />
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">Preview</span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1 rounded-lg text-white text-xs font-medium transition hover:opacity-80"
                        style={{ backgroundColor: '#F44336' }}>
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                        Remove
                      </button>
                    </div>
                    <div className="flex justify-center p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                      <img
                        src={imagePreview}
                        alt="Logo preview"
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={editForm.ownerName}
                  onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                  placeholder="Enter owner name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                  placeholder="email@example.com"
                  disabled
                />
                <p className="text-xs mt-1" style={{ color: '#666666' }}>
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                  placeholder="0701234567"
                />
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={editForm.shopName}
                  onChange={(e) => setEditForm({ ...editForm, shopName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                  placeholder="Enter shop name"
                />
              </div>

              {/* Opening Hours */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">
                  Opening Hours
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888888' }}>
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={editForm.openingTime}
                      onChange={(e) => setEditForm({ ...editForm, openingTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                      style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-2" style={{ color: '#888888' }}>
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={editForm.closingTime}
                      onChange={(e) => setEditForm({ ...editForm, closingTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                      style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                    />
                  </div>
                </div>
                <p className="text-xs mt-2" style={{ color: '#666666' }}>
                  Time will be displayed in 12-hour format with AM/PM
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition hover:opacity-80"
                  style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ backgroundColor: '#E84E0F' }}>
                  <FontAwesomeIcon icon={saving ? faSpinner : faSave} className={saving ? 'animate-spin' : ''} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl p-8 max-w-md w-full"
               style={{ backgroundColor: '#111111', border: '2px solid #F44336' }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl" style={{ color: '#F44336' }} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Delete Account</h2>
              <p style={{ color: '#888888' }}>
                Are you sure you want to deactivate your account?
              </p>
            </div>

            <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
              <div className="flex items-start gap-3">
                <FontAwesomeIcon icon={faCheckCircle} className="mt-1" style={{ color: '#E84E0F' }} />
                <div>
                  <p className="text-sm text-white font-semibold mb-1">What happens when you deactivate:</p>
                  <ul className="text-xs space-y-1" style={{ color: '#888888' }}>
                    <li>• Your account will be set to inactive status</li>
                    <li>• You won't be able to log in</li>
                    <li>• Your shop will not be visible to customers</li>
                    <li>• Admin can reactivate your account later</li>
                    <li>• Your data will be preserved</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition hover:opacity-80"
                style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#F44336' }}>
                <FontAwesomeIcon icon={saving ? faSpinner : faTrashAlt} className={saving ? 'animate-spin' : ''} />
                {saving ? 'Deactivating...' : 'Yes, Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}