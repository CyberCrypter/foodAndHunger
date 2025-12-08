import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Package, Clock, CheckCircle, Navigation, AlertCircle, User, TruckIcon, X, Phone, Mail, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import VolunteerProfile from '../../Components/volunteer/VolunteerProfile';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VDashboard = () => {
    const { publicAxiosInstance } = useOutletContext();
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('volunteer_active_tab') || 'profile';
    });
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [volunteerLocation, setVolunteerLocation] = useState(null);
    const [volunteerProfile, setVolunteerProfile] = useState(null);
    const [volunteerId, setVolunteerId] = useState(null);
    const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemType, setSelectedItemType] = useState(null);
    const [donorDetails, setDonorDetails] = useState(null);
    const [recipientDetails, setRecipientDetails] = useState(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationViewType, setLocationViewType] = useState(null); // 'volunteer-to-donor', 'donor-to-recipient'

    // Helper to calculate distance (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    // Save active tab to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('volunteer_active_tab', activeTab);
    }, [activeTab]);

    // Redirect to profile if not verified and trying to access other tabs
    useEffect(() => {
        if (volunteerProfile && volunteerProfile.status !== 'APPROVED' && activeTab !== 'profile') {
            setActiveTab('profile');
        }
    }, [volunteerProfile, activeTab]);

    // Initialize volunteer ID and check document status
    useEffect(() => {
        const storedRoleId = localStorage.getItem('roleId');
        if (storedRoleId) {
            setVolunteerId(parseInt(storedRoleId));

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
            publicAxiosInstance.get(`/volunteer/${storedRoleId}`)
                .then(res => {
                    setVolunteerProfile(res.data);
                    // Fallback: if profile has all docs but localStorage says false (or is missing), update it
                    if (res.data.profilePhotoUrl && res.data.aadhaarCard && res.data.panCard) {
                        if (localStorage.getItem('document_uploaded') !== 'true') {
                            localStorage.setItem('document_uploaded', 'true');
                            setIsDocumentUploaded(true);
                        }
                    }
                })
                .catch(err => console.error("Error fetching volunteer profile:", err));
        }
    }, [publicAxiosInstance]);

    const handleDocumentUploadSuccess = () => {
        setIsDocumentUploaded(true);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const storedVolunteerId = localStorage.getItem('roleId');
            if (storedVolunteerId) {
                const profileRes = await publicAxiosInstance.get(`/volunteer/${storedVolunteerId}`);
                setVolunteerProfile(profileRes.data);
                if (profileRes.data.latitude && profileRes.data.longitude) {
                    setVolunteerLocation({
                        lat: profileRes.data.latitude,
                        lng: profileRes.data.longitude
                    });
                }
            }

            // Fetch Donations
            const donationsRes = await publicAxiosInstance.get('/donation/all');
            // Filter only admin-approved donations and exclude completed ones
            // const approvedDonations = donationsRes.data.filter(d =>
            //     (d.approved === true || d.status === 'approved') && d.status !== 'completed'
            // );
            // setDonations(approvedDonations);
            setDonations(donationsRes.data);

            // Fetch Requests
            const requestsRes = await publicAxiosInstance.get('/request/all');
            // Filter only admin-approved donations and exclude completed ones
            // const approvedRequests = requestsRes.data.filter(d =>
            //     (d.approved === true || d.status === 'approved') && d.status !== 'completed'
            // );
            // setRequests(approvedRequests);
            setRequests(requestsRes.data);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Get current location if profile location is missing
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setVolunteerLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.log("Geolocation error:", error)
            );
        }
    }, []);

    const openDetailsModal = async (item, type) => {
        setSelectedItem(item);
        setSelectedItemType(type);
        
        try {
            // Fetch donor and recipient details based on item type
            if (type === 'donation') {
                // For donations: try to fetch donor details
                // The donation should have donorId, but let's be safe
                if (item.donorId) {
                    try {
                        const donorRes = await publicAxiosInstance.get(`/donor/${item.donorId}`);
                        setDonorDetails(donorRes.data);
                        console.log("Found donor from donorId:", donorRes.data);
                    } catch (err) {
                        console.error("Error fetching donor by ID:", err);
                        // Use fallback donor with item's location
                        const fallbackDonor = {
                            name: "Donor",
                            phone: "N/A",
                            email: "N/A",
                            address: item.address || "Unknown",
                            latitude: Number(item.latitude) || 0,
                            longitude: Number(item.longitude) || 0
                        };
                        setDonorDetails(fallbackDonor);
                        console.log("Using fallback donor (error):", fallbackDonor);
                    }
                } else {
                    // No donorId available, use fallback
                    const fallbackDonor = {
                        name: "Donor",
                        phone: "N/A",
                        email: "N/A",
                        address: item.address || "Unknown",
                        latitude: Number(item.latitude) || 0,
                        longitude: Number(item.longitude) || 0
                    };
                    setDonorDetails(fallbackDonor);
                    console.log("Using fallback donor (no donorId):", fallbackDonor);
                }
                
                // For donations with status 'requested' or 'out_for_delivery', find the recipient
                // First try to extract recipientId from remarks
                let recipientId = null;
                if (item.remarks) {
                    const match = item.remarks.match(/recipient ID: (\d+)/i);
                    if (match) {
                        recipientId = match[1];
                        console.log("Found recipientId in remarks:", recipientId);
                    }
                }
                
                if (item.status === 'requested' || item.status === 'out_for_delivery' || item.status === 'readytodonate') {
                    let recipientFetched = false;
                    
                    if (recipientId) {
                        // We have the recipientId from remarks
                        try {
                            const recipientRes = await publicAxiosInstance.get(`/recipient/${recipientId}`);
                            setRecipientDetails(recipientRes.data);
                            recipientFetched = true;
                            console.log("Found recipient from remarks:", recipientRes.data);
                        } catch (err) {
                            console.error("Error fetching recipient by ID:", err);
                            // Fall through to matching logic
                        }
                    }
                    
                    // If we still don't have recipient details, try matching logic
                    if (!recipientFetched) {
                        try {
                            // Get all requests to find which recipient might have matched
                            const requestsRes = await publicAxiosInstance.get('/request/all');
                            // Find requests that are in progress and match the food type
                            const matchedRequests = requestsRes.data.filter(r => 
                                (r.status === 'readytodonate' || r.status === 'out_for_delivery' || r.status === 'completed') &&
                                r.type?.toLowerCase() === item.type?.toLowerCase()
                            );
                            
                            console.log(`Found ${matchedRequests.length} matching requests for donation`, item.id);
                            
                            // Try to find the best match - prefer same status
                            let matchedRequest = matchedRequests.find(r => r.status === item.status);
                            if (!matchedRequest && matchedRequests.length > 0) {
                                matchedRequest = matchedRequests[0]; // Use first match
                            }
                            
                            if (matchedRequest && matchedRequest.recipientId) {
                                const recipientRes = await publicAxiosInstance.get(`/recipient/${matchedRequest.recipientId}`);
                                setRecipientDetails(recipientRes.data);
                                console.log("Found recipient from matching:", recipientRes.data);
                            } else {
                                // Fallback: use the item's location as recipient location
                                const fallbackRecipient = {
                                    name: "Recipient",
                                    phone: "N/A",
                                    email: "N/A",
                                    address: item.address || "Unknown",
                                    latitude: Number(item.latitude) || 0,
                                    longitude: Number(item.longitude) || 0
                                };
                                setRecipientDetails(fallbackRecipient);
                                console.log("Using fallback recipient:", fallbackRecipient);
                            }
                        } catch (err) {
                            console.error("Error finding recipient:", err);
                            const fallbackRecipient = {
                                name: "Recipient",
                                phone: "N/A",
                                email: "N/A",
                                address: item.address || "Unknown",
                                latitude: Number(item.latitude) || 0,
                                longitude: Number(item.longitude) || 0
                            };
                            setRecipientDetails(fallbackRecipient);
                            console.log("Using fallback recipient (error):", fallbackRecipient);
                        }
                    }
                } else {
                    setRecipientDetails(null);
                }
            } else {
                console.log("Processing REQUEST type item");
                // For requests: always has recipientId, item location is recipient's location
                try {
                    const recipientRes = await publicAxiosInstance.get(`/recipient/${item.recipientId}`);
                    setRecipientDetails(recipientRes.data);
                    console.log("✓ Found recipient from recipientId:", recipientRes.data);
                } catch (err) {
                    console.error("✗ Error fetching recipient:", err);
                    const fallbackRecipient = {
                        name: "Recipient",
                        phone: "N/A",
                        email: "N/A",
                        address: item.address || "Unknown",
                        latitude: Number(item.latitude) || 0,
                        longitude: Number(item.longitude) || 0
                    };
                    setRecipientDetails(fallbackRecipient);
                }
                
                // For requests with status 'readytodonate' or 'out_for_delivery', find the donor
                // First try to get donorId directly from the item, then from remarks
                let donorId = item.donorId; // Direct field from request
                
                console.log("Request item:", item);
                console.log("DonorId from item.donorId:", donorId);
                console.log("Remarks:", item.remarks);
                
                if (!donorId && item.remarks) {
                    const match = item.remarks.match(/donor ID: (\d+)/i);
                    if (match) {
                        donorId = match[1];
                        console.log("✓ Found donorId in remarks:", donorId);
                    }
                }
                
                if (donorId) {
                    console.log("✓ DonorId available:", donorId);
                } else {
                    console.warn("✗ No donorId found in item or remarks");
                }
                
                // ALWAYS try to fetch donor for readytodonate, out_for_delivery, or requested status
                if (item.status === 'readytodonate' || item.status === 'out_for_delivery' || item.status === 'requested') {
                    console.log("Status requires donor info:", item.status);
                    let donorFetched = false;
                    
                    if (donorId) {
                        // We have the donorId (from field or remarks)
                        try {
                            console.log("Attempting to fetch donor with ID:", donorId);
                            const donorRes = await publicAxiosInstance.get(`/donor/${donorId}`);
                            setDonorDetails(donorRes.data);
                            donorFetched = true;
                            console.log("✓ Successfully fetched donor:", donorRes.data);
                        } catch (err) {
                            console.error("✗ Error fetching donor by ID:", err.response?.data || err.message);
                            // Fall through to matching logic
                        }
                    } else {
                        console.log("Skipping direct donor fetch - no donorId available");
                    }
                    
                    // If we still don't have donor details, try matching logic
                    if (!donorFetched) {
                        console.log("Attempting fallback matching logic for donor");
                        try {
                            // Get all donations to find which donor might have matched
                            const donationsRes = await publicAxiosInstance.get('/donation/all');
                            const matchedDonation = donationsRes.data.find(d => 
                                (d.status === 'requested' || d.status === 'out_for_delivery' || d.status === 'completed') &&
                                d.type?.toLowerCase() === item.type?.toLowerCase()
                            );
                            
                            if (matchedDonation && matchedDonation.donorId) {
                                const donorRes = await publicAxiosInstance.get(`/donor/${matchedDonation.donorId}`);
                                setDonorDetails(donorRes.data);
                                donorFetched = true;
                                console.log("✓ Found donor via matching:", donorRes.data);
                            } else {
                                console.log("No matching donation found");
                            }
                        } catch (err) {
                            console.error("✗ Error in matching logic:", err);
                        }
                    }
                    
                    // Final fallback - set placeholder donor if still not fetched
                    if (!donorFetched) {
                        console.log("Using fallback donor (no donor found via any method)");
                        const fallbackDonor = {
                            name: "Donor",
                            phone: "N/A",
                            email: "N/A",
                            address: item.address || "Unknown",
                            latitude: Number(item.latitude) || 0,
                            longitude: Number(item.longitude) || 0
                        };
                        setDonorDetails(fallbackDonor);
                    }
                } else {
                    console.log("Status doesn't require donor info:", item.status);
                    setDonorDetails(null);
                }
            }
            
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching details:", error);
            toast.error("Failed to load details");
        }
    };

    const handleAcceptDelivery = async (item, type) => {
        try {
            const volunteerId = localStorage.getItem('roleId');
            const volunteerName = volunteerProfile?.name || "Volunteer";

            if (type === 'donation') {
                // Update donation status
                await publicAxiosInstance.patch(`/donation/${item.id}/status`, null, {
                    params: {
                        status: 'out_for_delivery',
                        remarks: `Accepted by ${volunteerName} (ID: ${volunteerId})`
                    }
                });
            } else {
                // Update request status
                const updatedRequest = { ...item, status: 'out_for_delivery' };
                await publicAxiosInstance.put(`/request/update/${item.id}`, updatedRequest);
            }

            toast.success("Delivery accepted! Status updated to 'Out for Delivery'.");
            setShowModal(false);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error accepting delivery:", error);
            toast.error("Failed to accept delivery");
        }
    };

    const handleAcceptDeliveryFromModal = () => {
        handleAcceptDelivery(selectedItem, selectedItemType);
    };

    const handleViewLocation = (viewType) => {
        setLocationViewType(viewType);
        setShowLocationModal(true);
    };

    const handleCompleteDelivery = async (item, type) => {
        if (!confirm("Confirm delivery completion?")) return;

        try {
            if (type === 'donation') {
                await publicAxiosInstance.patch(`/donation/${item.id}/status`, null, {
                    params: { status: 'completed' }
                });
            } else {
                const updatedRequest = { ...item, status: 'completed' };
                await publicAxiosInstance.put(`/request/update/${item.id}`, updatedRequest);
            }
            toast.success("Delivery completed successfully!");
            fetchData();
        } catch (error) {
            console.error("Error completing delivery:", error);
            toast.error("Failed to complete delivery");
        }
    };

    // Filter and sort items
    const getFilteredItems = () => {
        let items = [];

        // Normalize items
        const normDonations = donations.map(d => ({ ...d, type: 'donation', itemType: d.type }));
        const normRequests = requests.map(r => ({ ...r, type: 'request', itemType: r.type }));

        if (activeTab === 'available') {
            // Ready for pickup: 'requested' (recipient requested donation) or 'readytodonate' (donor donated to request)
            items = [
                ...normDonations.filter(d => d.status === 'requested' || d.status === 'readytodonate'),
                ...normRequests.filter(r => r.status === 'requested' || r.status === 'readytodonate')
            ];
        } else if (activeTab === 'active') {
            // Out for delivery
            items = [
                ...normDonations.filter(d => d.status === 'out_for_delivery'),
                ...normRequests.filter(r => r.status === 'out_for_delivery')
            ];
        } else if (activeTab === 'history') {
            // Completed
            items = [
                ...normDonations.filter(d => d.status === 'completed'),
                ...normRequests.filter(r => r.status === 'completed')
            ];
        }

        // Calculate distance and sort
        if (volunteerLocation) {
            items = items.map(item => ({
                ...item,
                distance: calculateDistance(volunteerLocation.lat, volunteerLocation.lng, item.latitude, item.longitude)
            })).sort((a, b) => a.distance - b.distance);
        }

        return items;
    };

    const filteredItems = getFilteredItems();

    if (loading) return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
    
    if (!volunteerId) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
                        {/* Profile Photo in Header */}
                        <div className="flex items-center gap-3">
                            {activeTab !== 'profile' && (
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {volunteerLocation ? "Location Active" : "Locating..."}
                                </div>
                            )}
                            {volunteerProfile && volunteerProfile.profilePhotoUrl ? (
                                <img
                                    src={`http://localhost:8080${volunteerProfile.profilePhotoUrl}`}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-blue-500">
                                    {volunteerProfile?.name?.charAt(0) || <User className="w-6 h-6" />}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Warning Banners */}
                {!isDocumentUploaded && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">
                            Please complete your profile and upload all required documents to access volunteer features.
                        </p>
                    </div>
                )}

                {isDocumentUploaded && volunteerProfile?.status !== 'APPROVED' && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 text-yellow-700">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">
                            Your account is pending verification. You will be able to access volunteer features once approved.
                        </p>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm p-2 mb-8 inline-flex gap-2">
                    <button
                        onClick={() => isDocumentUploaded && volunteerProfile?.status === 'APPROVED' && setActiveTab('available')}
                        disabled={!isDocumentUploaded || volunteerProfile?.status !== 'APPROVED'}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            activeTab === 'available'
                                ? 'bg-green-100 text-green-700 shadow-sm'
                                : isDocumentUploaded && volunteerProfile?.status === 'APPROVED'
                                ? 'text-gray-600 hover:bg-gray-50'
                                : 'text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                    >
                        <Package className="w-5 h-5" />
                        Available for Pickup
                    </button>
                    <button
                        onClick={() => isDocumentUploaded && volunteerProfile?.status === 'APPROVED' && setActiveTab('active')}
                        disabled={!isDocumentUploaded || volunteerProfile?.status !== 'APPROVED'}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            activeTab === 'active'
                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                : isDocumentUploaded && volunteerProfile?.status === 'APPROVED'
                                ? 'text-gray-600 hover:bg-gray-50'
                                : 'text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                    >
                        <TruckIcon className="w-5 h-5" />
                        Active Deliveries
                    </button>
                    <button
                        onClick={() => isDocumentUploaded && volunteerProfile?.status === 'APPROVED' && setActiveTab('history')}
                        disabled={!isDocumentUploaded || volunteerProfile?.status !== 'APPROVED'}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            activeTab === 'history'
                                ? 'bg-gray-800 text-white shadow-sm'
                                : isDocumentUploaded && volunteerProfile?.status === 'APPROVED'
                                ? 'text-gray-600 hover:bg-gray-50'
                                : 'text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                    >
                        <Clock className="w-5 h-5" />
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            activeTab === 'profile'
                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <User className="w-5 h-5" />
                        Profile
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'profile' ? (
                    <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[500px]">
                        <VolunteerProfile volunteerId={volunteerId} axios={publicAxiosInstance} onUploadSuccess={handleDocumentUploadSuccess} />
                    </div>
                ) : (
                    <>
                        {/* Stats / Welcome */}
                        <div className="bg-green-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
                            <h2 className="text-3xl font-bold mb-2">Welcome back, {volunteerProfile?.name || 'Volunteer'}!</h2>
                            <p className="text-green-100">You are making a difference. There are {filteredItems.length} items in this list.</p>
                        </div>

                        {/* List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <div key={`${item.type}-${item.id}`} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                        <div className="h-48 bg-gray-200 relative">
                                            {item.photo ? (
                                                <img
                                                    src={`http://localhost:8080${item.photo}`}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Package className="w-12 h-12" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                                                {item.type}
                                            </div>
                                            {typeof item.distance === 'number' && item.distance !== Infinity && (
                                                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                                    <Navigation className="w-3 h-3" />
                                                    {item.distance.toFixed(1)} km away
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                                                        item.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>

                                            <div className="space-y-2 text-sm text-gray-500 mb-6">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{item.address}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 shrink-0" />
                                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {activeTab === 'available' && (
                                                <button
                                                    onClick={() => openDetailsModal(item, item.type)}
                                                    className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    Accept Delivery
                                                </button>
                                            )}

                                            {activeTab === 'active' && (
                                                <button
                                                    onClick={() => openDetailsModal(item, item.type)}
                                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                    View Details
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                                    <p className="text-gray-500">There are no items in this category at the moment.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Details Modal */}
            {showModal && selectedItem && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Item Details */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Item Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">{selectedItem.title}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{selectedItem.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">{selectedItem.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Donor Details */}
                            {donorDetails && (
                                <div className="bg-green-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Donor Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium">{donorDetails.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-gray-600">{donorDetails.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-gray-600">{donorDetails.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-gray-600">{donorDetails.address}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recipient Details */}
                            {recipientDetails && (
                                <div className="bg-orange-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Recipient Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm font-medium">{recipientDetails.name}</span>
                                        </div>
                                        {recipientDetails.phone && recipientDetails.phone !== "N/A" && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-orange-600" />
                                                <span className="text-sm text-gray-600">{recipientDetails.phone}</span>
                                            </div>
                                        )}
                                        {recipientDetails.email && recipientDetails.email !== "N/A" && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-orange-600" />
                                                <span className="text-sm text-gray-600">{recipientDetails.email}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm text-gray-600">{recipientDetails.address}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Distance Information for Active Deliveries */}
                            {activeTab === 'active' && donorDetails && recipientDetails && (
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Route Information</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">Donor to Recipient Distance:</span>
                                        <span className="text-sm font-bold text-blue-600">
                                            {calculateDistance(
                                                donorDetails.latitude,
                                                donorDetails.longitude,
                                                recipientDetails.latitude,
                                                recipientDetails.longitude
                                            ).toFixed(2)} km
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 pt-4">
                                {activeTab === 'available' ? (
                                    <>
                                        <button
                                            onClick={() => handleViewLocation('volunteer-to-donor')}
                                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Navigation className="w-5 h-5" />
                                            View Location
                                        </button>
                                        <button
                                            onClick={handleAcceptDeliveryFromModal}
                                            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Accept Delivery
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleViewLocation('volunteer-to-donor')}
                                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Navigation className="w-5 h-5" />
                                            View Location of Donor
                                        </button>
                                        <button
                                            onClick={() => handleViewLocation('volunteer-to-recipient')}
                                            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Navigation className="w-5 h-5" />
                                            View Location of Recipient
                                        </button>
                                        <button
                                            onClick={() => handleCompleteDelivery(selectedItem, selectedItemType)}
                                            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Mark Delivered
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Modal */}
            {showLocationModal && selectedItem && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {locationViewType === 'volunteer-to-donor' ? 'Route to Donor' : 
                                 locationViewType === 'volunteer-to-recipient' ? 'Route to Recipient' :
                                 'Route from Donor to Recipient'}
                            </h2>
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="h-96 rounded-xl overflow-hidden border">
                                {locationViewType === 'volunteer-to-donor' && volunteerLocation && donorDetails && (
                                    <MapContainer
                                        center={[volunteerLocation.lat, volunteerLocation.lng]}
                                        zoom={12}
                                        className="h-full w-full"
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[volunteerLocation.lat, volunteerLocation.lng]}>
                                            <Popup>Your Location</Popup>
                                        </Marker>
                                        <Marker position={[donorDetails.latitude, donorDetails.longitude]}>
                                            <Popup>Donor Location</Popup>
                                        </Marker>
                                        <Polyline
                                            positions={[
                                                [volunteerLocation.lat, volunteerLocation.lng],
                                                [donorDetails.latitude, donorDetails.longitude]
                                            ]}
                                            color="blue"
                                            weight={3}
                                        />
                                    </MapContainer>
                                )}
                                {locationViewType === 'volunteer-to-recipient' && volunteerLocation && recipientDetails && recipientDetails.latitude && recipientDetails.longitude && (
                                    <MapContainer
                                        center={[volunteerLocation.lat, volunteerLocation.lng]}
                                        zoom={12}
                                        className="h-full w-full"
                                        key={`volunteer-recipient-${recipientDetails.latitude}-${recipientDetails.longitude}`}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[volunteerLocation.lat, volunteerLocation.lng]}>
                                            <Popup>Your Location</Popup>
                                        </Marker>
                                        <Marker position={[recipientDetails.latitude, recipientDetails.longitude]}>
                                            <Popup>Recipient Location</Popup>
                                        </Marker>
                                        <Polyline
                                            positions={[
                                                [volunteerLocation.lat, volunteerLocation.lng],
                                                [recipientDetails.latitude, recipientDetails.longitude]
                                            ]}
                                            color="purple"
                                            weight={3}
                                        />
                                    </MapContainer>
                                )}
                                {locationViewType === 'donor-to-recipient' && donorDetails && recipientDetails && (
                                    <MapContainer
                                        center={[donorDetails.latitude, donorDetails.longitude]}
                                        zoom={12}
                                        className="h-full w-full"
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[donorDetails.latitude, donorDetails.longitude]}>
                                            <Popup>Donor Location</Popup>
                                        </Marker>
                                        <Marker position={[recipientDetails.latitude, recipientDetails.longitude]}>
                                            <Popup>Recipient Location</Popup>
                                        </Marker>
                                        <Polyline
                                            positions={[
                                                [donorDetails.latitude, donorDetails.longitude],
                                                [recipientDetails.latitude, recipientDetails.longitude]
                                            ]}
                                            color="purple"
                                            weight={3}
                                        />
                                    </MapContainer>
                                )}
                            </div>

                            <div className="mt-4 bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Distance:</span>
                                    <span className="text-sm text-gray-900 font-semibold">
                                        {locationViewType === 'volunteer-to-donor' && volunteerLocation && donorDetails
                                            ? `${calculateDistance(volunteerLocation.lat, volunteerLocation.lng, donorDetails.latitude, donorDetails.longitude).toFixed(2)} km`
                                            : locationViewType === 'volunteer-to-recipient' && volunteerLocation && recipientDetails
                                            ? `${calculateDistance(volunteerLocation.lat, volunteerLocation.lng, recipientDetails.latitude, recipientDetails.longitude).toFixed(2)} km`
                                            : locationViewType === 'donor-to-recipient' && donorDetails && recipientDetails
                                            ? `${calculateDistance(donorDetails.latitude, donorDetails.longitude, recipientDetails.latitude, recipientDetails.longitude).toFixed(2)} km`
                                            : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="w-full mt-4 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default VDashboard;