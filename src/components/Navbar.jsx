import { Link } from "@tanstack/react-router";

function Navbar() {
  return (
    <nav className="bg-green-800 text-white p-4 flex justify-between items-center">

      <div className="flex gap-6">

        <Link to="/">Inicio</Link>
        <Link to="/registro">Registro</Link>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/eventos">Eventos</Link>
        <Link to="/reservas">Reservas</Link>
        <Link to="/emprendimientos">Emprendimientos</Link>

      </div>

    </nav>
  )
}

export default Navbar;