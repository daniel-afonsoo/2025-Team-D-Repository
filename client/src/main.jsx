import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.jsx'
import Login from './pages/Login.jsx'
import Horarios from './pages/horarios.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Horarios />
  </StrictMode>,
)
