import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import { useApp } from '@/context/AppContext';

function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user.sessionToken ? children : <Navigate to="/login" replace />;
}

function LoginRoute({ children }) {
  const { user } = useApp();
  return user.sessionToken ? <Navigate to="/" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginRoute>
            <LoginPage />
          </LoginRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
