import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-slate-500">Loading your account…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (!admin && user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}
