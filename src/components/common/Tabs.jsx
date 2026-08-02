import "./Tabs.css";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          className={`tabs__tab ${active === tab.value ? "tabs__tab--active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
          {typeof tab.count === "number" && <span className="tabs__count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}
