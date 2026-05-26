import { useEffect, useState } from "react";
import { Calendar, Users, Leaf, BadgeCheck, Clock, XCircle } from "lucide-react";

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    personas: "",
    actividad: "",
    estado: "pendiente"
  });

  const BASE_URL = "https://proyecto1prograiv-default-rtdb.firebaseio.com";

  const cargarReservas = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reservas.json`);
      const data = await res.json();
      if (!data) { setReservas([]); return; }
      const lista = Object.entries(data).map(([id, reserva]) => ({ id, ...reserva }));
      setReservas(lista);
    } catch (error) {
      console.error("Error cargando reservas:", error);
    }
  };

  const cargarEventos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/eventos.json`);
      const data = await res.json();
      if (!data) { setEventos([]); return; }
      const lista = Object.entries(data).map(([id, evento]) => ({ id, ...evento }));
      setEventos(lista);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  useEffect(() => {
    cargarReservas();
    cargarEventos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const abrirEditar = (reserva) => {
    setForm({
      nombre: reserva.nombre,
      fecha: reserva.fecha,
      personas: reserva.personas,
      actividad: reserva.actividad,
      estado: reserva.estado
    });
    setEditandoId(reserva.id);
    setOpen(true);
  };

  const guardarReserva = async () => {
    if (!form.nombre || !form.fecha || !form.personas || !form.actividad) {
      alert("Completa todos los campos");
      return;
    }

    try {
      if (editandoId) {
        await fetch(`${BASE_URL}/reservas/${editandoId}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        await fetch(`${BASE_URL}/reservas.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, estado: "pendiente" })
        });
      }

      await cargarReservas();
      setOpen(false);
      setEditandoId(null);
      setForm({ nombre: "", fecha: "", personas: "", actividad: "", estado: "pendiente" });
    } catch (error) {
      console.error("Error guardando reserva:", error);
    }
  };

  const eliminarReserva = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta reserva?")) return;
    try {
      await fetch(`${BASE_URL}/reservas/${id}.json`, { method: "DELETE" });
      await cargarReservas();
    } catch (error) {
      console.error("Error eliminando reserva:", error);
    }
  };

  const badgeEstado = (estado) => {
    if (estado === "confirmada") return (
      <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
        <BadgeCheck size={14} /> Confirmada
      </span>
    );
    if (estado === "cancelada") return (
      <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
        <XCircle size={14} /> Cancelada
      </span>
    );
    return (
      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">
        <Clock size={14} /> Pendiente
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-green-50 p-10">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-5xl font-bold text-green-900">Reservas del Parque</h1>
        <button
          onClick={() => { setEditandoId(null); setForm({ nombre: "", fecha: "", personas: "", actividad: "", estado: "pendiente" }); setOpen(true); }}
          className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
        >
          + Agregar reserva
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {reservas.map((reserva) => (
          <div key={reserva.id} className="bg-white rounded-xl shadow px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="font-bold text-gray-800">{reserva.nombre}</p>
              </div>
              <p className="flex items-center gap-1 text-gray-500 text-sm">
                <Calendar size={14} className="text-green-700" /> {reserva.fecha}
              </p>
              <p className="flex items-center gap-1 text-gray-500 text-sm">
                <Users size={14} className="text-green-700" /> {reserva.personas} personas
              </p>
              <p className="flex items-center gap-1 text-gray-500 text-sm">
                <Leaf size={14} className="text-green-700" /> {reserva.actividad}
              </p>
              {badgeEstado(reserva.estado)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => abrirEditar(reserva)}
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarReserva(reserva.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">

            <h2 className="text-xl font-bold mb-4">
              {editandoId ? "Editar reserva" : "Crear reserva"}
            </h2>

            <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
              placeholder="Nombre del visitante" className="border p-2 w-full mb-2 rounded" />

            <input type="date" name="fecha" value={form.fecha} onChange={handleChange}
              className="border p-2 w-full mb-2 rounded" />

            <input type="number" name="personas" value={form.personas} onChange={handleChange}
              placeholder="Cantidad de personas" className="border p-2 w-full mb-2 rounded" />

            <select name="actividad" value={form.actividad} onChange={handleChange}
              className="border p-2 w-full mb-2 rounded">
              <option value="">Selecciona un evento</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.nombre}>
                  {evento.nombre} — {evento.fecha}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-gray-300">
                Cancelar
              </button>
              <button onClick={guardarReserva} className="px-4 py-2 rounded bg-green-700 text-white">
                {editandoId ? "Guardar cambios" : "Reservar"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Reservas;