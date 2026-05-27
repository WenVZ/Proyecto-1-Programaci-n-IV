import { getSession } from "../services/authService";

function Dashboard() {
  const user = getSession();

  return (
    <div className="min-h-screen pt-20">
      <h1 className="text-3xl font-bold text-green-900">Dashboard</h1>
      <p className="mt-3 text-gray-700">
        Bienvenido, {user?.nombre}. Esta seccion solo esta disponible para administradores.
      </p>
    </div>
  )
}

export default Dashboard
