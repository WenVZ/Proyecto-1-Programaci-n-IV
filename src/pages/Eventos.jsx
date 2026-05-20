function Eventos() {

  const eventos = [
    {
      id: 1,
      nombre: "Tour Nocturno",
      fecha: "15 Agosto",
      descripcion: "Recorrido guiado por senderos.",
      imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
    },

    {
      id: 2,
      nombre: "Avistamiento de Aves",
      fecha: "20 Agosto",
      descripcion: "Explora la fauna del parque.",
      imagen: "https://images.unsplash.com/photo-1473773508845-188df298d2d1"
    }
  ]

  return (

    <div className="min-h-screen bg-green-50 p-10">

      <h1 className="text-5xl font-bold text-green-900 mb-4">
        Eventos del Parque
      </h1>

      <p className="text-xl mb-10">
        Descubre actividades turísticas y experiencias naturales.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {eventos.map((evento) => (

          <div
            key={evento.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >

            <img
              src={evento.imagen}
              alt={evento.nombre}
              className="w-full h-60 object-cover"
            />

            <div className="p-6">

              <h2 className="text-2xl font-bold mb-2">
                {evento.nombre}
              </h2>

              <p className="text-green-700 font-semibold mb-3">
                {evento.fecha}
              </p>

              <p className="mb-6">
                {evento.descripcion}
              </p>

              <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
                Reservar
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}

export default Eventos