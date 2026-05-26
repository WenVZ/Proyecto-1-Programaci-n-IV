import { useForm } from "@tanstack/react-form";
import emailjs from "@emailjs/browser";

function Contacto({ user }) {
  const form = useForm({
    defaultValues: {
      nombre: user?.nombre || "",
      correo: "",
      sugerencia: "",
    },

    onSubmit: async ({ value }) => {
      try {
        await emailjs.send(
          "service_berf2ts",
          "template_vvavbc9",
          {
            nombre: value.nombre,
            email: value.correo,
            sugerencia: value.sugerencia,
            tiempo: new Date().toLocaleString("es-CR"),
          },
          "sWBrop4Yb1ygJUKDh"
        );

        alert("Mensaje enviado correctamente");
        form.reset();
      } catch (error) {
        console.error(error);
        alert("Error al enviar el mensaje");
      }
    },
  });

  return (
    <div className="bg-stone-100 py-20 px-6 border-t border-stone-200">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-green-100">

        <p className="text-green-600 uppercase tracking-widest text-xs font-semibold mb-3 text-center">
          Contacto directo
        </p>

        <h2
          className="text-3xl font-bold text-stone-800 mb-4 text-center"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          ¿Deseas mayor información o dejarnos una sugerencia?
        </h2>

        <p className="text-stone-500 text-sm text-center mb-10 max-w-lg mx-auto">
          Tu opinión nos ayuda a proteger mejor el ecosistema del Diría y a mejorar la experiencia de nuestros visitantes.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <form.Field
              name="nombre"
              validators={{
                onChange: ({ value }) =>
                  !value ? "El nombre es requerido" : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-stone-600 uppercase mb-2 tracking-wider">
                    Nombre Completo
                  </label>

                  <input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="border border-stone-200 bg-stone-50 rounded-xl px-4 py-3"
                  />

                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em className="text-red-500 text-xs mt-1 not-italic">
                      {field.state.meta.errors.join(", ")}
                    </em>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="correo"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "El correo es requerido";

                  if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  ) {
                    return "Correo inválido";
                  }

                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-stone-600 uppercase mb-2 tracking-wider">
                    Correo Electrónico
                  </label>

                  <input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="border border-stone-200 bg-stone-50 rounded-xl px-4 py-3"
                  />

                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em className="text-red-500 text-xs mt-1 not-italic">
                      {field.state.meta.errors.join(", ")}
                    </em>
                  ) : null}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="sugerencia"
            validators={{
              onChange: ({ value }) =>
                !value ? "Debe escribir un mensaje" : undefined,
            }}
          >
            {(field) => (
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-stone-600 uppercase mb-2 tracking-wider">
                  Sugerencia o Mensaje
                </label>

                <textarea
                  rows={4}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Escriba aquí su mensaje..."
                  className="border border-stone-200 bg-stone-50 rounded-xl px-4 py-3 resize-none"
                />

                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em className="text-red-500 text-xs mt-1 not-italic">
                    {field.state.meta.errors.join(", ")}
                  </em>
                ) : null}
              </div>
            )}
          </form.Field>

          <div className="text-center">

            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
              ]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="bg-green-700 hover:bg-green-600 disabled:bg-stone-300 text-white px-10 py-3 rounded-full"
                >
                  {isSubmitting
                    ? "Enviando..."
                    : "Enviar sugerencia"}
                </button>
              )}
            </form.Subscribe>

          </div>
        </form>

      </div>
    </div>
  );
}

export default Contacto;