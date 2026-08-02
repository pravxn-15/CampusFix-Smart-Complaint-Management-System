import "./Avatar.css";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Avatar({ name, color = "#2563EB", size = 40, src, className = "" }) {
  const dim = { width: size, height: size, fontSize: size * 0.4 };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar ${className}`}
        style={dim}
      />
    );
  }

  return (
    <div
      className={`avatar avatar--fallback ${className}`}
      style={{ ...dim, background: color }}
      aria-label={name}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
