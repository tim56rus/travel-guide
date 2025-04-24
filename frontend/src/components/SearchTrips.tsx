import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";

import "../css/SearchTrips.css";

type SearchTripsProps = {
  onSearch: (results: any[]) => void;
};

const categories = [
  { label: "Name", value: "name" },
  { label: "Location", value: "location" },
  { label: "Journal", value: "journal" },
  { label: "Dates", value: "dates" },
];

export default function SearchTrips({ onSearch }: SearchTripsProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (by = category) => {
    // Build query params dynamically
    const params = new URLSearchParams();
    if (by) {
      params.append("by", by);
    }
    if (query.trim()) {
      params.append("q", query.trim());
    }

    const url =
      "/api/searchTrips" + (params.toString() ? `?${params.toString()}` : "");
    try {
      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();
      onSearch(json.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      onSearch([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.trim().length > 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
      performSearch();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Montserrat",
        padding: "0 1rem",
      }}
    >
      <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
        <input
          type="search"
          className="form-control"
          placeholder="Search Trips..."
          aria-label="Search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          maxLength={50}
          style={{
            paddingRight: "3rem",
            width: "100%",
            zIndex: 2,
            position: "relative",
          }}
        />
        <button
          type="button"
          className="search-button-animated"
          onClick={() => {
            setShowSuggestions(false);
            performSearch();
          }}
        >
          <i className="fas fa-search" />
        </button>

        {showSuggestions && (
          <div
            className="list-group"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1,
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.value}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  setCategory(cat.value);
                  setShowSuggestions(false);
                  performSearch(cat.value);
                }}
              >
                <span style={{ fontWeight: 500 }}>"{query.trim()}"</span> in{" "}
                {cat.label}
              </div>
            ))}
            <div
              className="list-group-item list-group-item-action"
              onClick={() => {
                setCategory("");
                setShowSuggestions(false);
                performSearch("");
              }}
            >
              Search all
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
