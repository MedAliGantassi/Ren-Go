import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { APP_ROUTES, ROLES } from '../../constants';
import { HomePage, PropertyListingPage, ContactPage } from '../../pages/public';
import PropertyDetailsPage from '../../pages/PropertyDetailsPage/PropertyDetailsPage';
import { LoginPage, RegisterPage } from '../../pages/auth';
import { ClientDashboardPage } from '../../pages/client';
import { OwnerDashboardPage } from '../../pages/proprietaire';
import { AdminDashboardPage } from '../../pages/admin';
import AuthModal from '../../components/common/AuthModal/AuthModal';

const AppRouter = () => {
  return (
    <Router>
      <AuthModal />
      <Routes>
        {/* Pages with standalone layouts */}
        <Route path={APP_ROUTES.PROPERTIES} element={<PropertyListingPage />} />
        <Route path={APP_ROUTES.CONTACT} element={<ContactPage />} />

        <Route element={<MainLayout />}>
          <Route path={APP_ROUTES.HOME} element={<HomePage />} />
          <Route path={APP_ROUTES.PROPERTY_DETAILS} element={<PropertyDetailsPage />} />
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.CLIENT]} />}>
            <Route path={APP_ROUTES.CLIENT_DASHBOARD} element={<ClientDashboardPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.PROPRIETAIRE]} />}>
            <Route path={APP_ROUTES.OWNER_DASHBOARD} element={<OwnerDashboardPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path={APP_ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
