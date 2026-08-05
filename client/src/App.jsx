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

const isLoginPage = location.pathname === "/login";
  
 return (

  <div className="app">

    {
      !isLoginPage && <Navbar />
    }
<div
  style={{
    display: "flex",
  }}
>

      {
        !isLoginPage && < Sidebar />
      }

    <div
  style={{
    flex: 1,
    marginLeft: isLoginPage ? 0 : 0,
    marginTop: isLoginPage ? 0 : 72,
    padding: isLoginPage ? 0 : 16,
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