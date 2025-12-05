import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Heart, HandHeart, Truck, Users, CheckCircle, ArrowRight } from 'lucide-react';
import AuthModal from '../utils/AuthModal';
import VolunteerFormModal from './VolunteerFormModal';
import toast from 'react-hot-toast';

const Volunteer = () => {
    const { publicAxiosInstance } = useOutletContext();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const loggedIn = localStorage.getItem('logged_in') === 'true';
        const registered = localStorage.getItem('is_registered') === 'true';
        
        setIsLoggedIn(loggedIn);
        setIsRegistered(loggedIn && registered);
    };

    const handleBecomeVolunteer = () => {
        const loggedIn = localStorage.getItem('logged_in') === 'true';
        const registered = localStorage.getItem('is_registered') === 'true';
        
        if (!loggedIn) {
            setShowAuthModal(true);
        } else if (registered) {
            toast.info("You are already registered!");
        } else {
            setShowVolunteerModal(true);
        }
    };

    const handleLoginSuccess = () => {
        setShowAuthModal(false);
        
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
            checkAuthStatus();
            
            // Check if user is already registered
            const registered = localStorage.getItem('is_registered') === 'true';
            
            if (!registered) {
                setShowVolunteerModal(true);
            } else {
                toast.info("You are already registered!");
            }
        }, 100);
    };

    const roles = [
        {
            icon: <Heart className="w-8 h-8 text-green-600" />,
            title: "Compassionate Support",
            description: "Provide emotional and logistical support to those in need, ensuring dignity and respect in every interaction."
        },
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

    const showButtons = !isRegistered;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-green-600 text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Become a Hero</h1>
                    <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-2xl mx-auto">
                        Join our network of dedicated volunteers and help bridge the gap between surplus food and those in need.
                    </p>
                    <button
                        onClick={handleBecomeVolunteer}
                        className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-green-50 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                    >
                        Become a Volunteer <ArrowRight className="w-5 h-5" />
                    </button>
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

            {/* Call to Action Bottom */}
            <div className="bg-white py-16 px-4 border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center bg-green-50 rounded-3xl p-8 md:p-12">
                    <Heart className="w-12 h-12 text-green-600 mx-auto mb-6 fill-green-600" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Make an Impact?</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Your time and effort can save lives. Sign up today and start your journey as a Food & Hunger volunteer.
                    </p>
                    <button
                        onClick={handleBecomeVolunteer}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-all"
                    >
                        Join Us Now
                    </button>
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