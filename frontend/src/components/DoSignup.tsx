import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

function DoSignup() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = { firstName, lastName, username, email, password };

    try {
      const response = await fetch("https://mern.nosikcompsci.com/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(result.success);
        // redirect back to login after signup
        setTimeout(() => {
          navigate("/");
        }, 1000);
        // clear form fields
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError("Error signing up: " + err.toString());
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "500px", backgroundColor: "#F6F1DE" }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label text-start w-100">First Name:</label>
            <input
              type="text"
              className="form-control"
              value={firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFirstName(e.target.value)
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">Last Name:</label>
            <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">Username:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-start w-100">
              Confirm Password:
            </label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#8AB2A6", color: "white" }}
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default DoSignup;
