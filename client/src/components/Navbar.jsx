import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <nav
        style={{
          background: "#1976d2",
          color: "white",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>CRM Software</h3>

        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Navbar;