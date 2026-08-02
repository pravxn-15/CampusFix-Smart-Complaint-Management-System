import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export const CHART_FONT = {
  family: "Inter, system-ui, sans-serif",
  size: 12,
};

export const TONE_COLORS = {
  primary: "#2563EB",
  accent: "#F59E0B",
  success: "#22C55E",
  warning: "#F97316",
  danger: "#EF4444",
  secondary: "#0F172A",
  muted: "#94A3B8",
};
