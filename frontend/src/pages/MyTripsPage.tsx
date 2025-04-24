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
  //const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/trips", { credentials: "include" });
        const json = await res.json();
        if (res.ok && json.data) {
          setTrips(json.data); // assuming your API returns { data: Trip[] }
        } else {
          console.error("Failed to fetch trips");
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, []);

  // const filteredTrips = trips.filter(trip =>
  //   trip.name.toLowerCase().includes(searchTerm.toLowerCase())
  // ); for filtering later 

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

        <SearchTrips />
        <FilterTrips />
        <TripsGrid trips={trips} onAddTrip={() => setShowPopup(true)} />
        {showPopup && <PlanTrip onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
};

export default MyTripsPage;
