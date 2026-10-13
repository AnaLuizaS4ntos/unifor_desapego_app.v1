import { CategoryFilter, MarketplaceItem, SortOption } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: string;
  whatsapp: string;
  avatarUrl?: string;
  verifiedStudent: boolean;
}

const AUTH_TOKEN_KEY = 'unidesapego_token';
const AUTH_USER_KEY = 'unidesapego_current_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: AuthUser) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Erro ao salvar autenticação local:', err);
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (err) {
    console.warn('Erro ao limpar autenticação:', err);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Registra novo usuário
 */
export async function registerApi(data: {
  name: string;
  email: string;
  password: string;
  course: string;
  semester?: string;
  whatsapp: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Erro ao realizar cadastro.');
  }

  setStoredAuth(body.token, body.user);
  return body;
}

/**
 * Login de usuário existente
 */
export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Erro ao realizar login.');
  }

  setStoredAuth(body.token, body.user);
  return body;
}

/**
 * Busca perfil atual via token
 */
export async function fetchMeApi(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      clearStoredAuth();
      return null;
    }
    const body = await res.json();
    if (body.user) {
      setStoredAuth(token, body.user);
      return body.user;
    }
    return null;
  } catch {
    return getStoredUser();
  }
}

/**
 * Busca itens com filtros direto do banco de dados PostgreSQL
 */
export async function fetchItemsApi(params: {
  searchQuery?: string;
  category?: CategoryFilter;
  bloco?: string;
  condition?: string;
  sortBy?: SortOption;
  onlyFavorites?: boolean;
}): Promise<{ items: MarketplaceItem[]; categoryCounts: Record<CategoryFilter, number> } | null> {
  try {
    const url = new URL(`${API_BASE || window.location.origin}/api/items`);
    if (params.searchQuery) url.searchParams.set('q', params.searchQuery);
    if (params.category && params.category !== 'Todos') url.searchParams.set('category', params.category);
    if (params.bloco && params.bloco !== 'Todos') url.searchParams.set('bloco', params.bloco);
    if (params.condition && params.condition !== 'Todos') url.searchParams.set('condition', params.condition);
    if (params.sortBy) url.searchParams.set('sortBy', params.sortBy);
    if (params.onlyFavorites) url.searchParams.set('onlyFavorites', 'true');

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('API backend não acessível no momento, usando modo local:', err);
    return null;
  }
}

/**
 * Cadastra novo item no banco
 */
export async function createItemApi(item: MarketplaceItem): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Incrementa contador de visualizações real no banco de dados PostgreSQL
 */
export async function incrementItemViewApi(itemId: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/api/items/${itemId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.views;
  } catch {
    return null;
  }
}

/**
 * Alterna favorito no banco para o usuário logado
 */
export async function toggleFavoriteApi(itemId: string): Promise<{ isFavorite: boolean; favoritesCount: number } | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/api/items/${itemId}/favorite`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
