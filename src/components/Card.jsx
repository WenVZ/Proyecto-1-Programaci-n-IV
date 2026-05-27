import { FaTree } from "react-icons/fa"

function Card({ titulo, descripcion }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <FaTree className="text-4xl text-green-700 mb-4" />

      <h2 className="text-2xl font-bold mb-3">
        {titulo}
      </h2>

      <p>
        {descripcion}
      </p>

    </div>
  )
}

export default Card