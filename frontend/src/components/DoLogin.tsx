import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/WanderLogo.png'
import '../css/TripDetails.css';

function DoLogin() {
  const [login, setLogin] = useState<string>(""); //for email or username
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Check if session exists
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://lp.poosdisfun.xyz/api/checkSession", {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        if (data.userId) {
          navigate("/MyTrips");
        }
      } catch (e) {
        console.error("session check failed", e);
      }
    })();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const payload = { login, password };

    try {
      const response = await fetch("https://lp.poosdisfun.xyz/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.id <= 0) {
        // if login fails, show error message
        setError(result.error || "Invalid credentials");
      } else {
        // else, store user data and navigate onward
        const user = {
          firstName: result.firstName,
          lastName: result.lastName,
          username: result.username,
          id: result.id,
        };
        localStorage.setItem("user>data", JSON.stringify(user));
        setError("");
        navigate("/MyTrips");
      }
    } catch (err: any) {
      setError("error logging in: " + err.toString());
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
       <div className="text-center">
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: '500px', height: 'auto'}}
        />
      </div>
      <div
        className="trip-container max-w-5xl mx-auto p-6 rounded-xl shadow space-y-8"
        style={{ width: "100%", maxWidth: "500px", backgroundColor: "#F6F1DE" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-start w-100">
              Email or Username:
            </label>
            <input
              type="text"
              className="form-control"
              value={login}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLogin(e.target.value)
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
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#8AB2A6", color: "white" }}
          >
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default DoLogin;
