import { useEffect, useState } from "react";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [open, setOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    descripcion: "",
    imagen: ""
  });

  const BASE_URL = "https://proyecto1prograiv-default-rtdb.firebaseio.com";

  const cargarEventos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/eventos.json`);
      const data = await res.json();

      if (!data) {
        setEventos([]);
        return;
      }

      const listaEventos = Object.entries(data).map(([id, evento]) => ({
        id,
        ...evento
      }));

      setEventos(listaEventos);
    } catch (error) {
      console.error("Error cargando eventos:", error);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const abrirEditar = (evento) => {
    setForm({
      nombre: evento.nombre,
      fecha: evento.fecha,
      descripcion: evento.descripcion,
      imagen: evento.imagen
    });
    setEditandoId(evento.id);
    setOpen(true);
  };

  const guardarEvento = async () => {
    if (!form.nombre || !form.fecha || !form.descripcion || !form.imagen) {
      alert("Completa todos los campos");
      return;
    }

    try {
      if (editandoId) {
        await fetch(`${BASE_URL}/eventos/${editandoId}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        await fetch(`${BASE_URL}/eventos.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      }

      await cargarEventos();
      setOpen(false);
      setEditandoId(null);
      setForm({ nombre: "", fecha: "", descripcion: "", imagen: "" });
    } catch (error) {
      console.error("Error guardando evento:", error);
    }
  };

  const eliminarEvento = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este evento?")) return;

    try {
      await fetch(`${BASE_URL}/eventos/${id}.json`, { method: "DELETE" });
      await cargarEventos();
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-10">
      <h1 className="text-5xl font-bold text-green-900 mb-6">
        Eventos del Parque
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {eventos.map((evento) => (
          <div key={evento.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={evento.imagen} alt={evento.nombre} className="w-full h-60 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{evento.nombre}</h2>
              <p className="text-green-700 font-semibold mb-3">{evento.fecha}</p>
              <p className="mb-6">{evento.descripcion}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => abrirEditar(evento)}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
                >
                  Editar
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
          onClick={() => { setEditandoId(null); setForm({ nombre: "", fecha: "", descripcion: "", imagen: "" }); setOpen(true); }}
          className="bg-white border-2 border-dashed border-green-400 rounded-2xl flex items-center justify-center min-h-[300px] cursor-pointer hover:bg-green-100 transition"
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
              {editandoId ? "Editar evento" : "Crear evento"}
            </h2>

            <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
              placeholder="Nombre" className="border p-2 w-full mb-2 rounded" />

            <input type="date" name="fecha" value={form.fecha} onChange={handleChange}
              className="border p-2 w-full mb-2 rounded" />

            <input type="text" name="imagen" value={form.imagen} onChange={handleChange}
              placeholder="URL de la imagen" className="border p-2 w-full mb-2 rounded" />

            <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
              placeholder="Descripción" className="border p-2 w-full mb-2 rounded" />

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-gray-300">
                Cancelar
              </button>
              <button onClick={guardarEvento} className="px-4 py-2 rounded bg-green-700 text-white">
                {editandoId ? "Guardar cambios" : "Crear"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Eventos;