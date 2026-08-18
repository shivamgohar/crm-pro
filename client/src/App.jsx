// import "./App.css";
import "./index.css";
import { useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
import AppRoutes from "./routes/AppRoutes";
// import { AppNavbar, AppSidebar } from "./components/layout";

function App() {
  const location = useLocation();

  // const isLoginPage = location.pathname === "/login";
  const authPages = ["/login", "/register", "/forgot-password"];

  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="app">
      {!isAuthPage && <Navbar />}
      <div
        style={{
          display: "flex",
        }}
      >
        {!isAuthPage && <Sidebar />}

        <div
          style={{
            flex: 1,
            marginLeft: isAuthPage ? 0 : 0,
            marginTop: isAuthPage ? 0 : 72,
            padding: isAuthPage ? 0 : 16,
            background: "#f8fafc",
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}

export default App;
