import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Upload from './Upload'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Upload />
  </StrictMode>,
)
