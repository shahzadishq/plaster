import { WORKER_BASE } from "./config";

async function req(path: string, init?: RequestInit) {
  const res = await fetch(WORKER_BASE + path, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Fehler ${res.status}`);
  return data;
}

export const api = {
  me: () => req("/api/me"),
  login: (password: string) => req("/api/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => req("/api/logout", { method: "POST" }),
  save: (files: { path: string; content: string }[], message?: string) =>
    req("/api/save", { method: "POST", body: JSON.stringify({ files, message }) }),
};
