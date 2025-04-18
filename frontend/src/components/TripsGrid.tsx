import TripCard from '../components/TripCard';
import '../css/TripsGrid.css';

interface TripsGridProps {
  onAddTrip: () => void;
}

function TripsGrid({ onAddTrip }: TripsGridProps) {
  return (
    <div className="container mt-0"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1rem'
      }}>
        {/* add new trip btn */} 
        <button id='addCardBtn' onClick={onAddTrip}
          style={{
            backgroundColor: '#ACD3A8',
            border: 'none',
            borderRadius: '5px',
            width: '200px',
            height: '250px',
            fontFamily: 'Montserrat', fontWeight: '400'
          }}
        >
        <i className="fa-solid fa-plus" style={{ fontSize: '30px', fontWeight: '1' }}></i>
        <br /> Add Trip</button>

      <TripCard />
    </div>
  );
}

export default TripsGrid;
