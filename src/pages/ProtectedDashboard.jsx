import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "./Dashboard";

function ProtectedDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Dashboard />
    </ProtectedRoute>
  );
}

export default ProtectedDashboard;
