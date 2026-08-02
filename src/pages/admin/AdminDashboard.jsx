import { Link } from "react-router-dom";
import {
  FiClipboard,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiCalendar,
  FiArrowRight,
  FiActivity,
} from "react-icons/fi";
import { useData } from "../../context/DataContext";
import StatCard from "../../components/common/StatCard";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import StatusDonutChart from "../../components/charts/StatusDonutChart";
import CategoryBarChart from "../../components/charts/CategoryBarChart";
import { OPEN_STATUSES } from "../../utils/statusConfig";
import { timeAgo } from "../../utils/formatDate";
import "../shared/Dashboard.css";
import "./AdminDashboard.css";

function isToday(iso) {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function AdminDashboard() {
  const { complaints, categories, staff, activityLog } = useData();

  const open = complaints.filter((c) => OPEN_STATUSES.includes(c.status));
  const resolved = complaints.filter((c) => c.status === "Resolved" || c.status === "Closed");
  const critical = complaints.filter((c) => c.priority === "Critical" && OPEN_STATUSES.includes(c.status));
  const today = complaints.filter((c) => isToday(c.createdAt));

  const statusSegments = [
    { label: "Pending", value: complaints.filter((c) => c.status === "Pending").length, color: "#94A3B8" },
    { label: "In progress", value: complaints.filter((c) => ["Assigned", "Accepted", "In Progress", "On Hold"].includes(c.status)).length, color: "#F59E0B" },
    { label: "Resolved", value: resolved.length, color: "#22C55E" },
    { label: "Rejected", value: complaints.filter((c) => c.status === "Rejected").length, color: "#EF4444" },
  ].filter((s) => s.value > 0);

  const topCategories = categories
    .map((cat) => ({ label: cat.name, value: complaints.filter((c) => c.category === cat.id).length }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const topStaff = [...staff].sort((a, b) => b.resolvedCount - a.resolvedCount).slice(0, 4);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Admin overview</h1>
          <p className="text-secondary">Live snapshot of every complaint across campus.</p>
        </div>
        <Link to="/admin/complaints" className="dash-card__link">
          Manage complaints <FiArrowRight />
        </Link>
      </div>

      <div className="dash-stats">
        <StatCard icon={FiClipboard} label="Total complaints" value={complaints.length} tone="primary" />
        <StatCard icon={FiClock} label="Currently open" value={open.length} tone="warning" />
        <StatCard icon={FiCheckCircle} label="Resolved" value={resolved.length} tone="success" />
        <StatCard icon={FiAlertTriangle} label="Critical & open" value={critical.length} tone="danger" />
      </div>

      <div className="admin-dash__row">
        <Card padding="lg">
          <div className="dash-card__header">
            <h4><FiCalendar /> Today's complaints</h4>
          </div>
          <strong className="admin-dash__big-number">{today.length}</strong>
          <p className="text-sm text-secondary">complaints raised today across all categories</p>
        </Card>
        <Card padding="lg">
          <h4>Status breakdown</h4>
          <div style={{ marginTop: 12 }}>
            <StatusDonutChart segments={statusSegments} centerValue={complaints.length} centerLabel="total" />
          </div>
        </Card>
      </div>

      <div className="admin-dash__row admin-dash__row--wide">
        <Card padding="lg">
          <h4>Top categories</h4>
          <div style={{ marginTop: 16 }}>
            <CategoryBarChart labels={topCategories.map((c) => c.label)} values={topCategories.map((c) => c.value)} />
          </div>
        </Card>

        <Card padding="lg">
          <div className="dash-card__header">
            <h4>Recent activity</h4>
          </div>
          <ul className="admin-dash__activity">
            {activityLog.slice(0, 6).map((log) => (
              <li key={log.id}>
                <span className="admin-dash__activity-icon"><FiActivity /></span>
                <div>
                  <span><strong>{log.actor}</strong> {log.action}</span>
                  <time>{timeAgo(log.timestamp)}</time>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card padding="lg">
        <div className="dash-card__header">
          <h4>Staff performance</h4>
          <Link to="/admin/staff" className="dash-card__link">
            Manage staff <FiArrowRight />
          </Link>
        </div>
        <div className="admin-dash__staff-grid">
          {topStaff.map((s) => (
            <div key={s.id} className="admin-dash__staff-card">
              <Avatar name={s.name} color={s.avatarColor} size={40} />
              <div>
                <strong>{s.name}</strong>
                <span className="text-xs text-secondary">{s.department}</span>
              </div>
              <div className="admin-dash__staff-stats">
                <span>{s.resolvedCount} resolved</span>
                <span>★ {s.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
