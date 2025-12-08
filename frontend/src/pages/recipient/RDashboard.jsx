import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import RequestList from '../../Components/recipient/RequestList';
import DonationFeed from '../../Components/recipient/DonationFeed';
import RecipientProfile from '../../Components/recipient/RecipientProfile';
import RecipientOrderDetails from '../../Components/recipient/RecipientOrderDetails';
import { List, User, Heart, AlertCircle, Package } from 'lucide-react';

const RDashboard = () => {
  const { publicAxiosInstance } = useOutletContext();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('recipient_active_tab') || 'profile';
  });
  const [recipientId, setRecipientId] = useState(null);

  const [recipientProfile, setRecipientProfile] = useState(null);
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recipient_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (recipientProfile && recipientProfile.status !== 'verified' && activeTab === 'requests') {
      setActiveTab('profile');
    }
  }, [recipientProfile, activeTab]);

  useEffect(() => {
    const storedRoleId = localStorage.getItem('roleId');
    if (storedRoleId) {
      setRecipientId(parseInt(storedRoleId));

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
      publicAxiosInstance.get(`/recipient/${storedRoleId}`)
        .then(res => {
          setRecipientProfile(res.data);
          // Fallback: if profile has all docs but localStorage says false (or is missing), update it
          if (res.data.photo && res.data.organizationCertificate && res.data.signature) {
            if (localStorage.getItem('document_uploaded') !== 'true') {
              localStorage.setItem('document_uploaded', 'true');
              setIsDocumentUploaded(true);
            }
          }
        })
        .catch(err => console.error("Error fetching recipient profile:", err));
    }
  }, [publicAxiosInstance]);

  const handleDocumentUploadSuccess = () => {
    setIsDocumentUploaded(true);
    // Optional: switch to requests tab automatically after upload
    // setActiveTab('requests');
  };

  if (!recipientId) {
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
                <h1 className="text-2xl font-bold text-gray-900">Recipient Dashboard</h1>
              </div>
            </div>
            {/* Profile Photo in Header */}
            <div className="flex items-center">
              {recipientProfile && recipientProfile.photo ? (
                <img
                  src={`http://localhost:8080${recipientProfile.photo}`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border-2 border-green-500">
                  {recipientProfile?.name?.charAt(0) || <User className="w-6 h-6" />}
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
              Please complete your profile and upload all required documents to access request features.
            </p>
          </div>
        )}

        {isDocumentUploaded && recipientProfile?.status !== 'verified' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 text-yellow-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              Your account is pending verification. You will be able to add requests once verified.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => isDocumentUploaded && recipientProfile?.status === 'verified' && setActiveTab('requests')}
            disabled={!isDocumentUploaded || recipientProfile?.status !== 'verified'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'requests'
              ? 'bg-green-100 text-green-700 shadow-sm'
              : isDocumentUploaded && recipientProfile?.status === 'verified'
                ? 'text-gray-600 hover:bg-gray-50'
                : 'text-gray-400 cursor-not-allowed opacity-60'
              }`}
          >
            <List className="w-5 h-5" />
            My Requests
          </button>
          <button
            onClick={() => isDocumentUploaded && setActiveTab('donations')}
            disabled={!isDocumentUploaded}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'donations'
              ? 'bg-green-100 text-green-700 shadow-sm'
              : isDocumentUploaded
                ? 'text-gray-600 hover:bg-gray-50'
                : 'text-gray-400 cursor-not-allowed opacity-60'
              }`}
          >
            <Heart className="w-5 h-5" />
            Donations Feed
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
          {activeTab === 'requests' && <RequestList recipientId={recipientId} axios={publicAxiosInstance} recipientProfile={recipientProfile} />}
          {activeTab === 'donations' && <DonationFeed axios={publicAxiosInstance} />}
          {activeTab === 'orders' && <RecipientOrderDetails axios={publicAxiosInstance} recipientId={recipientId} />}
          {activeTab === 'profile' && <RecipientProfile recipientId={recipientId} axios={publicAxiosInstance} onUploadSuccess={handleDocumentUploadSuccess} />}
        </div>
      </div>
    </div>
  );
};

export default RDashboard;