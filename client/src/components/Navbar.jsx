import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (

    <header className="navbar">

      <div className="navbar-left">

        <h2>ACN GROUP CRM</h2>

      </div>

      <div className="navbar-right">

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>

  );

}

export default Navbar;