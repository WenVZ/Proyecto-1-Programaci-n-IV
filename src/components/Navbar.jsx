import { Link, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { logout } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate({ to: "/login" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 
      bg-green-950/40 backdrop-blur-md 
      border-b border-white/10
      text-white px-6 py-4 flex items-center">

      <div className="font-bold tracking-widest text-green-200">
        PARQUE DIRÍA
      </div>

      <div className="flex gap-6 ml-auto text-sm md:text-base">
        
        <Link
          to="/"
          className="hover:text-green-300 transition-colors"
        >
          Inicio
        </Link>

        <Link
          to="/login"
          className="hover:text-green-300 transition-colors"
        >
          Login
        </Link>

        {user?.role === "admin" && (
          <Link
            to="/dashboard"
            className="hover:text-green-300 transition-colors"
          >
            Dashboard
          </Link>
        )}

        <Link
          to="/eventos"
          className="hover:text-green-300 transition-colors"
        >
          Eventos
        </Link>

        <Link
          to="/reservas"
          className="hover:text-green-300 transition-colors"
        >
          Reservas
        </Link>

        <Link
          to="/emprendimientos"
          className="hover:text-green-300 transition-colors"
        >
          Emprendimientos
        </Link>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="hover:text-green-300 transition-colors"
          >
            Salir
          </button>
        ) : (
          <Link
            to="/registro"
            className="hover:text-green-300 transition-colors"
          >
            Registro
          </Link>
        )}
        <Link to="/incidencias">
  Incidencias
</Link>
      </div>

    </nav>
  );
}

export default Navbar;
