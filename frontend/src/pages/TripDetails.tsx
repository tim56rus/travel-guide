import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView'

import '../css/TripDetails.css';

type ItineraryItem = {
  day: string; // Header
  morning?: string;
  afternoon?: string;
  evening?: string;
};

type TripDetails = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  flightInfo: string;
  itinerary: ItineraryItem[];
  journal: string;
  image?: string;
  tripPhotos?: string[];
};

const dummyTrip: TripDetails = {
  _id: 'dummy123',
  name: 'Tokyo Dream Trip',
  startDate: '2025-07-15',
  endDate: '2025-07-22',
  flightInfo: 'Flight JL062 - LAX to HND at 2:45 PM',
  journal: `Can't wait to explore Tokyo. Planning to see temples, enjoy ramen, and stroll through Shibuya.`,
  image: 'https://images.unsplash.com/photo-1587019154294-9c3b6dd4df4b',
  itinerary: [],
  tripPhotos: [],
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
    tripPhotos: false,
  });

  useEffect(() => {
    if (!id || id === 'dummy') {
      setTrip(dummyTrip);
      return;
    }
    // Fetch real data if needed
  }, [id]);

  const handleInputChange = (key: keyof TripDetails, value: any) => {
    if (!trip) return;
    setTrip({ ...trip, [key]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file && trip) {
      const updatedPhotos = [...(trip.tripPhotos || [])];
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for preview
      updatedPhotos[index] = imageUrl;
      setTrip({ ...trip, tripPhotos: updatedPhotos });
    }
  };

  const addItineraryDay = () => {
    if (!trip) return;
    const newDay: ItineraryItem = { day: `Day ${trip.itinerary.length + 1}`, morning: '', afternoon: '', evening: '' };
    setTrip({ ...trip, itinerary: [...trip.itinerary, newDay] });
  };
  
  const removeItineraryDay = (index: number) => {
    if (!trip) return;
    const updatedItinerary = [...trip.itinerary];
    updatedItinerary.splice(index, 1);
    setTrip({ ...trip, itinerary: updatedItinerary });
  };
  
  const handleItineraryChange = (index: number, key: keyof ItineraryItem, value: string) => {
    if (!trip) return;
    const updatedItinerary = [...trip.itinerary];
    updatedItinerary[index] = { ...updatedItinerary[index], [key]: value };
    setTrip({ ...trip, itinerary: updatedItinerary });
  };
  

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && trip) {
      const imageUrl = URL.createObjectURL(file);
      setTrip({ ...trip, image: imageUrl });
    }
  };
  
  const handleTripPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file && trip) {
      const updatedPhotos = [...(trip.tripPhotos || [])];
      const imageUrl = URL.createObjectURL(file);
      updatedPhotos[index] = imageUrl;
      setTrip({ ...trip, tripPhotos: updatedPhotos });
    }
  };
  

  const addPhotoBox = () => {
    if (!trip) return;
    setTrip({ ...trip, tripPhotos: [...(trip.tripPhotos || []), ''] });
  };

  const removePhotoBox = (index: number) => {
    if (!trip || !trip.tripPhotos) return;
    const updatedPhotos = [...trip.tripPhotos];
    updatedPhotos.splice(index, 1);
    setTrip({ ...trip, tripPhotos: updatedPhotos });
  };

  if (!trip) return <p className="text-center mt-10">Trip not found</p>;

  return (
    <div className="trip-container max-w-5xl mx-auto p-6 bg-white rounded-xl shadow space-y-8">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      {/* Trip Name & Date Range */}
      <section className="trip-section">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">
            Trip Information
          </h2>
          <button
            className="edit-button"
            onClick={() =>
              setEditState({ ...editState, name: !editState.name })
            }
          >
            {editState.name ? "Save" : "Edit"}
          </button>
        </div>
        {editState.name ? (
          <>
            <input
              value={trip.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-2 p-2 w-full border rounded"
            />
            <div className="flex gap-2 mt-2">
              <input
                type="date"
                value={trip.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="p-2 w-1/2 border rounded"
              />
              <input
                type="date"
                value={trip.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="p-2 w-1/2 border rounded"
              />
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-lg text-slate-700">{trip.name}</p>
            <p className="text-sm text-slate-500">
              Dates: {new Date(trip.startDate).toDateString()} -{" "}
              {new Date(trip.endDate).toDateString()}
            </p>
          </>
        )}
      </section>

      {/* Cover Photo */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-slate-800">Cover Photo</h2>
          <button
            className="edit-button"
            onClick={() =>
              setEditState({ ...editState, image: !editState.image })
            }
          >
            {editState.image ? "Save" : "Edit"}
          </button>
        </div>
        {editState.image ? (
          <>
            {trip.image && (
              <img
                src={trip.image}
                alt="Cover"
                className="w-full h-64 object-cover rounded-xl shadow mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="p-2 w-full border rounded"
            />
          </>
        ) : (
          trip.image && (
            <img
              src={trip.image}
              alt={trip.name}
              className="w-full h-64 object-cover rounded-xl shadow"
            />
          )
        )}
      </section>

      {/* Flight Info */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Flight Info</h2>
          <button
            className="edit-button "
            onClick={() =>
              setEditState({ ...editState, flight: !editState.flight })
            }
          >
            {editState.flight ? "Save" : "Edit"}
          </button>
        </div>
        {editState.flight ? (
          <textarea
            value={trip.flightInfo}
            onChange={(e) => handleInputChange("flightInfo", e.target.value)}
            className="mt-2 p-2 w-full border rounded"
          />
        ) : (
          <p className="mt-2 text-slate-700">{trip.flightInfo}</p>
        )}
      </section>

      {/* Itinerary */}
      <section className="trip-section">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-slate-800">Itinerary</h2>
          <button
            className="edit-button"
            onClick={() =>
              setEditState({ ...editState, itinerary: !editState.itinerary })
            }
          >
            {editState.itinerary ? "Save" : "Edit"}
          </button>
        </div>

        {editState.itinerary ? (
          <>
            {trip.itinerary.map((item, idx) => (
              <div
                key={idx}
                className="mb-4 border rounded p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={item.day}
                    onChange={(e) =>
                      handleItineraryChange(idx, "day", e.target.value)
                    }
                    className="font-semibold text-lg w-full p-2 border rounded mb-2"
                    placeholder="Day Title"
                  />
                  <button
                    onClick={() => removeItineraryDay(idx)}
                    className="edit-button text-red-500"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  placeholder="Morning Plans..."
                  value={item.morning || ""}
                  onChange={(e) =>
                    handleItineraryChange(idx, "morning", e.target.value)
                  }
                  className="p-2 w-full border rounded mb-2"
                />
                <textarea
                  placeholder="Afternoon Plans..."
                  value={item.afternoon || ""}
                  onChange={(e) =>
                    handleItineraryChange(idx, "afternoon", e.target.value)
                  }
                  className="p-2 w-full border rounded mb-2"
                />
                <textarea
                  placeholder="Evening Plans..."
                  value={item.evening || ""}
                  onChange={(e) =>
                    handleItineraryChange(idx, "evening", e.target.value)
                  }
                  className="p-2 w-full border rounded"
                />
              </div>
            ))}
            <button
              onClick={addItineraryDay}
              className="edit-button mt-2 text-green-500"
            >
              + Add Day
            </button>
          </>
        ) : (
          trip.itinerary.map((item, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold text-lg">{item.day}</h3>
              {item.morning && (
                <p className="italic mt-1">
                  <span className="font-medium">Morning:</span> {item.morning}
                </p>
              )}
              {item.afternoon && (
                <p className="italic mt-1">
                  <span className="font-medium">Afternoon:</span>{" "}
                  {item.afternoon}
                </p>
              )}
              {item.evening && (
                <p className="italic mt-1">
                  <span className="font-medium">Evening:</span> {item.evening}
                </p>
              )}
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
            onClick={() =>
              setEditState({ ...editState, journal: !editState.journal })
            }
          >
            {editState.journal ? "Save" : "Edit"}
          </button>
        </div>
        {editState.journal ? (
          <textarea
            value={trip.journal}
            onChange={(e) => handleInputChange("journal", e.target.value)}
            className="mt-2 p-2 w-full h-40 border rounded"
          />
        ) : (
          <p className="mt-2 text-slate-700 whitespace-pre-wrap">
            {trip.journal}
          </p>
        )}
      </section>

      {/* Trip Photos */}
      <section className="trip-section">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-slate-800">Trip Photos</h2>
          <button
            className="edit-button"
            onClick={() =>
              setEditState({ ...editState, tripPhotos: !editState.tripPhotos })
            }
          >
            {editState.tripPhotos ? "Save" : "Edit"}
          </button>
        </div>

        {editState.tripPhotos && (
          <>
            {trip.tripPhotos &&
              trip.tripPhotos.map((photo, index) => (
                <div key={index} className="flex items-center gap-4 mt-2">
                  {photo && (
                    <img
                      src={photo}
                      alt={`Trip ${index}`}
                      className="w-32 h-24 object-cover rounded shadow"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleTripPhotoUpload(e, index)}
                    className="p-2 border rounded"
                  />
                  <button
                    onClick={() => removePhotoBox(index)}
                    className="edit-button text-red-500"
                  >
                    -
                  </button>
                </div>
              ))}
            <button
              onClick={addPhotoBox}
              className="edit-button mt-2 text-green-500"
            >
              + Add Photo
            </button>
          </>
        )}

        {!editState.tripPhotos &&
          trip.tripPhotos &&
          trip.tripPhotos.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {trip.tripPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Trip ${index}`}
                  className="w-full h-40 object-cover rounded-xl shadow"
                />
              ))}
            </div>
          )}
      </section>
      {/* Map */}
      <section className="trip-section">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Map View</h2>
        <MapView />
      </section>
    </div>
  );
};

export default TripDetails;
