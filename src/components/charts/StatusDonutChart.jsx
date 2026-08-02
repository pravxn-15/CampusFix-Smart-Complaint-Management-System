import { Doughnut } from "react-chartjs-2";
import "./chartSetup";
import "./Charts.css";

export default function StatusDonutChart({ segments, centerValue, centerLabel }) {
  const data = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => s.value),
        backgroundColor: segments.map((s) => s.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0F172A",
        padding: 10,
        titleFont: { family: "Inter" },
        bodyFont: { family: "Inter" },
      },
    },
  };

  return (
    <div className="chart-donut">
      <div className="chart-donut__canvas">
        <Doughnut data={data} options={options} />
        {centerValue !== undefined && (
          <div className="chart-donut__center">
            <strong>{centerValue}</strong>
            <span>{centerLabel}</span>
          </div>
        )}
      </div>
      <ul className="chart-legend">
        {segments.map((s) => (
          <li key={s.label}>
            <span style={{ background: s.color }} />
            {s.label} <strong>{s.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
