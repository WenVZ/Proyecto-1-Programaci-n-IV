import { useCallback, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { registerUser } from "../services/authService";
import Recaptcha from "../components/Recaptcha";

function Registro() {
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const handleCaptchaChange = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const form = useForm({
    defaultValues: {
      nombre: "",
      correo: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setMessage("");
      setShowLogin(false);
      setLoading(true);

      try {
        if (!captchaToken) {
          throw new Error("Marca el reCAPTCHA antes de registrarte.");
        }

        if (!value.nombre.trim() || !value.correo.trim() || !value.password.trim()) {
          throw new Error("Complete todos los campos.");
        }

        if (value.password.length < 8) {
          throw new Error("La contrasena debe tener al menos 8 caracteres.");
        }

        await registerUser(value);
        setMessage("Usuario registrado correctamente. Ya puedes iniciar sesion.");
        setShowLogin(true);
      } catch (error) {
        setMessage(error.message || "No se pudo registrar el usuario.");
        setShowLogin(error.message?.includes("registrado"));
      } finally {
        setLoading(false);
      }
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

          <Recaptcha onChange={handleCaptchaChange} />

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-60 font-semibold transition-colors"
          >
            {loading ? "Registrando..." : "Registrarse"}
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
