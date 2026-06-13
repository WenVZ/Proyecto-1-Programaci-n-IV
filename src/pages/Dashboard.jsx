import { useContext, useEffect, useState, useMemo } from "react";
import { UserContext } from "../context/UserContext"; // IMPORTA EL CONTEXTO DEL USUARIO
import { getSession } from "../services/authService";// IMPORTA FUNCIoN PARA OBTENER LA SESIÓN ACTUAL DEL USUARIO
// IMPORTA ÍCONOS DE LUCIDE-REACT
import {  Briefcase,  AlertTriangle,  Calendar,  Ticket,  ChevronLeft,  ChevronRight, ArrowUpDown,  ClipboardList } from "lucide-react";
import { useReactTable, getCoreRowModel,getPaginationRowModel, getSortedRowModel, flexRender,} from "@tanstack/react-table";

const JSONBIN_URL = "https://api.jsonbin.io/v3/b/6a13f183ee5a733b1216ab4c";
const JSONBIN_HDRS = {
  headers: {
    "Content-Type": "application/json",
    "X-Master-Key": "$2a$10$Yj0n3PMXBv59/6uS6NvE1O2NARQX.kOKxPn9cFJB5RdfDo2WkbQp2",
  },
};

const FIREBASE_URL = "https://proyecto1prograiv-default-rtdb.firebaseio.com";

const ACCENT_VARIANTS = {
  green: { border: "bg-emerald-500", text: "text-emerald-700 bg-emerald-50" },
  red: { border: "bg-rose-500", text: "text-rose-700 bg-rose-50" },
  sky: { border: "bg-sky-500", text: "text-sky-700 bg-sky-50" },
  amber: { border: "bg-amber-500", text: "text-amber-700 bg-amber-50" },
};

async function fetchJsonBin(url, headers) {
  const res = await fetch(url, headers);
  if (!res.ok) throw new Error(`JSONBin error ${res.status}`);
  const json = await res.json();
  return json.record;
}

async function fetchFirebase(path) {
  const res = await fetch(`${FIREBASE_URL}/${path}.json`);
  if (!res.ok) throw new Error(`Firebase error ${res.status}`);
  return res.json();
}

function firebaseToArray(raw) {
  if (!raw) return [];
  return Object.entries(raw).map(([id, v]) => ({ id, ...v }));
}

function StatCard({ Icon, label, value, sub, variant, loading, error }) {
  const styles = ACCENT_VARIANTS[variant] || ACCENT_VARIANTS.green;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col gap-4">
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${styles.border}`} />

      <div className="flex items-center justify-between">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className={`text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${styles.text}`}>
          {label}
        </span>
      </div>

      <div>
        {loading ? (
          <div className="h-10 w-24 rounded-lg bg-gray-100 animate-pulse" />
        ) : error ? (
          <p className="text-sm text-rose-500 font-medium">Error al cargar</p>
        ) : (
          <p className="text-5xl font-bold text-gray-900 tabular-nums leading-none">
            {value ?? "—"}
          </p>
        )}
        {!loading && !error && sub && (
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{sub}</p>
        )}
      </div>
    </div>
  );
}

function IncidenciasBreakdown({ data, loading }) {
  const counts = {
    Pendiente: data.filter((i) => i.estado === "Pendiente").length,
    "En proceso": data.filter((i) => i.estado === "En proceso").length,
    Resuelta: data.filter((i) => i.estado === "Resuelta").length,
  };

  const pills = [
    { label: "Pendientes", value: counts["Pendiente"], cls: "bg-rose-50 text-rose-700 border-rose-200" },
    { label: "En proceso", value: counts["En proceso"], cls: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Resueltas", value: counts["Resuelta"], cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {pills.map((p) => (
        <span key={p.label} className={`text-xs font-semibold px-3 py-1 rounded-full border ${p.cls}`}>
          {loading ? "…" : p.value} {p.label}
        </span>
      ))}
    </div>
  );
}

function ReservasTable({ data, loading, error }) {
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      {
        id: "titular",
        header: "Usuario / Titular",
        accessorFn: (row) => row.nombre || row.usuario || row.cliente || "Anónimo",
        cell: (info) => <span className="text-gray-800 font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: "fecha",
        header: "Fecha de Reserva",
        cell: (info) => {
          const val = info.getValue();
          if (!val) return <span className="text-gray-400">—</span>;
          return <span className="text-gray-600 tabular-nums">{new Date(val).toLocaleDateString("es-CR", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>;
        },
      },
      {
        id: "cupos",
        header: "Cupos / Espacios",
        accessorFn: (row) => row.cantidad || row.cupos || row.personas || 1,
        cell: (info) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100 tabular-nums">
            {info.getValue()} Persona/s
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  if (loading) {
    return (
      <div className="space-y-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm mt-5">
        <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3" />
        <div className="h-32 bg-gray-50 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-rose-500 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm mt-5">Error al cargar la tabla de reservas.</p>;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mt-5">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Historial Completo de Reservas</h2>
            <p className="text-xs text-gray-400">Listado interactivo y control de visitas agendadas</p>
          </div>
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-md font-mono">{data.length} Totales</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 text-xs font-semibold tracking-wider text-gray-500 uppercase select-none">
                    <div
                      className={`flex items-center gap-1 ${header.column.getCanSort() ? "cursor-pointer hover:text-gray-700" : ""}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-sm text-gray-400">No hay registros de reservas en el sistema.</td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
        <div className="text-xs text-gray-500">
          Página <span className="font-semibold text-gray-700">{table.getState().pagination.pageIndex + 1}</span> de {table.getPageCount() || 1}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useContext(UserContext) || {};
  const usuarioActual = user || getSession();
  const nombre = usuarioActual?.name || usuarioActual?.nombre || "Administrador";

  const [dashboardData, setDashboardData] = useState({
    emp: { data: [], loading: true, error: false },
    inc: { data: [], loading: true, error: false },
    evt: { data: [], loading: true, error: false },
    res: { data: [], loading: true, error: false },
  });

  useEffect(() => {
    async function loadDashboardData() {
      const promises = [
        fetchJsonBin(JSONBIN_URL, JSONBIN_HDRS).catch(() => null),
        fetchFirebase("incidencias").catch(() => null),
        fetchFirebase("eventos").catch(() => null),
        fetchFirebase("reservas").catch(() => null),
      ];

      const [empRes, incRes, evtRes, resRes] = await Promise.all(promises);

      setDashboardData({
        emp: { data: empRes?.emprendimientos ?? [], loading: false, error: !empRes },
        inc: { data: firebaseToArray(incRes), loading: false, error: !incRes },
        evt: { data: firebaseToArray(evtRes), loading: false, error: !evtRes },
        res: { data: firebaseToArray(resRes), loading: false, error: !resRes },
      });
    }

    loadDashboardData();
  }, []);

  const { emp, inc, evt, res } = dashboardData;

  const ahora = new Date().toLocaleDateString("es-CR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalIncidencias = inc.data.length;
  const pend = inc.data.filter((i) => i.estado === "Pendiente").length;
  const proc = inc.data.filter((i) => i.estado === "En proceso").length;
  const res_ = inc.data.filter((i) => i.estado === "Resuelta").length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">
            Panel de administración
          </p>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight">
            Dashboard
          </h1>
          <p className="mt-3 text-gray-500 text-sm">
            Bienvenido, <span className="font-semibold text-gray-700">{nombre}</span>. Resumen actualizado al{" "}
            <span className="font-medium text-gray-700 capitalize">{ahora}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard
            Icon={Briefcase}
            label="Emprendimientos"
            value={emp.data.length}
            sub={`${[...new Set(emp.data.map((e) => e.categoria))].length} categorías registradas`}
            variant="green"
            loading={emp.loading}
            error={emp.error}
          />

          <StatCard
            Icon={AlertTriangle}
            label="Incidencias"
            value={inc.data.length}
            sub={`${pend} pendientes de atención`}
            variant="red"
            loading={inc.loading}
            error={inc.error}
          />

          <StatCard
            Icon={Calendar}
            label="Eventos"
            value={evt.data.length}
            sub="Eventos registrados en el parque"
            variant="sky"
            loading={evt.loading}
            error={evt.error}
          />

          <StatCard
            Icon={Ticket}
            label="Reservas"
            value={res.data.length}
            sub="Total de reservas recibidas"
            variant="amber"
            loading={res.loading}
            error={res.error}
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-base font-bold text-gray-800">Estado de incidencias</h2>
            <span className="text-xs text-gray-400">{totalIncidencias} registros en total</span>
          </div>

          {!inc.loading && !inc.error && totalIncidencias > 0 && (
            <div className="mb-4">
              <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
                <div className="bg-rose-400 transition-all duration-700" style={{ width: `${(pend / totalIncidencias) * 100}%` }} />
                <div className="bg-amber-400 transition-all duration-700" style={{ width: `${(proc / totalIncidencias) * 100}%` }} />
                <div className="bg-emerald-500 transition-all duration-700" style={{ width: `${(res_ / totalIncidencias) * 100}%` }} />
              </div>
            </div>
          )}

          <IncidenciasBreakdown data={inc.data} loading={inc.loading} />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-base font-bold text-gray-800">Emprendimientos por categoría</h2>
            <span className="text-xs text-gray-400">{emp.data.length} registros en total</span>
          </div>

          {emp.loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-6 rounded bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : emp.error ? (
            <p className="text-sm text-rose-500">No se pudieron cargar los datos.</p>
          ) : emp.data.length === 0 ? (
            <p className="text-sm text-gray-400">Sin emprendimientos registrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(
                emp.data.reduce((acc, e) => {
                  acc[e.categoria] = (acc[e.categoria] || 0) + 1;
                  return acc;
                }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-32 truncate">{cat}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${(count / emp.data.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-5 text-right">{count}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <ReservasTable data={res.data} loading={res.loading} error={res.error} />

      </div>
    </div>
  );
}