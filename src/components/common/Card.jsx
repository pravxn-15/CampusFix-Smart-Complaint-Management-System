import "./Card.css";

export default function Card({
  children,
  className = "",
  glass = false,
  padding = "md",
  hoverLift = false,
  as: Component = "div",
  ...rest
}) {
  const classes = [
    "card",
    glass ? "card--glass" : "",
    `card--pad-${padding}`,
    hoverLift ? "card--hover" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
