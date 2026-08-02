import { NavLink, Link } from "react-router-dom";
import {
  FiGrid,
  FiPlusCircle,
  FiClipboard,
  FiBell,
  FiMessageSquare,
  FiStar,
  FiUser,
  FiBarChart2,
  FiPieChart,
  FiUsers,
  FiTag,
  FiSettings,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import "./DashboardSidebar.css";

const NAV_BY_ROLE = {
  user: [
    { to: "/user/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/user/raise-complaint", label: "Raise Complaint", icon: FiPlusCircle },
    { to: "/user/complaints", label: "My Complaints", icon: FiClipboard },
    { to: "/user/notifications", label: "Notifications", icon: FiBell },
    { to: "/user/messages", label: "Messages", icon: FiMessageSquare },
    { to: "/user/feedback", label: "Feedback", icon: FiStar },
    { to: "/user/profile", label: "Profile", icon: FiUser },
  ],
  staff: [
    { to: "/staff/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/staff/complaints", label: "Assigned Complaints", icon: FiClipboard },
    { to: "/staff/reports", label: "Reports", icon: FiBarChart2 },
    { to: "/staff/messages", label: "Messages", icon: FiMessageSquare },
    { to: "/staff/profile", label: "Profile", icon: FiUser },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/admin/analytics", label: "Analytics", icon: FiPieChart },
    { to: "/admin/complaints", label: "Complaints", icon: FiClipboard },
    { to: "/admin/staff", label: "Staff", icon: FiUsers },
    { to: "/admin/users", label: "Users", icon: FiUser },
    { to: "/admin/categories", label: "Categories", icon: FiTag },
    { to: "/admin/reports", label: "Reports", icon: FiBarChart2 },
    { to: "/admin/settings", label: "Settings", icon: FiSettings },
  ],
};

const ROLE_LABEL = { user: "Student portal", staff: "Staff portal", admin: "Admin console" };

export default function DashboardSidebar({ role, open, onClose }) {
  const items = NAV_BY_ROLE[role] || [];

  return (
    <>
      {open && <div className="sidebar__scrim" onClick={onClose} />}
      <aside className={`sidebar sidebar--${role} ${open ? "sidebar--open" : ""}`}>
        <div className="sidebar__top">
          <Link to="/" className="sidebar__brand">
            <span className="sidebar__mark">
              <FiCheckCircle />
            </span>
            <span>
              CampusFix
              <small>{ROLE_LABEL[role]}</small>
            </span>
          </Link>
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        <nav className="sidebar__nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            >
              <item.icon aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
