import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Produkte" },
  { to: "/cart", label: "Warenkorb" },
  { to: "/admin", label: "Admin" },
];

const Layout = ({ children }) => {
  const { items } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link to="/" className="logo">
          Korall 2000
        </Link>
        <button
          type="button"
          className="burger"
          aria-label="Menü öffnen"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "open" : ""}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              {item.to === "/cart" && items.length > 0 ? (
                <span className="badge">{items.length}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
