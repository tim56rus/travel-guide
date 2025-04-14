import './TripCard.css';

function TripCard() {
  return(
    // individual trip card 
    <div className="card h-100 overflow-hidden"
    style={{
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '5px',
    width: '200px', height: '250px', aspectRatio: '4 / 3'
    }}>
    
      {/* img part of card */}
      <div style={{ flex: '2 0 0' }}>
        <img className="card-img-top"
          src="./WanderImg.png"
          alt="Default card image"
          style={{
            width: '200px',
            height: '180px',
            objectFit: 'cover',
            margin: '0px', padding: '5px'
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
          padding: '0', 
          borderTop: '1px solid black' // testing
        }}>
          <h1 className="card-title" style={{fontSize: '20px', paddingLeft: '5px', margin: '0px'}}>Destination</h1>
          <p className="card-text" style={{paddingLeft: '5px', margin: '0px'}}>Date</p>
      </div>
    </div>
  );
}

export default TripCard;