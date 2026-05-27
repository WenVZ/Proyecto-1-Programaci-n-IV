import { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "google-recaptcha-script";
let recaptchaScriptPromise;

function waitForRecaptcha() {
  return new Promise((resolve, reject) => {
    let intervalId;

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      reject(new Error("recaptcha-timeout"));
    }, 10000);

    const resolveWhenReady = () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
      resolve();
    };

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
    checkRecaptcha();
  });
}

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
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
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
