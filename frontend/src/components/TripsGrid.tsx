import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import './TripsGrid.css';


function TripsGrid() {

  const navigate = useNavigate();
  const goToPlanningPage = () => {
    navigate('/plan');
  };

  return (
    <div className="container mt-4" 
    style={{ 
      paddingTop: '15px',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1rem'
    }}>
    {/* add new trip btn */}
    <button id='addCardBtn' onClick={goToPlanningPage}
      style={{
        backgroundColor:'#ACD3A8',
        border: 'none', 
        borderRadius: '5px', 
        width: '200px', height: '250px',
      }}>
      <i className="fa-solid fa-plus" style={{fontSize: '30px', fontWeight: '1'}}></i>
      <br/> Add Trip</button>
    <TripCard />
    </div>
  );
};

export default TripsGrid;