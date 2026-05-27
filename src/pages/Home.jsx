import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { UserContext } from "../context/UserContext";
import parqueDiria from "../assets/parque-nacional-diria.jpg";

function Home() {
  const { user } = useContext(UserContext);

  const form = useForm({
    defaultValues: {
      nombre: user?.nombre || "", 
      correo: "",
      sugerencia: "",
    },
    onSubmit: async ({ value }) => {

      console.log("Datos enviados correctamente:", value);
      alert(`¡Gracias por tus comentarios, ${value.nombre}! Registro insertado con éxito.`);
      form.reset();
    },
  });

  const stats = [
    { valor: "Bosque Seco", label: "Ecosistema principal" },
    { valor: "Alta biodiversidad", label: "Flora y fauna protegida" },
    { valor: "Senderos naturales", label: "Educación y observación" },
    { valor: "SINAC", label: "Área protegida oficial" },
  ];

  const secciones = [
    {
      icono: "🌿",
      titulo: "Biodiversidad",
      descripcion:
        "Bosque tropical seco con especies adaptadas a condiciones climáticas extremas de la región de Guanacaste.",
    },
    {
      icono: "🥾",
      titulo: "Senderos Naturales",
      descripcion:
        "Rutas de observación para educación ambiental, fotografía de naturaleza y contacto directo con el ecosistema.",
    },
    {
      icono: "📚",
      titulo: "Educación Ambiental",
      descripcion:
        "Espacio para aprendizaje sobre conservación, protección de especies y manejo sostenible de áreas protegidas.",
    },
    {
      icono: "🌱",
      titulo: "Conservación",
      descripcion:
        "Gestión del SINAC enfocada en proteger ecosistemas frágiles y promover turismo responsable.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans">

      {user && (
        <div className="bg-green-800 text-green-100 text-sm px-6 py-2 flex justify-between items-center">
          <span>
            Sesión activa: <strong>{user.nombre}</strong>
          </span>
          <span className="uppercase tracking-widest text-xs bg-green-700 px-3 py-1 rounded-full">
            {user.role}
          </span>
        </div>
      )}

      <div className="h-[88vh] bg-gradient-to-br from-green-950 via-green-900 to-stone-900 flex items-end">

        <div className="relative z-10 pb-20 px-10 md:px-20">

          <p className="text-green-300 uppercase tracking-[0.3em] text-sm mb-4 font-medium">
            Costa Rica · Guanacaste · SINAC
          </p>

          <h1
            className="text-white font-bold leading-none mb-6"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontFamily: "'Georgia', serif"
            }}
          >
            Parque Nacional
            <br />
            <span className="text-green-300">Diría</span>
          </h1>

          <p className="text-stone-200 text-lg max-w-xl mb-10 leading-relaxed">
            Área protegida del Sistema Nacional de Áreas de Conservación (SINAC),
            ubicada en el bosque tropical seco de Guanacaste. Un espacio dedicado
            a la conservación de la biodiversidad, la educación ambiental y el turismo sostenible.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/reservas">
              <button className="bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-green-500/30">
                Reservar visita
              </button>
            </Link>

            <Link to="/eventos">
              <button className="border border-white/40 hover:border-white text-white px-8 py-3 rounded-full transition-all duration-200 hover:bg-white/10">
                Ver eventos
              </button>
            </Link>
          </div>

        </div>
      </div>

      <div className="bg-green-900 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-2xl font-bold text-green-300">{s.valor}</p>
              <p className="text-sm text-green-200 mt-1 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <p className="text-green-600 uppercase tracking-widest text-xs font-semibold mb-3">
              Sobre el parque
            </p>

            <h2
              className="text-4xl font-bold text-stone-800 mb-6 leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Un ecosistema de bosque seco<br />protegido por el SINAC
            </h2>

            <p className="text-stone-600 leading-relaxed mb-4">
              El Parque Nacional Diría forma parte del Sistema Nacional de Áreas de Conservación (SINAC)
              y protege uno de los últimos remanentes del bosque tropical seco en Costa Rica.
              Este ecosistema es altamente vulnerable y de gran importancia ecológica.
            </p>

            <p className="text-stone-600 leading-relaxed">
              Su conservación permite proteger especies nativas, fomentar la investigación científica,
              la educación ambiental y el turismo sostenible regulado en la región de Guanacaste.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl h-80">
            <img
              src={parqueDiria}
              alt="Parque Nacional Diría"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

        </div>
      </div>

      <div className="bg-green-50 py-20 px-6">

        <div className="max-w-5xl mx-auto">

          <p className="text-green-600 uppercase tracking-widest text-xs font-semibold mb-3 text-center">
            Gestión del parque
          </p>

          <h2
            className="text-4xl font-bold text-stone-800 mb-12 text-center"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Experiencias y conservación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {secciones.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-green-100 hover:shadow-md hover:border-green-300 transition-all duration-200"
              >
                <span className="text-4xl mb-4 block">{s.icono}</span>
                <h3 className="text-xl font-bold text-stone-800 mb-2">
                  {s.titulo}
                </h3>
                <p className="text-stone-500 leading-relaxed text-sm">
                  {s.descripcion}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">

        <div className="grid md:grid-cols-3 gap-8 text-center">

          <div className="bg-stone-100 rounded-2xl p-8">
            <p className="text-3xl mb-3">🕗</p>
            <h3 className="font-bold text-stone-800 mb-2">Horario</h3>
            <p className="text-stone-500 text-sm">Lunes a Domingo</p>
            <p className="text-green-700 font-semibold text-lg">
              7:00 am – 4:00 pm
            </p>
          </div>

          <div className="bg-stone-100 rounded-2xl p-8">
            <p className="text-3xl mb-3">💵</p>
            <h3 className="font-bold text-stone-800 mb-2">Tarifas</h3>
            <p className="text-stone-500 text-sm">Nacionales: ₡1,000 aprox.</p>
            <p className="text-green-700 font-semibold text-lg">
              Extranjeros: $2 aprox.
            </p>
          </div>

          <div className="bg-stone-100 rounded-2xl p-8">
            <p className="text-3xl mb-3">📍</p>
            <h3 className="font-bold text-stone-800 mb-2">Ubicación</h3>
            <p className="text-stone-500 text-sm">Santa Cruz, Guanacaste</p>
            <p className="text-green-700 font-semibold text-lg">
              Costa Rica
            </p>
          </div>

        </div>
      </div>

      <div className="px-6 md:px-16 pb-20">

        <div className="max-w-5xl mx-auto">

          <h2
            className="text-3xl font-bold text-stone-800 mb-8 text-center"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Cómo llegar
          </h2>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-green-100">

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d133150.7616677019!2d-85.64861850004726!3d10.169515486390148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f9fb4c33dbc9fcd%3A0x5efde53475a1a154!2sParque%20Nacional%20Diri%C3%AD!5e0!3m2!1ses!2scr!4v1779250170042!5m2!1ses!2scr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>

        </div>
      </div>

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
                  onChange: ({ value }) => !value ? "El nombre es requerido" : undefined
                }}
                children={(field) => (
                  <div className="flex flex-col">
                    <label htmlFor={field.name} className="text-xs font-semibold text-stone-600 uppercase mb-2 tracking-wider">
                      Nombre Completo
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="border border-stone-200 bg-stone-50 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length ? (
                      <em className="text-red-500 text-xs mt-1 not-italic">{field.state.meta.errors.join(", ")}</em>
                    ) : null}
                  </div>
                )}
              />

              <form.Field
                name="correo"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return "El correo es requerido";
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Formato de correo inválido";
                    return undefined;
                  }
                }}
                children={(field) => (
                  <div className="flex flex-col">
                    <label htmlFor={field.name} className="text-xs font-semibold text-stone-600 uppercase mb-2 tracking-wider">
                      Correo Electrónico
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="border border-stone-200 bg-stone-50 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length ? (
                      <em className="text-red-500 text-xs mt-1 not-italic">{field.state.meta.errors.join(", ")}</em>
                    ) : null}
                  </div>
                )}
              />
            </div>

            <form.Field
              name="sugerencia"
              validators={{
                onChange: ({ value }) => !value ? "El mensaje no puede estar vacío" : undefined
              }}
              children={(field) => (
                <div className="flex flex-col">
                  <label htmlFor={field.name} className="text-xs font-semibold text-stone-600 uppercase mb-2 tracking-wider">
                    Sugerencia o Mensaje
                  </label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    placeholder="Escribe aquí tus dudas o sugerencias para el SINAC..."
                    className="border border-stone-200 bg-stone-50 rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm resize-none"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <em className="text-red-500 text-xs mt-1 not-italic">{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </div>
              )}
            />

            <div className="text-center pt-2">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="bg-green-700 hover:bg-green-600 disabled:bg-stone-300 text-white font-semibold px-10 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-green-700/20 w-full md:w-auto"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Sugerencia"}
                  </button>
                )}
              />
            </div>
          </form>

        </div>
      </div>

      <div className="bg-green-900 text-white text-center py-16 px-6">

        <h2
          className="text-3xl font-bold mb-4"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          ¿Listo para explorar?
        </h2>

        <p className="text-green-300 mb-8 max-w-md mx-auto">
          Reserva tu visita y conoce uno de los ecosistemas más importantes del bosque seco tropical de Costa Rica.
        </p>

        <Link to="/reservas">
          <button className="bg-green-400 hover:bg-green-300 text-green-900 font-bold px-10 py-4 rounded-full text-lg transition-all duration-200">
            Reservar ahora
          </button>
        </Link>

      </div>

    </div>
  );
}

export default Home;
