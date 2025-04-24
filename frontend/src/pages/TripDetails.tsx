import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/TripDetails.css';
import MapView from '../components/MapView';

type ItineraryItem = {
  day: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
};

type TripDetailsType = {
  _id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  flightInfo: string;
  itinerary: ItineraryItem[];
  journal: string;
  coverPhoto?: string;
  tripPhotos?: string[];
};

const TripDetails: React.FC = () => {
  const { id: tripId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState({
    name: false,
    location: false,
    date: false,
    flight: false,
    journal: false,
    itinerary: false,
    coverPhoto: false,
    tripPhotos: false,
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch('/api/searchTrips', { credentials: 'include' });
        const json = await res.json();
        if (res.ok && json.data) {
          const foundTrip = json.data.find((t: TripDetailsType) => t._id === tripId);
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

  const handleInputChange = (field: keyof TripDetailsType, value: any) => {
    if (!trip) return;
    setTrip({ ...trip, [field]: value });
  };

  const handleItineraryChange = (index: number, field: keyof ItineraryItem, value: string) => {
    if (!trip) return;
    const updated = [...trip.itinerary];
    updated[index][field] = value;
    setTrip({ ...trip, itinerary: updated });
  };

  const addItineraryDay = () => {
    if (!trip) return;
    setTrip({ ...trip, itinerary: [...trip.itinerary, { day: '', morning: '', afternoon: '', evening: '' }] });
  };

  const removeItineraryDay = (index: number) => {
    if (!trip) return;
    const updated = trip.itinerary.filter((_, i) => i !== index);
    setTrip({ ...trip, itinerary: updated });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!trip || !e.target.files?.length) return;
    const url = URL.createObjectURL(e.target.files[0]);
    setTrip({ ...trip, coverPhoto: url });
  };

  const addPhotoBox = () => {
    if (!trip) return;
    setTrip({ ...trip, tripPhotos: [...(trip.tripPhotos || []), ''] });
  };

  const removePhotoBox = (index: number) => {
    if (!trip?.tripPhotos) return;
    const updated = trip.tripPhotos.filter((_, i) => i !== index);
    setTrip({ ...trip, tripPhotos: updated });
  };

  const handleTripPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!trip?.tripPhotos || !e.target.files?.length) return;
    const url = URL.createObjectURL(e.target.files[0]);
    const updated = [...trip.tripPhotos];
    updated[index] = url;
    setTrip({ ...trip, tripPhotos: updated });
  };

  const toUTCDateString = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-CA', { timeZone: 'UTC' });
  };

  const handleSaveAndBack = async () => {
    if (!trip) {
      navigate(-1);
      return;
    }
    try {
      await fetch('/api/MyTrips/tripUpdate', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: trip._id,
          name: trip.name,
          location: trip.location,
          startDate: trip.startDate,
          endDate: trip.endDate,
          flightInfo: trip.flightInfo,
          journal: trip.journal,
          image: trip.coverPhoto,
          tripPhotos: trip.tripPhotos,
          itinerary: trip.itinerary,
        }),
      });
    } catch (err) {
      console.error('Failed to save trip:', err);
    } finally {
      navigate(-1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found.</div>;

  return (
    <div className="trip-container max-w-5xl mx-auto p-6 rounded-xl shadow space-y-8" style={{ backgroundColor: '#F6F1DE' }}>
      <button onClick={handleSaveAndBack} className="back-button">← Back</button>

      {/* Trip Information */}
      <section className="trip-section">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Trip Information</h2>
          <button className="edit-button" onClick={() => setEditState(s => ({ ...s, name: !s.name }))}>
            {editState.name ? "Save" : "Edit"}
          </button>
        </div>
        {editState.name ? (
          <>
            <input value={trip.name} onChange={e => handleInputChange("name", e.target.value)} className="mt-2 p-2 w-full border rounded" />
            <div className="flex gap-2 mt-2">
              <input type="date" value={trip.startDate} onChange={e => handleInputChange("startDate", e.target.value)} className="p-2 w-1/2 border rounded" />
              <input type="date" value={trip.endDate} onChange={e => handleInputChange("endDate", e.target.value)} className="p-2 w-1/2 border rounded" />
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-lg text-slate-700">{trip.name}</p>
            <p className="text-sm text-slate-500">
              Dates: {toUTCDateString(trip.startDate)} - {toUTCDateString(trip.endDate)}
            </p>
          </>
        )}
      </section>

      {/* Location */}
      <section className="trip-section">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Location</h2>
          <button className="edit-button" onClick={() => setEditState(s => ({ ...s, location: !s.location }))}>
            {editState.location ? "Save" : "Edit"}
          </button>
        </div>
        {editState.location ? (
          <input value={trip.location} onChange={e => handleInputChange("location", e.target.value)} className="mt-2 p-2 w-full border rounded" />
        ) : (
          <p className="mt-2 text-slate-700">{trip.location}</p>
        )}
      </section>

      {/* Cover Photo */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-slate-800">Cover Photo</h2>
          <button className="edit-button" onClick={() => setEditState(s => ({ ...s, coverPhoto: !s.coverPhoto }))}>
            {editState.coverPhoto ? "Save" : "Edit"}
          </button>
        </div>
        {editState.coverPhoto ? (
          <>
            {trip.coverPhoto && <img src={trip.coverPhoto} alt="Cover" className="w-full h-64 object-cover rounded-xl shadow mb-2" />}
            <label className="file-upload-label">
              Choose Cover Photo
              <input type="file" accept="image/*" onChange={handleCoverUpload} />
            </label>
            {trip.coverPhoto && <button onClick={() => handleInputChange('coverPhoto', '')} className="remove-day-btn mt-2">Remove Cover Photo</button>}
          </>
        ) : (
          trip.coverPhoto && <img src={trip.coverPhoto} alt={trip.name} className="w-full h-64 object-cover rounded-xl shadow" />
        )}
      </section>

      {/* Flight Info */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Flight Info</h2>
          <button className="edit-button" onClick={() => setEditState({ ...editState, flight: !editState.flight })}>
            {editState.flight ? "Save" : "Edit"}
          </button>
        </div>
        {editState.flight ? (
          <textarea value={trip.flightInfo} onChange={(e) => handleInputChange("flightInfo", e.target.value)} className="mt-2 p-2 w-full border rounded" />
        ) : (
          <p className="mt-2 text-slate-700">{trip.flightInfo}</p>
        )}
      </section>

      {/* Itinerary */}
      <section className="trip-section">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-slate-800">Itinerary</h2>
          <button className="edit-button" onClick={() => setEditState({ ...editState, itinerary: !editState.itinerary })}>
            {editState.itinerary ? "Save" : "Edit"}
          </button>
        </div>
        {editState.itinerary ? (
          <>
            {trip.itinerary.map((item, idx) => (
              <div key={idx} className="mb-4 border rounded p-4 bg-white shadow-sm">
                <input type="text" value={item.day} onChange={(e) => handleItineraryChange(idx, "day", e.target.value)} className="font-semibold text-lg w-full p-2 border rounded mb-2" placeholder="Day Title" />
                <textarea placeholder="Morning Plans..." value={item.morning || ""} onChange={(e) => handleItineraryChange(idx, "morning", e.target.value)} className="p-2 w-full border rounded mb-2" />
                <textarea placeholder="Afternoon Plans..." value={item.afternoon || ""} onChange={(e) => handleItineraryChange(idx, "afternoon", e.target.value)} className="p-2 w-full border rounded mb-2" />
                <textarea placeholder="Evening Plans..." value={item.evening || ""} onChange={(e) => handleItineraryChange(idx, "evening", e.target.value)} className="p-2 w-full border rounded" />
                <button onClick={() => removeItineraryDay(idx)} className="edit-button text-red-500" style={{ marginLeft: '10px' }}>Remove Day</button>
              </div>
            ))}
            <button onClick={addItineraryDay} className="edit-button mt-2 text-green-500">+ Add Day</button>
          </>
        ) : (
          trip.itinerary.map((item, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-semibold text-lg">{item.day}</h3>
              {item.morning && <p className="italic mt-1"><span className="font-medium">Morning:</span> {item.morning}</p>}
              {item.afternoon && <p className="italic mt-1"><span className="font-medium">Afternoon:</span> {item.afternoon}</p>}
              {item.evening && <p className="italic mt-1"><span className="font-medium">Evening:</span> {item.evening}</p>}
            </div>
          ))
        )}
      </section>

      {/* Journal */}
      <section className="trip-section border p-4 rounded-xl bg-slate-50 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">Journal</h2>
          <button className="edit-button" onClick={() => setEditState({ ...editState, journal: !editState.journal })}>
            {editState.journal ? "Save" : "Edit"}
          </button>
        </div>
        {editState.journal ? (
          <textarea value={trip.journal} onChange={(e) => handleInputChange("journal", e.target.value)} className="mt-2 p-2 w-full h-40 border rounded" />
        ) : (
          <p className="mt-2 text-slate-700 whitespace-pre-wrap">{trip.journal}</p>
        )}
      </section>

      {/* Trip Photos */}
      <section className="trip-section">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-slate-800">Trip Photos</h2>
          <button className="edit-button" onClick={() => setEditState({ ...editState, tripPhotos: !editState.tripPhotos })}>
            {editState.tripPhotos ? "Save" : "Edit"}
          </button>
        </div>
        {editState.tripPhotos && (
          <>
            {trip.tripPhotos && trip.tripPhotos.map((photo, index) => (
              <div key={index} className="photo-container flex items-center gap-4 mt-2">
                {photo && <img src={photo} alt={`Trip ${index}`} className="w-32 h-24 object-cover rounded shadow preview-image" />}
                <label className="file-upload-label">
                  Choose Photo
                  <input type="file" accept="image/*" onChange={(e) => handleTripPhotoUpload(e, index)} />
                </label>
                <button onClick={() => removePhotoBox(index)} className="circle-remove-btn">-</button>
              </div>
            ))}
            <button onClick={addPhotoBox} className="add-photo-btn">+ Add Trip Photo</button>
          </>
        )}
        {!editState.tripPhotos && trip.tripPhotos && trip.tripPhotos.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {trip.tripPhotos.map((photo, index) => (
              <img key={index} src={photo} alt={`Trip ${index}`} className="w-full h-40 object-cover rounded-xl shadow" />
            ))}
          </div>
        )}
      </section>

      {/* Map View */}
      <section className="trip-section">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Map View</h2>
        <MapView location={trip.location} />
      </section>
    </div>
  );
};

export default TripDetails;
