import React, { useState, useEffect } from "react";
import { ArrowRight, BookOpen, Target, Handshake, Users, Leaf, Heart, Award } from "lucide-react";
import manisha from '../../assets/images/team/manisha.jpeg'
import rameshwar from '../../assets/images/team/rameshwar.jpeg'
import neeraj from '../../assets/images/team/neeraj.jpg'
// Placeholder images for the About page
const aboutImages = [
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=1600&q=80",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&q=80",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600&q=80"
];

const About = () => {
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer Hook for scroll animations
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
    document.querySelectorAll('[id^="about-section-"]').forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-green-500 fill-green-500/20" />,
      title: "Compassion",
      description: "Leading every action with empathy and a deep understanding of human need."
    },
    {
      icon: <Handshake className="w-8 h-8 text-emerald-500 fill-emerald-500/20" />,
      title: "Integrity",
      description: "Maintaining the highest standards of transparency and accountability in all operations."
    },
    {
      icon: <Leaf className="w-8 h-8 text-blue-500 fill-blue-500/20" />,
      title: "Sustainability",
      description: "Working towards long-term solutions that ensure lasting food security and minimize waste."
    },
    {
      icon: <Users className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />,
      title: "Collaboration",
      description: "Partnering with communities, donors, and volunteers to maximize our collective impact."
    },
  ];

  const leadership = [
    { name: "Manisha Kumari", role: "Team Lead", avatar: manisha, color: "red", linkedin: "https://www.linkedin.com/in/bugsfounder/" },
    { name: "Neeraj Passwan", role: "Team Member", avatar: neeraj, color: "blue", linkedin: "https://www.linkedin.com/in/neeraj-paswan-654547292/" },
    { name: "Rameshawar", role: "Team Member", avatar: rameshwar, color: "purple", linkedin: "https://www.linkedin.com/in/rameshwar-7b8905292" },
  ];

  return (
    <div className="w-full overflow-hidden">

      {/* --- Hero Section --- */}
      <div className="relative w-full h-[50vh] overflow-hidden text-white">
        <img
          src={aboutImages[0]}
          alt="Team working in an office"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center  text-center px-4">
          <div className="space-y-4 max-w-4xl">
            <p className="text-xl font-medium uppercase tracking-widest text-green-400 animate-slide-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              Our Foundation
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight animate-slide-down opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              A Story of <span className="inline-block bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 bg-clip-text text-transparent animate-gradient bg-300">Hope & Action</span>
            </h1>
            <p className="text-lg md:text-xl font-light mt-4 animate-slide-down opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Driven by compassion, committed to eliminating hunger.
            </p>
          </div>
        </div>
      </div>

      {/* --- Our Story Section --- */}
      <div
        id="about-section-story"
        className={`py-20 px-4 transition-all duration-1000 ${isVisible["about-section-story"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block relative mb-6">
              <h2 className="text-4xl font-bold relative inline-block">
                Our Journey
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-400 opacity-20 blur-2xl animate-pulse-slow"></div>
              </h2>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-16 h-1 bg-green-500 rounded-full animate-expand-right"></div>
                <BookOpen className="w-6 h-6 text-green-600 animate-bounce-slow" />
              </div>
            </div>
            <p className="mt-4 text-lg leading-relaxed opacity-80">
              Our journey began in 2025 during the SureTrust internship on G3 DSA in Java. The session was led by Karthik Subhramanyam, a Software Tester at JIO Telecom. During one of his lectures, he asked all students to share ideas for their final project.
            </p>
            <p className="mt-4 text-lg leading-relaxed opacity-80">
              I started searching everywhere — browsing the internet, asking ChatGPT for suggestions, and going through dozens of ideas. Nothing truly clicked until I came across one simple yet powerful concept: households sharing food with the needy nearby.
            </p>
            <p className="mt-4 text-lg leading-relaxed opacity-80">
              That idea felt right. I proposed it to Karthik sir, and he approved it immediately.
            </p>
            <p className="mt-4 text-lg leading-relaxed opacity-80">
              Now, our team — Manisha, Rameshwar, and Neeraj — is working hard to build the first version of our website, turning that small idea into something that can make a real difference.
            </p>
            <button className="mt-8 relative overflow-hidden px-6 py-2 rounded-xl font-semibold shadow-md transform transition-all duration-300 hover:scale-105 group  bg-green-600 hover:bg-green-700">
              <a target="_blank" className="relative flex items-center gap-2 text-white" href="https://github.com/Bugsfounder/foodAndHunger">
                Join Development OS
              </a>
            </button>
          </div>
          <div className="order-1 md:order-2 relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
            <img
              src={aboutImages[1]}
              alt="Team meeting to discuss strategy"
              className="w-full h-auto object-cover rounded-2xl"
            />
            <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/50 to-transparent w-full ">
              <p className="text-sm font-light">
                Planning the next phase of our mission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Mission & Values Section --- */}
      <div
        id="about-section-mission"
        className={`py-20 px-4  transition-all duration-1000 ${isVisible["about-section-mission"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Our Mission & Values
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-green-400 opacity-20 blur-2xl animate-pulse-slow"></div>
              </h2>
            </div>
            <p className="mt-4 text-lg opacity-80 max-w-2xl mx-auto">
              Our core beliefs guide every plate served, ensuring we act with purpose, dignity, and respect.
            </p>
          </div>

          {/* Mission Statement - Flat Style */}
          <div className="mb-12">
            <h3 className="text-3xl font-extrabold text-green-600 mb-4 flex items-center gap-3">
              <Target className="w-8 h-8 text-green-600 fill-green-600/10" />
              Mission Statement
            </h3>
            <p className="text-xl leading-relaxed">
              Our mission is to cut food waste and help end hunger — because in India more than 194 million people are undernourished, over 20 crore people go to sleep empty-stomach every night, and every day more than 7,000 lives are lost due to hunger.
              We aim to connect Restorents, Hotels, households with surplus food to needy people nearby — so no meal is wasted, and no one sleeps hungry.
            </p>
          </div>

          {/* Core Values Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-xl border border-gray-200  shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-2 relative"
                style={{
                  animation: isVisible["about-section-mission"] ? `slide-up 0.8s ease-out ${idx * 0.2}s forwards` : 'none',
                  opacity: isVisible["about-section-mission"] ? 1 : 0
                }}
              >
                <div className="mb-4">
                  <div className="p-3 inline-block rounded-lg bg-green-500/10 transform group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                <p className="text-sm opacity-70">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Leadership Section --- */}
      <div
        id="about-section-leadership"
        className={`py-20 px-4 transition-all duration-1000 ${isVisible["about-section-leadership"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 border-2 border-green-400/30 relative overflow-hidden group">
              <Award className="w-5 h-5 text-green-600 animate-bounce-slow relative z-10" />
              <span className="text-green-800 font-semibold relative z-10">
                Our Driving Force
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet the Team
            </h2>
            <p className="mt-4 text-lg opacity-80 max-w-2xl mx-auto">
              Dedicated leaders who ensure our mission is executed with precision and heart.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadership.map((member, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 text-center relative overflow-hidden"
                style={{
                  animation: isVisible["about-section-leadership"] ? `pop-in 0.6s ease-out ${idx * 0.15}s forwards` : 'none',
                  opacity: isVisible["about-section-leadership"] ? 1 : 0
                }}
              >
                {/* Background swirl effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                <div className="relative z-10">
                  <div className="relative inline-block mb-4">
                    <img className={`w-24 h-24 rounded-full flex items-center justify-center  text-3xl font-bold mx-auto shadow-lg transform group-hover:scale-110 transition-all duration-500 bg-gradient-to-br from-${member.color}-500 to-${member.color}-600`} src={member.avatar}>
                    </img>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-green-600 font-semibold mb-4">{member.role}</p>
                  <div className="pt-4 border-t border-gray-100">
                    <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                      <a href={member.linkedin} target="_blank">  Connect on LinkedIn</a>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Reusing the Home page styles for animations --- */}
      <style>{`
                /* Ensure all required animations from Home component are included here or imported via CSS/Tailwind */
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pop-in {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                @keyframes animate-expand-right {
                    from { width: 0; }
                    to { width: 4rem; } /* Tailwind w-16 is 4rem */
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-slide-down { animation: slide-down 0.8s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
                .animate-gradient { background-size: 300% 300%; animation: gradient 4s ease infinite; }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
                .animate-expand-right { animation: animate-expand-right 1s ease-out forwards; }
                .animate-bounce-slow { animation: bounce-slow 2s infinite; }
                .bg-300 { background-size: 300%; }
            `}</style>
    </div>
  );
};

export default About;