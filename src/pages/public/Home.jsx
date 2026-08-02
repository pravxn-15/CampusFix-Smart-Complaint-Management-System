import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiSmile,
  FiPlusCircle,
  FiUserCheck,
  FiEye,
  FiStar,
} from "react-icons/fi";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import CategoryIcon from "../../components/common/CategoryIcon";
import ProgressSteps from "../../components/common/ProgressSteps";
import { CATEGORIES } from "../../data/mockData";
import { StatusBadge } from "../../components/common/Badge";
import "./Home.css";

const STATS = [
  { icon: FiClock, value: "18 hrs", label: "Average resolution time" },
  { icon: FiCheckCircle, value: "1,240+", label: "Complaints resolved this year" },
  { icon: FiSmile, value: "4.7 / 5", label: "Average feedback rating" },
];

const STEPS = [
  { icon: FiPlusCircle, title: "Raise it", body: "Describe the issue, tag a category and priority, attach a photo. Takes under a minute." },
  { icon: FiUserCheck, title: "Get assigned", body: "Admins route it to the right staff member — electrical, IT, housekeeping, security." },
  { icon: FiEye, title: "Track it live", body: "Watch the status change in real time, chat with staff, and get notified at every step." },
  { icon: FiStar, title: "Rate the fix", body: "Confirm it's resolved and leave feedback that helps improve response times." },
];

const ROLES = [
  {
    tag: "For students & residents",
    title: "Raise it once, follow it everywhere",
    points: ["One-tap complaint form with photo upload", "Live status timeline and in-app chat", "Full complaint history at a glance"],
    to: "/register",
    cta: "Create an account",
  },
  {
    tag: "For maintenance & support staff",
    title: "A queue that sorts itself by urgency",
    points: ["Assigned queue sorted by priority", "Update status and add internal notes on the go", "Direct chat with the person who reported it"],
    to: "/login",
    cta: "Staff login",
  },
  {
    tag: "For wardens & admin teams",
    title: "See the whole campus at once",
    points: ["Live analytics across every category", "One-click staff assignment", "Exportable reports for monthly reviews"],
    to: "/login",
    cta: "Admin login",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="home">
      {/* ---------------- Hero ---------------- */}
      <section className="home__hero">
        <div className="container home__hero-grid">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="home__eyebrow">Built for colleges &amp; hostels</span>
            <h1>
              Every campus issue, <span className="home__accent-text">tracked</span> from report to resolved.
            </h1>
            <p className="home__hero-sub">
              CampusFix replaces the WhatsApp groups and lost paper forms with one place to raise, assign, and
              close out complaints — for hostels, classrooms, labs, and everything in between.
            </p>
            <div className="home__hero-actions">
              <Button as={Link} to="/register" size="lg" icon={FiArrowRight} iconPosition="right">
                Get started free
              </Button>
              <Button as={Link} to="/login" size="lg" variant="outline">
                I already have an account
              </Button>
            </div>

            <div className="home__stats">
              {STATS.map((s) => (
                <div key={s.label} className="home__stat">
                  <s.icon aria-hidden="true" />
                  <div>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="home__preview-card" padding="lg">
              <div className="home__preview-header">
                <div>
                  <span className="text-xs text-secondary">CMP-1024</span>
                  <h4>Flickering tube light in Room 204</h4>
                </div>
                <StatusBadge status="In Progress" />
              </div>
              <ProgressSteps steps={["Raised", "Assigned", "Accepted", "In Progress", "Resolved"]} currentIndex={3} />
              <div className="home__preview-footer">
                <span className="text-xs text-secondary">Assigned to Suresh Nair · Electrical</span>
                <span className="text-xs text-secondary">Updated 4h ago</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="container home__section">
        <h2>Whatever's broken, there's a category for it</h2>
        <p className="home__section-sub">From a flickering bulb to a Wi-Fi dead zone — everything gets routed to the right team.</p>
        <div className="home__category-grid">
          {CATEGORIES.slice(0, 12).map((cat) => (
            <div key={cat.id} className="home__category">
              <CategoryIcon icon={cat.icon} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="home__section-alt">
        <div className="container home__section">
          <h2>From report to resolved in four steps</h2>
          <p className="home__section-sub">No follow-up calls needed — the status updates come to you.</p>
          <div className="home__steps-grid">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card padding="lg" hoverLift className="home__step-card">
                  <span className="home__step-number">{String(i + 1).padStart(2, "0")}</span>
                  <step.icon className="home__step-icon" aria-hidden="true" />
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Roles ---------------- */}
      <section className="container home__section">
        <h2>Built for everyone who keeps a campus running</h2>
        <div className="home__roles-grid">
          {ROLES.map((role) => (
            <Card key={role.title} padding="lg" hoverLift className="home__role-card">
              <span className="home__role-tag">{role.tag}</span>
              <h3>{role.title}</h3>
              <ul>
                {role.points.map((p) => (
                  <li key={p}>
                    <FiCheckCircle aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
              <Link to={role.to} className="home__role-link">
                {role.cta} <FiArrowRight />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------- CTA banner ---------------- */}
      <section className="container">
        <div className="home__cta">
          <div>
            <h2>Something needs fixing?</h2>
            <p>Get your account set up in under a minute — no paperwork, no follow-up calls.</p>
          </div>
          <Button as={Link} to="/register" size="lg" variant="secondary" icon={FiArrowRight} iconPosition="right">
            Create your account
          </Button>
        </div>
      </section>
    </div>
  );
}
