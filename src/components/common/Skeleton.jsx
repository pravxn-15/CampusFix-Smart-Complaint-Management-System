export function SkeletonLine({ width = "100%", height = 14, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />;
}

export function SkeletonCircle({ size = 40 }) {
  return <div className="skeleton" style={{ width: size, height: size, borderRadius: "50%" }} />;
}

export function SkeletonCard() {
  return (
    <div className="card card--pad-md" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SkeletonCircle size={40} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <SkeletonLine width="60%" />
          <SkeletonLine width="40%" height={10} />
        </div>
      </div>
      <SkeletonLine width="100%" />
      <SkeletonLine width="80%" />
    </div>
  );
}

export function SkeletonTableRows({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} style={{ padding: "14px 16px" }}>
              <SkeletonLine width={c === 0 ? "80%" : "60%"} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
