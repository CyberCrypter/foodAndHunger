import React, { useState, useEffect } from "react";
import { ArrowRight, Users, Heart, HandHeart, TrendingUp, Award, Clock, Sparkles, Star, Zap } from "lucide-react";
import DonorFoodListing from "../donor/DonorFoodListingForm";
import DonorFoodList from "../donor/DonorFoodList";
import RecipientListing from "../recipient/RecipientListing";

import ListDonations from "../donation/ListDonations";
import GoogleMapViewer from "../utils/LiveLocation";
import DonorForm from "../donor/Register";
import HomePageCrousel from "../utils/HomePageCrousel";
import HomePageStates from "../utils/HomePageStates";


const Home = () => {
    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );
        document.querySelectorAll('[id^="section-"]').forEach((el) => {
            observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);


    return (
        <div className="w-full overflow-hidden">

            <HomePageCrousel />
            <HomePageStates />

            {/* Recipients Section */}
            <div
                id="section-recipients"
                className={`py-20 px-4 transition-all duration-1000 ${isVisible["section-recipients"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                    }`}
            >

                {/* <DonorFoodList /> */}
                <ListDonations />
                <GoogleMapViewer address="Muzaffarpur, Bihar, 842001" />
                {/* <DonorForm /> */}
                <RecipientListing />
                <GoogleMapViewer address="balarampur, purulia, west bengol-723143" />
            </div>
        </div>
    );
};

export default Home;