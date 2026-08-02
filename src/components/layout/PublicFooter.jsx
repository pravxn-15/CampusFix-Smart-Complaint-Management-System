import { Link } from "react-router-dom";
import { FiCheckCircle, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import "./PublicNavbar.css";
import "./PublicFooter.css";

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container public-footer__grid">
        <div className="public-footer__brand">
          <span className="public-nav__brand" style={{ color: "#fff" }}>
            <span className="public-nav__mark">
              <FiCheckCircle />
            </span>
            CampusFix
          </span>
          <p>The place your campus keeps its promises — raise it, track it, get it fixed.</p>
        </div>

        <div>
          <h4>Product</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/register">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h4>Reach the help desk</h4>
          <ul className="public-footer__contact">
            <li><FiMail /> helpdesk@campusfix.edu</li>
            <li><FiPhone /> +91 98765 43210</li>
            <li><FiMapPin /> Student Services Block, Ground Floor</li>
          </ul>
        </div>
      </div>
      <div className="container public-footer__bottom">
        <span>© {new Date().getFullYear()} CampusFix. Built for campuses that fix things fast.</span>
      </div>
    </footer>
  );
}
