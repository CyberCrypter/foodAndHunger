import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Heart, HandHeart, Truck, Users, CheckCircle, ArrowRight } from 'lucide-react';
import AuthModal from '../utils/AuthModal';
import VolunteerFormModal from './VolunteerFormModal';
import toast from 'react-hot-toast';

const Volunteer = () => {
    const { publicAxiosInstance } = useOutletContext();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);

    const handleBecomeVolunteer = () => {
        const isLoggedIn = localStorage.getItem('logged_in');
        if (!isLoggedIn) {
            setShowAuthModal(true);
        } else {
            setShowVolunteerModal(true);
        }
    };

    const handleLoginSuccess = () => {
        setShowAuthModal(false);
        setShowVolunteerModal(true);
    };

    const roles = [
        {
            icon: <Truck className="w-8 h-8 text-green-600" />,
            title: "Food Pickup & Delivery",
            description: "Collect surplus food from donors and deliver it to designated NGOs or distribution points safely and on time."
        },
        {
            icon: <CheckCircle className="w-8 h-8 text-green-600" />,
            title: "Quality Check",
            description: "Ensure the donated food is fresh, hygienic, and safe for consumption before it reaches the recipients."
        },
        {
            icon: <Users className="w-8 h-8 text-green-600" />,
            title: "Community Outreach",
            description: "Identify communities in need, verify requests, and help spread awareness about the platform."
        },
        {
            icon: <HandHeart className="w-8 h-8 text-green-600" />,
            title: "Event Support",
            description: "Assist in organizing food drives, fundraising events, and awareness campaigns to support the cause."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-green-600 text-white py-15 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Become a Hero</h1>
                    <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-2xl mx-auto">
                        Join our network of dedicated volunteers and help bridge the gap between surplus food and those in need.
                    </p>
                </div>
            </div>

            {/* Roles & Responsibilities */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Roles & Responsibilities</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        As a volunteer, you play a crucial role in our mission. Here are some of the key ways you can contribute.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {roles.map((role, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                {role.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{role.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {role.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>


            {/* Modals */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <VolunteerFormModal
                isOpen={showVolunteerModal}
                onClose={() => setShowVolunteerModal(false)}
                axiosInstance={publicAxiosInstance}
            />
        </div>
    );
};

export default Volunteer;