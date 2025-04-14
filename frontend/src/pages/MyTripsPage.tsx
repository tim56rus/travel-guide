import Header from '../components/Header';
import SearchTrips from '../components/SearchTrips';
import TripsGrid from '../components/TripsGrid';

const MyTripsPage = () => {

  return(
    <div style={{
      backgroundColor: '#F6F1DE', 
      minHeight: '100vh', width: '100%'
    }}>
      <Header />
      <h1 style={{
        fontFamily: 'Montserrat', fontWeight: '300', 
        textAlign: 'center',
        fontSize: '60px', 
        padding: '10px'
      }}>
        My Trips
      </h1>
      <SearchTrips />
      <TripsGrid />
    </div>
  );
};

export default MyTripsPage;