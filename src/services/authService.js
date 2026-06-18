import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const SESSION_KEY = "sigtad_user";

// =================== SESIÓN ===================

export function getSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("token");
}

// =================== AUTH ===================

export async function loginUser({ correo, password }) {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { correo, password });
    console.log("Respuesta del backend:", res.data);

    const token = res.data.token;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const rol = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const email = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

    const user = {
      email,
      correo: email,
      role: rol,
    };

    localStorage.setItem("token", token);
    saveSession(user);

    return user;
  } catch (error) {
    // 👇 Esto nos dirá exactamente qué está fallando
    console.error("Error completo:", error);
    console.error("Respuesta del servidor:", error?.response?.data);
    console.error("Status:", error?.response?.status);
    throw new Error("Correo o contraseña incorrectos.");
  }
}

// =================== REGISTRO ===================
// El registro sigue igual por ahora, lo conectamos al backend después

export async function registerUser({ nombre, correo, password }) {
  try {
    await axios.post(`${API_URL}/auth/register`, { nombre, correo, password });
  } catch {
    throw new Error("No se pudo registrar el usuario.");
  }
}