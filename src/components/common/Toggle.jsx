import "./Toggle.css";

export default function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="toggle-row">
      <div>
        <strong>{label}</strong>
        {description && <p>{description}</p>}
      </div>
      <span className={`toggle ${checked ? "toggle--on" : ""}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle__knob" />
      </span>
    </label>
  );
}
