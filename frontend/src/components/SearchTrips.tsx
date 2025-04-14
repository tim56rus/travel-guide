function SearchTrips () {
  return(
    <div className="input-group rounded"
      style={{
        display: 'flex', justifyContent: 'center', 
      }}
    >
      <input type="search" className="form-control rounded" placeholder="Search Trips..." aria-label="Search" aria-describedby="search-addon" 
        style={{
          maxWidth: '400px'

        }}
      />
      <span className="input-group-text border-0" id="search-addon" style={{backgroundColor: 'transparent'}}>
        <i className="fas fa-search" style={{cursor: 'pointer'}}></i>
      </span>
    </div>
  );
}

export default SearchTrips;