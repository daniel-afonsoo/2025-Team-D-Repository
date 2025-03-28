import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Docente from './components/create/DocenteCreate.jsx'
import Curso from './components/create/CursoCreate.jsx'
import UC from './components/create/UCCreate.jsx'
import Sala from './components/create/SalaCreate.jsx'
import Escola from './components/create/EscolaCreate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Docente />
  </StrictMode>,
)

/*
  
  <Curso />
  <UC />
  <Sala />
  <Escola />
*/