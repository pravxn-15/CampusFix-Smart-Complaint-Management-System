import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Pagination.css";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="pagination">
      <button
        className="pagination__nav"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {showEllipsis && <span className="pagination__ellipsis">…</span>}
            <button
              className={`pagination__page ${p === page ? "pagination__page--active" : ""}`}
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        className="pagination__nav"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </div>
  );
}
