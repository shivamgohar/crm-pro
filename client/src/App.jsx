import "./App.css";
import { useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
import AppRoutes from "./routes/AppRoutes";

function App() {

const location = useLocation();

const isLoginPage = location.pathname === "/login";
  
 return (

  <div className="app">

    {
      !isLoginPage && <Navbar />
    }

    <div className="main">

      {
        !isLoginPage && <Sidebar />
      }

      <div
        style={{
          flex: 1,
          padding: isLoginPage ? 0 : "20px",
        }}
      >
        <AppRoutes />
      </div>

    </div>

  </div>

);
}

export default App;