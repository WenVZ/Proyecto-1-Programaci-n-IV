import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";

const BASE_URL = "https://proyecto1prograiv-default-rtdb.firebaseio.com";

export default function Incidencias() {
  const [incidencias, setIncidencias] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  // Inicialización de TanStack Form
  const formManager = useForm({
    defaultValues: {
      anonimo: false,
      nombre: "",
      tipo: "Basura",
      ubicacion: "",
      descripcion: "",
      imagenUrl: "",
      b64: "",
      preview: "",
      urlMode: false,
    },
    onSubmit: async ({ value }) => {
      if (!value.ubicacion || !value.descripcion) {
        alert("Complete los campos de ubicación y descripción.");
        return;
      }

      const imagen = value.urlMode ? value.imagenUrl : value.b64;
      const nueva = {
        nombre: value.anonimo ? "Anónimo" : value.nombre || "Sin nombre",
        tipo: value.tipo,
        ubicacion: value.ubicacion,
        descripcion: value.descripcion,
        imagen,
        estado: "Pendiente",
        prioridad: value.tipo === "Emergencia" ? "Alta" : "Normal",
        fecha: new Date().toLocaleDateString("es-CR"),
        fechaCreacion: new Date().toISOString(),
      };

      try {
        await fetch(`${BASE_URL}/incidencias.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nueva),
        });
        
        formManager.reset();
        if (fileRef.current) fileRef.current.value = "";
        cargar();
      } catch (e) {
        console.error(e);
      }
    },
  });

  const cargar = async () => {
    try {
      const res = await fetch(`${BASE_URL}/incidencias.json`);
      const data = await res.json();
      if (!data) { setIncidencias([]); return; }
      const lista = Object.entries(data)
        .map(([id, v]) => ({ id, ...v }))
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
      setIncidencias(lista);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { cargar(); }, []);

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) { alert("Seleccione una imagen."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("La imagen supera 5 MB."); return; }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      formManager.setFieldValue("b64", e.target.result);
      formManager.setFieldValue("preview", e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    formManager.setFieldValue("b64", "");
    formManager.setFieldValue("preview", "");
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleUrlMode = () => {
    const currentMode = formManager.getFieldValue("urlMode");
    formManager.setFieldValue("urlMode", !currentMode);
    removeImage();
    formManager.setFieldValue("imagenUrl", "");
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await fetch(`${BASE_URL}/incidencias/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      cargar();
    } catch (e) { console.error(e); }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta incidencia?")) return;
    try {
      await fetch(`${BASE_URL}/incidencias/${id}.json`, { method: "DELETE" });
      cargar();
    } catch (e) { console.error(e); }
  };

  const filtradas = filtro === "Todas" ? incidencias : incidencias.filter((i) => i.estado === filtro);
  const pendientes = incidencias.filter((i) => i.estado === "Pendiente").length;
  const proceso = incidencias.filter((i) => i.estado === "En proceso").length;
  const resueltas = incidencias.filter((i) => i.estado === "Resuelta").length;

  const estadoPill = (e) =>
    e === "Pendiente"
      ? "bg-red-50 text-red-800 border border-red-200"
      : e === "En proceso"
      ? "bg-amber-50 text-amber-800 border border-amber-200"
      : "bg-green-50 text-green-800 border border-green-200";

  const inputCls = "w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 outline-none focus:border-gray-400 transition-colors";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900 tracking-tight">
          Reporte de incidencias
        </h1>
        <p className="mt-1 text-sm text-gray-400 leading-relaxed">
          Registre situaciones que afecten la seguridad, infraestructura o medio ambiente del parque.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {[
          { label: "Total", value: incidencias.length, color: "text-gray-800" },
          { label: "Pendientes", value: pendientes, color: "text-red-700" },
          { label: "En proceso", value: proceso, color: "text-amber-700" },
          { label: "Resueltas", value: resueltas, color: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-medium ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 mb-8" />

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formManager.handleSubmit();
        }}
        className="mb-10"
      >
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
          Nuevo reporte
        </p>

        {/* Anónimo */}
        <formManager.Field
          name="anonimo"
          children={(field) => (
            <label className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.setValue(e.target.checked)}
                className="accent-green-700 w-3.5 h-3.5"
              />
              <span className="text-sm text-gray-500">Reportar de forma anónima</span>
            </label>
          )}
        />

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          {/* Nombre condicional */}
          <formManager.Subscribe
            selector={(state) => state.values.anonimo}
            children={(anonimo) => {
              if (anonimo) return null;
              return (
                <formManager.Field
                  name="nombre"
                  children={(field) => (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Nombre</label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.setValue(e.target.value)}
                        placeholder="Nombre completo"
                        className={inputCls}
                      />
                    </div>
                  )}
                />
              );
            }}
          />

          {/* Tipo */}
          <formManager.Field
            name="tipo"
            children={(field) => (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  className={inputCls}
                >
                  {["Basura", "Infraestructura", "Fauna", "Seguridad", "Emergencia", "Otro"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          />

          {/* Ubicación */}
          <formManager.Field
            name="ubicacion"
            children={(field) => (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ubicación</label>
                <input
                  value={field.state.value}
                  onChange={(e) => field.setValue(e.target.value)}
                  placeholder="Ej. Sendero principal, km 3"
                  className={inputCls}
                />
              </div>
            )}
          />
        </div>

        {/* Sección de Imagen gestionada por Subscribe */}
        <formManager.Subscribe
          selector={(state) => [state.values.urlMode, state.values.preview, state.values.imagenUrl]}
          children={([urlMode, preview, imagenUrl]) => (
            <div className="mb-3">
              <label className="block text-xs text-gray-400 mb-1">
                Fotografía <span className="text-gray-300">(opcional)</span>
              </label>

              {!urlMode && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer?.files?.[0]; if (f) processFile(f); }}
                  onClick={() => !preview && fileRef.current?.click()}
                  className={`border rounded-lg p-5 text-center transition-colors
                    ${dragging ? "border-green-400 bg-green-50" : "border-dashed border-gray-200 bg-gray-50"}
                    ${!preview ? "cursor-pointer hover:border-gray-300" : ""}`}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
                  />

                  {preview ? (
                    <div className="relative inline-block">
                      <img src={preview} alt="Vista previa"
                        className="max-h-40 rounded-md border border-gray-200 mx-auto block" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center gap-2 mb-2">
                        {["Cámara", "Archivos"].map((l) => (
                          <span key={l} className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1 bg-white">
                            {l}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-400">Toque para seleccionar o arrastre aquí</p>
                      <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP · máx 5 MB</p>
                    </>
                  )}
                </div>
              )}

              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={toggleUrlMode}
                  className="text-xs text-green-700 underline bg-transparent border-none cursor-pointer"
                >
                  {urlMode ? "Usar cámara / archivo en su lugar" : "Usar URL en su lugar"}
                </button>
              </div>

              {urlMode && (
                <formManager.Field
                  name="imagenUrl"
                  children={(field) => (
                    <input
                      value={field.state.value}
                      onChange={(e) => field.setValue(e.target.value)}
                      placeholder="https://"
                      className={`${inputCls} mt-2`}
                    />
                  )}
                />
              )}
            </div>
          )}
        />

        {/* Descripción */}
        <formManager.Field
          name="descripcion"
          children={(field) => (
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-1">Descripción</label>
              <textarea
                value={field.state.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder="Describa la situación con detalle…"
                rows={3}
                className={inputCls + " resize-y leading-relaxed"}
              />
            </div>
          )}
        />

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-green-800 hover:bg-green-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Enviar reporte
        </button>
      </form>

      <div className="border-t border-gray-100 mb-6" />

      {/* Filters */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
          Incidencias registradas
          <span className="ml-2 font-normal normal-case tracking-normal text-gray-300">
            {filtradas.length}
          </span>
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {["Todas", "Pendiente", "En proceso", "Resuelta"].map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filtro === f
                  ? "bg-green-800 text-white border-green-800"
                  : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtradas.length === 0 ? (
        <p className="text-center text-sm text-gray-300 py-16">Sin incidencias en esta categoría.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtradas.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
              {item.imagen && (
                <img src={item.imagen} alt=""
                  className="w-full h-36 object-cover border-b border-gray-100" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{item.tipo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    item.prioridad === "Alta"
                      ? "bg-orange-50 text-orange-800 border-orange-200"
                      : "bg-green-50 text-green-800 border-green-200"
                  }`}>
                    {item.prioridad}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-0.5">{item.nombre}</p>
                <p className="text-xs text-gray-400 mb-3">{item.ubicacion}</p>

                <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-2 mb-3">
                  {item.descripcion}
                </p>

                <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full mb-3 ${estadoPill(item.estado)}`}>
                  {item.estado}
                </span>

                <div className="flex gap-1.5 flex-wrap">
                  <button onClick={() => cambiarEstado(item.id, "En proceso")}
                    className="text-xs px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                    En proceso
                  </button>
                  <button onClick={() => cambiarEstado(item.id, "Resuelta")}
                    className="text-xs px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors">
                    Resuelta
                  </button>
                  <button onClick={() => eliminar(item.id)}
                    className="text-xs px-2.5 py-1 rounded-md border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    Eliminar
                  </button>
                </div>

                <p className="text-xs text-gray-300 mt-3">{item.fecha}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}