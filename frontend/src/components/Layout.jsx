import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useI18n } from "../context/I18nContext";
import ChatbotWidget from "./ChatbotWidget";

const Layout = ({ children }) => {
  const { items } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/products", label: t("nav.products") },
    { to: "/cart", label: t("nav.cart") },
    { to: "/admin", label: t("nav.admin") },
  ];

  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link to="/" className="logo">
          {t("brand")}
        </Link>
        <div className="nav-actions">
          <div className="lang-toggle">
            <button
              type="button"
              className={language === "de" ? "active" : ""}
              onClick={() => setLanguage("de")}
            >
              {t("language.de")}
            </button>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              {t("language.en")}
            </button>
          </div>
        </div>
        <button
          type="button"
          className="burger"
          aria-label={t("nav.menu")}
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
      <ChatbotWidget />
    </div>
  );
};

export default Layout;
