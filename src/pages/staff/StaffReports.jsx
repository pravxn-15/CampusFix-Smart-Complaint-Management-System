import { FiDownload, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";
import CategoryBarChart from "../../components/charts/CategoryBarChart";
import "../shared/Dashboard.css";

export default function StaffReports() {
  const { user } = useAuth();
  const { complaints, categories, staff } = useData();

  const mine = complaints.filter((c) => c.assignedTo === user.id);
  const staffRecord = staff.find((s) => s.id === user.id);

  const byCategory = categories
    .map((cat) => ({ label: cat.name, value: mine.filter((c) => c.category === cat.id).length }))
    .filter((c) => c.value > 0);

  const avgTurnaroundHrs =
    mine.length > 0
      ? Math.round(
          mine.reduce((sum, c) => sum + (new Date(c.updatedAt) - new Date(c.createdAt)) / 3600000, 0) / mine.length
        )
      : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Reports</h1>
          <p className="text-secondary">A summary of your performance across all assignments.</p>
        </div>
        <Button
          variant="outline"
          icon={FiDownload}
          onClick={() => toast.info("PDF export will be available once the backend is connected.")}
        >
          Export PDF
        </Button>
      </div>

      <div className="dash-stats">
        <StatCard icon={FiCheckCircle} label="Resolved (all time)" value={staffRecord?.resolvedCount ?? 0} tone="success" />
        <StatCard icon={FiClock} label="Avg. turnaround" value={`${avgTurnaroundHrs}h`} tone="primary" />
        <StatCard icon={FiStar} label="Average rating" value={staffRecord?.rating ?? "—"} tone="accent" />
        <StatCard icon={FiCheckCircle} label="Currently assigned" value={mine.length} tone="warning" />
      </div>

      <Card padding="lg">
        <h4>Assignments by category</h4>
        <div style={{ marginTop: 16 }}>
          {byCategory.length === 0 ? (
            <p className="text-sm text-secondary">No assignments yet.</p>
          ) : (
            <CategoryBarChart labels={byCategory.map((c) => c.label)} values={byCategory.map((c) => c.value)} color="#F59E0B" horizontal />
          )}
        </div>
      </Card>
    </div>
  );
}
