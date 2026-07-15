import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const fetchDashboard = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/dashboard"
      );

      setStats(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  return (

    <div style={{ padding: "30px" }}>

      <h1>CRM Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,250px)",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>👥 Customers</h2>

          <h1>{stats.customers}</h1>

        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>📦 Products</h2>

          <h1>{stats.products}</h1>

        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>🛒 Orders</h2>

          <h1>{stats.orders}</h1>

        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>💰 Revenue</h2>

          <h1>₹ {stats.revenue}</h1>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;