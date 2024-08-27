import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // o cualquier otra forma que uses para manejar la autenticación

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
