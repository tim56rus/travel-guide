import React, { useState, FormEvent, ChangeEvent } from "react";
import "../css/PlanTrip.css";

type ItineraryItem = {
  day: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
};

type PlanPopupProps = {
  onClose: () => void;
  onSearch: () => void;
};

const PlanPopup: React.FC<PlanPopupProps> = ({ onClose, onSearch }) => {
  const [tripName, setTripName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flightInfo, setFlightInfo] = useState("");
  const [journal, setJournal] = useState("");

  // 👇 Preview URL for cover photo
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  // 👇 Actual File object for cover photo (NEW)
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);

  // 👇 Preview URLs for trip photos
  const [tripPhotosPreview, setTripPhotosPreview] = useState<string[]>([]);
  // 👇 Actual File objects for trip photos (NEW)
  const [tripPhotoFiles, setTripPhotoFiles] = useState<(File | null)[]>([]);

  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 👇 Handle cover photo selection (stores both preview and file) (UPDATED)
  const handleCoverPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCoverPhotoPreview(URL.createObjectURL(file));
      setCoverPhotoFile(file);
    }
  };

  // 👇 Handle each trip-photo selection (stores both preview and file) (UPDATED)
  const handleTripPhotoChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0] || null;

    setTripPhotosPreview(prev => {
      const updated = [...prev];
      updated[index] = file ? URL.createObjectURL(file) : "";
      return updated;
    });

    setTripPhotoFiles(prev => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  // 👇 Add a new photo input slot (NEW)
  const addTripPhotoBox = () => {
    setTripPhotosPreview(prev => [...prev, ""]);
    setTripPhotoFiles(prev => [...prev, null]);
  };

  // 👇 Remove a photo input slot (NEW)
  const removeTripPhotoBox = (index: number) => {
    setTripPhotosPreview(prev => prev.filter((_, i) => i !== index));
    setTripPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addItineraryDay = () => {
    setItinerary(prev => [
      ...prev,
      { day: `Day ${prev.length + 1}`, morning: "", afternoon: "", evening: "" },
    ]);
  };

  const updateItinerary = (
    index: number,
    key: keyof ItineraryItem,
    value: string
  ) => {
    setItinerary(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const removeItineraryDay = (index: number) => {
    setItinerary(prev => prev.filter((_, i) => i !== index));
  };

  // 👇 Build FormData and send files (NEW)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tripName || !location || !startDate || !endDate) {
      setError("Please fill out name, location, start and end dates.");
      return;
    }

    const form = new FormData();
    form.append("name", tripName);
    form.append("location", location);
    form.append("startDate", startDate);
    form.append("endDate", endDate);
    form.append("flightInfo", flightInfo);
    form.append("journal", journal);
    form.append("itinerary", JSON.stringify(itinerary));

    // 👇 Append cover photo file if present (NEW)
    if (coverPhotoFile) {
      form.append("coverPhoto", coverPhotoFile);
    }
    // 👇 Append each trip-photo file if present (NEW)
    tripPhotoFiles.forEach(file => {
      if (file) form.append("tripPhotos", file);
    });

    try {
      const res = await fetch("/api/createTrip", {
        method: "POST",
        credentials: "include",
        body: form,                 // 👈 no JSON.stringify, use FormData
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to create trip");
      } else {
        onSearch();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    }
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-content">
        <button className="exit-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Plan Your Future Trip</h2>
        {error && <div className="error-msg">{error}</div>}
        <form className="trip-form" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Trip name"
            value={tripName}
            onChange={e => setTripName(e.target.value)}
            required
          />

          <input
            name="location"
            type="text"
            placeholder="Location(s)"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />

          <div className="flex-row">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
            />
          </div>

          <textarea
            name="flightInfo"
            placeholder="Enter flight"
            value={flightInfo}
            onChange={e => setFlightInfo(e.target.value)}
          />

          {/* Cover Photo */}
          <div className="cover-photo-section">
            {coverPhotoPreview && (
              <img
                src={coverPhotoPreview}
                alt="Cover Preview"
                className="cover-preview"
              />
            )}
            <label className="file-upload-label">
              Choose Cover Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverPhotoChange}  // 👈 updated handler
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
                  onChange={e => updateItinerary(idx, "day", e.target.value)}
                  placeholder="Day Title"
                />
                <textarea
                  placeholder="Morning Plans..."
                  value={item.morning}
                  onChange={e => updateItinerary(idx, "morning", e.target.value)}
                />
                <textarea
                  placeholder="Afternoon Plans..."
                  value={item.afternoon}
                  onChange={e => updateItinerary(idx, "afternoon", e.target.value)}
                />
                <textarea
                  placeholder="Evening Plans..."
                  value={item.evening}
                  onChange={e => updateItinerary(idx, "evening", e.target.value)}
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
          <h3>Journal</h3>
          <textarea
            name="journal"
            placeholder="Journal"
            value={journal}
            onChange={e => setJournal(e.target.value)}
          />

          {/* Trip Photos */}
          <div className="trip-photos-section">
            <h3>Trip Photos</h3>
            {tripPhotosPreview.map((photo, idx) => (
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
                    onChange={e => handleTripPhotoChange(e, idx)}  // 👈 updated handler
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeTripPhotoBox(idx)}          // 👈 updated handler
                  className="circle-remove-btn"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTripPhotoBox}                           // 👈 new handler
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
