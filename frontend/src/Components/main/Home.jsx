// /*  */import React, { useState, useEffect } from "react";
import { ArrowRight, Users, Heart, HandHeart, TrendingUp, Award, Clock, Sparkles, Star, Zap } from "lucide-react";
import DonorFoodListing from "../donor/DonorFoodListingForm";
import DonorFoodList from "../donor/DonorFoodList";
import RecipientListing from "../recipient/RecipientListing";
import { useEffect, useState } from "react";


const images = [
    banner1,
    banner2,
    banner3,
    banner4,
];

    useEffect(() => {
        const fetchData = async () => {
            if (!publicAxiosInstance) {
                console.error("publicAxiosInstance is undefined");
                return;
            }
            try {
                console.log("Fetching data...");
                const [donationsRes, requestsRes] = await Promise.all([
                    publicAxiosInstance.get("/donation/all"),
                    publicAxiosInstance.get("/recipient/all"),
                ]);
                console.log("Donations:", donationsRes.data);
                console.log("Requests:", requestsRes.data);
                setDonations(donationsRes.data);
                setRequests(requestsRes.data);

                // Fetch donor details
                const uniqueDonorIds = [...new Set(donationsRes.data.map(d => d.donorId))];

                const donorPromises = uniqueDonorIds.map(id =>
                    publicAxiosInstance.get(`/donor/${id}`)
                        .then(res => ({ id, data: res.data }))
                        .catch(err => {
                            console.warn(`Failed to fetch donor ${id}:`, err);
                            return null;
                        })
                );
                const donorsData = await Promise.all(donorPromises);

                const donorsMap = donorsData.reduce((acc, curr) => {
                    if (curr) {
                        acc[curr.id] = curr.data;
                    }
                    return acc;
                }, {});
                setDonors(donorsMap);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [publicAxiosInstance]);

    const handleRequestDonation = async (id) => {
        try {
            const donationToUpdate = donations.find(d => d.id === id);
            if (!donationToUpdate) return;

            const updatedDonation = { ...donationToUpdate, status: "approved", remarks: "Verified" };

            await publicAxiosInstance.put(`/donation/update/${id}`, updatedDonation);

            // Update local state to reflect change
            setDonations((prev) =>
                prev.map((d) => (d.id === id ? { ...d, status: "approved" } : d))
            );
            alert("Donation requested successfully!");
        } catch (error) {
            console.error("Error requesting donation:", error);
            alert("Failed to request donation.");
        }
    };

    const openLiveLocation = (lat, lng, address) => {
        let query = address;
        if (lat && lng) {
            query = `${lat},${lng}`;
        }
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`, "_blank");
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="w-full min-h-screen bg-green-50/30">
            <HomePageCrousel />
            <HomePageStates />

            <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
                {/* Donations Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <Heart className="text-green-600 fill-green-600" />
                                Available Donations
                            </h2>
                            <p className="text-gray-600 mt-2">Fresh food available for pickup right now</p>
                        </div>
                        <button className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 transition-colors">
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {donations.map((donation) => (
                            <div key={donation.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-green-100 group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={donation.photo ? `http://localhost:8080${donation.photo}` : "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80"}
                                        alt={donation.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80";
                                        }}
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${donation.type?.toLowerCase() === 'veg' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                            {donation.type || 'Veg'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{donation.title}</h3>
                                        {donors[donation.donorId] && (
                                            <p className="text-sm font-medium text-green-600 mb-2">
                                                By: {donors[donation.donorId].organizationName || donors[donation.donorId].name}
                                            </p>
                                        )}
                                        <p className="text-gray-500 text-sm line-clamp-2">{donation.description}</p>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                            <span className="line-clamp-1">{donation.address || "Address Available"}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                            <span className="line-clamp-1">{donation.location || "Location Available"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-green-600 shrink-0" />
                                            <span>Added: {formatDate(donation.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-green-600 shrink-0" />
                                            <span>Status: {donation.status || "Available"}</span>
                                        </div>
                                        {donation.remarks && (
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                <span className="line-clamp-1">Remarks: {donation.remarks}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleRequestDonation(donation.id)}
                                            disabled={donation.status === 'approved'}
                                            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${donation.status === 'approved'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20'
                                                }`}
                                        >
                                            {donation.status === 'approved' ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4" /> Requested
                                                </>
                                            ) : (
                                                'Request Donation'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => openLiveLocation(donation.latitude, donation.longitude, donation.address)}
                                            className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors border border-green-200"
                                            title="Track Location"
                                        >
                                            <Navigation className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Requests Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <Utensils className="text-orange-500 fill-orange-500" />
                                Current Food Needs
                            </h2>
                            <p className="text-gray-600 mt-2">Urgent requests from communities in need</p>
                        </div>
                        <button className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 transition-colors">
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((request) => (
                            <div key={request.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-orange-100 group">

                                <div className="p-5 space-y-4">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">{request.title}</h3>
                                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                                {request.amount ? `${request.amount} People` : 'Any Amount'}
                                            </span>
                                        </div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm mb-2 ${request.status?.toLowerCase() === 'urgent'
                                            ? 'bg-red-500 text-white animate-pulse'
                                            : 'bg-orange-500 text-white'
                                            }`}>
                                            {request.status || 'Urgent'}
                                        </span>
                                        <p className="text-gray-500 text-sm line-clamp-2">{request.description}</p>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                            <span className="line-clamp-1">{request.address || "Address Available"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                                            <span>{formatDate(request.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                                            <span>Status: {request.status || "Urgent"}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                                        <button className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all duration-200 flex items-center justify-center gap-2">
                                            Donate Now
                                        </button>
                                        <button
                                            onClick={() => openLiveLocation(request.latitude, request.longitude, request.address)}
                                            className="p-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors border border-orange-200"
                                            title="Track Location"
                                        >
                                            <Navigation className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;