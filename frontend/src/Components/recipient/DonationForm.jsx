import React, { useState } from "react";
import "./DonationForm.css";

const DonationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    foodType: "",
    quantity: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Thank you for your donation!");
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="logo-circle">
          <span role="img" aria-label="logo">🍴</span>
        </div>
        <div className="title">
          <h2>FOOD & HUNGER</h2>
        </div>
      </div>

      <h3 className="form-title">DONATION APPLICATION FORM</h3>

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <label>Type of Food to Donate</label>
        <input
          type="text"
          name="foodType"
          value={formData.foodType}
          onChange={handleChange}
          required
        />

        <label>Quantity</label>
        <input
          type="text"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter your location"
          required
        />

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default DonationForm;
