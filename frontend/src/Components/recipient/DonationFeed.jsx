import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, User } from 'lucide-react';

const DonationFeed = ({ axios }) => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const fetchDonations = async () => {
        try {
            // Fetch all donations. Ideally, this should be filtered by status 'active' or similar.
            // Assuming /api/donation/all returns all donations.
            const res = await axios.get('/donation/all');
            
            // Filter only admin-approved donations and exclude completed ones
            const approvedDonations = res.data.filter(d => 
                (d.approved === true || d.status === 'approved') && d.status !== 'completed'
            );
            
            setDonations(approvedDonations);
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const sortedDonations = [...donations].sort((a, b) => {
        if (!sortByDistance || !userLocation) return 0;
        const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
    });

    const displayDonations = sortByDistance ? sortedDonations : donations;

    if (loading) return <div className="text-center py-8">Loading donations...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Available Donations</h2>
                <button
                    onClick={handleNearMe}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${sortByDistance
                        ? 'bg-green-600 text-white'
                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <MapPin className="w-4 h-4" />
                    Near Me
                </button>
            </div>

            {displayDonations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No donations available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayDonations.map((donation) => (
                        <div key={donation.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            {donation.photo ? (
                                <img
                                    src={`http://localhost:8080${donation.photo}`}
                                    alt={donation.title}
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
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium uppercase">
                                        {donation.type}
                                    </span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(donation.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{donation.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{donation.description}</p>

                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{donation.location || donation.address || 'Location not specified'}</span>
                                </div>

                                {donation.latitude && donation.longitude && (
                                    <div className="mb-2">
                                        <div className="text-xs text-blue-600 mb-1">
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${donation.latitude},${donation.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline flex items-center gap-1"
                                            >
                                                <MapPin className="w-3 h-3" /> View on Map
                                            </a>
                                        </div>
                                        {userLocation && (
                                            <p className="text-xs text-gray-500">
                                                {calculateDistance(userLocation.latitude, userLocation.longitude, donation.latitude, donation.longitude).toFixed(1)} km away
                                            </p>
                                        )}
                                    </div>
                                )}

                                <button className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                                    Request Donation
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonationFeed;
