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
  text-white px-8 py-4 flex items-center">
      

      <div className="flex gap-8 ml-auto text-sm items-center">

        <Link to="/" className="hover:text-green-300 transition-colors">
          Inicio
        </Link>

        <Link to="/eventos" className="hover:text-green-300 transition-colors">
          Eventos
        </Link>

        <Link to="/reservas" className="hover:text-green-300 transition-colors">
          Reservas
        </Link>

        <Link to="/emprendimientos" className="hover:text-green-300 transition-colors">
          Emprendimientos
        </Link>

        <Link to="/incidencias" className="hover:text-green-300 transition-colors">
          Incidencias
        </Link>

        {user?.role === "admin" && (
          <Link to="/dashboard" className="hover:text-green-300 transition-colors">
            Dashboard
          </Link>
        )}

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Salir
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-300 transition-colors">
              Login
            </Link>
            <Link to="/registro" className="hover:text-green-300 transition-colors">
              Registro
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;