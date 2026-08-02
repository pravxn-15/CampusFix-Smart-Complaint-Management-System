import { FiCheck } from "react-icons/fi";
import "./ProgressSteps.css";

export default function ProgressSteps({ steps, currentIndex, orientation = "horizontal" }) {
  return (
    <ol className={`progress-steps progress-steps--${orientation}`}>
      {steps.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming";
        return (
          <li key={step} className={`progress-steps__item progress-steps__item--${state}`}>
            <span className="progress-steps__marker">
              {state === "done" ? <FiCheck /> : i + 1}
            </span>
            <span className="progress-steps__label">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
