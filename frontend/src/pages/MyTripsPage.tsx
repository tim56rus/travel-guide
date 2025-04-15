import React, { useState } from 'react';
import Header from '../components/Header';
import SearchTrips from '../components/SearchTrips';
import TripsGrid from '../components/TripsGrid';
import PlanTrip from '../components/PlanTrip';

const MyTripsPage = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div style={{
      backgroundColor: '#F6F1DE',
      minHeight: '100vh',
      width: '100%',
      position: 'relative'
    }}>
      <Header />
      <h1 style={{
        fontFamily: 'Montserrat', fontWeight: '300',
        textAlign: 'center',
        fontSize: '60px',
        padding: '10px'
      }}>
        My Trips
      </h1>
        
      <SearchTrips />
      <TripsGrid onAddTrip={() => setShowPopup(true)} />

      {showPopup && <PlanTrip onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default MyTripsPage;
