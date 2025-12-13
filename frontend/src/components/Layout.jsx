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

  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link to="/" className="logo">
          Korall 2000
        </Link>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
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
