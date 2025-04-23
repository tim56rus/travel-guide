import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/WanderImg.png";
import '../css/TripDetails.css';

function Account() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("User details updated successfully!");

    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    setDeleted(true);
    setShowDeleteConfirm(false);
    setError("");
    setSuccess("");
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="trip-container max-w-5xl mx-auto p-6 rounded-xl shadow space-y-8"
        style={{ width: "100%", maxWidth: "600px", backgroundColor: "#F6F1DE" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">User Management</h2>
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "70px", height: "auto" }}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {deleted && (
          <div className="alert alert-danger">
            Your account has been deleted.
          </div>
        )}

        {showDeleteConfirm && (
          <div className="alert alert-warning text-center">
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <button
              className="btn btn-danger me-2"
              onClick={confirmDeleteAccount}
            >
              Yes, Delete
            </button>
            <button className="btn btn-secondary" onClick={cancelDeleteAccount}>
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="row">
            <div className="mb-3 col-md-6 text-center">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="rounded-circle mb-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    border: "3px solid #8AB2A6",
                  }}
                />
              ) : (
                <div
                  className="rounded-circle mb-2 d-flex justify-content-center align-items-center"
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "3px dashed #8AB2A6",
                    backgroundColor: "#f0f0f0",
                    fontSize: "32px",
                    color: "#8AB2A6",
                    cursor: "pointer",
                    margin: "0 auto",
                  }}
                  onClick={() =>
                    document.getElementById("profilePicInput").click()
                  }
                >
                  +
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: "none" }}
                id="profilePicInput"
              />
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">Username:</label>
              <input
                type="text"
                className="form-control custom-input"
                value={firstName}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">First Name:</label>
              <input
                type="text"
                className="form-control custom-input"
                value={lastName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">Last Name:</label>
              <input
                type="text"
                className="form-control custom-input"
                value={username}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">Email:</label>
              <input
                type="email"
                className="form-control custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">
                Current Password:
              </label>
              <input
                type="password"
                className="form-control custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">
                New Password:
              </label>
              <input
                type="password"
                className="form-control custom-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">
                Confirm New Password:
              </label>
              <input
                type="password"
                className="form-control custom-input"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 mb-2"
            style={{ backgroundColor: "#8AB2A6", color: "white" }}
          >
            Update Information
          </button>

          <button
            type="button"
            className="btn w-100"
            style={{ backgroundColor: "#c44c4c", color: "white" }}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </form>

        <p className="text-center mt-3">
          Back to <Link to="/MyTrips">Main Page</Link>
        </p>
      </div>
    </div>
  );
}

export default Account;
