import { createContext, useState } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Home from "../pages/Home";
import Eventos from "../pages/Eventos";
import Reservas from "../pages/Reservas";
import Emprendimientos from "../pages/Emprendimientos";
import Registro from "../pages/Registro";
import Login from "../pages/Login";

export const UserContext = createContext(null);

function RootComponent() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div>
        <Navbar />
        <div className="flex">
          <main className="p-6 flex-1">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

const rootRoute = createRootRoute({ component: RootComponent });

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

const routeTree = rootRoute.addChildren([
  homeRoute,
  eventosRoute,
  reservasRoute,
  emprendimientosRoute,
  registerRoute,
  loginRoute,
]);

export const router = createRouter({ routeTree });