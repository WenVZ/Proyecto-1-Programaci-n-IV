import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getSession } from "../services/authService";

const BASE_URL = "https://proyecto1prograiv-default-rtdb.firebaseio.com";

export default function Eventos() {
  const navigate = useNavigate();
  const usuarioActual = getSession();

  const rol = String(
    usuarioActual?.role || usuarioActual?.rol || ""
  ).toLowerCase();

  const esAdmin =
    rol === "admin" || rol === "administrador";

  const [eventos, setEventos] = useState([]);
  const [openReserva, setOpenReserva] = useState(false);
  const [openEvento, setOpenEvento] = useState(false);
  const [editando, setEditando] = useState(null);

  const [reserva, setReserva] = useState({
    nombre: "",
    fecha: "",
    personas: "",
    actividad: "",
    estado: "pendiente",
  });

  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: "",
    fecha: "",
    descripcion: "",
    imagen: "",
  });

  const cargarEventos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/eventos.json`);
      const data = await res.json();

      if (!data) {
        setEventos([]);
        return;
      }

      const lista = Object.entries(data).map(([id, evento]) => ({
        id,
        ...evento,
      }));

      setEventos(lista);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const reservarEvento = (evento) => {
    if (!usuarioActual) {
      navigate({ to: "/login" });
      return;
    }

setReserva({
  nombre:
    usuarioActual.name ||
    usuarioActual.nombre ||
    usuarioActual.email ||
    "Usuario",
  fecha: evento.fecha,
  personas: "",
  actividad: evento.nombre,
  estado: "pendiente",
});

    setOpenReserva(true);
  };

  const guardarReserva = async () => {await fetch(`${BASE_URL}/reservas.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reserva),
    });

    alert("Reserva realizada");
    setOpenReserva(false);
  };

  const guardarEvento = async () => {
    const metodo = editando ? "PATCH" : "POST";
    const url = editando
      ? `${BASE_URL}/eventos/${editando}.json`
      : `${BASE_URL}/eventos.json`;

    await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoEvento),
    });

    setOpenEvento(false);
    setEditando(null);

    setNuevoEvento({
      nombre: "",
      fecha: "",
      descripcion: "",
      imagen: "",
    });

    cargarEventos();
  };

  const editarEvento = (evento) => {
    setNuevoEvento(evento);
    setEditando(evento.id);
    setOpenEvento(true);
  };

  const eliminarEvento = async (id) => {
    await fetch(`${BASE_URL}/eventos/${id}.json`, {
      method: "DELETE",
    });

    cargarEventos();
  };

  return (
    <div className="min-h-screen bg-green-50 p-10">
      <h1 className="text-5xl font-bold text-green-900 mb-6">
        Eventos del Parque
      </h1>

      {esAdmin && (
        <button
          onClick={() => setOpenEvento(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6"
        >
          Crear Evento
        </button>
      )}

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

              <p className="mb-6">{evento.descripcion}</p>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => reservarEvento(evento)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Reservar
                </button>

                {esAdmin && (
                  <>
                    <button
                      onClick={() => editarEvento(evento)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarEvento(evento.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {openReserva && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <input
              type="number"
              placeholder="Cantidad de personas"
              className="border p-2 w-full mb-4 rounded"
              onChange={(e) =>
                setReserva({
                  ...reserva,
                  personas: e.target.value,
                })
              }
            />

            <button
              onClick={guardarReserva}
              className="bg-green-700 text-white px-4 py-2 rounded"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {openEvento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <input
              placeholder="Nombre"
              className="border p-2 w-full mb-2 rounded"
              value={nuevoEvento.nombre}
              onChange={(e) =>
                setNuevoEvento({
                  ...nuevoEvento,
                  nombre: e.target.value,
                })
              }
            />

            <input
              placeholder="Fecha"
              className="border p-2 w-full mb-2 rounded"
              value={nuevoEvento.fecha}
              onChange={(e) =>
                setNuevoEvento({
                  ...nuevoEvento,
                  fecha: e.target.value,
                })
              }
            />

            <input
              placeholder="Imagen URL"
              className="border p-2 w-full mb-2 rounded"
              value={nuevoEvento.imagen}
              onChange={(e) =>
                setNuevoEvento({
                  ...nuevoEvento,
                  imagen: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Descripción"
              className="border p-2 w-full mb-4 rounded"
              value={nuevoEvento.descripcion}
              onChange={(e) =>
                setNuevoEvento({
                  ...nuevoEvento,
                  descripcion: e.target.value,
                })
              }
            />

            <button
              onClick={guardarEvento}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {editando ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}