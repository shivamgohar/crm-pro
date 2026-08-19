// import "./App.css";
import "./index.css";
import { useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
import AppRoutes from "./routes/AppRoutes";
// import { AppNavbar, AppSidebar } from "./components/layout";

function App({
  themeSettings,
  onThemeChange,
}) {
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
            background: "background.default",
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
         <AppRoutes
  themeSettings={themeSettings}
  onThemeChange={onThemeChange}
/>
        </div>
      </div>
    </div>
  );
}

export default App;
