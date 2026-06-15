import { Link, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/notes" className="header-logo">📝 Notes</Link>
        <nav className="header-nav">
          <Link to="/notes" className={location.pathname === "/notes" ? "active" : ""}>
            Notes
          </Link>
          <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
            Profile
          </Link>
        </nav>
      </div>

      <div className="header-right">
        <Link to="/profile" className="user-chip">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="avatar" />
          ) : (
            <span className="avatar avatar-fallback">{initials}</span>
          )}
          <span className="welcome-text">Hi, {user?.username}</span>
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </header>
  );
}
