/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { LandingLayout } from "./components/layout/LandingLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProblemExplorer from "./pages/ProblemExplorer";
import VentureOpportunities from "./pages/VentureOpportunities";
import TeamBuilder from "./pages/TeamBuilder";
import IdeaAnalyzer from "./pages/IdeaAnalyzer";
import IdeaGenerator from "./pages/IdeaGenerator";
import Settings from "./pages/Settings";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Landing />} />
          </Route>
          
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="explorer" element={<ProblemExplorer />} />
            <Route path="ventures" element={<VentureOpportunities />} />
            <Route path="team" element={<TeamBuilder />} />
            <Route path="analyzer" element={<IdeaAnalyzer />} />
            <Route path="generator" element={<IdeaGenerator />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
