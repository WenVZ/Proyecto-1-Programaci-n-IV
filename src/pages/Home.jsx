import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import { UserContext } from "../context/UserContext";
import Contacto from "./Contacto";
import parqueDiria from "../assets/parque-nacional-diria.jpg";

function Home() {
  const { user } = useContext(UserContext);

  const stats = [
    { valor: "Bosque Seco", label: "Ecosistema principal" },
    { valor: "Alta biodiversidad", label: "Flora y fauna protegida" },
    { valor: "Senderos naturales", label: "Educación y observación" },
    { valor: "SINAC", label: "Área protegida oficial" },
  ];

  const secciones = [
    {
      titulo: "Biodiversidad",
      descripcion:
        "Bosque tropical seco con especies adaptadas a condiciones climáticas extremas de la región de Guanacaste.",
    },
    {
      titulo: "Senderos Naturales",
      descripcion:
        "Rutas de observación para educación ambiental, fotografía de naturaleza y contacto directo con el ecosistema.",
    },
    {
      titulo: "Educación Ambiental",
      descripcion:
        "Espacio para aprendizaje sobre conservación, protección de especies y manejo sostenible de áreas protegidas.",
    },
    {
      titulo: "Conservación",
      descripcion:
        "Gestión del SINAC enfocada en proteger ecosistemas frágiles y promover turismo responsable.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans">

      {user && (
        <div className="mt-10 bg-green-800 text-green-100 text-sm px-6 py-2 flex justify-between items-center">
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
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontFamily: "'Georgia', serif" }}
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
              <p className="text-sm text-green-200 mt-1 uppercase tracking-wider">{s.label}</p>
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
                <div className="w-10 h-1 bg-green-500 rounded-full mb-4" />
                <h3 className="text-xl font-bold text-stone-800 mb-2">{s.titulo}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{s.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">

          <div className="bg-stone-100 rounded-2xl p-8">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-stone-800 mb-2">Horario</h3>
            <p className="text-stone-500 text-sm">Lunes a Domingo</p>
            <p className="text-green-700 font-semibold text-lg">7:00 am – 4:00 pm</p>
          </div>

          <div className="bg-stone-100 rounded-2xl p-8">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-stone-800 mb-2">Tarifas</h3>
            <p className="text-stone-500 text-sm">Nacionales: ₡1,000 aprox.</p>
            <p className="text-green-700 font-semibold text-lg">Extranjeros: $2 aprox.</p>
          </div>

          <div className="bg-stone-100 rounded-2xl p-8">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-stone-800 mb-2">Ubicación</h3>
            <p className="text-stone-500 text-sm">Santa Cruz, Guanacaste</p>
            <p className="text-green-700 font-semibold text-lg">Costa Rica</p>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d133150.7616677019!2d-85.64861850004726!3d10.169515486390148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f9fb4c33dbc9fcd%3A0x5efde53475a1a154!2sParque%20Nacional%20Diri%C3%A1!5e0!3m2!1ses!2scr!4v1779250170042!5m2!1ses!2scr"
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

      <Contacto user={user} />

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

        <div className="flex items-center justify-center gap-6 mt-10">
          <a
            href="https://www.facebook.com/pages/Parque%20Nacional%20Diria/847443315458131/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
            Facebook
          </a>

          <span className="text-green-700">|</span>

          <a
            href="https://wa.me/50687223373"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-300 hover:text-white transition-colors duration-200 text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            +506 8722 3373
          </a>
        </div>
      </div>

    </div>
  );
}

export default Home;