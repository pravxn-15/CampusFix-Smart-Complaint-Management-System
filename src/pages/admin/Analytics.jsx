import { useMemo } from "react";
import { FiTrendingUp } from "react-icons/fi";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Avatar from "../../components/common/Avatar";
import TrendsLineChart from "../../components/charts/TrendsLineChart";
import CategoryBarChart from "../../components/charts/CategoryBarChart";
import StatusDonutChart from "../../components/charts/StatusDonutChart";
import { PRIORITY_CONFIG } from "../../utils/priorityConfig";
import "../shared/DataTable.css";
import "../shared/Dashboard.css";
import "./Analytics.css";

function buildDailyTrend(complaints, days = 14) {
  const labels = [];
  const raised = [];
  const resolved = [];

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);

    labels.push(day.toLocaleDateString("en-IN", { day: "numeric", month: "short" }));
    raised.push(complaints.filter((c) => new Date(c.createdAt) >= day && new Date(c.createdAt) < next).length);
    resolved.push(
      complaints.filter(
        (c) => (c.status === "Resolved" || c.status === "Closed") && new Date(c.updatedAt) >= day && new Date(c.updatedAt) < next
      ).length
    );
  }
  return { labels, raised, resolved };
}

export default function Analytics() {
  const { complaints, categories, staff } = useData();

  const trend = useMemo(() => buildDailyTrend(complaints), [complaints]);

  const categoryData = categories
    .map((cat) => ({ label: cat.name, value: complaints.filter((c) => c.category === cat.id).length }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const priorityColors = { Low: "#94A3B8", Medium: "#F59E0B", High: "#F97316", Critical: "#EF4444" };
  const prioritySegments = Object.keys(PRIORITY_CONFIG)
    .map((p) => ({ label: p, value: complaints.filter((c) => c.priority === p).length, color: priorityColors[p] }))
    .filter((s) => s.value > 0);

  const sortedStaff = [...staff].sort((a, b) => b.resolvedCount - a.resolvedCount);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="text-secondary">Complaint trends and staff performance across the last two weeks.</p>
        </div>
      </div>

      <Card padding="lg">
        <h4><FiTrendingUp style={{ marginBottom: -2 }} /> Complaint trends</h4>
        <div style={{ marginTop: 16 }}>
          <TrendsLineChart
            labels={trend.labels}
            series={[
              { label: "Raised", values: trend.raised, color: "#2563EB" },
              { label: "Resolved", values: trend.resolved, color: "#22C55E" },
            ]}
          />
        </div>
      </Card>

      <div className="admin-dash__row admin-dash__row--wide">
        <Card padding="lg">
          <h4>Complaints by category</h4>
          <div style={{ marginTop: 16 }}>
            <CategoryBarChart labels={categoryData.map((c) => c.label)} values={categoryData.map((c) => c.value)} horizontal />
          </div>
        </Card>
        <Card padding="lg">
          <h4>By priority</h4>
          <div style={{ marginTop: 16 }}>
            <StatusDonutChart segments={prioritySegments} centerValue={complaints.length} centerLabel="total" />
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <h4>Staff performance</h4>
        <div className="analytics__table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff member</th>
                <th>Department</th>
                <th>Active</th>
                <th>Resolved</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedStaff.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="data-table__person">
                      <Avatar name={s.name} color={s.avatarColor} size={32} />
                      <strong style={{ fontSize: "var(--fs-sm)" }}>{s.name}</strong>
                    </div>
                  </td>
                  <td className="text-sm text-secondary">{s.department}</td>
                  <td className="text-sm">{s.activeCount}</td>
                  <td className="text-sm">{s.resolvedCount}</td>
                  <td className="text-sm">★ {s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
