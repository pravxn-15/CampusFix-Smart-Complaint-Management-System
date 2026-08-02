import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useClickOutside from "../../hooks/useClickOutside";
import "./Dropdown.css";

export default function Dropdown({ trigger, children, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className="dropdown" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger({ open })}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            className={`dropdown__panel dropdown__panel--${align}`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ icon: Icon, children, danger, ...rest }) {
  return (
    <button className={`dropdown-item ${danger ? "dropdown-item--danger" : ""}`} {...rest}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </button>
  );
}
