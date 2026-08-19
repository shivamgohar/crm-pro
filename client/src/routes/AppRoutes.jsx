import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// import Dashboard from "../pages/Dashboard";
import Dashboard from "../pages/Dashboard/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import Reports from "../pages/Reports";
import Inventory from "../pages/Inventory";
import Invoice from "../pages/Invoice";
import Payments from "../pages/Payments";
import CustomerProfile from "../pages/CustomerProfile";
import CustomerFields from "../pages/settings/CustomerFields";
import Settings from "../pages/settings/Settings";
import CustomerStatus from "../pages/settings/CustomerStatus";
import ImportWizard from "../modules/import/pages/ImportWizard";
import DataManagement from "../pages/settings/DataManagement";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Users from "../pages/settings/Users";
import CleanImportedData from "../pages/settings/CleanImportedData";
import Trash from "../pages/settings/Trash";
import GoogleSheetSync from "../pages/settings/GoogleSheetSync";
import FieldManagement from "../pages/settings/FieldManagement";
import DataCleanup from "../pages/settings/DataCleanup";
import Restore from "../pages/settings/Restore";
import ExportData from "../pages/settings/ExportData";
import DashboardControl from "../pages/settings/dashboard/DashboardControl";
import SoftwareUpdates from "../pages/settings/SoftwareUpdates";
import SoftwareTheme from "../pages/settings/SoftwareTheme";

function AppRoutes({
  themeSettings,
  onThemeChange,
}) {
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

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Inventory"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Invoice"
        element={
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Payments"
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers/:id"
        element={
          <ProtectedRoute>
            <CustomerProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/field-management"
        element={
          <ProtectedRoute>
            <FieldManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/customer-fields"
        element={
          <ProtectedRoute>
            <CustomerFields />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers/import"
        element={
          <ProtectedRoute>
            <ImportWizard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/customer-status"
        element={
          <ProtectedRoute>
            <CustomerStatus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/data-management"
        element={
          <ProtectedRoute>
            <DataManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/data-management/clean-imported"
        element={
          <ProtectedRoute>
            <CleanImportedData />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/data-management/cleanup"
        element={
          <ProtectedRoute>
            <DataCleanup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/data-management/google-sync"
        element={
          <ProtectedRoute>
            <GoogleSheetSync />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/trash"
        element={
          <ProtectedRoute>
            <Trash />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/data-management/restore"
        element={
          <ProtectedRoute>
            <Restore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/data-management/export"
        element={
          <ProtectedRoute>
            <ExportData />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/dashboard-control"
        element={
          <ProtectedRoute>
            <DashboardControl />
          </ProtectedRoute>
        }
      />

    

      <Route
        path="/settings/software-updates"
        element={
          <ProtectedRoute>
            <SoftwareUpdates />
          </ProtectedRoute>
        }
      />

      <Route
  path="/settings/software-theme"
  element={
    <ProtectedRoute>
      <SoftwareTheme
        themeSettings={themeSettings}
        onThemeChange={onThemeChange}
      />
    </ProtectedRoute>
  }
/>

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
