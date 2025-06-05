import React from "react";
import { useTranslation } from "react-i18next";
import "./i18n/i18n";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./components/Payment";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const { t, i18n } = useTranslation();

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">{t("signals")}</Link> |{" "}
        <Link to="/login">{t("login")}</Link> |{" "}
        <Link to="/register">{t("register")}</Link> |{" "}
        <Link to="/pay">{t("pay")}</Link>
        <button onClick={() => i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")}>
          {i18n.language === "ar" ? "English" : "العربية"}
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pay" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;