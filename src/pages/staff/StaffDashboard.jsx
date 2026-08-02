import { Link } from "react-router-dom";
import { FiClipboard, FiClock, FiCheckCircle, FiStar, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import CategoryIcon from "../../components/common/CategoryIcon";
import EmptyState from "../../components/common/EmptyState";
import { OPEN_STATUSES } from "../../utils/statusConfig";
import { PRIORITY_CONFIG } from "../../utils/priorityConfig";
import { timeAgo } from "../../utils/formatDate";
import "../shared/Dashboard.css";

export default function StaffDashboard() {
  const { user } = useAuth();
  const { complaints, categories, staff } = useData();

  const mine = complaints.filter((c) => c.assignedTo === user.id);
  const active = mine.filter((c) => OPEN_STATUSES.includes(c.status));
  const resolved = mine.filter((c) => c.status === "Resolved" || c.status === "Closed");
  const staffRecord = staff.find((s) => s.id === user.id);

  const queue = [...active].sort(
    (a, b) => PRIORITY_CONFIG[b.priority].weight - PRIORITY_CONFIG[a.priority].weight || new Date(a.updatedAt) - new Date(b.updatedAt)
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hi {user.name.split(" ")[0]}, here's your queue</h1>
          <p className="text-secondary">Sorted by priority — critical items float to the top.</p>
        </div>
      </div>

      <div className="dash-stats">
        <StatCard icon={FiClipboard} label="Active assignments" value={active.length} tone="primary" />
        <StatCard
          icon={FiClock}
          label="Critical & open"
          value={active.filter((c) => c.priority === "Critical").length}
          tone="danger"
        />
        <StatCard icon={FiCheckCircle} label="Resolved (all time)" value={staffRecord?.resolvedCount ?? resolved.length} tone="success" />
        <StatCard icon={FiStar} label="Average rating" value={staffRecord?.rating ?? "—"} tone="accent" />
      </div>

      <Card padding="lg">
        <div className="dash-card__header">
          <h4>Today's queue</h4>
          <Link to="/staff/complaints" className="dash-card__link">
            View all <FiArrowRight />
          </Link>
        </div>
        {queue.length === 0 ? (
          <EmptyState icon={FiClipboard} title="Nothing in your queue" description="New assignments will show up here." />
        ) : (
          <ul className="dash-recent-list">
            {queue.slice(0, 6).map((c) => {
              const cat = categories.find((cc) => cc.id === c.category);
              return (
                <li key={c.id}>
                  <Link to={`/staff/complaints/${c.id}`} className="dash-recent-item">
                    <span className="dash-recent-item__icon">
                      <CategoryIcon icon={cat?.icon} />
                    </span>
                    <div className="dash-recent-item__body">
                      <strong>{c.title}</strong>
                      <span className="text-xs text-secondary">{c.location} · Updated {timeAgo(c.updatedAt)}</span>
                    </div>
                    <div className="dash-recent-item__badges">
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
