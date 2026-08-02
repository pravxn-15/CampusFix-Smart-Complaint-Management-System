import { STATUS_CONFIG } from "../../utils/statusConfig";
import { PRIORITY_CONFIG } from "../../utils/priorityConfig";
import "./Badge.css";

export function Badge({ children, tone = "muted", dot = false, className = "" }) {
  return (
    <span className={`badge badge--${tone} ${className}`}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { tone: "muted" };
  return (
    <Badge tone={config.tone} dot>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || { tone: "muted" };
  return <Badge tone={config.tone}>{priority}</Badge>;
}

export default Badge;
