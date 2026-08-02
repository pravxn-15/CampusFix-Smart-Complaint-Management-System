import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX, FiCheckCircle } from "react-icons/fi";
import Button from "../common/Button";
import "./PublicNavbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="public-nav">
      <div className="container public-nav__row">
        <Link to="/" className="public-nav__brand" onClick={() => setOpen(false)}>
          <span className="public-nav__mark">
            <FiCheckCircle />
          </span>
          CampusFix
        </Link>

        <nav className={`public-nav__links ${open ? "public-nav__links--open" : ""}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `public-nav__link ${isActive ? "public-nav__link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="public-nav__actions public-nav__actions--mobile">
            <Button as={Link} to="/login" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Log in
            </Button>
            <Button as={Link} to="/register" variant="primary" size="sm" onClick={() => setOpen(false)}>
              Get started
            </Button>
          </div>
        </nav>

        <div className="public-nav__actions">
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to="/register" variant="primary" size="sm">
            Get started
          </Button>
        </div>

        <button className="public-nav__toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
}
