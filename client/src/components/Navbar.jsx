import React from 'react';
import '../styles/navbar.css'
import { useLocation, Link } from 'react-router-dom';
import logo from '../images/ipt_logo_branco.svg';
import { FaHome } from 'react-icons/fa';

const Navbar = () => {

  const location = useLocation();
  const path = location.pathname;

  const h1Style = { cursor: 'default', fontSize: '30px', fontFamily: "'Times New Roman', Times, serif" }


  const getSelectedClass = (currentPath) => {
    return path.endsWith(currentPath) ? 'linksNavBarSelected' : 'linksNavBar';
  }

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
        {path === ('/backoffice') && (
          <>
            <h1 className='linksNavBar' style={h1Style} >Painel de Administração</h1>
          </>
        )}

        {path.startsWith('/backoffice/') && (
          <>

            <Link className='linksNavBar' to="/backoffice">Backoffice</Link>
            <Link className={getSelectedClass("/docentes")} to="/backoffice/docentes">Docentes</Link>
            <Link className={getSelectedClass("/cursos")} to="/backoffice/cursos">Cursos</Link>
            <Link className={getSelectedClass("/unidades-curriculares")} to="/backoffice/unidades-curriculares">Unidades Curriculares</Link>
            <Link className={getSelectedClass("escolas")} to="/backoffice/escolas">Escolas</Link>
            <Link className={getSelectedClass("salas")} to="/backoffice/salas">Salas</Link>
            <Link className={getSelectedClass("turmas")} to="/backoffice/turmas">Turmas</Link>
          </>
        )}

        {path.startsWith('/horariosESTT') && (
          <>
            <h1 className='linksNavBar' style={h1Style}>Horários ESTT</h1>
          </>
        )}

        {path.startsWith('/horariosESTA') && (
          <>
            <h1 className='linksNavBar' style={h1Style}>Horários ESTA</h1>
          </>
        )}

        {path.startsWith('/horariosESGT') && (
          <>
            <h1 className='linksNavBar' style={h1Style}>Horários ESGT</h1>
          </>
        )}

        {(path === "/" || path === "/login") && (
          <>
            <h1 className='linksNavBar' style={h1Style}>Horários Instituto Politécnico de Tomar</h1>
          </>
        )}

      </div>

      <div className="navbar-right">

      </div>
    </div>
  );
};

export default Navbar;