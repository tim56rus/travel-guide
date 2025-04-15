import React from 'react';
import '../css/PlanTrip.css';

type PlanPopupProps = {
  onClose: () => void;
};

const PlanPopup: React.FC<PlanPopupProps> = ({ onClose }) => {
  return (
    <div className="popup-backdrop">
      <div className="popup-content">
        <button className="exit-btn" onClick={onClose}>✕</button>
        <h2>Plan Your Future Trip</h2>
        <form className="trip-form">
          {/*<label>Trip Name</label>*/}
          <input name="name" type="text" placeholder="Trip name" required />

          {/*  <label>Trip Date</label> */}
          <input name="date" type="date" required />

          {/*<label>Flight Information</label>*/}
          <textarea name="flightInfo" placeholder="Enter flight" />

          {/*<label>Itinerary Details</label>*/}
          <textarea name="itinerary" placeholder="Itinerary" />

          {/*<label>Journal Entry</label>*/}
          <textarea name="journal" placeholder="Journal" />

          {/*<label>Upload Trip Image</label>*/}
          <input type="file" accept="image/*" />

          <button className="submit-btn" type="submit">Submit Plan</button>
        </form>

      </div>
    </div>
  );
};

export default PlanPopup;
