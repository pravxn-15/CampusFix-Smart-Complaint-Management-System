import { Bar } from "react-chartjs-2";
import "./chartSetup";

export default function CategoryBarChart({ labels, values, color = "#2563EB", horizontal = false }) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: color,
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? "y" : "x",
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#0F172A", padding: 10 } },
    scales: {
      x: { grid: { display: !horizontal, color: "#E5E7EB" }, ticks: { font: { family: "Inter", size: 11 } } },
      y: { grid: { display: horizontal, color: "#E5E7EB" }, ticks: { font: { family: "Inter", size: 11 } }, beginAtZero: true },
    },
  };

  return (
    <div style={{ height: horizontal ? labels.length * 34 + 20 : 260 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
