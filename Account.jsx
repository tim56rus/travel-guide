import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Account() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();

    // Validation checks
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      setSuccess('');
      return;
    }

    // Mock success message after validation
    setError('');
    setSuccess('User details updated successfully!');
    
    // Clear the fields
    setUsername('');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#F6F1DE' }}>
        <h2 className="text-center mb-4">User Management</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label text-start w-100">Username:</label>
            <input
              type="text"
              className="form-control custom-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-start w-100">Email:</label>
            <input
              type="email"
              className="form-control custom-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-start w-100">Current Password:</label>
            <input
              type="password"
              className="form-control custom-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-start w-100">New Password:</label>
            <input
              type="password"
              className="form-control custom-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-start w-100">Confirm New Password:</label>
            <input
              type="password"
              className="form-control custom-input"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn w-100"
            style={{ backgroundColor: '#8AB2A6', color: 'white' }}
          >
            Update Information
          </button>
        </form>

        <p className="text-center mt-3">
          Back to <Link to="/profile">Profile</Link>
        </p>
      </div>
    </div>
  );
}

export default Account;
