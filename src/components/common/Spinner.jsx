export default function Spinner({ size = 20, color = "var(--color-primary)" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `2.5px solid ${color}33`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}
