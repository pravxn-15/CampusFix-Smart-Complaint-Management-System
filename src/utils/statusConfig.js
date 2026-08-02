// Central source of truth for how each complaint status is labelled,
// coloured, and sequenced. Keeping this in one place means a Badge, a
// Timeline step, and a chart legend all agree with each other.

export const STATUS_ORDER = [
  "Pending",
  "Assigned",
  "Accepted",
  "In Progress",
  "On Hold",
  "Resolved",
  "Closed",
  "Rejected",
];

export const STATUS_CONFIG = {
  Pending: { tone: "muted", description: "Waiting for review" },
  Assigned: { tone: "info", description: "Handed to a staff member" },
  Accepted: { tone: "info", description: "Staff has taken it up" },
  "In Progress": { tone: "warning", description: "Actively being worked on" },
  "On Hold": { tone: "accent", description: "Paused, waiting on something" },
  Resolved: { tone: "success", description: "Fixed, awaiting your confirmation" },
  Closed: { tone: "muted", description: "Confirmed and closed" },
  Rejected: { tone: "danger", description: "Could not be actioned" },
};

// Statuses that count as "still open" for dashboard stat cards.
export const OPEN_STATUSES = ["Pending", "Assigned", "Accepted", "In Progress", "On Hold"];
export const CLOSED_STATUSES = ["Resolved", "Closed"];

export function nextStatuses(current) {
  const flow = {
    Pending: ["Assigned", "Rejected"],
    Assigned: ["Accepted", "Rejected"],
    Accepted: ["In Progress", "On Hold"],
    "In Progress": ["On Hold", "Resolved"],
    "On Hold": ["In Progress"],
    Resolved: ["Closed"],
    Closed: [],
    Rejected: [],
  };
  return flow[current] || [];
}
