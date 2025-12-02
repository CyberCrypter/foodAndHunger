import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, User } from 'lucide-react';

const RequestFeed = ({ axios }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'food', 'medical', etc.
    const [userLocation, setUserLocation] = useState(null);
    const [sortByDistance, setSortByDistance] = useState(false);

    // Haversine formula to calculate distance in km
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

    const handleNearMe = () => {
        if (sortByDistance) {
            setSortByDistance(false);
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setSortByDistance(true);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Please allow location access to use 'Near Me' filter.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Assuming /api/request/all exists based on RequestController
                const res = await axios.get('/request/all');
                
                // Filter only admin-approved requests
                const approvedRequests = res.data.filter(request => 
                    request.approved === true || request.status === 'approved'
                );
                
                setRequests(approvedRequests);
            } catch (error) {
                console.error("Error fetching requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const filteredRequests = (filter === 'all'
        ? requests
        : requests.filter(req => req.type?.toLowerCase() === filter.toLowerCase()))
        .sort((a, b) => {
            if (!sortByDistance || !userLocation) return 0;
            const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
            const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
            return distA - distB;
        });

    if (loading) return <div className="text-center py-8">Loading requests...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Recipient Requests</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleNearMe}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${sortByDistance
                            ? 'bg-green-600 text-white'
                            : 'bg-white border text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <MapPin className="w-4 h-4" />
                        Near Me
                    </button>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    >
                        <option value="all">All Types</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                    </select>
                </div>
            </div>

            {filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No requests found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredRequests.map((req) => (
                        <div key={req.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            {req.photo ? (
                                <img
                                    src={`http://localhost:8080${req.photo}`}
                                    alt={req.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium uppercase">
                                        {req.type || 'General'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(req.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{req.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{req.description}</p>

                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span className="truncate">{req.location || req.address || 'Location not specified'}</span>
                                    </div>
                                    {req.latitude && req.longitude && (
                                        <div className="ml-6">
                                            <div className="text-xs text-blue-600 mb-1">
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${req.latitude},${req.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline flex items-center gap-1"
                                                >
                                                    <MapPin className="w-3 h-3" /> View on Map
                                                </a>
                                            </div>
                                            {userLocation && (
                                                <p className="text-xs text-gray-500">
                                                    {calculateDistance(userLocation.latitude, userLocation.longitude, req.latitude, req.longitude).toFixed(1)} km away
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>Recipient ID: {req.recipientId}</span>
                                    </div>
                                </div>

                                <button className="w-full py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RequestFeed;
