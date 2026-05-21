import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <div className="p-6 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;