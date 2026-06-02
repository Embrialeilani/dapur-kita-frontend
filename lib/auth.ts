const TOKEN_KEY = 'dk_token';
const USER_KEY  = 'dk_user';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  phone?: string;
  address?: string;
}

function isClient() {
  return typeof window !== 'undefined';
}

export function saveAuth(token: string, user: User) {
  if (!isClient()) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  if (!isClient()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  if (!isClient()) return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn() {
  return !!getToken();
}

export function isAdmin() {
  const u = getUser();
  return !!u && u.role === 'ADMIN';
}

export function logout() {
  if (!isClient()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = '/login';
}