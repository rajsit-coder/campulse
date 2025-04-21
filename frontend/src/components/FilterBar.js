import React from "react";
import "../styles/FilterBar.css";

const FilterBar = () => {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="Search events..." />
      <select>
        <option value="">All Types</option>
        <option value="tech">Tech</option>
        <option value="cultural">Cultural</option>
      </select>
      <select>
        <option value="">All Clubs</option>
        <option value="CSE Club">CSE Club</option>
        <option value="Drama Club">Drama Club</option>
        {/* Add more clubs as needed */}
      </select>
    </div>
  );
};

export default FilterBar;
