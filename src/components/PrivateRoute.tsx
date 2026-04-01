import { Navigate } from 'react-router-dom';
import { authStore } from '../store/auth.store';

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const token = authStore.getToken(); // ✅ direct read every render

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}