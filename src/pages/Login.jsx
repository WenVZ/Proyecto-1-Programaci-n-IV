import { useForm } from "@tanstack/react-form";

function Login() {
  const form = useForm({
    defaultValues: {
      correo: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      console.log(value);
      alert("Inicio de sesión correcto");
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

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800"
          >
            Ingresar
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;