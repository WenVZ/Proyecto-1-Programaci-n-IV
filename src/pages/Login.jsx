import { useCallback, useContext, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { UserContext } from "../context/UserContext";
import { loginUser } from "../services/authService";
import Recaptcha from "../components/Recaptcha";

function Login() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const handleCaptchaChange = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const form = useForm({
    defaultValues: {
      correo: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setMessage("");
      setLoading(true);

      try {
        if (!captchaToken) {
          throw new Error("Marca el reCAPTCHA antes de iniciar sesion.");
        }

        const user = await loginUser(value);
        setUser(user);
        navigate({ to: search.redirect || (user.role === "admin" ? "/dashboard" : "/") });
      } catch (error) {
        setMessage(error.message || "No se pudo iniciar sesion.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">
          Iniciar Sesión
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >

          <form.Field
            name="correo"
            children={(field) => (
              <input
                type="email"
                placeholder="Correo electrónico"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <input
                type="password"
                placeholder="Contraseña"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />
            )}
          />

          <Recaptcha onChange={handleCaptchaChange} />

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

        </form>

        {message && (
          <p className="text-center mt-4 font-semibold text-red-700">
            {message}
          </p>
        )}

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-2">¿No tienes cuenta?</p>
          <Link to="/registro" className="font-semibold text-green-800 hover:text-green-900">
            Crear cuenta
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;
