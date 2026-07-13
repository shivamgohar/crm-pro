import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="app">

      <Navbar />

      <div className="main">

        <Sidebar />

        <div style={{padding:"20px"}}>

          {/* <Dashboard /> */}
          <AppRoutes /> 


        </div>

      </div>

    </div>
  );
}

export default App;