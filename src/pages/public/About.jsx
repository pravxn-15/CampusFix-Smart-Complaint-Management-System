import { FiTarget, FiUsers, FiZap } from "react-icons/fi";
import Card from "../../components/common/Card";
import "./StaticPage.css";

const VALUES = [
  { icon: FiZap, title: "Fast by default", body: "Every complaint is routed to the right department within minutes, not days." },
  { icon: FiUsers, title: "Built with the people who use it", body: "Designed alongside wardens, maintenance staff, and student council reps across three campuses." },
  { icon: FiTarget, title: "Accountability, visibly", body: "Every status change is logged and visible to the person who raised it — nothing gets lost in a chat thread." },
];

export default function About() {
  return (
    <div className="static-page">
      <section className="container static-page__hero">
        <span className="home__eyebrow">About CampusFix</span>
        <h1>We built the complaint system we wished our own hostels had.</h1>
        <p>
          CampusFix started as a student council project to stop losing repair requests in WhatsApp groups.
          Today it runs the maintenance, IT, housekeeping, and security workflows for campuses that want one
          clear record of what's broken and who's fixing it.
        </p>
      </section>

      <section className="container static-page__grid">
        {VALUES.map((v) => (
          <Card key={v.title} padding="lg">
            <v.icon className="static-page__icon" aria-hidden="true" />
            <h4>{v.title}</h4>
            <p>{v.body}</p>
          </Card>
        ))}
      </section>

      <section className="container static-page__stats">
        <div><strong>12</strong><span>Complaint categories covered</span></div>
        <div><strong>18 hrs</strong><span>Average resolution time</span></div>
        <div><strong>4.7 / 5</strong><span>Average feedback rating</span></div>
      </section>
    </div>
  );
}
