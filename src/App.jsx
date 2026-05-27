import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Incidencias from "./pages/Incidencias";
import Eventos from "./pages/Eventos";
import Reservas from "./pages/Reservas";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Navbar />

      <div className="flex">
        <div className="p-6 flex-1">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/incidencias" element={<Incidencias />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/reservas" element={<Reservas />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;