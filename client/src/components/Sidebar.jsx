import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>ACN GROUP</h2>
        <p>CRM Software</p>
      </div>

      <nav className="menu">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          👥 Customers
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📦 Products
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🛒 Orders
        </NavLink>

        <NavLink
  to="/reports"
  className={({ isActive }) =>
    isActive ? "menu-item active" : "menu-item"
  }
>
  📊 Reports
</NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;