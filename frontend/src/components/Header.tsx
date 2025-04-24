import '../css/Header.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    profilePic?: string;
  } | null>(null);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const timeoutRef = useRef<any>(null); // Avoid NodeJS.Timeout

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/account/populate", {
          credentials: "include"
        });
        const json = await res.json();
        if (res.ok && json.data) {
          setUser(json.data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const getServeUrl = (uploadPath: string) => {
    const parts = uploadPath.replace(/^\//, '').split('/');
    const [, owner, ...rest] = parts;
    return `/api/servePhotos/${owner}/${rest.join('/')}`;
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
      });
      localStorage.removeItem("user>data"); 
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const profileImgSrc = user?.profilePic ? getServeUrl(user.profilePic) : "/defaultIcon.png";

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 500); // Delay in ms before hiding
  };

  return (
    <div className="header-container">
      {/* logo */}
      <img src="/WanderLogo.png" alt="Wander" className="header-logo" />

      {/* user icon + hover dropdown */}
      <div className="header-user-section">
        <span id="userName" className="header-username">
          {user ? `${user.firstName} ${user.lastName}` : "Welcome"}
        </span>

        <div 
          className="dropdown-hover"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={profileImgSrc}
            alt="User Management"
            className="header-profile-pic"
          />
          <ul className={`dropdown-menu-custom ${isDropdownVisible ? 'show' : ''}`}>
            <li><a className="dropdown-item" href="/account">User Settings</a></li>
            <li><button className="dropdown-item" onClick={handleLogout} style={{fontWeight:'bold'}}>Log Out</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
