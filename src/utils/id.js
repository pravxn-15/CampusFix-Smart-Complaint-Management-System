let counter = 1025;

export function nextComplaintId() {
  counter += 1;
  return `CMP-${counter}`;
}

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
