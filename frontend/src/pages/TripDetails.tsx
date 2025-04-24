import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';

import '../css/TripDetails.css';

type DateRange = {
  start: string;
  end: string;
};

type TripDetails = {
  _id: string;
  location: string;
  dateRange: DateRange;
  notes: string;
  coverPhoto?: string;
  photos?: string[];
  createdAt?: string;
  updatedAt?: string;
};

const TripDetails: React.FC = () => {
  const { id: tripId } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [editState, setEditState] = useState({
    location: false,
    dateRange: false,
    notes: false,
    coverPhoto: false,
    photos: false,
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/${tripId}`);
        const data = await res.json();
        setTrip(data);
      } catch (error) {
        console.error('Failed to fetch trip details:', error);
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="trip-details-container">
      <h1>Trip to {trip.location}</h1>
      <section className="trip-section">
        <h2>Date Range</h2>
        <p>{trip.dateRange.start} to {trip.dateRange.end}</p>
      </section>
      <section className="trip-section">
        <h2>Notes</h2>
        <p>{trip.notes}</p>
      </section>
      {trip.coverPhoto && (
        <section className="trip-section">
          <h2>Cover Photo</h2>
          <img src={trip.coverPhoto} alt="Cover" />
        </section>
      )}
      {trip.photos && trip.photos.length > 0 && (
        <section className="trip-section">
          <h2>Photos</h2>
          <div className="trip-photos">
            {trip.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Trip Photo ${index + 1}`} />
            ))}
          </div>
        </section>
      )}
      <MapView location={trip.location} />
    </div>
  );
};

export default TripDetails;
