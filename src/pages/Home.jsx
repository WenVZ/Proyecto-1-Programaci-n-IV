import parqueDiria from "../assets/parque-nacional-diria.jpg"
function Home() {

  const eventos = [
     {
      id: 1,
      nombre: "Tour Diurno",
      fecha: "15 Agosto",
      descripcion: "Recorrido guiado por senderos.",
      imagen: parqueDiria
    },

    {
      id: 2,
      nombre: "Avistamiento de Aves",
      fecha: "20 Agosto",
      descripcion: "Explora la fauna del parque."    }
  ]

  return (

    <div className="min-h-screen bg-green-100">

      {/* HERO */}

      <div className="p-10">

        <h1 className="text-5xl font-bold text-green-900">
          Bienvenido al Parque Nacional
        </h1>

        <p className="mt-6 text-xl">
          Explora eventos, reservas y emprendimientos turísticos.
          HACERLO BONITO, SOLO ES UNA PRUEBA
        </p>

      </div>

      {/* EVENTOS */}

      <div className="p-10">

        <h2 className="text-4xl font-bold text-green-800 mb-8">
          Eventos Destacados
        </h2>

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

                <h3 className="text-2xl font-bold mb-2">
                  {evento.nombre}
                </h3>

                <p className="text-green-700 font-semibold mb-3">
                  {evento.fecha}
                </p>

                <p className="mb-4">
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

          {/* MAPA */}

<div className="p-10">

  <h2 className="text-4xl font-bold text-green-800 mb-8">
    Ubicación del Parque
  </h2>

  <div className="rounded-2xl overflow-hidden shadow-lg">

    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d133150.7616677019!2d-85.64861850004726!3d10.169515486390148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f9fb4c33dbc9fcd%3A0x5efde53475a1a154!2sParque%20Nacional%20Diri%C3%A1!5e0!3m2!1ses!2scr!4v1779250170042!5m2!1ses!2scr"
      width="100%"
      height="450"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="rounded-2xl"
    ></iframe>

  </div>

</div>
    </div>

  )
}

export default Home