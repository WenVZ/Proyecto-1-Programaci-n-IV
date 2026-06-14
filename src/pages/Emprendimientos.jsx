import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { getSession } from "../services/authService";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

const API = "https://localhost:7092/api/emprendimientos";

const getHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const categorias = ["Alojamientos", "Artesanías", "Comida", "Tours"];

const formInicial = { nombre: "", descripcion: "", categoria: "" };

const columnHelper = createColumnHelper();

export default function Emprendimientos() {
  const { user } = useContext(UserContext) || {};
  const usuarioActual = user || getSession();
  const rol = String(usuarioActual?.role || usuarioActual?.rol || "").toLowerCase();
  const esAdmin = rol === "admin" || rol === "administrador";

  const [data, setData] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await axios.get(API);
        setData(res.data || []);
      } catch (error) {
        setMensaje("Error al cargar datos");
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const mostrar = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(""), 2000);
  };

  const validarAdmin = () => {
    if (esAdmin) return true;
    mostrar("Solo administradores pueden modificar emprendimientos.");
    return false;
  };

  const limpiar = () => {
    setForm(formInicial);
    setEditId(null);
  };

  const obtenerFormularioLimpio = () => ({
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    categoria: form.categoria,
  });

  const crear = async () => {
    if (!validarAdmin()) return;
    const formLimpio = obtenerFormularioLimpio();
    if (!formLimpio.nombre || !formLimpio.descripcion || !formLimpio.categoria)
      return mostrar("Complete los campos");

    try {
      setGuardando(true);
      const res = await axios.post(API, formLimpio, getHeaders());
      setData([...data, res.data]);
      limpiar();
      mostrar("Creado");
    } catch (error) {
      mostrar("Error al crear");
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id) => {
    if (!validarAdmin()) return;
    if (!window.confirm("¿Eliminar registro?")) return;

    try {
      setGuardando(true);
      await axios.delete(`${API}/${id}`, getHeaders());
      setData(data.filter((e) => e.id !== id));
      mostrar("Eliminado");
    } catch (error) {
      mostrar("Error al eliminar");
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  const editar = (item) => {
    if (!validarAdmin()) return;
    setForm({ nombre: item.nombre, descripcion: item.descripcion, categoria: item.categoria });
    setEditId(item.id);
  };

  const actualizar = async () => {
    if (!validarAdmin()) return;
    const formLimpio = obtenerFormularioLimpio();
    if (!formLimpio.nombre || !formLimpio.descripcion || !formLimpio.categoria)
      return mostrar("Complete los campos");

    try {
      setGuardando(true);
      await axios.put(`${API}/${editId}`, formLimpio, getHeaders());
      setData(data.map((e) => (e.id === editId ? { ...e, ...formLimpio } : e)));
      limpiar();
      mostrar("Actualizado");
    } catch (error) {
      mostrar("Error al actualizar");
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  const guardar = () => (editId ? actualizar() : crear());

  const columns = [
    columnHelper.accessor("nombre", {
      header: "Nombre",
      cell: (info) => <strong className="text-green-900">{info.getValue()}</strong>,
    }),
    columnHelper.accessor("descripcion", {
      header: "Descripción",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("categoria", {
      header: "Categoría",
      cell: (info) => (
        <span className="rounded-full bg-lime-500 px-3 py-1 text-xs font-medium text-white">
          {info.getValue()}
        </span>
      ),
    }),
    ...(esAdmin
      ? [
          columnHelper.display({
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <button
                  onClick={() => editar(row.original)}
                  disabled={guardando}
                  className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminar(row.original.id)}
                  disabled={guardando}
                  className="rounded-lg bg-green-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Eliminar
                </button>
              </div>
            ),
          }),
        ]
      : []),
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-green-50 px-4 py-12 sm:px-8 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-green-700">Gestión turística</p>
            <h1 className="text-4xl font-bold text-green-900 sm:text-5xl">Emprendimientos</h1>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-green-800 shadow-sm">
            <span className="mr-1">{data.length}</span>
            {data.length === 1 ? "registro" : "registros"}
          </div>
        </div>

        {mensaje && (
          <p className="mb-5 rounded-lg border border-green-200 bg-white px-4 py-3 font-semibold text-green-800 shadow-sm">
            {mensaje}
          </p>
        )}

        {esAdmin && (
          <div className="mb-8 overflow-hidden rounded-xl border border-green-100 bg-white shadow-lg">
            <div className="p-5">
              <h2 className="mb-4 text-xl font-bold text-green-900">
                {editId ? "Editar emprendimiento" : "Nuevo emprendimiento"}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <input
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-lg border border-green-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
                <input
                  placeholder="Descripción"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full rounded-lg border border-green-200 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full rounded-lg border border-green-200 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Seleccione categoría</option>
                  {categorias.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={guardar}
                  disabled={guardando}
                  className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {guardando ? "Guardando..." : editId ? "Actualizar" : "Crear"}
                </button>
                {editId && (
                  <button
                    onClick={limpiar}
                    disabled={guardando}
                    className="rounded-lg bg-sky-100 px-5 py-3 font-semibold text-sky-800 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-green-100 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead className="bg-gradient-to-r from-green-900 to-green-800 text-white">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id} className="px-5 py-4 text-left text-sm font-bold uppercase">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-green-100">
                {!cargando && table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition hover:bg-green-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4 text-sm text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cargando && (
            <p className="px-5 py-8 text-center font-semibold text-gray-500">Cargando emprendimientos...</p>
          )}
          {!cargando && data.length === 0 && (
            <p className="px-5 py-8 text-center font-semibold text-gray-500">No hay emprendimientos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}