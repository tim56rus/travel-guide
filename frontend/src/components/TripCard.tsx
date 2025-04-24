import '../css/TripCard.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Trip {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date; 
}

interface TripCardProps {
  trip: Trip;
}

function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  const formattedDateRange =
    start.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) +
    " – " +
    end.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });

  return(
    // individual trip card 
    <div className="card overflow-hidden position-relative"
    style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '5px',
      width: '200px', height: '250px',
      fontFamily: 'Montserrat', fontSize: 'small'
    }}
    onClick={() => !showConfirm && navigate(`/TripDetails/`)}
    >

      {/* Delete Button */}
      <button
      className="btn delete-btn btn-sm position-absolute"
      onClick={(e) => {
        e.stopPropagation(); // prevents navigation
        setShowConfirm(true);
      }}
      >
        <i className="fa-regular fa-trash-can fa-lg" style={{color: '#c31313'}}></i>
      </button>

      {/* Delete Confirmation Overlay */}
      {showConfirm && (
        <div
          className="confirm-overlay"
          onClick={(e) => e.stopPropagation()} 
        >
          <p>Delete this trip?</p>
          <button className="btn delete-confirm btn-danger btn-sm">Yes</button>
          <button  className="btn delete-confirm btn-secondary btn-sm" onClick={() => setShowConfirm(false)}>No</button>
        </div>
      )}
    
      {/* img part of card */}
      <div style={{ flex: '2 0 0' }}>
        <img className="card-img-top"
          src="./WanderImg.png"
          alt="Default card image"
          style={{
            width: '200px',
            height: '180px',
            objectFit: 'cover',
            margin: '0px', padding: '0px'
          }}/>
      </div>

      {/* destination + date */}
      <div className="card-body"
        style={{
          flex: '1 0 0',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '5px', 
          borderTop: '1px solid #D3D3D3' 
        }}>
          <h1 className="card-title" style={{fontSize: '20px', paddingLeft: '5px', margin: '0px'}}>{trip.name}</h1>
          <p className="card-text" style={{paddingLeft: '5px', margin: '0px'}}>{formattedDateRange}</p>
      </div>
    </div>
  );
}

export default TripCard;
