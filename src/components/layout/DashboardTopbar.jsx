import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiMoon, FiSun, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import Avatar from "../common/Avatar";
import Dropdown, { DropdownItem } from "../common/Dropdown";
import { timeAgo } from "../../utils/formatDate";
import EmptyState from "../common/EmptyState";
import "./DashboardTopbar.css";

export default function DashboardTopbar({ role, onMenuClick, title }) {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const myNotifications = notifications
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const unread = myNotifications.filter((n) => !n.read).length;

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__icon-btn topbar__menu" onClick={onMenuClick} aria-label="Open menu">
          <FiMenu />
        </button>
        {title && <h1 className="topbar__title">{title}</h1>}
      </div>

      <div className="topbar__right">
        <button className="topbar__icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>

        <Dropdown
          align="right"
          trigger={() => (
            <button className="topbar__icon-btn" aria-label="Notifications">
              <FiBell />
              {unread > 0 && <span className="topbar__badge">{unread}</span>}
            </button>
          )}
        >
          <div className="notif-panel">
            <div className="notif-panel__header">
              <strong>Notifications</strong>
              {unread > 0 && (
                <button onClick={() => markAllNotificationsRead(user.id)}>Mark all read</button>
              )}
            </div>
            <div className="notif-panel__list">
              {myNotifications.length === 0 ? (
                <EmptyState icon={FiBell} title="You're all caught up" description="New updates will show up here." />
              ) : (
                myNotifications.slice(0, 6).map((n) => (
                  <button
                    key={n.id}
                    className={`notif-panel__item ${!n.read ? "notif-panel__item--unread" : ""}`}
                    onClick={() => {
                      markNotificationRead(n.id);
                      navigate(`/${role}/complaints/${n.complaintId}`);
                    }}
                  >
                    <span className="notif-panel__dot" />
                    <span>
                      <strong>{n.title}</strong>
                      <p>{n.body}</p>
                      <time>{timeAgo(n.timestamp)}</time>
                    </span>
                  </button>
                ))
              )}
            </div>
            <Link to={`/${role}/notifications`} className="notif-panel__footer">
              View all notifications
            </Link>
          </div>
        </Dropdown>

        <Dropdown
          align="right"
          trigger={({ open }) => (
            <button className="topbar__profile" aria-label="Account menu">
              <Avatar name={user.name} color={user.avatarColor || "#2563EB"} size={34} />
              <span className="topbar__profile-name">{user.name.split(" ")[0]}</span>
              <FiChevronDown className={`topbar__chevron ${open ? "topbar__chevron--open" : ""}`} />
            </button>
          )}
        >
          <DropdownItem icon={FiUser} onClick={() => navigate(`/${role}/profile`)}>
            My profile
          </DropdownItem>
          <DropdownItem
            icon={FiLogOut}
            danger
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
