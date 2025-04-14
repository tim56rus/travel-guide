import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// npm install bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Ensure the element is not null with a type assertion
const rootElement = document.getElementById('root') as HTMLElement

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
