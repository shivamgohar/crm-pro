import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Login from "../pages/Login";

function AppRoutes() {
    return (
        <Routes>
            <Route
  path="/"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default AppRoutes;