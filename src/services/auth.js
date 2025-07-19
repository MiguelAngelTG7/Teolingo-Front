// src/routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { accessToken } = useAuth();

  return accessToken ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
