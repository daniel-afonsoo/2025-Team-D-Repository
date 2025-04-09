import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CursoEdit from './components/edit_remove/Curso_edit_remove.jsx'
import  DocenteEdit from './components/edit_remove/Docente_edit_remove.jsx'
import  EscolaEdit from './components/edit_remove/Escola_edit_remove.jsx'
import  UcEdit from './components/edit_remove/UC_edit_remove.jsx'
import  SalaEdit from './components/edit_remove/Sala_edit_remove.jsx'
import  Horarios from './components/horarios.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SalaEdit/>
    <UcEdit />
    <EscolaEdit />
    <DocenteEdit />
    <CursoEdit />
    <Horarios />
  </StrictMode>,
)
