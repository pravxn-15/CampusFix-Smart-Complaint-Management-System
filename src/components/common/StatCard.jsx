import Card from "./Card";
import "./StatCard.css";

export default function StatCard({ icon: Icon, label, value, tone = "primary", trend }) {
  return (
    <Card padding="lg" className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${tone}`}>
        <Icon aria-hidden="true" />
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        {trend && <em className={trend.direction === "down" ? "tone-danger" : "tone-success"}>{trend.text}</em>}
      </div>
    </Card>
  );
}
