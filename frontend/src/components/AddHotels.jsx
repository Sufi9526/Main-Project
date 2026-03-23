// src/pages/Admin/AddHotel.jsx
import React, { useState } from 'react';

const AddHotels = () => {
  const [hotel, setHotel] = useState({
    name: '',
    location: '',
    price: '',
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    upiId: ''
  });

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(hotel); // backend API
  };

  return (
    <div>
      <h3>Add Hotel</h3>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Hotel Name" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />
        <input name="price" placeholder="Price per night" onChange={handleChange} />

        <h4>Payment Details</h4>

        <input name="accountHolder" placeholder="Account Holder Name" onChange={handleChange} />
        <input name="bankName" placeholder="Bank Name" onChange={handleChange} />
        <input name="accountNumber" placeholder="Account Number" onChange={handleChange} />
        <input name="ifsc" placeholder="IFSC Code" onChange={handleChange} />
        <input name="upiId" placeholder="UPI ID (optional)" onChange={handleChange} />

        <button type="submit">Add Hotel</button>
      </form>
    </div>
  );
};

export default AddHotels;
