import { Link, useNavigate } from "@tanstack/react-router";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { logout } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate({ to: "/login" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-green-950/70 backdrop-blur-md border-b border-white/10 text-white">

      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-wide"
        >
          Parque Diría
        </Link>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Links desktop */}
        <div className="hidden md:flex gap-6 items-center text-sm">

          <Link to="/" className="hover:text-green-300 transition">
            Inicio
          </Link>

          <Link to="/eventos" className="hover:text-green-300 transition">
            Eventos
          </Link>

          <Link to="/reservas" className="hover:text-green-300 transition">
            Reservas
          </Link>

          <Link to="/emprendimientos" className="hover:text-green-300 transition">
            Emprendimientos
          </Link>

          <Link to="/incidencias" className="hover:text-green-300 transition">
            Incidencias
          </Link>

          {user?.role === "admin" && (
            <Link to="/dashboard" className="hover:text-green-300 transition">
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="hover:text-red-400 transition"
            >
              Salir
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-300 transition">
                Login
              </Link>

              <Link to="/registro" className="hover:text-green-300 transition">
                Registro
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4 bg-green-950/95">

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>

          <Link to="/eventos" onClick={() => setMenuOpen(false)}>
            Eventos
          </Link>

          <Link to="/reservas" onClick={() => setMenuOpen(false)}>
            Reservas
          </Link>

          <Link to="/emprendimientos" onClick={() => setMenuOpen(false)}>
            Emprendimientos
          </Link>

          <Link to="/incidencias" onClick={() => setMenuOpen(false)}>
            Incidencias
          </Link>

          {user?.role === "admin" && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-left text-red-300"
            >
              Salir
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>

              <Link to="/registro" onClick={() => setMenuOpen(false)}>
                Registro
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;