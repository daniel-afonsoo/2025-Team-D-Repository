// src/routes.jsx
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

export default function RouterConfig() {
  return (
    <Routes>
      {/* pública */}
     <Route path="/login" element={<Login />} />
     <Route path="/" element={<Navigate to="/login" replace />} />

      {/* dashboard: qualquer user autenticado */}
      <Route element={<PrivateRoute allowedRoles={['prof', 'comissao', 'diretor', 'admin']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/horariosESGT" element={<HorariosESGT />} />
        <Route path="/horariosESTT" element={<HorariosESTT />} />
        <Route path="/horariosESTA" element={<HorariosESTA />} />
      </Route>

      {/* backoffice: só admins */}
      <Route element={<PrivateRoute allowedRoles={['diretor', 'admin']} />}>
        <Route path="/backoffice" element={<BackOffice />} />
        <Route path="/backoffice/:entity" element={<Data_Pages />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
