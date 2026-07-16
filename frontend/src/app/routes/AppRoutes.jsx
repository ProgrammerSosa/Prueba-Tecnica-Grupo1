import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore.js";
import { BeeSpinner } from "../../shared/components/BeeSpinner.jsx";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage.jsx";
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage.jsx";
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage.jsx";
import { DashboardLayout } from "../layouts/DashboardPage.jsx";
import { DashboardHomePage } from "../../features/reports/pages/DashboardHomePage.jsx";
import { ProductsPage } from "../../features/products/pages/ProductsPage.jsx";
import { InventoryPage } from "../../features/inventory/pages/InventoryPage.jsx";
import { EntryPage } from "../../features/inventory/pages/EntryPage.jsx";
import { OutputPage } from "../../features/inventory/pages/OutputPage.jsx";
import { AlertsPage } from "../../features/reports/pages/AlertsPage.jsx";
import { ReportsPage } from "../../features/reports/pages/ReportsPage.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuthStore();

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cacao-ink text-cream-comb">
        <BeeSpinner size="lg" label="Preparando la colmena..." />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

export const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="entries" element={<EntryPage />} />
        <Route path="outputs" element={<OutputPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
};
