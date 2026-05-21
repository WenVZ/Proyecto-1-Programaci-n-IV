import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";

function Registro() {
  // luego se cambia esto por el json bin que tenemos que usar
  const usersDB = [
    { correo: "test@gmail.com" }
  ];

  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const form = useForm({
    defaultValues: {
      nombre: "",
      correo: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      const userExists = usersDB.find(
        (u) => u.correo === value.correo
      );

      if (userExists) {
        setMessage("Este correo ya está registrado.");
        setShowLogin(true);
        return;
      }

      setMessage(" Usuario registrado correctamente");
      setShowLogin(false);
      console.log("Usuario nuevo:", value);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Registro
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="nombre">
            {(field) => (
              <input
                placeholder="Nombre completo"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            )}
          </form.Field>

          <form.Field name="correo">
            {(field) => (
              <input
                type="email"
                placeholder="Correo electrónico"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <input
                type="password"
                placeholder="Contraseña"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            )}
          </form.Field>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 font-semibold transition-colors"
          >
            Registrarse
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 font-semibold ${showLogin ? 'text-amber-600' : 'text-green-700'}`}>
            {message}
          </p>
        )}

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-2">
            ¿Ya tienes una cuenta?
          </p>
          <Link to="/login" className="inline-block w-full">
            <button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors">
              Iniciar sesión
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Registro;