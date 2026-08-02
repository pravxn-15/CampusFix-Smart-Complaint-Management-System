import { STATUS_CONFIG } from "../../utils/statusConfig";
import { formatDateTime } from "../../utils/formatDate";
import "./Timeline.css";

export default function Timeline({ events, getActorName }) {
  return (
    <ol className="timeline">
      {events.map((event, i) => {
        const tone = STATUS_CONFIG[event.status]?.tone || "muted";
        const isLast = i === events.length - 1;
        return (
          <li key={i} className="timeline__item">
            <div className="timeline__rail">
              <span className={`timeline__dot timeline__dot--${tone}`} />
              {!isLast && <span className="timeline__line" />}
            </div>
            <div className="timeline__content">
              <div className="timeline__row">
                <strong>{event.status}</strong>
                <time className="text-xs text-secondary">{formatDateTime(event.timestamp)}</time>
              </div>
              <p className="text-sm">{event.note}</p>
              {getActorName && (
                <span className="text-xs text-secondary">— {getActorName(event.actor)}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
