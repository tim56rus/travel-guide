import { useState } from 'react'
import './App.css'
// npm install react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Signup from './pages/Signup'

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App