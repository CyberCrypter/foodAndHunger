import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Calendar, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import DonationForm from './DonationForm';

import toast from 'react-hot-toast';

const DonationList = ({ donorId, axios, donorProfile }) => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDonation, setEditingDonation] = useState(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, completed: 0 });

    const fetchDonations = async () => {
        try {
            const res = await axios.get(`/donation/donor/${donorId}`);
            const donationData = res.data;
            setDonations(donationData);
            
            // Calculate statistics
            const calculatedStats = {
                total: donationData.length,
                pending: donationData.filter(d => d.status === 'pending' || !d.status).length,
                approved: donationData.filter(d => d.status === 'approved').length,
                completed: donationData.filter(d => d.status === 'completed').length
            };
            setStats(calculatedStats);
        } catch (error) {
            console.error("Error fetching donations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [donorId]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this donation?")) {
            try {
                await axios.delete(`/donation/delete/${id}`);
                fetchDonations();
            } catch (error) {
                console.error("Error deleting donation:", error);
                alert("Failed to delete donation");
            }
        }
    };

    const handleEdit = (donation) => {
        setEditingDonation(donation);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        if (donorProfile) {
            if (donorProfile.status !== 'verified') {
                toast.error("Your account must be verified to add donations.");
                return;
            }
            if (!donorProfile.photo) {
                toast.error("Please upload your profile photo to add donations.");
                return;
            }
            if (donorProfile.organizationName && !donorProfile.organizationCertificate) {
                toast.error("Please upload your organization certificate to add donations.");
                return;
            }
        }
        setEditingDonation(null);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingDonation(null);
    };

    const handleFormSuccess = () => {
        handleFormClose();
        fetchDonations();
    };

    if (loading) return <div className="text-center py-8">Loading donations...</div>;

    return (
        <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium mb-1">Total Donations</p>
                            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                        </div>
                        <Package className="w-10 h-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 font-medium mb-1">Pending</p>
                            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                        </div>
                        <Clock className="w-10 h-10 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Approved</p>
                            <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 font-medium mb-1">Completed</p>
                            <p className="text-2xl font-bold text-purple-900">{stats.completed}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-purple-500" />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Donations</h2>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Donation
                </button>
            </div>

            {donations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
                    <button
                        onClick={handleAddNew}
                        className="text-green-600 font-medium hover:underline"
                    >
                        Make your first donation
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donations.map((donation) => (
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
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium uppercase ${donation.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {donation.status || 'Active'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{donation.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{donation.description}</p>

                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{donation.location}</span>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                    <button
                                        onClick={() => handleEdit(donation)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(donation.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <DonationForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                    donation={editingDonation}
                    donorId={donorId}
                    axios={axios}
                />
            )}
        </div>
    );
};

export default DonationList;
