import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/TripDetails.css';

// Dummy MapView for placeholder
const MapView: React.FC<{ location: string }> = ({ location }) => (
  <div style={{ height: '200px', backgroundColor: '#e0e0e0', margin: '1rem 0' }}>Map showing: {location}</div>
);

type ItineraryItem = {
  day: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
};

type TripDetails = {
  _id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  flightInfo: string;
  itinerary: ItineraryItem[];
  journal: string;
  image?: string;
  tripPhotos?: string[];
};

const TripDetails: React.FC = () => {
  const { id: tripId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch('/api/searchTrips', { credentials: 'include' });
        const json = await res.json();
        if (res.ok && json.data) {
          const foundTrip = json.data.find((t: TripDetails) => t._id === tripId);
          setTrip(foundTrip);
        }
      } catch (error) {
        console.error('Failed to fetch trip:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [tripId]);

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found.</div>;

  return (
    <div className="trip-details">
      <h1>{trip.name}</h1>
      <MapView location={trip.location} />
      <section>
        <h2>Location</h2>
        <p>{trip.location}</p>
      </section>
      <section>
        <h2>Dates</h2>
        <p>{trip.startDate} - {trip.endDate}</p>
      </section>
      <section>
        <h2>Flight Info</h2>
        <p>{trip.flightInfo}</p>
      </section>
      <section>
        <h2>Itinerary</h2>
        {trip.itinerary.map((item, index) => (
          <div key={index}>
            <h3>{item.day}</h3>
            {item.morning && <p><strong>Morning:</strong> {item.morning}</p>}
            {item.afternoon && <p><strong>Afternoon:</strong> {item.afternoon}</p>}
            {item.evening && <p><strong>Evening:</strong> {item.evening}</p>}
          </div>
        ))}
      </section>
      <section>
        <h2>Journal</h2>
        <p>{trip.journal}</p>
      </section>
      {trip.image && <img src={trip.image} alt="Trip" style={{ maxWidth: '100%' }} />}
      {trip.tripPhotos && trip.tripPhotos.map((photo, index) => (
        <img key={index} src={photo} alt={`Trip Photo ${index + 1}`} style={{ maxWidth: '100px', margin: '5px' }} />
      ))}
    </div>
  );
};

export default TripDetails;
