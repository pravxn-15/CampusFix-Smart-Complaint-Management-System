import { forwardRef } from "react";
import { FiLoader } from "react-icons/fi";
import "./Button.css";

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    loading = false,
    fullWidth = false,
    as: Component = "button",
    className = "",
    disabled,
    ...rest
  },
  ref
) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component ref={ref} className={classes} disabled={disabled || loading} {...rest}>
      {loading && <FiLoader className="btn__spinner" aria-hidden="true" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="btn__icon" aria-hidden="true" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && <Icon className="btn__icon" aria-hidden="true" />}
    </Component>
  );
});

export default Button;
