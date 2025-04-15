import React, { useState, FormEvent, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/WanderLogo.png'

function Login(): JSX.Element {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (email === 'user@example.com' && password === 'password123') {
      alert('Login successful!')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center mb-4">
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: '500px', height: 'auto' }}
        />
      </div>
      <div
        className="card shadow p-4"
        style={{ width: '100%', maxWidth: '500px', backgroundColor: '#F6F1DE' }}
      >
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-start w-100">Email or Username:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-start w-100">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="btn w-100"
            style={{ backgroundColor: '#8AB2A6', color: 'white' }}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
