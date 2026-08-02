import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "../../components/common/Button";

export default function NotFound() {
  return (
    <div
      className="container"
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "var(--color-warning-light)",
          color: "var(--color-warning)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
        }}
      >
        <FiAlertTriangle />
      </div>
      <h1>Page not found</h1>
      <p style={{ maxWidth: 380 }}>
        The page you're looking for doesn't exist, or may have moved. Let's get you back on track.
      </p>
      <Button as={Link} to="/" variant="primary">
        Back to home
      </Button>
    </div>
  );
}
