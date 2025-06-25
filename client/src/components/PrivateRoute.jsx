// components/PrivateRoute.jsx
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

export default function PrivateRoute({ allowedRoles }) {
  const [status, setStatus] = useState('checking');  // só um string

 useEffect(() => {
  axios.get('http://localhost:5170/auth/verify', { withCredentials: true })
    .then(res => {
      const role = res.data.role;
      if (!role) {
        // Se não veio role nenhum, trata como “não autenticado”
        return setStatus('no-auth');
      }
      if (allowedRoles.includes(role)) {
        // Autenticado e com papel permitido
        setStatus('ok');
      } else {
        // Autenticado, mas sem permissão
        setStatus('forbidden');
      }
    })
    .catch(err => {
      const code = err.response?.status;
      if (code === 401 || !code) {
        // Sem cookie ou erro de rede → login
        setStatus('no-auth');
      } else if (code === 403) {
        // Token existe, mas sem permissão → dashboard
        setStatus('forbidden');
      } else {
        // Qualquer outro → login
        setStatus('no-auth');
      }
    });
}, [allowedRoles]);



  if (status === 'checking') {
    return null;            // não monta Outlet nem children
  }
  if (status === 'no-auth') {
    return <Navigate to="/login" replace />;
  }
  if (status === 'forbidden') {
    return <Navigate to="/login" replace />;
  }
  // status === 'ok'
  return <Outlet />;
}
