import { useMemo, useState } from "react";
import { FiDownload, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Select } from "../../components/common/FormField";
import StatCard from "../../components/common/StatCard";
import CategoryBarChart from "../../components/charts/CategoryBarChart";
import { CLOSED_STATUSES } from "../../utils/statusConfig";
import "../shared/Dashboard.css";
import "./AdminReports.css";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

export default function AdminReports() {
  const { complaints, categories } = useData();
  const [range, setRange] = useState("30");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const cutoff = range === "all" ? null : Date.now() - Number(range) * 86400000;
    return complaints
      .filter((c) => !cutoff || new Date(c.createdAt).getTime() >= cutoff)
      .filter((c) => !category || c.category === category);
  }, [complaints, range, category]);

  const resolved = filtered.filter((c) => CLOSED_STATUSES.includes(c.status));
  const avgResolutionHrs =
    resolved.length > 0
      ? Math.round(resolved.reduce((sum, c) => sum + (new Date(c.updatedAt) - new Date(c.createdAt)) / 3600000, 0) / resolved.length)
      : 0;

  const categoryData = categories
    .map((cat) => ({ label: cat.name, value: filtered.filter((c) => c.category === cat.id).length }))
    .filter((c) => c.value > 0);

  const reportTypes = [
    { title: "Monthly complaint summary", desc: "All complaints, grouped by status and category, for the selected range." },
    { title: "Staff performance report", desc: "Resolution counts and average ratings per staff member." },
    { title: "Category breakdown report", desc: "Volume and average resolution time per category." },
  ];

  function exportReport(name) {
    toast.info(`"${name}" export will be available once the backend is connected.`);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="text-secondary">Build a filtered view, then export it for record-keeping.</p>
        </div>
      </div>

      <Card padding="lg">
        <div className="admin-reports__filters">
          <Select label="Date range" value={range} onChange={(e) => setRange(e.target.value)} options={RANGE_OPTIONS} />
          <Select
            label="Category"
            placeholder="All categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />
          <Button variant="outline" icon={FiDownload} onClick={() => exportReport("Filtered report")}>
            Export CSV
          </Button>
          <Button variant="outline" icon={FiDownload} onClick={() => exportReport("Filtered report")}>
            Export PDF
          </Button>
        </div>
      </Card>

      <div className="dash-stats" style={{ marginTop: "var(--space-4)" }}>
        <StatCard icon={FiFileText} label="Complaints in range" value={filtered.length} tone="primary" />
        <StatCard icon={FiFileText} label="Resolved" value={resolved.length} tone="success" />
        <StatCard icon={FiFileText} label="Avg. resolution" value={`${avgResolutionHrs}h`} tone="warning" />
        <StatCard
          icon={FiFileText}
          label="Rejected"
          value={filtered.filter((c) => c.status === "Rejected").length}
          tone="danger"
        />
      </div>

      <Card padding="lg">
        <h4>Category breakdown</h4>
        <div style={{ marginTop: 16 }}>
          {categoryData.length === 0 ? (
            <p className="text-sm text-secondary">No complaints in this range.</p>
          ) : (
            <CategoryBarChart labels={categoryData.map((c) => c.label)} values={categoryData.map((c) => c.value)} horizontal />
          )}
        </div>
      </Card>

      <Card padding="lg">
        <h4>Standard reports</h4>
        <div className="admin-reports__types">
          {reportTypes.map((r) => (
            <div key={r.title} className="admin-reports__type">
              <div>
                <strong>{r.title}</strong>
                <p className="text-sm text-secondary">{r.desc}</p>
              </div>
              <Button size="sm" variant="outline" icon={FiDownload} onClick={() => exportReport(r.title)}>
                Export
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
