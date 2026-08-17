import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { getAuth } from './lib/auth';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import AboutUsAlternate from './pages/AboutUsAlternate';
import ContactUs from './pages/ContactUs';
import Auth from './pages/Auth';
import Blank from './pages/Blank';
import Investor from './pages/Investor';
import BecomeInvestor from './pages/BecomeInvestor';
import Partners from './pages/Partners';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import StaffLogin from './pages/StaffLogin';
import AdminDashboard from './pages/AdminDashboard';
import SalesmanDashboard from './pages/SalesmanDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function ProtectedRoute({ allowedRoles, children }) {
  const auth = getAuth();
  if (!auth || !auth.token) {
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
  return (
    <Router>
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
          <Route path="admin/login" element={<StaffLogin role="admin" />} />
          <Route path="salesman/login" element={<StaffLogin role="salesman" />} />
          <Route path="employee/login" element={<StaffLogin role="employee" />} />

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

          {/* Protected Staff Routes */}
          <Route path="salesman/dashboard" element={<ProtectedRoute allowedRoles={['salesman', 'admin']}><SalesmanDashboard /></ProtectedRoute>} />
          <Route path="employee/dashboard" element={<ProtectedRoute allowedRoles={['employee', 'admin']}><EmployeeDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
