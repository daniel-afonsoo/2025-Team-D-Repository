import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CursoEdit from './components/edit_remove/Curso_edit_remove.jsx'
import  DocenteEdit from './components/edit_remove/Docente_edit_remove.jsx'
import CursoCreate from './components/create/CursoCreate.jsx'
import DocenteCreate from './components/create/DocenteCreate.jsx'  
import EscolaCreate from './components/create/EscolaCreate.jsx'  
import UCCreate from './components/create/UCCreate.jsx'
import  EscolaEdit from './components/edit_remove/Escola_edit_remove.jsx'
import  UcEdit from './components/edit_remove/UC_edit_remove.jsx'
import  SalaEdit from './components/edit_remove/Sala_edit_remove.jsx'
import  Horarios from './components/horarios.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import HorarioPage from './pages/Horario.jsx'
import BackOffice from './pages/BackOffice.jsx'
import Navbar from './components/Navbar.jsx'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Navbar />
    {/* <Login />   */}
    {/* <SalaEdit/>
    <UcEdit />
    <EscolaEdit />
    <DocenteEdit />
    <CursoEdit />
    <DocenteCreate/>  
    <EscolaCreate/>
    <CursoCreate/>
    <UCCreate/>  
    <Horarios />
    
    <HorarioPage />
    
    <Dashboard /> 
    */}
     <BackOffice />
    
  </StrictMode>,
)
