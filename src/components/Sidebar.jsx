import { useState } from "react";

import {
  FaBars,
  FaHome,
  FaCalendarAlt,
  FaClipboardList,
  FaStore,
  FaChartBar
} from "react-icons/fa";

function Sidebar() {

  const [open, setOpen] = useState(false);

  return (

    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 bg-green-900 text-white p-3 rounded-lg shadow-lg"
      >
        <FaBars />
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-green-900 text-white p-6
          transform transition-transform duration-300 z-40

          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        <h2 className="text-3xl font-bold mb-10 mt-12">
          Parque Nacional
        </h2>

        <nav>

          <ul className="space-y-3">

            <li className="flex items-center gap-3 hover:bg-green-800 p-3 rounded-lg cursor-pointer transition">
              <FaHome />
              Dashboard
            </li>

            <li className="flex items-center gap-3 hover:bg-green-800 p-3 rounded-lg cursor-pointer transition">
              <FaCalendarAlt />
              Eventos
            </li>

            <li className="flex items-center gap-3 hover:bg-green-800 p-3 rounded-lg cursor-pointer transition">
              <FaClipboardList />
              Reservas
            </li>

            <li className="flex items-center gap-3 hover:bg-green-800 p-3 rounded-lg cursor-pointer transition">
              <FaStore />
              Emprendimientos
            </li>

            <li className="flex items-center gap-3 hover:bg-green-800 p-3 rounded-lg cursor-pointer transition">
              <FaChartBar />
              Reportes
            </li>

          </ul>

        </nav>

      </aside>
    </>

  )
}

export default Sidebar