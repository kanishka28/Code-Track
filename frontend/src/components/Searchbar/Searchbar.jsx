import "./Searchbar.css";
import { FiSearch } from "react-icons/fi";

function Searchbar({ value, onChange }) {
  return (
    <div className="search-container">
      <div className="search-box">
        <FiSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search problems, topics or companies..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Searchbar;