import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (allowedRole && role !== allowedRole)
    return <Navigate to="/" />;

  return children;
}

export default ProtectedRoute;