import React, { useState } from "react";
import "../css/PlanTrip.css";

type ItineraryItem = {
  day: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
};

type PlanPopupProps = {
  onClose: () => void;
  onSubmit: (tripData: any) => void; // SUBMIT
};

const PlanPopup: React.FC<PlanPopupProps> = ({ onClose, onSubmit }) => {
  const [tripName, setTripName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flightInfo, setFlightInfo] = useState("");
  const [journal, setJournal] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [tripPhotos, setTripPhotos] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPhoto(url);
    }
  };

  const handleTripPhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const updatedPhotos = [...tripPhotos];
      updatedPhotos[index] = url;
      setTripPhotos(updatedPhotos);
    }
  };

  const addTripPhotoBox = () => setTripPhotos([...tripPhotos, ""]);
  const removeTripPhotoBox = (index: number) => {
    const updated = [...tripPhotos];
    updated.splice(index, 1);
    setTripPhotos(updated);
  };

  const addItineraryDay = () => {
    setItinerary([
      ...itinerary,
      {
        day: `Day ${itinerary.length + 1}`,
        morning: "",
        afternoon: "",
        evening: "",
      },
    ]);
  };

  const updateItinerary = (
    index: number,
    key: keyof ItineraryItem,
    value: string
  ) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [key]: value };
    setItinerary(updated);
  };

  const removeItineraryDay = (index: number) => {
    const updated = [...itinerary];
    updated.splice(index, 1);
    setItinerary(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tripData = {
      name: tripName,
      location,
      startDate,
      endDate,
      flightInfo,
      journal,
      image: coverPhoto,
      tripPhotos,
      itinerary,
    };
    onSubmit(tripData);
    onClose();
  

  // send to the new API
  await fetch("/api/createTrip", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(tripData),
});

  const result = await res.json();
  if (result.error) {
    // handle error…
    console.error(result.error);
  } else {
    // success!
    console.log("New trip ID:", result.tripId);
    onClose();
  }
};


  return (
    <div className="popup-backdrop">
      <div className="popup-content">
        <button className="exit-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Plan Your Future Trip</h2>
        <form className="trip-form" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Trip name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            required
          />

          <input
            name="location"
            type="text"
            placeholder="Location(s)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          

          <div className="flex-row">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <textarea
            name="flightInfo"
            placeholder="Enter flight"
            value={flightInfo}
            onChange={(e) => setFlightInfo(e.target.value)}
          />

          {/* Cover Photo */}
          <div className="cover-photo-section">
            {coverPhoto && (
              <img
                src={coverPhoto}
                alt="Cover Preview"
                className="cover-preview"
              />
            )}
            <label className="file-upload-label">
              Choose Cover Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverPhotoChange}
              />
            </label>
          </div>

          {/* Itinerary Section */}
          <div className="itinerary-section">
            <h3>Itinerary</h3>
            {itinerary.map((item, idx) => (
              <div key={idx} className="itinerary-item">
                <input
                  type="text"
                  value={item.day}
                  onChange={(e) => updateItinerary(idx, "day", e.target.value)}
                  placeholder="Day Title"
                />
                <textarea
                  placeholder="Morning Plans..."
                  value={item.morning}
                  onChange={(e) =>
                    updateItinerary(idx, "morning", e.target.value)
                  }
                />
                <textarea
                  placeholder="Afternoon Plans..."
                  value={item.afternoon}
                  onChange={(e) =>
                    updateItinerary(idx, "afternoon", e.target.value)
                  }
                />
                <textarea
                  placeholder="Evening Plans..."
                  value={item.evening}
                  onChange={(e) =>
                    updateItinerary(idx, "evening", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeItineraryDay(idx)}
                  className="remove-day-btn"
                >
                  Remove Day
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addItineraryDay}
              className="add-day-btn"
            >
              + Add Day
            </button>
          </div>

          {/* Journal Section */}
          <div className="journal-section">
          <h3>Journal</h3>
          <textarea
            name="journal"
            placeholder="Journal"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
          />
          </div>

          {/* Trip Photos */}
          <div className="trip-photos-section">
            <h3>Trip Photos</h3>
            {tripPhotos.map((photo, idx) => (
              <div key={idx} className="photo-upload-item">
                {photo && (
                  <img
                    src={photo}
                    alt={`Trip ${idx}`}
                    className="trip-photo-preview"
                  />
                )}
                <label className="file-upload-label">
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleTripPhotoChange(e, idx)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeTripPhotoBox(idx)}
                  className="circle-remove-btn"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTripPhotoBox}
              className="add-photo-btn"
            >
              + Add Trip Photo
            </button>
          </div>

          <button className="submit-btn" type="submit">
            Submit Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlanPopup;
