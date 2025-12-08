import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DonationList from '../../Components/donor/DonationList';
import RequestFeed from '../../Components/donor/RequestFeed';
import DonorProfile from '../../Components/donor/DonorProfile';
import OrderDetails from '../../Components/donor/OrderDetails';
import { Heart, List, User, AlertCircle, Package } from 'lucide-react';

const DDashboard = () => {
  const { publicAxiosInstance } = useOutletContext();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('donor_active_tab') || 'profile';
  });
  const [donorId, setDonorId] = useState(null);

  const [donorProfile, setDonorProfile] = useState(null);
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('donor_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (donorProfile && donorProfile.status !== 'verified' && activeTab === 'donations') {
      setActiveTab('profile');
    }
  }, [donorProfile, activeTab]);

  useEffect(() => {
    const storedRoleId = localStorage.getItem('roleId');
    if (storedRoleId) {
      setDonorId(parseInt(storedRoleId));

      // Check localStorage for document status initially
      const storedDocStatus = localStorage.getItem('document_uploaded');
      if (storedDocStatus === 'true') {
        setIsDocumentUploaded(true);
      } else {
        setIsDocumentUploaded(false);
        // If not explicitly true in localStorage, default to profile tab
        setActiveTab('profile');
      }

      // Fetch profile to check document status (fallback/sync)
      publicAxiosInstance.get(`/donor/${storedRoleId}`)
        .then(res => {
          setDonorProfile(res.data);
          // Fallback: if profile has all docs but localStorage says false (or is missing), update it
          if (res.data.photo && res.data.organizationCertificate && res.data.signature) {
            if (localStorage.getItem('document_uploaded') !== 'true') {
              localStorage.setItem('document_uploaded', 'true');
              setIsDocumentUploaded(true);
            }
          }
        })
        .catch(err => console.error("Error fetching donor profile:", err));
    }
  }, [publicAxiosInstance]);

  const handleDocumentUploadSuccess = () => {
    setIsDocumentUploaded(true);
    // Optional: switch to donations tab automatically after upload
    // setActiveTab('donations'); 
  };

  if (!donorId) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
              </div>
            </div>
            {/* Profile Photo in Header */}
            <div className="flex items-center">
              {donorProfile && donorProfile.photo ? (
                <img
                  src={`http://localhost:8080${donorProfile.photo}`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border-2 border-green-500">
                  {donorProfile?.name?.charAt(0) || <User className="w-6 h-6" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isDocumentUploaded && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              Please complete your profile and upload all required documents to access donation features.
            </p>
          </div>
        )}

        {isDocumentUploaded && donorProfile?.status !== 'verified' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 text-yellow-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              Your account is pending verification. You will be able to add donations once verified.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => isDocumentUploaded && donorProfile?.status === 'verified' && setActiveTab('donations')}
            disabled={!isDocumentUploaded || donorProfile?.status !== 'verified'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'donations'
              ? 'bg-green-100 text-green-700 shadow-sm'
              : isDocumentUploaded && donorProfile?.status === 'verified'
                ? 'text-gray-600 hover:bg-gray-50'
                : 'text-gray-400 cursor-not-allowed opacity-60'
              }`}
          >
            <Heart className="w-5 h-5" />
            My Donations
          </button>
          <button
            onClick={() => isDocumentUploaded && setActiveTab('requests')}
            disabled={!isDocumentUploaded}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'requests'
              ? 'bg-green-100 text-green-700 shadow-sm'
              : isDocumentUploaded
                ? 'text-gray-600 hover:bg-gray-50'
                : 'text-gray-400 cursor-not-allowed opacity-60'
              }`}
          >
            <List className="w-5 h-5" />
            Requests Feed
          </button>
          <button
            onClick={() => isDocumentUploaded && setActiveTab('orders')}
            disabled={!isDocumentUploaded}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'orders'
              ? 'bg-green-100 text-green-700 shadow-sm'
              : isDocumentUploaded
                ? 'text-gray-600 hover:bg-gray-50'
                : 'text-gray-400 cursor-not-allowed opacity-60'
              }`}
          >
            <Package className="w-5 h-5" />
            Order Details
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'profile'
              ? 'bg-green-100 text-green-700 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <User className="w-5 h-5" />
            Profile
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
          {activeTab === 'donations' && <DonationList donorId={donorId} axios={publicAxiosInstance} donorProfile={donorProfile} />}
          {activeTab === 'requests' && <RequestFeed axios={publicAxiosInstance} />}
          {activeTab === 'orders' && <OrderDetails axios={publicAxiosInstance} donorId={donorId} />}
          {activeTab === 'profile' && <DonorProfile donorId={donorId} axios={publicAxiosInstance} onUploadSuccess={handleDocumentUploadSuccess} />}
        </div>
      </div>
    </div>
  );
};

export default DDashboard;