import React from 'react';
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { BrowserRouter as Router } from 'react-router-dom'; // Importar o BrowserRouter
import RouterConfig from '../routes/routes'; // Importar o arquivo de rotas
import '../styles/main.css'


function App() {
  return (
    <div className="app-container">
      <Router> {/* Envolver toda a aplicação com BrowserRouter */}
        <Navbar />
        <main className="content">
          <RouterConfig /> {/* Renderizar as rotas configuradas */}
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;