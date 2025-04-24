import '../css/TripCard.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Trip {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date; 
  coverPhoto?: string;
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

  // Helper to convert upload path to serve URL
  const getServeUrl = (uploadPath: string) => {
    const parts = uploadPath.replace(/^\//, '').split('/');
    const [, owner, ...rest] = parts;
    return `/api/servePhotos/${owner}/${rest.join('/')}`;
  };

  const imageUrl = trip.coverPhoto ? getServeUrl(trip.coverPhoto) : "./WanderImg.png";


	const handleDelete = async () => {
	try {
		const res = await fetch("/api/MyTrips/tripDelete", {
		  method: "DELETE",
		  credentials: "include",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ id: trip._id }),
		});
    
        if (res.ok) {
          // Option 1: Refresh the page
          window.location.reload();
    
          // Option 2 (better): Use a prop to notify parent and remove the trip from state
          // onTripDeleted(trip._id);
        } else {
          const errorData = await res.json();
          alert(`Failed to delete trip: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('An error occurred while deleting the trip.');
      }
    };

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
    onClick={() => !showConfirm && navigate(`/TripDetails/${trip._id}`)}
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
          <button className="btn delete-confirm btn-danger btn-sm"  onClick={handleDelete}>Yes</button>
          <button  className="btn delete-confirm btn-secondary btn-sm" onClick={() => setShowConfirm(false)}>No</button>
        </div>
      )}
    
      {/* img part of card */}
      <div style={{ flex: '2 0 0' }}>
        <img className="card-img-top"
          src={imageUrl}
          alt="Trip Cover"
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
