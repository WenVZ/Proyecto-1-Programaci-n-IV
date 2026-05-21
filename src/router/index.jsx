import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import Home from "../pages/Home";
import Eventos from "../pages/Eventos";
import Reservas from "../pages/Reservas";
import Emprendimientos from "../pages/Emprendimientos";
import Registro from "../pages/Registro";
import Login from "../pages/Login"; 

function RootComponent() {
  return (
    <div>
      <Navbar />
      <Sidebar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const eventosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/eventos",
  component: Eventos,
});

const reservasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reservas",
  component: Reservas,
});

const emprendimientosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/emprendimientos",
  component: Emprendimientos,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/registro",
  component: Registro,
});

// 🔥 AQUÍ ESTABA EL PROBLEMA (FALTABA LOGIN)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  eventosRoute,
  reservasRoute,
  emprendimientosRoute,
  registerRoute,
  loginRoute, // ✅ AGREGADO
]);

export const router = createRouter({
  routeTree,
});