import { useEffect, useState } from "react";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    descripcion: "",
    imagen: ""
  });

  const URL =
    "https://api.jsonbin.io/v3/b/6a0f21e26610dd3ae881a9ea/latest";

  const HEADERS = {
    "X-Master-Key":
      "$2a$10$GVnjA1UyH.j/jOzsqiwXeOa.j.3axXrnrx1ZppxbQluUXFHIglan."
  };

  const cargarEventos = () => {
    fetch(URL, { headers: HEADERS })
      .then((res) => res.json())
      .then((data) => {
        setEventos(data.record.eventos || []);
      });
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const agregarEvento = () => {
    if (!form.nombre || !form.fecha || !form.descripcion || !form.imagen) {
      alert("Completa todos los campos");
      return;
    }

    const nuevoEvento = {
      id: Date.now(),
      ...form
    };

    fetch(URL, { headers: HEADERS })
      .then((res) => res.json())
      .then((data) => {
        const eventosActualizados = [
          ...data.record.eventos,
          nuevoEvento
        ];

        return fetch(
          "https://api.jsonbin.io/v3/b/6a0f21e26610dd3ae881a9ea",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Master-Key":
                "$2a$10$GVnjA1UyH.j/jOzsqiwXeOa.j.3axXrnrx1ZppxbQluUXFHIglan."
            },
            body: JSON.stringify({
              eventos: eventosActualizados
            })
          }
        );
      })
      .then(() => {
        cargarEventos();
        setOpen(false);

        setForm({
          nombre: "",
          fecha: "",
          descripcion: "",
          imagen: ""
        });
      });
  };

  const eliminarEvento = (id) => {
    fetch(URL, { headers: HEADERS })
      .then((res) => res.json())
      .then((data) => {
        const filtrados = data.record.eventos.filter(
          (e) => e.id !== id
        );

        return fetch(
          "https://api.jsonbin.io/v3/b/6a0f21e26610dd3ae881a9ea",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-Master-Key":
                "$2a$10$GVnjA1UyH.j/jOzsqiwXeOa.j.3axXrnrx1ZppxbQluUXFHIglan."
            },
            body: JSON.stringify({
              eventos: filtrados
            })
          }
        );
      })
      .then(() => cargarEventos());
  };

  return (
    <div className="min-h-screen bg-green-50 p-10">

      <h1 className="text-5xl font-bold text-green-900 mb-6">
        Eventos del Parque
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {eventos.map((evento) => (
          <div
            key={evento.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <img
              src={evento.imagen}
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

              <div className="flex gap-2">

                <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
                  Reservar
                </button>

                <button
                  onClick={() => eliminarEvento(evento.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>

              </div>

            </div>
          </div>
        ))}

        <div
          onClick={() => setOpen(true)}
          className="bg-white border-2 border-dashed border-green-400 rounded-2xl flex items-center justify-center h-full cursor-pointer hover:bg-green-100 transition"
        >
          <div className="text-center text-green-700">
            <p className="text-5xl font-bold">+</p>
            <p className="mt-2 font-semibold">Agregar evento</p>
          </div>
        </div>

      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Crear evento
            </h2>

            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              placeholder="Fecha"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="Imagen URL"
              className="border p-2 w-full mb-2 rounded"
            />

            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              className="border p-2 w-full mb-2 rounded"
            />

            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={agregarEvento}
                className="px-4 py-2 rounded bg-green-700 text-white"
              >
                Crear
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Eventos;