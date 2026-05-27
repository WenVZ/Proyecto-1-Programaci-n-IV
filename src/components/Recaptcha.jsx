import { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "google-recaptcha-script";

function loadRecaptchaScript() {
  if (document.getElementById(SCRIPT_ID)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function Recaptcha({ onChange }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [error, setError] = useState("");
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    let cancelled = false;

    async function renderCaptcha() {
      if (!siteKey) {
        setError("Falta configurar VITE_RECAPTCHA_SITE_KEY.");
        return;
      }

      try {
        await loadRecaptchaScript();

        if (cancelled || !containerRef.current || widgetIdRef.current !== null) {
          return;
        }

        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onChange(token),
          "expired-callback": () => onChange(""),
          "error-callback": () => {
            onChange("");
            setError("No se pudo validar el captcha. Intentalo otra vez.");
          },
        });
      } catch {
        setError("No se pudo cargar reCAPTCHA.");
      }
    }

    renderCaptcha();

    return () => {
      cancelled = true;
    };
  }, [onChange, siteKey]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={containerRef} />
      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}

export default Recaptcha;
