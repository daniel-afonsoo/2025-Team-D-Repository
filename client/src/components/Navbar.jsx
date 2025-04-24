import React from 'react';
import '../styles/navbar.css'
import logo from '../images/ipt_logo.jpg'; // substitui pelo teu logo

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo IPT" className="logo" />
        <span className="instituto">Instituto Politécnico de Tomar</span>
      </div>
      <div className="navbar-right">
        <div className="links">
          <a href="/perfil">Perfil</a>
          <a href="/logout">Terminar sessão</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
