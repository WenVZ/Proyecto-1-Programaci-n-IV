import { useEffect, useRef, useState } from "react";

// ID que tendra el script de Google reCAPTCHA
const SCRIPT_ID = "google-recaptcha-script";

let recaptchaScriptPromise;// Variable global para guardar la promesa del script




// FUNCIoN PARA ESPERAR QUE RECAPTCHA ESTe LISTO
function waitForRecaptcha() {

  return new Promise((resolve, reject) => {  // Retorna una promesa


    let intervalId;

    const timeoutId = window.setTimeout(() => {    // si tarda mas de 10 segundos da error


      window.clearInterval(intervalId);

      reject(new Error("recaptcha-timeout"));

    }, 10000);




    // cuando reCAPTCHA ya esta listo
    const resolveWhenReady = () => {

      window.clearInterval(intervalId);

      window.clearTimeout(timeoutId);      // Limpia el timeout


      resolve();      // Marca la promesa como exitosa

    };




    // Verifica si grecaptcha ya existe
    const checkRecaptcha = () => {

      if (window.grecaptcha?.render) {

        if (window.grecaptcha.ready) {

          window.grecaptcha.ready(resolveWhenReady);

        } else {

          resolveWhenReady();
        }
      }
    };




    intervalId = window.setInterval(checkRecaptcha, 100);

    // Primera revisión inmediata
    checkRecaptcha();
  });
}





// FUNCIÓN PARA CARGAR EL SCRIPT DE GOOGLE
function loadRecaptchaScript() {

  if (window.grecaptcha?.render) {

    return waitForRecaptcha();
  }

  if (recaptchaScriptPromise) {

    return recaptchaScriptPromise;
  }






  recaptchaScriptPromise = new Promise((resolve, reject) => {

    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {

      waitForRecaptcha().then(resolve).catch(reject);
      return;
    }






    const script = document.createElement("script");

    script.id = SCRIPT_ID;

    // URL del script de Google reCAPTCHA
    script.src =
      "https://www.google.com/recaptcha/api.js?render=explicit";

    script.async = true;

    script.defer = true;






    script.onload = () => {

      waitForRecaptcha().then(resolve).catch(reject);
    };

    script.onerror = reject;

    document.body.appendChild(script);
  });

  return recaptchaScriptPromise;
}








// COMPONENTE RECAPTCHA
function Recaptcha({ onChange }) {

  const containerRef = useRef(null);

  const widgetIdRef = useRef(null);

  const [error, setError] = useState("");

  // Obtiene la clave pública desde .env
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;







  useEffect(() => {

    let cancelled = false;






    async function renderCaptcha() {

      if (!siteKey) {      // Si no existe la key


        // Muestra error
        setError("Falta configurar VITE_RECAPTCHA_SITE_KEY.");
        return;
      }

      try {

        await loadRecaptchaScript();




        if (
          cancelled ||
          !containerRef.current ||
          widgetIdRef.current !== null
        ) {
          return;
        }






        widgetIdRef.current = window.grecaptcha.render(
          containerRef.current,
          {

            // Clave pública
            sitekey: siteKey,

            callback: (token) => onChange(token),

            "expired-callback": () => onChange(""),

            "error-callback": () => {

              onChange("");

              setError(
                "No se pudo validar el captcha. Intentalo otra vez."
              );
            },
          }
        );

      } catch {

        setError("No se pudo cargar reCAPTCHA.");
      }
    }






    renderCaptcha();    // Ejecuta la función







    return () => {

      cancelled = true;
    };

  }, [onChange, siteKey]);








  // Lo que muestra el componente
  return (

    <div className="flex flex-col items-center gap-2">   


      <div ref={containerRef} />

      {error && (

        <p className="text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

// Exporta el componente
export default Recaptcha;