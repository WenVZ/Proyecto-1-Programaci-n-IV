import { useEffect, useState, useMemo } from "react";
import { Navigate } from "@tanstack/react-router";
import emailjs from "@emailjs/browser";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { getSession } from "../services/authService";

const EMAILJS_SERVICE_ID  = "service_berf2ts";
const EMAILJS_TEMPLATE_ID = "template_m063v78";
const EMAILJS_PUBLIC_KEY  = "sWBrop4Yb1ygJUKDh";

const BASE_URL = "https://proyecto1prograiv-default-rtdb.firebaseio.com";

function Reservas() {
  const user = getSession();

  if (!user) return <Navigate to="/login" replace />;

  const rol = String(user?.role || user?.rol || "").toLowerCase();
  const isAdmin = rol === "admin" || rol === "administrador";

  const [reservas, setReservas] = useState([]);
  const [enviando, setEnviando] = useState(null);

  const cargarReservas = async () => {
    const res = await fetch(`${BASE_URL}/reservas.json`);
    const data = await res.json();
    if (!data) { setReservas([]); return; }
    setReservas(Object.entries(data).map(([id, r]) => ({ id, ...r })));
  };

  useEffect(() => { cargarReservas(); }, []);

  const eliminarReserva = async (id) => {
    await fetch(`${BASE_URL}/reservas/${id}.json`, { method: "DELETE" });
    cargarReservas();
  };

  const confirmarReserva = async (reserva) => {
    setEnviando(reserva.id);
    try {
      // 1. Actualizar estado en Firebase
      await fetch(`${BASE_URL}/reservas/${reserva.id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Confirmada" }),
      });

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          nombre:    reserva.nombre,
          email:     reserva.email,   // correo del cliente guardado en la reserva
          actividad: reserva.actividad,
          fecha:     reserva.fecha,
              horaEvento:  reserva.horaEvento,

          personas:  reserva.personas,
          tiempo:    new Date().toLocaleString("es-CR"),
        },
        EMAILJS_PUBLIC_KEY
      );

      alert(`✅ Reserva confirmada. Notificación enviada a ${reserva.email    }`);
    } catch (err) {
      console.error("Error al enviar correo:", err);
      alert("Reserva confirmada, pero no se pudo enviar el correo.");
    } finally {
      setEnviando(null);
      cargarReservas();
    }
  };

  const nombreUsuario = user?.name || user?.nombre || user?.email;
  const reservasFiltradas = isAdmin
    ? reservas
    : reservas.filter((r) => r.nombre === nombreUsuario);

  const columns = useMemo(
    () => [
      { header: "Nombre",    accessorKey: "nombre" },
      { header: "Fecha",     accessorKey: "fecha" },
{ header: "Hora",  accessorKey: "horaEvento" },
      { header: "Personas",  accessorKey: "personas" },
      { header: "Actividad", accessorKey: "actividad" },
      {
        header: "Estado",
        cell: ({ row }) => (
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            row.original.estado === "Confirmada"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {row.original.estado || "Pendiente"}
          </span>
        ),
      },
      ...(isAdmin ? [{
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {row.original.estado !== "Confirmada" && (
              <button
                onClick={() => confirmarReserva(row.original)}
                disabled={enviando === row.original.id}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {enviando === row.original.id ? (
                  <>
                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Enviando...
                  </>
                ) : "Confirmar"}
              </button>
            )}
            <button
              onClick={() => eliminarReserva(row.original.id)}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
            >
              Eliminar
            </button>
          </div>
        ),
      }] : []),
    ],
    [isAdmin, enviando]
  );

  const table = useReactTable({
    data: reservasFiltradas,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-screen bg-green-50 p-10">
      <h1 className="text-5xl font-bold text-green-900 mb-8">
        {isAdmin ? "Todas las Reservas" : "Mis Reservas"}
      </h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-green-700 text-white">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-4 text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                  No hay reservas registradas
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-green-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext()) ||
                        row.getValue(cell.column.id)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reservas;