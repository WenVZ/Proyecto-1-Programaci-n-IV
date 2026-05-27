import axios from "axios";

const API_URL = "https://api.jsonbin.io/v3";
const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;
const ACCESS_KEY = import.meta.env.VITE_JSONBIN_ACCESS_KEY;
const MASTER_KEY = import.meta.env.VITE_JSONBIN_MASTER_KEY;
const SESSION_KEY = "sigtad_user";

function getAuthHeader() {
  if (ACCESS_KEY) return { "X-Access-Key": ACCESS_KEY };
  if (MASTER_KEY) return { "X-Master-Key": MASTER_KEY };
  return {};
}

const jsonbin = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  },
});

function assertJsonBinConfig() {
  if (!BIN_ID || (!ACCESS_KEY && !MASTER_KEY)) {
    throw new Error(
      "Faltan VITE_JSONBIN_BIN_ID y VITE_JSONBIN_ACCESS_KEY en el archivo .env"
    );
  }
}

function cleanEmail(email) {
  return email.trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user.id,
    nombre: user.nombre,
    correo: user.email || user.correo,
    email: user.email || user.correo,
    role: user.role,
  };
}

function normalizeRecord(record) {
  if (Array.isArray(record)) return { usuarios: record };
  return {
    ...record,
    usuarios: Array.isArray(record?.usuarios)
      ? record.usuarios
      : Array.isArray(record?.users)
        ? record.users
        : [],
  };
}

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
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser(user)));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export async function getUsersRecord() {
  assertJsonBinConfig();
  const response = await jsonbin.get(`/b/${BIN_ID}/latest`, {
    headers: { "X-Bin-Meta": "false" },
  });
  return normalizeRecord(response.data);
}

async function saveUsersRecord(record) {
  assertJsonBinConfig();
  const response = await jsonbin.put(`/b/${BIN_ID}`, record, {
    headers: { "X-Bin-Versioning": "false" },
  });
  return normalizeRecord(response.data.record);
}

export async function registerUser({ nombre, correo, password }) {
  const record = await getUsersRecord();
  const normalizedEmail = cleanEmail(correo);
  const userExists = record.usuarios.some(
    (user) => cleanEmail(user.email || user.correo) === normalizedEmail
  );

  if (userExists) {
    throw new Error("Este correo ya esta registrado.");
  }

  const nextId =
    Math.max(0, ...record.usuarios.map((user) => Number(user.id) || 0)) + 1;
  const user = {
    id: nextId,
    nombre: nombre.trim(),
    email: normalizedEmail,
    password,
    role: "user",
  };

  const updatedRecord = {
    ...record,
    usuarios: [...record.usuarios, user],
  };

  await saveUsersRecord(updatedRecord);
  return publicUser(user);
}

export async function loginUser({ correo, password }) {
  const record = await getUsersRecord();
  const normalizedEmail = cleanEmail(correo);
  const user = record.usuarios.find(
    (savedUser) => cleanEmail(savedUser.email || savedUser.correo) === normalizedEmail
  );

  if (!user || user.password !== password) {
    throw new Error("Correo o contrasena incorrectos.");
  }

  saveSession(user);
  return publicUser(user);
}
