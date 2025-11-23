import React, { useState } from "react";

export default function VolunteerPage() {
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

  const [volunteers, setVolunteers] = useState([
    { name: "Ananya Sharma", role: "Food Pickup & Delivery", availability: "Weekends" },
    { name: "Ravi Patel", role: "Cooking / Meal Preparation", availability: "Weekdays" },
    { name: "Meera Das", role: "Awareness Campaigns", availability: "Evenings" },
  ]);

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
    alert("Thank you for volunteering!");
    setFormData({ name: "", email: "", phone: "", role: "", availability: "" });
  };

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Volunteer — Food & Hunger</h1>
          <p>
            Join us to recover surplus food and feed communities in need. Choose a
            role, tell us when you're available, and help us make a difference.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section
            className="lg:col-span-1 rounded-xl p-6"
            style={{ border: "2px solid #00a03d", background: "rgb(0 111 49 / 31%)" }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Open Opportunities
            </h2>
            <div className="space-y-5">
              {opportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-5"
                  style={{ border: "2px solid #00a03d", background: "rgb(0 111 49 / 31%)" }}
                >
                  <h3 className="text-lg font-medium mb-1">{opp.title}</h3>
                  <p className="text-sm mb-2">{opp.desc}</p>
                  <div className="flex justify-between text-sm">
                    <span>📍 {opp.location}</span>
                    <span>⏰ {opp.time}</span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm">{opp.spots} spots</span>
                    <button
                      className="px-3 py-1 rounded-md text-sm"
                      style={{
                        border: "1px solid #00a03d",
                        background: "rgb(0 111 49 / 31%)",
                      }}
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="lg:col-span-2 space-y-10">
            <section
              className="rounded-xl p-6"
              style={{ border: "2px solid #00a03d", background: "rgb(0 111 49 / 31%)" }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Current Volunteers
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {volunteers.map((vol, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-5"
                    style={{ border: "2px solid #00a03d", background: "rgb(0 111 49 / 31%)" }}
                  >
                    <h3 className="text-lg font-semibold mb-1">{vol.name}</h3>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Role:</span> {vol.role}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Availability:</span>{" "}
                      {vol.availability || "Not specified"}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="rounded-xl p-8"
              style={{ border: "2px solid #00a03d", background: "rgb(0 111 49 / 31%)" }}
            >
              <h2 className="text-3xl font-bold text-center mb-4">
                Become a Volunteer
              </h2>
              <p className="text-center mb-8">
                Join hands in reducing food waste and feeding the hungry.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {["name", "email", "phone", "availability"].map((field) => (
                  <div key={field}>
                    <label className="block mb-2 font-medium capitalize">
                      {field === "email"
                        ? "Email Address"
                        : field === "phone"
                          ? "Phone Number"
                          : field}
                    </label>
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required={field === "name"}
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: "1px solid #00a03d",
                        background: "rgb(0 111 49 / 31%)",
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label className="block mb-2 font-medium">Area of Interest</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ border: "1px solid #00a03d", background: "rgb(0 111 49 / 31%)" }}
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

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-lg"
                    style={{
                      border: "2px solid #00a03d",
                      background: "rgb(0 111 49 / 31%)",
                    }}
                  >
                    Submit Application
                  </button>
                </div>
              </form>

              <p className="text-center text-sm mt-8">
                Thank you for your willingness to help those in need.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
