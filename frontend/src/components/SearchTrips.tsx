import { useState, useEffect, useRef } from 'react';

function SearchTrips() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = ['Notes', 'Places', 'Dates'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.trim().length > 0);
  };

  // Hide suggestions if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        fontFamily: 'Montserrat',
        padding: '0 1rem'
      }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <input
          type="search"
          className="form-control"
          placeholder="Search Trips..."
          aria-label="Search"
          value={query}
          onChange={handleChange}
          maxLength={50}
          style={{
            paddingRight: '2rem',
            width: '100%',
            zIndex: 2,
            position: 'relative'
          }}
        />
        {/* Search Icon */}
        <i
          className="fas fa-search"
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'gray',
            zIndex: 3,
          }}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            className="list-group"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              cursor: 'pointer',
            }}
          >
            {categories.map((category) => (
              <div
                key={category}
                className="list-group-item list-group-item-action"
              >
                <span style={{ fontWeight: 500 }}>"{query}"</span> in {category}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchTrips;