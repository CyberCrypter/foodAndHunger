import React, { useState } from 'react';
import { X, Loader2, User, Mail, Phone, MapPin, CreditCard, Calendar, Briefcase, Heart, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VolunteerFormModal = ({ isOpen, onClose, axiosInstance }) => {
    const [loading, setLoading] = useState(false);
    
    // Get user email from localStorage
    const userEmail = localStorage.getItem('email') || '';
    
    const [formData, setFormData] = useState({
        name: '',
        email: userEmail,
        phone: '',
        address: '',
        location: '',
        aadhaarCard: '',
        panCard: '',
        availability: '',
        skills: '',
        reason: '',
        emergencyContactPhone: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/volunteer/add', formData);
            toast.success("Application submitted successfully! We will contact you soon.");
            onClose();
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                location: '',
                aadhaarCard: '',
                panCard: '',
                availability: '',
                skills: '',
                reason: '',
                emergencyContactPhone: ''
            });
        } catch (error) {
            console.error("Error submitting volunteer application:", error);
            toast.error("Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Volunteer Application</h2>
                        <p className="text-gray-500 text-sm mt-1">Join our community and make a difference</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600" /> Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        readOnly
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                                    <input
                                        type="tel"
                                        name="emergencyContactPhone"
                                        required
                                        value={formData.emergencyContactPhone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Emergency Phone"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address & Location */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" /> Location
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
                                    <textarea
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Full address..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Volunteering Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="City, Area"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Identity Proof */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-green-600" /> Identity Proof
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                                    <input
                                        type="text"
                                        name="aadhaarCard"
                                        required
                                        value={formData.aadhaarCard}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="12-digit Aadhaar"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                    <input
                                        type="text"
                                        name="panCard"
                                        required
                                        value={formData.panCard}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="10-character PAN"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-green-600" /> Skills & Availability
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                    <input
                                        type="text"
                                        name="availability"
                                        required
                                        value={formData.availability}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Weekends, Mon-Fri 5PM-8PM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                    <input
                                        type="text"
                                        name="skills"
                                        required
                                        value={formData.skills}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Driving, Packing, Event Management"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer?</label>
                                    <textarea
                                        name="reason"
                                        required
                                        value={formData.reason}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Share your motivation..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VolunteerFormModal;
