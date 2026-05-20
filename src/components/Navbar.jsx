function Navbar() {
  return (
    <nav className="bg-green-800 text-white p-4 flex justify-between items-center">
      
      <h1 className="text-2xl font-bold">
      </h1>

      <div className="flex gap-6">
        <a href="/">Inicio</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/eventos">Eventos</a>
        <a href="/reservas">Reservas</a>
      </div>

    </nav>
  )
}

export default Navbar