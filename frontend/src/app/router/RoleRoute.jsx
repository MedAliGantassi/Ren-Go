import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../constants';

const RoleRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
