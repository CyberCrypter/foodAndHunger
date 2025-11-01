// import React, { useState } from "react";

// export default function VolunteerPage() {
//   // --- Volunteer Opportunities ---
//   const opportunities = [
//     {
//       title: "Restaurant Pickup Driver",
//       desc: "Collect surplus food from partner restaurants and bring to sorting center.",
//       location: "Downtown",
//       time: "Weekday mornings",
//       spots: 4,
//     },
//     {
//       title: "Food Sorting & Packaging",
//       desc: "Help sort, portion and pack donated food for distribution.",
//       location: "Warehouse A",
//       time: "Saturdays",
//       spots: 8,
//     },
//     {
//       title: "Distribution Volunteer",
//       desc: "Join teams that deliver prepared packages to shelters and communities.",
//       location: "Citywide",
//       time: "Weekends",
//       spots: 6,
//     },
//   ];

//   // --- Current Volunteers ---
//   const [volunteers, setVolunteers] = useState([
//     { name: "Ananya Sharma", role: "Food Pickup & Delivery", availability: "Weekends" },
//     { name: "Ravi Patel", role: "Cooking / Meal Preparation", availability: "Weekdays" },
//     { name: "Meera Das", role: "Awareness Campaigns", availability: "Evenings" },
//   ]);

//   // --- Form State ---
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     availability: "",
//   });

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.role) {
//       alert("Please fill all required fields!");
//       return;
//     }
//     setVolunteers([formData, ...volunteers]);
//     alert("Thank you for volunteering! 🌟");
//     setFormData({ name: "", email: "", phone: "", role: "", availability: "" });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0b1e2d] text-gray-900 dark:text-gray-100 transition-colors duration-500 px-6 py-10 flex flex-col items-center">
//       <div className="max-w-6xl w-full space-y-12">
//         {/* Header */}
//         <header className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-2">Volunteer — Food & Hunger</h1>
//           <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//             Join us to recover surplus food and feed communities in need. Choose a
//             role, tell us when you're available, and help us make a difference.
//           </p>
//         </header>

//         {/* Volunteer Opportunities */}
//         <section className="bg-white dark:bg-[#12283d] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
//           <h2 className="text-2xl font-semibold mb-6 text-center">
//             Open Volunteer Opportunities
//           </h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {opportunities.map((opp, idx) => (
//               <div
//                 key={idx}
//                 className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:border-blue-500 transition"
//               >
//                 <h3 className="text-lg font-medium mb-1">{opp.title}</h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{opp.desc}</p>
//                 <div className="flex flex-wrap justify-between text-sm text-gray-500 dark:text-gray-400">
//                   <span>📍 {opp.location}</span>
//                   <span>⏰ {opp.time}</span>
//                 </div>
//                 <div className="mt-4 flex justify-between items-center">
//                   <span className="text-sm text-gray-500">{opp.spots} spots</span>
//                   <button className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md text-sm hover:bg-blue-600 hover:text-white transition">
//                     Join
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
//             <strong>Not sure?</strong> Fill the form below and we’ll suggest a role
//             based on your availability and skills.
//           </p>
//         </section>

//         {/* Current Volunteers */}
//         <section className="bg-white dark:bg-[#12283d] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
//           <h2 className="text-2xl font-semibold mb-6 text-center text-green-700 dark:text-green-400">
//             Current Volunteers
//           </h2>
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {volunteers.map((vol, index) => (
//               <div
//                 key={index}
//                 className="bg-white dark:bg-[#0b1e2d] border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition"
//               >
//                 <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-1">
//                   {vol.name}
//                 </h3>
//                 <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
//                   <span className="font-medium">Role:</span> {vol.role}
//                 </p>
//                 <p className="text-gray-700 dark:text-gray-300 text-sm">
//                   <span className="font-medium">Availability:</span>{" "}
//                   {vol.availability || "Not specified"}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Volunteer Form */}
//         <section className="bg-white dark:bg-[#12283d] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
//           <h2 className="text-3xl font-bold text-center mb-4 text-green-700 dark:text-green-400">
//             Become a Volunteer
//           </h2>
//           <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
//             Join hands in reducing food waste and feeding the hungry. Together, we can
//             make a lasting impact.
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name */}
//             <div>
//               <label className="block mb-2 font-medium">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//                 required
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block mb-2 font-medium">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block mb-2 font-medium">Phone Number</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter your phone number"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             {/* Role */}
//             <div>
//               <label className="block mb-2 font-medium">Area of Interest</label>
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="">Select your role</option>
//                 <option value="Food Pickup & Delivery">Food Pickup & Delivery</option>
//                 <option value="Cooking / Meal Preparation">
//                   Cooking / Meal Preparation
//                 </option>
//                 <option value="Distribution & Service">Distribution & Service</option>
//                 <option value="Awareness Campaigns">Awareness Campaigns</option>
//               </select>
//             </div>

//             {/* Availability */}
//             <div>
//               <label className="block mb-2 font-medium">Availability</label>
//               <input
//                 type="text"
//                 name="availability"
//                 value={formData.availability}
//                 onChange={handleChange}
//                 placeholder="e.g. Weekends, Weekdays, Evenings"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             {/* Submit */}
//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200"
//               >
//                 Submit Application
//               </button>
//             </div>
//           </form>

//           <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
//             Thank you for your willingness to help those in need 💚
//           </p>
//         </section>
//       </div>
//     </div>
//   );
// }












import React, { useState } from "react";

export default function VolunteerPage() {
  // --- Volunteer Opportunities ---
  const opportunities = [
    {
      title: "Restaurant Pickup Driver",
      desc: "Collect surplus food from partner restaurants and bring to sorting center.",
      location: "Downtown",
      time: "Weekday mornings",
      spots: 4,
    },
    {
      title: "Food Sorting & Packaging",
      desc: "Help sort, portion and pack donated food for distribution.",
      location: "Warehouse A",
      time: "Saturdays",
      spots: 8,
    },
    {
      title: "Distribution Volunteer",
      desc: "Join teams that deliver prepared packages to shelters and communities.",
      location: "Citywide",
      time: "Weekends",
      spots: 6,
    },
  ];

  // --- Current Volunteers ---
  const [volunteers, setVolunteers] = useState([
    { name: "Ananya Sharma", role: "Food Pickup & Delivery", availability: "Weekends" },
    { name: "Ravi Patel", role: "Cooking / Meal Preparation", availability: "Weekdays" },
    { name: "Meera Das", role: "Awareness Campaigns", availability: "Evenings" },
  ]);

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    availability: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      alert("Please fill all required fields!");
      return;
    }
    setVolunteers([formData, ...volunteers]);
    alert("Thank you for volunteering! 🌟");
    setFormData({ name: "", email: "", phone: "", role: "", availability: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1e2d] text-gray-900 dark:text-gray-100 transition-colors duration-500 px-6 py-10 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Volunteer — Food & Hunger</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join us to recover surplus food and feed communities in need. Choose a
            role, tell us when you're available, and help us make a difference.
          </p>
        </header>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side — Opportunities */}
          <section className="lg:col-span-1 bg-white dark:bg-[#12283d] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Open Opportunities
            </h2>
            <div className="space-y-5">
              {opportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md hover:border-blue-500 transition"
                >
                  <h3 className="text-lg font-medium mb-1">{opp.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{opp.desc}</p>
                  <div className="flex flex-wrap justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>📍 {opp.location}</span>
                    <span>⏰ {opp.time}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{opp.spots} spots</span>
                    <button className="border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-md text-sm hover:bg-blue-600 hover:text-white transition">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Side — Volunteers & Form */}
          <div className="lg:col-span-2 space-y-10">
            {/* Current Volunteers */}
            <section className="bg-white dark:bg-[#12283d] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center text-green-700 dark:text-green-400">
                Current Volunteers
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {volunteers.map((vol, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-[#0b1e2d] border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-1">
                      {vol.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                      <span className="font-medium">Role:</span> {vol.role}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      <span className="font-medium">Availability:</span>{" "}
                      {vol.availability || "Not specified"}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Volunteer Form */}
            <section className="bg-white dark:bg-[#12283d] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
              <h2 className="text-3xl font-bold text-center mb-4 text-green-700 dark:text-green-400">
                Become a Volunteer
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                Join hands in reducing food waste and feeding the hungry. Together, we can
                make a lasting impact.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block mb-2 font-medium">Area of Interest</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select your role</option>
                    <option value="Food Pickup & Delivery">Food Pickup & Delivery</option>
                    <option value="Cooking / Meal Preparation">
                      Cooking / Meal Preparation
                    </option>
                    <option value="Distribution & Service">Distribution & Service</option>
                    <option value="Awareness Campaigns">Awareness Campaigns</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block mb-2 font-medium">Availability</label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="e.g. Weekends, Weekdays, Evenings"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1e2d] focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200"
                  >
                    Submit Application
                  </button>
                </div>
              </form>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                Thank you for your willingness to help those in need 💚
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
