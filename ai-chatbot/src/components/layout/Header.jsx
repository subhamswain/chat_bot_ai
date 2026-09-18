import {
  Search,
  Bell,
  UserCircle,
  Menu,
  LogIn,
  LogOut,
} from "lucide-react";

function Header({
  isLoggedIn,
  onToggleLogin,
}) {
  return (
    <header className="site-header">

      <div className="header-left">

        <button className="mobile-menu-button">
          <Menu size={22} />
        </button>

        <div className="sws-logo">
          <div className="sws-logo-mark">
            S
          </div>

          <div>
            <div className="sws-logo-title">
              SWS
            </div>

            <div className="sws-logo-subtitle">
              Investor Services
            </div>
          </div>
        </div>

      </div>

      <nav className="header-navigation">

        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#applications">Applications</a>
        <a href="#grievances">Grievances</a>
        <a href="#documents">Documents</a>
        <a href="#resources">Resources</a>

      </nav>

      <div className="header-actions">

        <button className="header-icon-button">
          <Search size={19} />
        </button>

        <button className="header-icon-button">
          <Bell size={19} />

          {isLoggedIn && (
            <span className="notification-dot" />
          )}
        </button>

        <div className="profile-area">

          <div className="profile-avatar">
            SB
          </div>

          <div className="profile-info">

            <strong>
              {isLoggedIn
                ? "Satyabrata Bagha"
                : "Guest User"}
            </strong>

            <span>
              {isLoggedIn
                ? "Investor"
                : "Not Logged In"}
            </span>

          </div>

        </div>

        <button
          className="login-demo-button"
          onClick={onToggleLogin}
        >
          {isLoggedIn ? (
            <>
              <LogOut size={15} />
              Logout
            </>
          ) : (
            <>
              <LogIn size={15} />
              Login
            </>
          )}
        </button>

      </div>

    </header>
  );
}

export default Header;