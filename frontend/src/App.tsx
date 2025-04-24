import { useState } from 'react'
import './css/App.css'
// npm install react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import MyTripsPage from './pages/MyTripsPage'
import TripDetails from './pages/TripDetails'

function App(){
  const [count, setCount] = useState<number>(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />}/>
        <Route path="/MyTrips" element={<MyTripsPage />} />
        <Route path="/TripDetails/:id" element={<TripDetails />} />
      </Routes>
    </Router>
  )
}

export default App
