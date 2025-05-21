import React from 'react';
import '../styles/navbar.css'
import { useLocation, Link } from 'react-router-dom';
import logo from '../images/ipt_logo_branco.svg';
import { FaHome } from 'react-icons/fa';

const Navbar = () => {

  const location = useLocation();
  const path = location.pathname;



  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="https://www.ipt.pt" target="_blank" rel="noopener noreferrer" style={{ cursor: 'default' }}>
          <img src={logo} alt="Logo IPT" className="logo" style={{ width: "200px", height: "auto" }} />
        </a>

        {!(path === "/" || path === "/login") && (
          <>
            <Link className='linksNavBar' to="/"> <FaHome size={35} color="#fff" /></Link>
          </>
        )}


      </div>

      <div className='navbar-center'>
        {/* Links adicionais para o backoffice */}
        {path.startsWith('/backoffice') && (
          <>

            <Link className='linksNavBar' to="/backoffice">BackOffice</Link>
            <Link className='linksNavBar' to="/backoffice/docentes">Docentes</Link>
            <Link className='linksNavBar' to="/backoffice/cursos">Cursos</Link>
            <Link className='linksNavBar' to="/backoffice/unidades-curriculares">Unidades Curriculares</Link>
            <Link className='linksNavBar' to="/backoffice/escolas">Escolas</Link>
            <Link className='linksNavBar' to="/backoffice/salas">Salas</Link>
            <Link className='linksNavBar' to="/backoffice/turmas">Turmas</Link>
          </>
        )}

        {path.startsWith('/horariosESTT') && (
          <>
            <h1 className='linksNavBar' style={{ cursor: 'default', fontSize: '30px', fontFamily: "'Times New Roman', Times, serif" }}>Horários ESTT</h1>
          </>
        )}

        {path.startsWith('/horariosESTA') && (
          <>
            <h1 className='linksNavBars' style={{ cursor: 'default', fontSize: '30px', fontFamily: "'Times New Roman', Times, serif" }}>Horários ESTA</h1>
          </>
        )}

        {path.startsWith('/horariosESGT') && (
          <>
            <h1 className='linksNavBar' style={{ cursor: 'default', fontSize: '30px', fontFamily: "'Times New Roman', Times, serif"}}>Horários ESGT</h1>
          </>
        )}

        {(path === "/" || path === "/login") && (
          <>
            <h1 className='linksNavBar' style={{ cursor: 'default', fontSize: '30px', fontFamily: "'Times New Roman', Times, serif"}}>Horários Instituto Politécnico de Tomar</h1>
          </>
        )}

      </div>

      <div className="navbar-right">

      </div>
    </div>
  );
};

export default Navbar;