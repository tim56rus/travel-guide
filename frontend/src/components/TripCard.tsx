import "../css/TripCard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Trip {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  coverPhoto?: string;
}

interface TripCardProps {
  trip: Trip;
  onTripsLoaded: (trips: any[]) => void;
}

export default function TripCard({ trip, onTripsLoaded }: TripCardProps) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const start = new Date(trip.startDate);
  const end   = new Date(trip.endDate);

  const formattedDateRange =
    start.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    }) +
    " – " +
    end.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });

  const getServeUrl = (uploadPath: string) => {
    const parts = uploadPath.replace(/^\//, "").split("/");
    const [, owner, ...rest] = parts;
    return `/api/servePhotos/${owner}/${rest.join("/")}`;
  };

  const imageUrl = trip.coverPhoto
    ? getServeUrl(trip.coverPhoto)
    : "./WanderImg.png";

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/MyTrips/tripDelete", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trip._id }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to delete trip: ${errorData.error}`);
        return;
      }

      // fetch entire list with no query
      const listRes = await fetch("/api/searchTrips", { credentials: "include" });
      if (!listRes.ok) {
        alert("Trip deleted, but failed to reload list.");
        return;
      }
      const json = await listRes.json();
      onTripsLoaded(json.data);
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("An error occurred while deleting the trip.");
    }
  };

  return (
    <div
      className="card overflow-hidden position-relative"
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        width: "200px",
        height: "250px",
        fontFamily: "Montserrat",
        fontSize: "small",
      }}
      onClick={() => !showConfirm && navigate(`/TripDetails/${trip._id}`)}
    >
      <button
        className="btn delete-btn btn-sm position-absolute"
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirm(true);
        }}
      >
        <i className="fa-regular fa-trash-can fa-lg" style={{ color: "#c31313" }} />
      </button>

      {showConfirm && (
        <div className="confirm-overlay" onClick={(e) => e.stopPropagation()}>
          <p>Delete this trip?</p>
          <button
            className="btn delete-confirm btn-danger btn-sm"
            onClick={handleDelete}
          >
            Yes
          </button>
          <button
            className="btn delete-confirm btn-secondary btn-sm"
            onClick={() => setShowConfirm(false)}
          >
            No
          </button>
        </div>
      )}

      <div style={{ flex: "2 0 0" }}>
        <img
          className="card-img-top"
          src={imageUrl}
          alt="Trip Cover"
          
        />
      </div>

      <div
        className="card-body"
        style={{
          flex: "1 0 0",
          backgroundColor: "#ACD3A8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "5px",
          borderTop: "1px solid #D3D3D3",
        }}
      >
        <h1
          className="card-title"
          style={{
            fontSize: "16px",
            paddingLeft: "5px",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {trip.name}
        </h1>
        <p className="card-text" style={{ paddingLeft: "5px", margin: 0 }}>
          {formattedDateRange}
        </p>
      </div>
    </div>
  );
}
