import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../css/TripDetails.css';

type ItineraryItem = {
  day: string;
  morning?: string[];
  afternoon?: string[];
  evening?: string[];
};

type TripDetails = {
  _id: string;
  name: string;
  date: string;
  flightInfo: string;
  itinerary: ItineraryItem[];
  journal: string;
  image?: string;
};

const dummyTrip: TripDetails = {
  _id: 'dummy123',
  name: 'Tokyo Dream Trip',
  date: '2025-07-15',
  flightInfo: 'Flight JL062 - LAX to HND at 2:45 PM',
  journal: `Can't wait to explore Tokyo. Planning to see temples, enjoy ramen, and stroll through Shibuya.`,
  image: 'https://images.unsplash.com/photo-1587019154294-9c3b6dd4df4b',
  itinerary: [
    {
      day: 'Day 1: Arrival',
      morning: ['Arrive at Haneda', 'Hotel check-in'],
      afternoon: ['Explore Asakusa', 'Visit Senso-ji Temple'],
      evening: ['Tokyo Skytree view', 'Dinner at izakaya'],
    },
  ],
};

const TripDetails = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [editState, setEditState] = useState({
    name: false,
    date: false,
    flight: false,
    journal: false,
    itinerary: false,
    image: false,
  });

  useEffect(() => {
    if (!id || id === 'dummy') {
      setTrip(dummyTrip);
      return;
    }
    // Fetch real data if needed
  }, [id]);

  const handleInputChange = (
    key: keyof TripDetails,
    value: string
  ) => {
    if (!trip) return;
    setTrip({ ...trip, [key]: value });
  };

  if (!trip) return <p className="text-center mt-10">Trip not found</p>;

  return (
    <div className="trip-container max-w-5xl mx-auto p-6 bg-white rounded-xl shadow space-y-8">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      {/* Trip Name & Date */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Trip Information</h2>
          <button
            className="edit-button text-blue-500 hover:underline text-sm"
            onClick={() => setEditState({ ...editState, name: !editState.name })}
          >
            {editState.name ? 'Save' : 'Edit'}
          </button>
        </div>
        {editState.name ? (
          <>
            <input
              value={trip.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-2 p-2 w-full border rounded"
            />
            <input
              type="date"
              value={trip.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="mt-2 p-2 w-full border rounded"
            />
          </>
        ) : (
          <>
            <p className="mt-2 text-lg text-slate-700">{trip.name}</p>
            <p className="text-sm text-slate-500">Date: {new Date(trip.date).toDateString()}</p>
          </>
        )}
      </section>

      {/* Flight Info */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Flight Info</h2>
          <button
            className="edit-button "
            onClick={() => setEditState({ ...editState, flight: !editState.flight })}
          >
            {editState.flight ? 'Save' : 'Edit'}
          </button>
        </div>
        {editState.flight ? (
          <textarea
            value={trip.flightInfo}
            onChange={(e) => handleInputChange('flightInfo', e.target.value)}
            className="mt-2 p-2 w-full border rounded"
          />
        ) : (
          <p className="mt-2 text-slate-700">{trip.flightInfo}</p>
        )}
      </section>

      {/* Itinerary */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Itinerary</h2>
          <button
            className="edit-button"
            onClick={() => setEditState({ ...editState, itinerary: !editState.itinerary })}
          >
            {editState.itinerary ? 'Save' : 'Edit'}
          </button>
        </div>
        {editState.itinerary ? (
          <textarea
            value={JSON.stringify(trip.itinerary, null, 2)}
            onChange={(e) =>
              setTrip({ ...trip, itinerary: JSON.parse(e.target.value) })
            }
            className="mt-2 p-2 w-full h-48 border rounded font-mono text-sm"
          />
        ) : (
          trip.itinerary.map((item, idx) => (
            <div key={idx} className="mt-3">
              <h3 className="font-semibold text-lg">{item.day}</h3>
              {['morning', 'afternoon', 'evening'].map((period) => {
                const acts = item[period as keyof ItineraryItem] as string[] | undefined;
                return (
                  acts && (
                    <div key={period}>
                      <p className="italic capitalize mt-1">{period}:</p>
                      <ul className="list-disc list-inside ml-4">
                        {acts.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )
                );
              })}
            </div>
          ))
        )}
      </section>

      {/* Journal */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Journal</h2>
          <button
            className="edit-button"
            onClick={() => setEditState({ ...editState, journal: !editState.journal })}
          >
            {editState.journal ? 'Save' : 'Edit'}
          </button>
        </div>
        {editState.journal ? (
          <textarea
            value={trip.journal}
            onChange={(e) => handleInputChange('journal', e.target.value)}
            className="mt-2 p-2 w-full h-40 border rounded"
          />
        ) : (
          <p className="mt-2 text-slate-700 whitespace-pre-wrap">{trip.journal}</p>
        )}
      </section>

      {/* Image */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Trip Image</h2>
          <button
            className="edit-button"
            onClick={() => setEditState({ ...editState, image: !editState.image })}
          >
            {editState.image ? 'Save' : 'Edit'}
          </button>
        </div>
        {editState.image ? (
          <input
            value={trip.image || ''}
            onChange={(e) => handleInputChange('image', e.target.value)}
            className="mt-2 p-2 w-full border rounded"
          />
        ) : (
          trip.image && (
            <img
              src={trip.image}
              alt={trip.name}
              className="mt-2 w-full h-64 object-cover rounded-xl shadow"
            />
          )
        )}
      </section>
    </div>
  );
};

export default TripDetails;
