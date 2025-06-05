import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Home() {
  const [signals, setSignals] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_URL}/signals`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSignals(res.data));
  }, []);

  return (
    <div>
      <h1>{t("signals")}</h1>
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Direction</th>
            <th>Entry</th>
            <th>Stop Loss</th>
            <th>Take Profit</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {signals.map(signal => (
            <tr key={signal._id}>
              <td>{signal.pair}</td>
              <td>{signal.direction}</td>
              <td>{signal.entry}</td>
              <td>{signal.stopLoss}</td>
              <td>{signal.takeProfit}</td>
              <td>{new Date(signal.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}