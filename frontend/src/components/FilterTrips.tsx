import { useState } from "react";
import "../css/FilterTrips.css";

const FilterTrips = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("Date Created");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    "desc"
  );

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };
  const setSort = (sort:string) => onChange(selectedFilters, sort, sortDirection);
  const setDir  = (dir:'asc'|'desc') => onChange(selectedFilters, selectedSort, dir);

  return (
    <div className="d-flex gap-2 flex-wrap mb-3 justify-content-center p-2">
      {/* types of trip filter */}
      {["past", "current", "future"].map((filter) => {
        const isSelected = selectedFilters.includes(filter);
        return (
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            className="btn trip-filter-btn"
            style={{
              borderRadius: "999px",
              padding: "0.4rem 1rem",
              fontWeight: 500,
              textTransform: "capitalize",
              fontFamily: "Montserrat",
              fontSize: "15px",
              backgroundColor: isSelected ? "#ACD3A8" : "white",
              border: "1px solid #ACD3A8",
              color: "black",
              transition: "all 0.2s ease-in-out, transform 0.2s ease-in-out",
            }}
          >
            {filter}
          </button>
        );
      })}

      {/* ascending or descending */}
      <div
        className="dropdown"
        style={{ padding: "5px", fontFamily: "Montserrat" }}
      >
        <button
          className="btn p-0 border-0 bg-transparent search-btn"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa-solid fa-filter fa-lg" style={{ color: "grey" }}></i>
        </button>

        <div
          className="dropdown-menu p-3"
          style={{ minWidth: "200px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 fw-bold">Sort by:</div>

          {["Date Created", "Date Modified", "Trip Start Date"].map((label) => (
            <div className="form-check" key={label}>
              <input
                className="form-check-input"
                type="radio"
                name="sortOption"
                id={label}
                checked={selectedSort === label}
                onChange={() => setSelectedSort(label)}
                style={{ cursor: "pointer" }}
              />
              <label className="form-check-label" htmlFor={label}>
                {label}
              </label>
            </div>
          ))}

          <div className="d-flex justify-content-center mt-3">
            <button
              className={`btn btn-sm ${
                sortDirection === "asc"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setSortDirection("asc")}
              style={{ margin: "3px" }}
            >
              Asc
            </button>
            <button
              className={`btn btn-sm ${
                sortDirection === "desc"
                  ? "btn-secondary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setSortDirection("desc")}
              style={{ margin: "3px" }}
            >
              Desc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTrips;

