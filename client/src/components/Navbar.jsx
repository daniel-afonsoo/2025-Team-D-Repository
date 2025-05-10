import React from 'react';
import '../styles/navbar.css'
import { useLocation, Link } from 'react-router-dom';
import logo from '../images/ipt_logo.jpg';


const Navbar = () => {

  const location = useLocation();
  const path = location.pathname;



  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="https://www.ipt.pt" target="_blank" rel="noopener noreferrer" style={{ cursor: 'default' }}>
          <img src={logo} alt="Logo IPT" className="logo" />
        </a>

        {!(path === "/") && (
          <>
            <Link className='linksNavBar' to="/">Dashboard</Link>
          </>
        )}


      </div>

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
          <Link className='linksNavBar' style={{ cursor: 'default', fontSize: '30px' }}>Horários ESTT</Link>
        </>
      )}

      {path.startsWith('/horariosESTA') && (
        <>
          <Link className='linksNavBar' style={{ cursor: 'default', fontSize: '30px'  }}>Horários ESTA</Link>
        </>
      )}

      {path.startsWith('/horariosESGT') && (
        <>
          <Link className='linksNavBar' style={{ cursor: 'default', fontSize: '30px'  }}>Horários ESGT</Link>
        </>
      )}

      <div className="navbar-right">

      </div>
    </div>
  );
};

export default Navbar;