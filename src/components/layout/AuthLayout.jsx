import { Link, Outlet } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import "../layout/PublicNavbar.css";
import "./AuthLayout.css";

const STEPS = ["Raised", "Assigned", "In Progress", "Resolved"];

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__hero">
        <div className="auth-layout__mesh" aria-hidden="true" />
        <Link to="/" className="auth-layout__brand">
          <span className="public-nav__mark">
            <FiCheckCircle />
          </span>
          CampusFix
        </Link>

        <div className="auth-layout__card">
          <p className="auth-layout__eyebrow">Right now on campus</p>
          <h2>Every complaint moves — you can watch it happen.</h2>
          <div className="auth-layout__flow">
            {STEPS.map((step, i) => (
              <div key={step} className={`auth-layout__step ${i === 2 ? "auth-layout__step--active" : ""}`}>
                <span />
                {step}
              </div>
            ))}
          </div>
          <p className="auth-layout__quote">
            "Reported a broken tube light Tuesday night — fixed by Wednesday afternoon.
            I could see exactly who was on it."
          </p>
          <span className="text-xs auth-layout__quote-author">— Aditi, Hostel Block A</span>
        </div>
      </div>

      <div className="auth-layout__panel">
        <Outlet />
      </div>
    </div>
  );
}
