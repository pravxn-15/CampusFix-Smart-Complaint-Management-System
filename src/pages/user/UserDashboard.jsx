import { Link } from "react-router-dom";
import { FiClipboard, FiClock, FiCheckCircle, FiAlertTriangle, FiPlusCircle, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import CategoryIcon from "../../components/common/CategoryIcon";
import EmptyState from "../../components/common/EmptyState";
import StatusDonutChart from "../../components/charts/StatusDonutChart";
import { OPEN_STATUSES, CLOSED_STATUSES } from "../../utils/statusConfig";
import { timeAgo } from "../../utils/formatDate";
import "../shared/Dashboard.css";

export default function UserDashboard() {
  const { user } = useAuth();
  const { complaints, categories } = useData();

  const mine = complaints.filter((c) => c.raisedBy === user.id);
  const open = mine.filter((c) => OPEN_STATUSES.includes(c.status));
  const resolved = mine.filter((c) => CLOSED_STATUSES.includes(c.status));
  const critical = mine.filter((c) => c.priority === "Critical" && OPEN_STATUSES.includes(c.status));

  const recent = [...mine].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const segments = [
    { label: "Open", value: open.length, color: "#2563EB" },
    { label: "Resolved", value: resolved.length, color: "#22C55E" },
    { label: "Rejected", value: mine.filter((c) => c.status === "Rejected").length, color: "#EF4444" },
  ].filter((s) => s.value > 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hi {user.name.split(" ")[0]}, here's what's happening</h1>
          <p className="text-secondary">A quick look at everything you've reported.</p>
        </div>
        <Button as={Link} to="/user/raise-complaint" icon={FiPlusCircle}>
          Raise a complaint
        </Button>
      </div>

      <div className="dash-stats">
        <StatCard icon={FiClipboard} label="Total complaints" value={mine.length} tone="primary" />
        <StatCard icon={FiClock} label="Currently open" value={open.length} tone="warning" />
        <StatCard icon={FiCheckCircle} label="Resolved" value={resolved.length} tone="success" />
        <StatCard icon={FiAlertTriangle} label="Critical &amp; open" value={critical.length} tone="danger" />
      </div>

      <div className="dash-grid">
        <Card padding="lg" className="dash-grid__main">
          <div className="dash-card__header">
            <h4>Recent complaints</h4>
            <Link to="/user/complaints" className="dash-card__link">
              View all <FiArrowRight />
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              icon={FiClipboard}
              title="No complaints yet"
              description="Spot something that needs fixing around campus?"
              actionLabel="Raise your first complaint"
              onAction={() => {}}
            />
          ) : (
            <ul className="dash-recent-list">
              {recent.map((c) => {
                const cat = categories.find((cc) => cc.id === c.category);
                return (
                  <li key={c.id}>
                    <Link to={`/user/complaints/${c.id}`} className="dash-recent-item">
                      <span className="dash-recent-item__icon">
                        <CategoryIcon icon={cat?.icon} />
                      </span>
                      <div className="dash-recent-item__body">
                        <strong>{c.title}</strong>
                        <span className="text-xs text-secondary">{c.id} · Updated {timeAgo(c.updatedAt)}</span>
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

        <div className="dash-grid__side">
          <Card padding="lg">
            <h4>Your complaints by outcome</h4>
            <div style={{ marginTop: 16 }}>
              {segments.length === 0 ? (
                <p className="text-sm text-secondary">Raise a complaint to see your stats here.</p>
              ) : (
                <StatusDonutChart segments={segments} centerValue={mine.length} centerLabel="total" />
              )}
            </div>
          </Card>

          <Card padding="lg" className="dash-cta-card">
            <FiPlusCircle />
            <h4>Something not working?</h4>
            <p>Raise a complaint in under a minute — attach a photo and we'll route it to the right team.</p>
            <Button as={Link} to="/user/raise-complaint" fullWidth>
              Raise a complaint
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
