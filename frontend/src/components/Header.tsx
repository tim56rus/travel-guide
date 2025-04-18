import '../css/Header.css';

function Header() {

  return (
    // header background
    <div 
      style={{
        position: 'sticky', top: '0', zIndex: '1000',
        backgroundImage: 'linear-gradient(to right, #ACD3A8, #8AB2A6)',
        display: 'flex',
        justifyContent: 'space-between',
        boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.12)'
      }} 
    > 
      {/* logo */}
      <img src="/WanderLogo.png" alt="Wander"
        style={{
          width: '200px'
        }}
      />

      {/* user icon + dropdown for logout and user management */}
      <div
        className="dropdown"
        style={{padding: '5px', fontFamily: 'Montserrat'}}
      >
        <button
          className="btn p-0 border-0 bg-transparent"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="/defaultIcon.png"
            alt="User Mangement"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid white',
              marginTop: '5px', marginRight: '5px'
            }}
          />
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><a className="dropdown-item" href="/account">User Settings</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#" style={{fontWeight:'bold'}}>Log Out</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
