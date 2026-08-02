import { Line } from "react-chartjs-2";
import "./chartSetup";

export default function TrendsLineChart({ labels, series }) {
  const data = {
    labels,
    datasets: series.map((s) => ({
      label: s.label,
      data: s.values,
      borderColor: s.color,
      backgroundColor: `${s.color}22`,
      tension: 0.35,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 4,
      borderWidth: 2,
    })),
  };

  const options = {
    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true, font: { family: "Inter", size: 11 }, boxWidth: 8 } },
      tooltip: { backgroundColor: "#0F172A", padding: 10 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: "Inter", size: 11 } } },
      y: { grid: { color: "#E5E7EB" }, ticks: { font: { family: "Inter", size: 11 } }, beginAtZero: true },
    },
  };

  return (
    <div style={{ height: 260 }}>
      <Line data={data} options={options} />
    </div>
  );
}
