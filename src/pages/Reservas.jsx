import { useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import {
  Calendar,
  Users,
  Leaf
} from "lucide-react";

import { getSession } from "../services/authService";

function Reservas() {
  const user = getSession();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rol = String(
    user?.role || user?.rol || ""
  ).toLowerCase();

  const isAdmin =
    rol === "admin" || rol === "administrador";

  const [reservas, setReservas] = useState([]);

  const BASE_URL =
    "https://proyecto1prograiv-default-rtdb.firebaseio.com";

  const cargarReservas = async () => {
    const res = await fetch(`${BASE_URL}/reservas.json`);
    const data = await res.json();

    if (!data) {
      setReservas([]);
      return;
    }

    const lista = Object.entries(data).map(([id, reserva]) => ({
      id,
      ...reserva
    }));

    setReservas(lista);
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const eliminarReserva = async (id) => {
    await fetch(`${BASE_URL}/reservas/${id}.json`, {
      method: "DELETE"
    });

    cargarReservas();
  };

  const nombreUsuario = user?.name || user?.nombre || user?.email;

const reservasFiltradas = isAdmin
  ? reservas
  : reservas.filter(
      (reserva) => reserva.nombre === nombreUsuario
    );

  return (
    <div className="min-h-screen bg-green-50 p-10">
      <h1 className="text-5xl font-bold text-green-900 mb-6">
        {isAdmin ? "Todas las Reservas" : "Mis Reservas"}
      </h1>

      <div className="flex flex-col gap-3">
        {reservasFiltradas.map((reserva) => (
          <div
            key={reserva.id}
            className="bg-white rounded-xl shadow px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">

              <p className="font-bold text-gray-800">
                {reserva.nombre}
              </p>

              <p className="flex items-center gap-1 text-gray-500 text-sm">
                <Calendar size={14} className="text-green-700" />
                {reserva.fecha}
              </p>

              <p className="flex items-center gap-1 text-gray-500 text-sm">
                <Users size={14} className="text-green-700" />
                {reserva.personas}
              </p>

              <p className="flex items-center gap-1 text-gray-500 text-sm">
                <Leaf size={14} className="text-green-700" />
                {reserva.actividad}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => eliminarReserva(reserva.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reservas;