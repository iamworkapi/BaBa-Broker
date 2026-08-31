import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './hooks/useAuth';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Properties from './pages/Properties';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

const AboutUsAlternate = lazy(() => import('./pages/AboutUsAlternate'));
const Investor      = lazy(() => import('./pages/Investor'));
const Partners      = lazy(() => import('./pages/Partners'));
const Blank         = lazy(() => import('./pages/Blank'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const StaffLogin    = lazy(() => import('./pages/StaffLogin'));
const AdminLogin    = lazy(() => import('./pages/AdminLogin'));
const SalesLogin    = lazy(() => import('./pages/SalesLogin'));
const EmployeeLogin = lazy(() => import('./pages/EmployeeLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SalesmanDashboard = lazy(() => import('./pages/SalesmanDashboard'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const BecomeInvestor   = lazy(() => import('./pages/BecomeInvestor'));

function ProtectedRoute({ allowedRoles, children }) {
  const { session, getAuth } = useAuth();
  const auth = session || getAuth();
  const token = auth?.token || auth?.access;
  if (!auth || !token) {
    if (allowedRoles.includes('salesman')) return <Navigate to="/salesman/login" replace />;
    if (allowedRoles.includes('employee')) return <Navigate to="/employee/login" replace />;
    return <Navigate to="/admin/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    if (auth.role === 'salesman') return <Navigate to="/salesman/dashboard" replace />;
    if (auth.role === 'employee') return <Navigate to="/employee/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="about-1" element={<AboutUsAlternate />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="auth" element={<Auth />} />
              <Route path="blank" element={<Blank />} />
              <Route path="investor" element={<Investor />} />
              <Route path="become-investor" element={<BecomeInvestor />} />
              <Route path="partners" element={<Partners />} />
              <Route path="properties" element={<Properties />} />
              <Route path="property-details" element={<PropertyDetails />} />

              {/* Auth Login Routes */}
              <Route path="admin/login" element={<AdminLogin />} />
              <Route path="salesman/login" element={<SalesLogin />} />
              <Route path="employee/login" element={<EmployeeLogin />} />

              {/* Protected Admin Routes */}
              <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="admin/projects" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="projects" /></ProtectedRoute>} />
              <Route path="admin/create-project" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="create-project" /></ProtectedRoute>} />
              <Route path="admin/featured" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="featured" /></ProtectedRoute>} />
              <Route path="admin/flats" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="flats" /></ProtectedRoute>} />
              <Route path="admin/plots" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="plots" /></ProtectedRoute>} />
              <Route path="admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="staff" /></ProtectedRoute>} />
              <Route path="admin/contacts" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="contacts" /></ProtectedRoute>} />
              <Route path="admin/add-investor" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="add-investor" /></ProtectedRoute>} />
              <Route path="admin/investment-requests" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="investment-requests" /></ProtectedRoute>} />
              <Route path="admin/whatsapp" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="whatsapp" /></ProtectedRoute>} />
              <Route path="admin/excel" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard view="excel" /></ProtectedRoute>} />

              {/* Protected Staff Routes */}
              <Route path="salesman/dashboard" element={<ProtectedRoute allowedRoles={['salesman', 'admin']}><SalesmanDashboard /></ProtectedRoute>} />
              <Route path="employee/dashboard" element={<ProtectedRoute allowedRoles={['employee', 'admin']}><EmployeeDashboard /></ProtectedRoute>} />

              {/* Catch-all: 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
