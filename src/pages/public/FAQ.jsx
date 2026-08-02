import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import "./StaticPage.css";

const FAQS = [
  {
    q: "How long does a complaint usually take to resolve?",
    a: "It depends on the category and priority — most electrical and IT issues are resolved within a day, while larger maintenance jobs can take a few days. You'll see an estimated resolution time on every complaint, and you're notified the moment the status changes.",
  },
  {
    q: "Can I raise a complaint on behalf of my whole room or floor?",
    a: "Yes — just mention the shared location (e.g. \"Hostel Block B, 2nd Floor Corridor\") in the location field so staff know it affects more than one room.",
  },
  {
    q: "What happens after I submit a complaint?",
    a: "An admin reviews it and assigns it to the right staff member based on category. You'll get a notification at every stage — assigned, accepted, in progress, and resolved — and can chat directly with the assigned staff member.",
  },
  {
    q: "Can I attach photos to my complaint?",
    a: "Yes, you can attach up to four photos when raising a complaint, which helps staff diagnose the issue before they arrive.",
  },
  {
    q: "What if I'm not satisfied with how a complaint was resolved?",
    a: "Leave a low rating and a comment in the feedback step — this gets flagged to the admin team automatically and the ticket stays open until you're satisfied.",
  },
  {
    q: "Is my complaint visible to other students?",
    a: "No — only you, the assigned staff member, and admins can see the details of your complaint.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="faq-item">
      <button className="faq-item__question" aria-expanded={isOpen} onClick={onToggle}>
        {item.q}
        <FiChevronDown aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="faq-item__answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="static-page__faq">
      <div className="container" style={{ textAlign: "center", marginBottom: 32 }}>
        <span className="home__eyebrow">FAQ</span>
        <h1 style={{ marginTop: 8 }}>Frequently asked questions</h1>
      </div>
      <div className="container">
        {FAQS.map((item, i) => (
          <FaqItem key={item.q} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>
    </div>
  );
}
