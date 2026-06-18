import { useEffect, useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { getSession } from "../services/authService";

const API = `${import.meta.env.VITE_API_URL}/api/eventos`;

const toBase64 = (file) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = (error) => rej(error);
  });

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-green-700">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function Eventos() {
  const navigate = useNavigate();
  const usuarioActual = getSession();

  const rol = String(usuarioActual?.role || usuarioActual?.rol || "").toLowerCase();
  const esAdmin = rol === "admin" || rol === "administrador";

  const [eventos, setEventos] = useState([]);
  const [openReserva, setOpenReserva] = useState(false);
  const [openEvento, setOpenEvento] = useState(false);
  const [editando, setEditando] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const [reserva, setReserva] = useState({
    nombre: "",
    email: "",
    fecha: "",
    hora: "",
    personas: 1,
    actividad: "",
    estado: "pendiente",
  });

  const form = useForm({
    defaultValues: {
      nombre: "",
      fecha: "",
      hora: "",
      descripcion: "",
      imagen: "",
      cupos: "",
    },
    onSubmit: async ({ value }) => {
      const metodo = editando ? "PUT" : "POST";
      const url = editando ? `${API}/${editando}` : API;

      await fetch(url, {
        method: metodo,
        headers: getHeaders(),
        body: JSON.stringify({
          nombre: value.nombre,
          fecha: value.fecha,
          hora: value.hora,
          descripcion: value.descripcion,
          imagen: value.imagen,
          cupos: Number(value.cupos),
        }),
      });

      setOpenEvento(false);
      setEditando(null);
      setPreviewUrl("");
      form.reset();
      cargarEventos();
    },
  });

  const cargarEventos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setEventos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { cargarEventos(); }, []);

  const reservarEvento = (evento) => {
    if (!usuarioActual) { navigate({ to: "/login" }); return; }

    if (evento.cupos <= 0) {
      alert("Ya no hay cupos disponibles para este evento");
      return;
    }

    setEventoSeleccionado(evento);
    setReserva({
      nombre: usuarioActual.name || usuarioActual.nombre || usuarioActual.email || "Usuario",
      email: usuarioActual.email || "",
      fecha: evento.fecha,
      horaEvento: evento.hora || "",
      hora: new Date().toLocaleTimeString("es-CR"),
      personas: 1,
      actividad: evento.nombre,
      estado: "pendiente",
    });

    setOpenReserva(true);
  };

  const guardarReserva = async () => {
    const personas = Number(reserva.personas);
    if (personas <= 0) { alert("Ingrese una cantidad válida"); return; }
    if (personas > eventoSeleccionado.cupos) {
      alert(`Solo quedan ${eventoSeleccionado.cupos} cupos disponibles`);
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      await fetch(`${import.meta.env.VITE_API_URL}/api/eventos/${eventoSeleccionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...eventoSeleccionado,
          cupos: eventoSeleccionado.cupos - personas,
        }),
      });

      alert("¡Reserva realizada correctamente!");
      setOpenReserva(false);
      cargarEventos();
    } catch (error) {
      console.error("Error al procesar la reserva:", error);
      alert("Ocurrió un error al guardar la reserva.");
    }
  };

  const editarEvento = (evento) => {
    form.reset({
      nombre: evento.nombre,
      fecha: evento.fecha,
      hora: evento.hora || "",
      descripcion: evento.descripcion,
      imagen: evento.imagen,
      cupos: evento.cupos,
    });
    setPreviewUrl(evento.imagen || "");
    setEditando(evento.id);
    setOpenEvento(true);
  };

  const eliminarEvento = async (id) => {
    if (!window.confirm("¿Eliminar este evento?")) return;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    cargarEventos();
  };

  const handleImageFile = async (file, fieldApi) => {
    if (!file) return;
    const base64 = await toBase64(file);
    setPreviewUrl(base64);
    fieldApi.handleChange(base64);
  };

  return (
    <div className="min-h-screen bg-green-50 p-10">
      <h1 className="text-5xl font-bold text-green-900 mb-6">Eventos del Parque</h1>

      {esAdmin && (
        <button
          onClick={() => { form.reset(); setPreviewUrl(""); setEditando(null); setOpenEvento(true); }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg mb-6 hover:bg-blue-700 transition"
        >
          + Crear Evento
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {eventos.map((evento) => (
          <div key={evento.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={evento.imagen} alt={evento.nombre} className="w-full h-60 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{evento.nombre}</h2>
              <p className="text-green-700 font-semibold mb-2">
                {evento.fecha} {evento.hora && `· ${evento.hora}`}
              </p>
              <p className="mb-4">{evento.descripcion}</p>

              <div className="mb-4">
                {evento.cupos > 0 ? (
                  <p className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                    Cupos disponibles: {evento.cupos}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full inline-block">
                    Sin cupos disponibles
                  </p>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => reservarEvento(evento)}
                  disabled={evento.cupos <= 0}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    evento.cupos <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Reservar
                </button>

                {esAdmin && (
                  <>
                    <button onClick={() => editarEvento(evento)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                      Editar
                    </button>
                    <button onClick={() => eliminarEvento(evento.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Eliminar
                    </button>
                  </                  >
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {openReserva && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-green-900 mb-4">Confirmar Reserva</h2>
            <p className="mb-1">Evento: <strong>{reserva.actividad}</strong></p>
            <p className="mb-1 text-sm text-gray-500">Reservando como: <strong>{reserva.email}</strong></p>
            <p className="mb-4 text-sm text-green-700 font-semibold">
              Cupos disponibles: {eventoSeleccionado?.cupos}
            </p>

            <input
              type="number"
              min="1"
              placeholder="Cantidad de personas"
              value={reserva.personas}
              onChange={(e) => setReserva({ ...reserva, personas: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg w-full mb-4"
            />

            <div className="flex gap-2">
              <button onClick={guardarReserva} className="flex-1 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800">
                Confirmar
              </button>
              <button onClick={() => setOpenReserva(false)} className="flex-1 border border-gray-300 py-3 rounded-lg">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {openEvento && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">
                {editando ? "Editar Evento" : "Nuevo Evento"}
              </h2>
            </div>

            <div className="p-8">
              <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-5">

                <form.Field name="nombre">
                  {(field) => (
                    <Field label="Nombre">
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 w-full"
                        placeholder="Nombre del evento"
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="fecha">
                  {(field) => (
                    <Field label="Fecha">
                      <input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 w-full"
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="hora">
                  {(field) => (
                    <Field label="Hora de inicio">
                      <input
                        type="time"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 w-full"
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="cupos">
                  {(field) => (
                    <Field label="Cantidad de cupos">
                      <input
                        type="number"
                        min="1"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 w-full"
                        placeholder="Ej: 50"
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="descripcion">
                  {(field) => (
                    <Field label="Descripción">
                      <textarea
                        rows={4}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 w-full resize-none"
                      />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="imagen">
                  {(field) => (
                    <Field label="Imagen del evento">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-green-300 rounded-xl p-4 cursor-pointer hover:bg-green-50 transition text-center"
                      >
                        {previewUrl ? (
                          <img src={previewUrl} alt="preview" className="w-full max-h-72 object-cover rounded-xl" />
                        ) : (
                          <div className="py-10 text-green-600">Haz clic para subir imagen</div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFile(e.target.files?.[0], field)}
                      />
                    </Field>
                  )}
                </form.Field>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
                    {editando ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOpenEvento(false); setEditando(null); setPreviewUrl(""); form.reset(); }}
                    className="flex-1 border border-gray-300 py-3 rounded-xl"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}