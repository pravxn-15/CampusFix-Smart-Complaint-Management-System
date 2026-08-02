import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiMessageSquare,
  FiUser,
  FiStar,
  FiAlertOctagon,
  FiImage,
  FiSend,
} from "react-icons/fi";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { StatusBadge, PriorityBadge } from "../../components/common/Badge";
import CategoryIcon from "../../components/common/CategoryIcon";
import Avatar from "../../components/common/Avatar";
import Timeline from "../../components/common/Timeline";
import ProgressSteps from "../../components/common/ProgressSteps";
import { Select, TextArea } from "../../components/common/FormField";
import { formatDate, formatDateTime } from "../../utils/formatDate";
import { nextStatuses } from "../../utils/statusConfig";
import EmptyState from "../../components/common/EmptyState";
import "./ComplaintDetails.css";

const HAPPY_PATH = ["Pending", "Assigned", "Accepted", "In Progress", "Resolved", "Closed"];

export default function ComplaintDetails({ role }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    complaints,
    categories,
    staff,
    findPerson,
    changeStatus,
    assignStaff,
    addComment,
    addInternalNote,
    submitFeedback,
  } = useData();

  const [comment, setComment] = useState("");
  const [note, setNote] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [pendingStaffId, setPendingStaffId] = useState("");

  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return (
      <EmptyState
        icon={FiAlertOctagon}
        title="Complaint not found"
        description="It may have been removed, or the link is incorrect."
        actionLabel="Back to complaints"
        onAction={() => navigate(`/${role}/complaints`)}
      />
    );
  }

  const category = categories.find((c) => c.id === complaint.category);
  const raisedByPerson = findPerson(complaint.raisedBy);
  const assignedPerson = complaint.assignedTo ? findPerson(complaint.assignedTo) : null;
  const isOwner = role === "user" && complaint.raisedBy === user.id;
  const canManage = role === "staff" || role === "admin";
  const eligibleStaff = staff.filter((s) => s.specialty.includes(complaint.category));

  const currentIndex = HAPPY_PATH.indexOf(complaint.status === "On Hold" ? "In Progress" : complaint.status);
  const showFeedbackForm = isOwner && complaint.status === "Resolved" && !complaint.feedback;

  return (
    <div className="complaint-details">
      <button className="complaint-details__back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="complaint-details__header">
        <div>
          <span className="text-xs text-secondary">{complaint.id}</span>
          <h1>{complaint.title}</h1>
          <div className="complaint-details__badges">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            <span className="complaint-details__category">
              <CategoryIcon icon={category?.icon} /> {category?.name}
            </span>
          </div>
        </div>
        {canManage && assignedPerson && role !== "admin" && (
          <Button as={Link} to={`/${role}/messages/${complaint.id}`} icon={FiMessageSquare} variant="outline">
            Open chat
          </Button>
        )}
        {isOwner && complaint.assignedTo && (
          <Button as={Link} to={`/${role}/messages/${complaint.id}`} icon={FiMessageSquare} variant="outline">
            Message staff
          </Button>
        )}
      </div>

      {complaint.status === "Rejected" ? (
        <Card padding="lg" className="complaint-details__rejected">
          <FiAlertOctagon />
          <div>
            <strong>This complaint was rejected.</strong>
            <p>{complaint.timeline[complaint.timeline.length - 1]?.note}</p>
          </div>
        </Card>
      ) : (
        <Card padding="lg">
          <ProgressSteps steps={HAPPY_PATH} currentIndex={currentIndex} />
          {complaint.status === "On Hold" && (
            <p className="text-sm complaint-details__hold-note">⏸ Currently on hold — see timeline for details.</p>
          )}
        </Card>
      )}

      <div className="complaint-details__grid">
        <div className="complaint-details__main">
          <Card padding="lg">
            <h4>Description</h4>
            <p style={{ marginTop: 8 }}>{complaint.description}</p>
            <div className="complaint-details__meta">
              <span><FiMapPin /> {complaint.location}</span>
              <span><FiCalendar /> Raised {formatDate(complaint.createdAt)}</span>
            </div>
            {complaint.images?.length > 0 && (
              <div className="complaint-details__images">
                {complaint.images.map((img, i) => (
                  <div key={i} className="complaint-details__image-ph">
                    <FiImage /> <span>{img}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card padding="lg">
            <h4>Timeline</h4>
            <div style={{ marginTop: 16 }}>
              <Timeline events={complaint.timeline} getActorName={(id) => findPerson(id)?.name || "System"} />
            </div>
          </Card>

          <Card padding="lg">
            <h4>Comments</h4>
            <div className="complaint-details__comments">
              {complaint.comments.length === 0 && <p className="text-sm text-secondary">No comments yet.</p>}
              {complaint.comments.map((c, i) => {
                const person = findPerson(c.author);
                return (
                  <div key={i} className="complaint-details__comment">
                    <Avatar name={person?.name || "?"} color={person?.avatarColor} size={32} />
                    <div>
                      <div className="complaint-details__comment-head">
                        <strong>{person?.name}</strong>
                        <time>{formatDateTime(c.timestamp)}</time>
                      </div>
                      <p>{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form
              className="complaint-details__comment-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                addComment(complaint.id, comment.trim(), user);
                setComment("");
              }}
            >
              <input
                className="field__input"
                placeholder="Add a comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button type="submit" size="md" icon={FiSend}>
                Send
              </Button>
            </form>
          </Card>

          {canManage && (
            <Card padding="lg">
              <h4>Internal notes <span className="text-xs text-secondary">(staff &amp; admin only)</span></h4>
              <div className="complaint-details__comments">
                {complaint.internalNotes.length === 0 && <p className="text-sm text-secondary">No internal notes yet.</p>}
                {complaint.internalNotes.map((n, i) => {
                  const person = findPerson(n.author);
                  return (
                    <div key={i} className="complaint-details__comment">
                      <Avatar name={person?.name || "?"} color={person?.avatarColor} size={32} />
                      <div>
                        <div className="complaint-details__comment-head">
                          <strong>{person?.name}</strong>
                          <time>{formatDateTime(n.timestamp)}</time>
                        </div>
                        <p>{n.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form
                className="complaint-details__comment-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!note.trim()) return;
                  addInternalNote(complaint.id, note.trim(), user);
                  setNote("");
                }}
              >
                <input
                  className="field__input"
                  placeholder="Add an internal note…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button type="submit" size="md" variant="outline" icon={FiSend}>
                  Add
                </Button>
              </form>
            </Card>
          )}

          {showFeedbackForm && (
            <Card padding="lg">
              <h4>How was the fix?</h4>
              <div className="complaint-details__rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setFeedbackRating(n)} aria-label={`${n} stars`}>
                    <FiStar className={n <= feedbackRating ? "star--filled" : ""} />
                  </button>
                ))}
              </div>
              <TextArea
                placeholder="Anything else to add? (optional)"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={3}
              />
              <Button
                style={{ marginTop: 12 }}
                onClick={() => submitFeedback(complaint.id, feedbackRating, feedbackComment)}
              >
                Submit feedback
              </Button>
            </Card>
          )}

          {complaint.feedback && (
            <Card padding="lg">
              <h4>Feedback</h4>
              <div className="complaint-details__rating" style={{ pointerEvents: "none", marginTop: 8 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <FiStar key={n} className={n <= complaint.feedback.rating ? "star--filled" : ""} />
                ))}
              </div>
              {complaint.feedback.comment && <p style={{ marginTop: 8 }}>{complaint.feedback.comment}</p>}
            </Card>
          )}
        </div>

        <div className="complaint-details__side">
          <Card padding="lg">
            <h4>People</h4>
            <div className="complaint-details__person">
              <Avatar name={raisedByPerson?.name || "?"} color={raisedByPerson?.avatarColor} />
              <div>
                <span className="text-xs text-secondary">Raised by</span>
                <strong>{raisedByPerson?.name}</strong>
              </div>
            </div>
            {assignedPerson ? (
              <div className="complaint-details__person">
                <Avatar name={assignedPerson.name} color={assignedPerson.avatarColor} />
                <div>
                  <span className="text-xs text-secondary">Assigned to</span>
                  <strong>{assignedPerson.name}</strong>
                </div>
              </div>
            ) : (
              <div className="complaint-details__person">
                <div className="complaint-details__unassigned"><FiUser /></div>
                <div>
                  <span className="text-xs text-secondary">Assigned to</span>
                  <strong>Not yet assigned</strong>
                </div>
              </div>
            )}
            <p className="text-xs text-secondary" style={{ marginTop: 12 }}>
              Est. resolution: ~{complaint.estimatedResolutionHrs} hrs
            </p>
          </Card>

          {role === "admin" && !complaint.assignedTo && (
            <Card padding="lg">
              <h4>Assign staff</h4>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                <Select
                  placeholder="Choose a staff member"
                  value={pendingStaffId}
                  onChange={(e) => setPendingStaffId(e.target.value)}
                  options={(eligibleStaff.length ? eligibleStaff : staff).map((s) => ({ value: s.id, label: `${s.name} (${s.department})` }))}
                />
                <Button disabled={!pendingStaffId} onClick={() => assignStaff(complaint.id, pendingStaffId, user)}>
                  Assign
                </Button>
              </div>
            </Card>
          )}

          {canManage && nextStatuses(complaint.status).length > 0 && (
            <Card padding="lg">
              <h4>Update status</h4>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {nextStatuses(complaint.status).map((s) => (
                  <Button
                    key={s}
                    variant={s === "Rejected" ? "outline" : "primary"}
                    onClick={() => changeStatus(complaint.id, s, `Marked as ${s}.`, user)}
                  >
                    Move to {s}
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
