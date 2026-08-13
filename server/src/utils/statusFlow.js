const FLOW = {
  Pending: ["Assigned", "Rejected"],
  Assigned: ["Accepted", "Rejected"],
  Accepted: ["In Progress", "On Hold"],
  "In Progress": ["On Hold", "Resolved"],
  "On Hold": ["In Progress"],
  Resolved: ["Closed"],
  Closed: [],
  Rejected: [],
};

export function nextStatuses(current) {
  return FLOW[current] || [];
}

export function isValidTransition(from, to) {
  return nextStatuses(from).includes(to);
}
