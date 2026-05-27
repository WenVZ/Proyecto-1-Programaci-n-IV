import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

import Home from "../pages/Home";
import Eventos from "../pages/Eventos";
import Reservas from "../pages/Reservas";
import Emprendimientos from "../pages/Emprendimientos";
import Registro from "../pages/Registro";
import Login from "../pages/Login";
import ProtectedDashboard from "../pages/ProtectedDashboard";
import RootLayout from "../components/RootLayout";
import Incidencias from "../pages/Incidencias";

const rootRoute = createRootRoute({ component: RootLayout });

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

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: ProtectedDashboard,
});

const incidenciasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incidencias",
  component: Incidencias,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  eventosRoute,
  reservasRoute,
  emprendimientosRoute,
  registerRoute,
  loginRoute,
  dashboardRoute,
  incidenciasRoute,
]);

export const router = createRouter({ routeTree });
