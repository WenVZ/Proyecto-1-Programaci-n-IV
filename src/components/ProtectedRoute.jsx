import { Navigate } from "@tanstack/react-router";
import { getSession } from "../services/authService";

function ProtectedRoute({ children, requiredRole }) {
  const user = getSession();

  if (!user) {
    return <Navigate to="/login" replace search={{ redirect: location.pathname }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
