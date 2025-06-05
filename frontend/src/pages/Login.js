import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Login() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      window.location = "/";
    } catch (err) {
      setMsg("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div>
      <h2>{t("login")}</h2>
      {msg}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="البريد الإلكتروني" onChange={handleChange} />
        <input name="password" type="password" placeholder="كلمة المرور" onChange={handleChange} />
        <button type="submit">{t("login")}</button>
      </form>
    </div>
  );
}