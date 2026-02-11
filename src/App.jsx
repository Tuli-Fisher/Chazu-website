import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { initStorage, getSession } from './services/storage';

// Pages - placeholders for now
import Login from './pages/Login';
import LocationDashboard from './pages/LocationDashboard';
// import OverallDashboard from './pages/OverallDashboard'; // Deprecated
import AdminAggregatedData from './pages/admin/AdminAggregatedData';
import AdminDailyOperations from './pages/admin/AdminDailyOperations';
import AdminLocations from './pages/admin/AdminLocations';
import AdminFinance from './pages/admin/AdminFinance';
import AdminAlerts from './pages/AdminAlerts';
import Layout from './components/Layout';

// Route guard: protects routes that require authentication
// Checks if user is logged in and has the correct role
const PrivateRoute = ({ children, allowedRoles }) => {
  const session = getSession();
  const location = useLocation();

  if (!session) {
    // Not logged in - redirect to login, saving intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    // Wrong role - redirect to their appropriate dashboard
    return <Navigate to={session.role === 'OVERALL_MANAGER' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    initStorage(); // Initialize localStorage with default data
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Layout wraps authenticated routes with header/nav */}
      <Route element={<Layout />}>
        {/* Location Manager Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['LOCATION_MANAGER']}>
              <LocationDashboard />
            </PrivateRoute>
          }
        />

        {/* Overall Manager Routes - nested routes use <Outlet /> */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['OVERALL_MANAGER']}>
              <Outlet />
            </PrivateRoute>
          }
        >
          {/* Default admin route redirects to daily operations */}
          <Route index element={<Navigate to="daily" replace />} />
          <Route path="aggregated" element={<AdminAggregatedData />} />
          <Route path="daily" element={<AdminDailyOperations />} />
          <Route path="locations" element={<AdminLocations />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="alerts" element={<AdminAlerts />} />
        </Route>
      </Route>

      {/* Root path redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
