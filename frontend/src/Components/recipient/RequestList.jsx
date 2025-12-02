import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Utensils, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import RequestForm from './RequestForm';

import toast from 'react-hot-toast';

const RequestList = ({ recipientId, axios, recipientProfile }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [stats, setStats] = useState({ total: 0, urgent: 0, completed: 0, totalPeople: 0 });

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`/request/recipient/${recipientId}`);
            const requestData = res.data;
            setRequests(requestData);
            
            // Calculate statistics
            const totalPeople = requestData.reduce((sum, req) => sum + (parseInt(req.amount) || 0), 0);
            const calculatedStats = {
                total: requestData.length,
                urgent: requestData.filter(r => r.status?.toLowerCase() === 'urgent').length,
                completed: requestData.filter(r => r.status?.toLowerCase() === 'completed').length,
                totalPeople: totalPeople
            };
            setStats(calculatedStats);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [recipientId]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
            try {
                await axios.delete(`/request/delete/${id}`);
                fetchRequests();
            } catch (error) {
                console.error("Error deleting request:", error);
                alert("Failed to delete request");
            }
        }
    };

    const handleEdit = (request) => {
        setEditingRequest(request);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        if (recipientProfile) {
            if (recipientProfile.status !== 'verified') {
                toast.error("Your account must be verified to add requests.");
                return;
            }
            if (!recipientProfile.photo) {
                toast.error("Please upload your profile photo to add requests.");
                return;
            }
            if (recipientProfile.organizationName && !recipientProfile.organizationCertificate) {
                toast.error("Please upload your organization certificate to add requests.");
                return;
            }
        }
        setEditingRequest(null);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingRequest(null);
    };

    const handleFormSuccess = () => {
        handleFormClose();
        fetchRequests();
    };

    if (loading) return <div className="text-center py-8">Loading requests...</div>;

    return (
        <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-orange-600 font-medium mb-1">Total Requests</p>
                            <p className="text-2xl font-bold text-orange-900">{stats.total}</p>
                        </div>
                        <Utensils className="w-10 h-10 text-orange-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium mb-1">Urgent</p>
                            <p className="text-2xl font-bold text-red-900">{stats.urgent}</p>
                        </div>
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Completed</p>
                            <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium mb-1">People Served</p>
                            <p className="text-2xl font-bold text-blue-900">{stats.totalPeople}</p>
                        </div>
                        <Users className="w-10 h-10 text-blue-500" />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">My Requests</h2>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Request
                </button>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">You haven't made any requests yet.</p>
                    <button
                        onClick={handleAddNew}
                        className="text-green-600 font-medium hover:underline"
                    >
                        Make your first request
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((req) => (
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
                                        {req.type}
                                    </span>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium uppercase ${req.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {req.status || 'Active'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{req.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{req.description}</p>

                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{req.location}</span>
                                </div>

                                <div className="flex gap-2 pt-4 border-t">
                                    <button
                                        onClick={() => handleEdit(req)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(req.id)}
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
                <RequestForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                    request={editingRequest}
                    recipientId={recipientId}
                    axios={axios}
                />
            )}
        </div>
    );
};

export default RequestList;
