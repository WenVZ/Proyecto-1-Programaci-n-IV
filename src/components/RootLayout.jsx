import { useState } from "react";// importa usestate desde react
import { Outlet } from "@tanstack/react-router";// mporta outlet desde tanstack router. outlet muestra las paginas hijas dentro del layout
import Footer from "./Footer";
import Navbar from "./Navbar";
import { UserContext } from "../context/UserContext";
import { getSession } from "../services/authService";// Importa la funcion getsession. Obtiene la sesion actual del usuario




// COMPONENTE PRINCIPAL DEL LAYOUT
function RootLayout() {

  const [user, setUser] = useState(getSession());  // getSession() obtiene el usuario guardado


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

// Exporta el componente
export default RootLayout;