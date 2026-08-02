import { useNavigate } from "react-router-dom";
import { FiBell, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { timeAgo } from "../../utils/formatDate";
import "./Notifications.css";

export default function Notifications({ role }) {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const navigate = useNavigate();

  const mine = notifications
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const unreadCount = mine.filter((n) => !n.read).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="text-secondary">Stay on top of every update to your complaints.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" icon={FiCheckCircle} onClick={() => markAllNotificationsRead(user.id)}>
            Mark all as read
          </Button>
        )}
      </div>

      <Card padding="none">
        {mine.length === 0 ? (
          <EmptyState icon={FiBell} title="No notifications yet" description="You'll see updates here as things happen." />
        ) : (
          <ul className="notif-list">
            {mine.map((n) => (
              <li key={n.id} className={`notif-list__item ${!n.read ? "notif-list__item--unread" : ""}`}>
                <button
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.complaintId) navigate(`/${role}/complaints/${n.complaintId}`);
                  }}
                >
                  <span className="notif-list__dot" />
                  <div>
                    <strong>{n.title}</strong>
                    <p>{n.body}</p>
                  </div>
                  <time>{timeAgo(n.timestamp)}</time>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
