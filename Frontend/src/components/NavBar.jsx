import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/slices/userSlice";
import { checkSession } from "../utils/api";
import { FiUser, FiLogOut, FiX, FiChevronDown, FiCheck, FiHome} from "react-icons/fi";
import "../styles/NavBar.css";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // New state for loader

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutUser = async () => {
    try {
      const response = await fetch('/api/v1/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        dispatch(clearUser());
        window.location.href = "/";
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setMessage({ text: "Passwords don't match", type: "error" });
      return;
    }

    setIsUpdating(true); // Start loading
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`/api/v1/user/update-profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profileForm.name,
          currentPassword: profileForm.currentPassword,
          newPassword: profileForm.newPassword
        })
      });

      const data = await response.json();
      const newUser = await checkSession();
      
      if (newUser) {
        dispatch(setUser(newUser));
      } else {
        dispatch(clearUser());
      }

      if (response.ok) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setTimeout(() => {
          setShowProfileModal(false);
          setIsUpdating(false);
          setMessage("");
        }, 1500);
      } else {
        setMessage({ text: data.message, type: "error" });
        setIsUpdating(false);
      }
    } catch (error) {
      setMessage({ text: "Error updating profile", type: "error" });
      console.error("Error:", error);
      setIsUpdating(false);
    }
  };

  return (
    <nav className={`topbar-navbar ${scrolled ? "topbar-scrolled" : ""}`}>
     <div className="top-bar-brand" onClick={() => window.location.href = "/"}>
            {/* <FiHome className="top-bar-logo-icon" /> */}
          <div className="top-bar-logo-container">
            <span className="top-bar-app-name">RemaHorizon -</span>
          <div className="top-bar-tagline">Project Management System</div>
          </div>
        </div>

      <div className="topbar-menu">
        {user && (
          <div className="topbar-user-profile" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="topbar-avatar">
              {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="topbar-username">
              {user?.name || user?.email.split("@")[0]}
              <FiChevronDown className={`topbar-dropdown-icon ${showDropdown ? "topbar-rotate" : ""}`} />
            </span>
            
            {showDropdown && (
              <div className="topbar-dropdown-menu">
                <div className="topbar-dropdown-header">
                  <div className="topbar-avatar-large">
                    {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="topbar-user-fullname">{user?.name}</div>
                    <div className="topbar-user-email">{user?.email}</div>
                  </div>
                </div>
                {/* <div className="topbar-dropdown-divider"></div> */}
                <button 
                  className="topbar-dropdown-item"
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDropdown(false);
                  }}
                >
                  <FiUser className="topbar-icon" />
                  <span>Profile Settings</span>
                </button>
                {/* <div className="topbar-dropdown-divider"></div> */}
                <button className="topbar-dropdown-item topbar-logout" onClick={logoutUser}>
                  <FiLogOut className="topbar-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showProfileModal && (
        <div className="topbar-modal-overlay">
          <div className="topbar-modal-content">
            <div className="topbar-modal-header">
              <h3>Update Profile</h3>
              <button 
                className="topbar-close-btn" 
                onClick={() => {
                  setShowProfileModal(false);
                  setMessage({ text: "", type: "" });
                }}
                disabled={isUpdating}
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleProfileUpdate}>
              <div className="topbar-form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  required
                  className="topbar-input"
                  disabled={isUpdating}
                />
              </div>
              
              <div className="topbar-form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={profileForm.currentPassword}
                  onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                  placeholder="Required for any changes"
                  className="topbar-input"
                  disabled={isUpdating}
                />
              </div>
              
              <div className="topbar-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                  placeholder="Leave blank to keep current"
                  className="topbar-input"
                  disabled={isUpdating}
                />
                {profileForm.newPassword && (
                  <div className="topbar-password-strength">
                    <span className={`topbar-strength-item ${profileForm.newPassword.length >= 8 ? "topbar-valid" : ""}`}>
                      <FiCheck className="topbar-icon" /> 8+ characters
                    </span>
                  </div>
                )}
              </div>
              
              {profileForm.newPassword && (
                <div className="topbar-form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
                    placeholder="Confirm your new password"
                    className="topbar-input"
                    disabled={isUpdating}
                  />
                </div>
              )}
              
              {message.text && (
                <div className={`topbar-message topbar-${message.type}`}>
                  {message.text}
                </div>
              )}
              
              <button 
                type="submit" 
                className="topbar-submit-btn"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="topbar-loader"></span>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;