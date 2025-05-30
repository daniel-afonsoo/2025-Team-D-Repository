import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login        from '../pages/Login';
import Dashboard    from '../pages/Dashboard';
import HorariosESGT from '../pages/HorariosESGT';
import HorariosESTT from '../pages/HorariosESTT';
import HorariosESTA from '../pages/HorariosESTA';
import BackOffice   from '../pages/BackOffice';
import Data_Pages   from '../pages/Data_Pages';
import PrivateRoute from '../components/PrivateRoute';

const RouterConfig = () => (
  <Routes>
    {/* Rota pública */}
    <Route path="/" element={<Login />} />

    {/* Todas as rotas abaixo requerem login */}
    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard/>} />

      <Route path="/horariosESGT" element={<HorariosESGT/>}/>
      <Route path="/horariosESTT" element={<HorariosESTT/>}/>
      <Route path="/horariosESTA" element={<HorariosESTA/>}/>

      <Route path="/backoffice" element={<BackOffice/>}/>
      <Route path="/backoffice/docentes"                 element={<Data_Pages/>}/>
      <Route path="/backoffice/cursos"                   element={<Data_Pages/>}/>
      <Route path="/backoffice/unidades-curriculares"    element={<Data_Pages/>}/>
      <Route path="/backoffice/escolas"                  element={<Data_Pages/>}/>
      <Route path="/backoffice/salas"                    element={<Data_Pages/>}/>
      <Route path="/backoffice/turmas"                   element={<Data_Pages/>}/>
    </Route>

    {/* Qualquer outra URL */} 
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default RouterConfig;
