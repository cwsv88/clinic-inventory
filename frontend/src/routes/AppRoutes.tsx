import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '../pages/Dashboard';
import { InventoryList } from '../pages/InventoryList';
import { InventoryDetail } from '../pages/InventoryDetail';
import { Login } from '../pages/Login';
import { Reports } from '../pages/Reports';

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="inventory" element={<InventoryList />} />
      <Route path="inventory/:id" element={<InventoryDetail />} />
      <Route path="reports" element={<Reports />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
