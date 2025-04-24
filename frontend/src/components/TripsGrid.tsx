// src/components/TripsGrid.tsx
import React from 'react';
import TripCard from '../components/TripCard';
import '../css/TripsGrid.css';

interface Trip {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date; 
}

interface TripsGridProps {
  onAddTrip: () => void;
  trips: Trip[];
  onTripsLoaded: (trips: any[]) => void;
}

export default function TripsGrid({ onAddTrip, trips, onTripsLoaded }: TripsGridProps) {
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '2.5rem',
        padding: '0 2rem 2rem 2rem',
        justifyContent: 'start',
        justifyItems: 'center'
      }}
    >
      {/* add new trip button */}
      <button
        id="addCardBtn"
        onClick={onAddTrip}
        style={{
          backgroundColor: '#ACD3A8',
          border: 'none',
          borderRadius: '5px',
          width: '200px',
          height: '250px',
          fontFamily: 'Montserrat',
          fontWeight: '400'
        }}
      >
        <i className="fa-solid fa-plus" style={{ fontSize: '30px' }} />
        <br />
        Add Trip
      </button>

      {trips.map(trip => (
        <TripCard 
          key={trip._id}
          trip={trip}
          onTripsLoaded={onTripsLoaded}
        />
      ))}
    </div>
  );
}
