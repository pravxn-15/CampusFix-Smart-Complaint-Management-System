import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import "./FormField.css";

function FieldShell({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      {label && (
        <label htmlFor={htmlFor} className="field__label">
          {label} {required && <span className="field__required">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="field__message field__message--error">
          <FiAlertCircle aria-hidden="true" /> {error}
        </span>
      ) : hint ? (
        <span className="field__message">{hint}</span>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, required, id, type = "text", className = "", ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const inputId = id || rest.name;

  return (
    <FieldShell label={label} htmlFor={inputId} error={error} hint={hint} required={required}>
      <div className={`field__control ${Icon ? "field__control--icon" : ""}`}>
        {Icon && <Icon className="field__icon" aria-hidden="true" />}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`field__input ${className}`}
          aria-invalid={!!error}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </FieldShell>
  );
});

export const TextArea = forwardRef(function TextArea(
  { label, error, hint, required, id, rows = 4, className = "", ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <FieldShell label={label} htmlFor={inputId} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`field__input field__textarea ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
    </FieldShell>
  );
});

export const Select = forwardRef(function Select(
  { label, error, hint, required, id, options = [], placeholder, className = "", ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <FieldShell label={label} htmlFor={inputId} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        id={inputId}
        className={`field__input field__select ${className}`}
        aria-invalid={!!error}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
});
