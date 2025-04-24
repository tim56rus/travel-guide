import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/WanderImg.png";
import "../css/TripDetails.css";
import "../css/Account.css";

// same uploader util you use elsewhere
async function uploadToServer(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.path; // e.g. "/uploads/<userId>/filename.jpg"
}

// turns "/uploads/owner/filename.jpg" into
// "/api/servePhotos/owner/filename.jpg"
function getServeUrl(uploadPath: string) {
  const parts = uploadPath.replace(/^\//, "").split("/");
  const [, owner, ...rest] = parts;
  return `/api/servePhotos/${owner}/${rest.join("/")}`;
}

function Account() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePicPath, setProfilePicPath] = useState<string>(""); // store server path
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  // on mount: check session, load account data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/checkSession", {
          method: "GET",
          credentials: "include",
        });
        const { userId } = await res.json();
        if (!userId) return navigate("/login", { replace: true });
        setUserId(userId);

        const acctRes = await fetch("/api/account/populate", {
          credentials: "include",
        });
        const { error: acctErr, data: acctData } = await acctRes.json();
        if (acctErr) {
          setError(acctErr);
        } else {
          setUsername(acctData.username);
          setFirstName(acctData.firstName);
          setLastName(acctData.lastName);
          setEmail(acctData.email);
          if (acctData.profilePic) {
            setProfilePicPath(acctData.profilePic);
            setProfilePicture(getServeUrl(acctData.profilePic));
          }
        }
      } catch (e) {
        console.error("Session/account load failed", e);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading…</div>
    );
  }

  // when user picks a new file, upload immediately
  const handleProfilePictureChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const path = await uploadToServer(file);
      setProfilePicPath(path);
      setProfilePicture(getServeUrl(path));
    } catch (err: any) {
      console.error("Profile upload failed:", err);
      setError("Failed to upload profile picture.");
    } finally {
      // clear the input so onChange fires next time, even if same file
      e.target.value = "";
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    // build payload, include profilePic if we have it
    const payload: any = {
      userId,
      username,
      email,
      firstName,
      lastName,
      password: password || "",
      newPassword: newPassword || "",
      confirmNewPassword: confirmNewPassword || "",
    };
    if (profilePicPath) {
      payload.profilePic = profilePicPath;
    }

    try {
      const res = await fetch("/api/account/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const { error: errMsg, success: successMsg } = await res.json();
      if (errMsg) {
        setError(errMsg);
      } else {
        setSuccess(successMsg);
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (e) {
      console.error(e);
      setError("Unable to update account. Please try again.");
    }
  };

  const handleDeleteAccount = () => setShowDeleteConfirm(true);
  const cancelDeleteAccount = () => setShowDeleteConfirm(false);

  const confirmDeleteAccount = async () => {
    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        credentials: "include",
      });
      const { error: errMsg } = await res.json();
      if (errMsg) {
        setError(errMsg);
      } else {
        localStorage.removeItem("user>data");
        await fetch("/api/logout", { method: "POST", credentials: "include" });
        navigate("/login", { replace: true });
      }
    } catch (e) {
      console.error(e);
      setError("Could not delete account. Try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      localStorage.removeItem("user>data");
      navigate("/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
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
              <div
                className="profile-pic-wrapper position-relative d-inline-block"
                onClick={() =>
                  document.getElementById("profilePicInput")!.click()
                }
                style={{ cursor: "pointer" }}
              >
                {profilePicture ? (
                  <>
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
                    {/* Overlay on hover */}
                    <div className="overlay rounded-circle">Change</div>
                  </>
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
                  >
                    +
                  </div>
                )}
              </div>

              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePictureChange}
              />
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">Username:</label>
              <input
                type="text"
                className="form-control custom-input"
                value={username}
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label text-start w-100">Last Name:</label>
              <input
                type="text"
                className="form-control custom-input"
                value={lastName}
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
            className="btn w-100 mb-2 btn-update"
            style={{ backgroundColor: "#8AB2A6", color: "white" }}
          >
            Update Information
          </button>
          <button
            type="button"
            className="btn w-100 btn-delete"
            style={{ backgroundColor: "#c44c4c", color: "white" }}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </form>

        <p
          className="text-center mt-3"
          style={{ fontSize: "16px", lineHeight: "1.5" }}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button
            className="btn btn-link p-0 m-0"
            style={{ fontSize: "16px", lineHeight: "1.5" }}
            onClick={handleLogout}
          >
            Log out
          </button>
          <span style={{ fontSize: "20px", padding: "0 10px" }}>•</span>
          <Link
            to="/MyTrips"
            className="btn btn-link p-0 m-0"
            style={{ fontSize: "16px", lineHeight: "1.5" }}
          >
            Main Page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Account;
