import { BASE_API_URL } from './config';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dk_token');
}

async function request<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: any
): Promise<T> {
  const url = `${BASE_API_URL}${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts: RequestInit = { method, headers };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  let data: any = {};
  try { data = await res.json(); } catch (e) {}

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }
  return data as T;
}

export const api = {
  get:    <T = any>(path: string)             => request<T>('GET',    path),
  post:   <T = any>(path: string, body?: any) => request<T>('POST',   path, body),
  patch:  <T = any>(path: string, body?: any) => request<T>('PATCH',  path, body),
  put:    <T = any>(path: string, body?: any) => request<T>('PUT',    path, body),
  delete: <T = any>(path: string)             => request<T>('DELETE', path),
};