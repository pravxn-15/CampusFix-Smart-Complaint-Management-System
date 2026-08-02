import { FiSearch, FiX } from "react-icons/fi";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="search-bar">
      <FiSearch className="search-bar__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onChange("")} aria-label="Clear search">
          <FiX />
        </button>
      )}
    </div>
  );
}
