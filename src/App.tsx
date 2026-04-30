/**
 * App Component
 * ──────────────
 * Root application component with React Router configuration.
 * Defines public routes, auth routes, and protected dashboard routes.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

// Public pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';

// Protected dashboard
import DashboardLayout from '@/pages/dashboard/DashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import MyAgentsPage from '@/pages/dashboard/MyAgentsPage';
import OperationsPage from '@/pages/dashboard/OperationsPage';
import InsightsPage from '@/pages/dashboard/InsightsPage';
import SettingsPage from '@/pages/dashboard/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="agents" element={<MyAgentsPage />} />
            <Route path="operations" element={<OperationsPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
