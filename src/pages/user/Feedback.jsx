import { useState } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { formatDate } from "../../utils/formatDate";
import "./Feedback.css";
import "./Feedback.css";

function RatingRow({ complaint }) {
  const { submitFeedback } = useData();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [expanded, setExpanded] = useState(false);

  if (complaint.feedback) {
    return (
      <div className="feedback-row">
        <div className="feedback-row__info">
          <strong>{complaint.title}</strong>
          <span className="text-xs text-secondary">{complaint.id} · Resolved {formatDate(complaint.updatedAt)}</span>
        </div>
        <div className="feedback-row__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <FiStar key={n} className={n <= complaint.feedback.rating ? "star--filled" : ""} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-row feedback-row--pending">
      <div className="feedback-row__top">
        <div className="feedback-row__info">
          <strong>{complaint.title}</strong>
          <span className="text-xs text-secondary">{complaint.id} · Resolved {formatDate(complaint.updatedAt)}</span>
        </div>
        {!expanded && (
          <Button size="sm" variant="outline" onClick={() => setExpanded(true)}>
            Rate this fix
          </Button>
        )}
      </div>
      {expanded && (
        <div className="feedback-row__form">
          <div className="feedback-row__stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                <FiStar className={n <= rating ? "star--filled" : ""} />
              </button>
            ))}
          </div>
          <input
            className="field__input"
            placeholder="Anything else to add? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button size="sm" onClick={() => submitFeedback(complaint.id, rating, comment)}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Feedback() {
  const { user } = useAuth();
  const { complaints } = useData();

  const resolved = complaints
    .filter((c) => c.raisedBy === user.id && (c.status === "Resolved" || c.status === "Closed"))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const pending = resolved.filter((c) => !c.feedback);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Feedback</h1>
          <p className="text-secondary">
            {pending.length > 0 ? `${pending.length} resolved complaint${pending.length > 1 ? "s" : ""} waiting for your rating.` : "You're all caught up on feedback."}
          </p>
        </div>
      </div>

      <Card padding="lg">
        {resolved.length === 0 ? (
          <EmptyState
            icon={FiCheckCircle}
            title="Nothing to rate yet"
            description="Once a complaint is marked resolved, you can leave feedback here."
          />
        ) : (
          <div className="feedback-list">
            {resolved.map((c) => (
              <RatingRow key={c.id} complaint={c} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
