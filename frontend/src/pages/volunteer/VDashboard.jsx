import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Package, Clock, CheckCircle, Navigation, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VDashboard = () => {
    const { publicAxiosInstance } = useOutletContext();
    const [activeTab, setActiveTab] = useState('available');
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [volunteerLocation, setVolunteerLocation] = useState(null);
    const [volunteerProfile, setVolunteerProfile] = useState(null);

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

    const fetchData = async () => {
        setLoading(true);
        try {
            const volunteerId = localStorage.getItem('roleId');
            if (volunteerId) {
                const profileRes = await publicAxiosInstance.get(`/volunteer/${volunteerId}`);
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
            setDonations(donationsRes.data);

            // Fetch Requests
            const requestsRes = await publicAxiosInstance.get('/request/all');
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

    const handleAcceptDelivery = async (item, type) => {
        if (!confirm("Are you sure you want to accept this delivery?")) return;

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
                // Update request status - RequestController doesn't have PATCH status, so we use PUT update
                const updatedRequest = { ...item, status: 'out_for_delivery' };
                await publicAxiosInstance.put(`/request/update/${item.id}`, updatedRequest);
            }

            toast.success("Delivery accepted! Status updated to 'Out for Delivery'.");
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error accepting delivery:", error);
            toast.error("Failed to accept delivery");
        }
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
            // Pending or Approved items (Ready for pickup)
            // Assuming 'approved' means ready for volunteer, 'pending' might need admin approval first?
            // Let's assume 'approved' is the state where volunteers can pick up.
            // Or maybe 'pending' is okay too if no admin approval flow is strictly enforced yet.
            // Let's show 'approved' and 'pending' for now, or just 'approved' if admin workflow exists.
            // Based on previous context, admin approves things. So volunteers should see 'approved'.
            items = [
                ...normDonations.filter(d => d.status === 'approved' || d.status === 'pending'),
                ...normRequests.filter(r => r.status === 'approved' || r.status === 'pending')
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

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {volunteerLocation ? "Location Active" : "Locating..."}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats / Welcome */}
                <div className="bg-green-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {volunteerProfile?.name || 'Volunteer'}!</h2>
                    <p className="text-green-100">You are making a difference. There are {filteredItems.length} items in this list.</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'available' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Available for Pickup
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Active Deliveries
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Delivery History
                    </button>
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
                                    {item.distance !== Infinity && (
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
                                            onClick={() => handleAcceptDelivery(item, item.type)}
                                            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Accept Delivery
                                        </button>
                                    )}

                                    {activeTab === 'active' && (
                                        <button
                                            onClick={() => handleCompleteDelivery(item, item.type)}
                                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Mark Delivered
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
            </div>
        </div>
    );
};

export default VDashboard;