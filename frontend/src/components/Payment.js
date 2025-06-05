import React from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Payment() {
  const handleSubscribe = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(atob(token.split('.')[1]));
    const email = user?.user?.email;
    const res = await axios.post(`${API_URL}/stripe/create-checkout-session`, { email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location = res.data.url;
  };

  return (
    <div>
      <h2>اشترك الآن</h2>
      <button onClick={handleSubscribe}>الدفع عبر Stripe</button>
    </div>
  );
}