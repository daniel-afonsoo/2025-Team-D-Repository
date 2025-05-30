import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ allowedRoles }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5170/auth/verify', { withCredentials: true })
      .then(res => {
        if (!allowedRoles || allowedRoles.includes(res.data.role)) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return null;
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
