import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchTrips from '../components/SearchTrips';
import TripsGrid from '../components/TripsGrid';
import PlanTrip from '../components/PlanTrip';
import FilterTrips from '../components/FilterTrips';

const MyTripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]); // ideally use a typed `Trip[]`
  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);

  const [searchActive, setSearchActive] = useState(false);


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/searchTrips", { credentials: "include" });
        const json = await res.json();
        if (res.ok && json.data) {
          setTrips(json.data); 
          setFilteredTrips(json.data);
        } else {
          console.error("Failed to fetch trips");
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, []);

  // Session check on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/checkSession', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.userId) {
          // Not authenticated → redirect to login
          navigate('/login', { replace: true });
        }
      } catch (e) {
        console.error('Session check failed', e);
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // While checking session, show loading state
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading…</div>;
  }

  return (
    <div
      style={{
        backgroundColor: '#F6F1DE',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Header />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h1
          style={{
            fontFamily: 'Montserrat',
            fontWeight: 300,
            textAlign: 'center',
            fontSize: '60px',
            padding: '10px',
          }}
        >
          My Trips
        </h1>

        <SearchTrips onSearch={(results) => {
          setFilteredTrips(results);
          setSearchActive(true); 
        }} />
        <FilterTrips />
        <TripsGrid trips={filteredTrips}
          onAddTrip={() => setShowPopup(true)} />

        {searchActive && filteredTrips.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Montserrat', fontSize: '20px' }}>
            No trips found...
          </div>
        )}

        {showPopup && <PlanTrip onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
};

export default MyTripsPage;
