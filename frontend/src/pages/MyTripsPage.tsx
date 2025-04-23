import React, { useState } from 'react';
import Header from '../components/Header';
import SearchTrips from '../components/SearchTrips';
import TripsGrid from '../components/TripsGrid';
import PlanTrip from '../components/PlanTrip';
import FilterTrips from '../components/FilterTrips';

const MyTripsPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div style={{
      backgroundColor: '#F6F1DE',
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
    }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h1 style={{
          fontFamily: 'Montserrat', fontWeight: '300',
          textAlign: 'center',
          fontSize: '60px',
          padding: '10px'
        }}>
          My Trips
        </h1>
          
        <SearchTrips />
        <FilterTrips />
        
        <TripsGrid onAddTrip={() => setShowPopup(true)} />

        {showPopup && <PlanTrip onClose={() => setShowPopup(false)} />}
      </div>
    </div>
  );
};

export default MyTripsPage;