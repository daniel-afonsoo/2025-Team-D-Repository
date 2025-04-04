import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App';
import Horarios from './components/horarios'; // Certifique-se de que o nome começa com letra maiúscula

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Horarios /> {/* Use o nome correto do componente */}
  </StrictMode>,
);