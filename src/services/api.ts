import { config } from '@/config/environment';
import type {
  User,
  AdminUser,
  BlockedDate,
  AuthResponse,
  RegisterData,
  RegisterPetData,
  Pet,
} from '@/types/api';

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

interface RequestConfig<TResponse> {
  fallbackValue?: TResponse;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;
  private storageCache: Storage | null | undefined = undefined;

  constructor() {
    this.baseUrl = config.apiUrl;
    this.token = this.storage?.getItem('auth_token') ?? null;
  }

  /**
   * Gets the storage instance (localStorage) with caching.
   *
   * SECURITY NOTE: localStorage is vulnerable to XSS attacks.
   * Consider migrating to httpOnly cookies for production environments.
   *
   * For improved security:
   * - Implement Content Security Policy (CSP)
   * - Use httpOnly cookies with SameSite attribute
   * - Implement token rotation and refresh tokens
   */
  private get storage(): Storage | null {
    if (this.storageCache !== undefined) {
      return this.storageCache;
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      this.storageCache = null;
      return null;
    }

    this.storageCache = window.localStorage;
    return this.storageCache;
  }

  private getStoredToken(): string | null {
    return this.storage?.getItem('auth_token') ?? null;
  }

  private resolveToken(): string | null {
    if (this.token) {
      return this.token;
    }

    const storedToken = this.getStoredToken();

    if (storedToken) {
      this.token = storedToken;
    }

    return this.token;
  }

  setToken(token: string, persist = true) {
    this.token = token;
    if (persist) {
      this.storage?.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    this.storage?.removeItem('auth_token');
  }

  private async request<TResponse>(
    endpoint: string,
    options: RequestInit = {},
    config: RequestConfig<TResponse> = {}
  ): Promise<TResponse> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.resolveToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('Content-Type') ?? '';
      const isJsonResponse = contentType.includes('application/json');

      if (!response.ok) {
        let message = `Erro na requisição: ${response.statusText}`;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          try {
            const body = await response.json();
            if (body?.message) {
              message = body.message;
            }
          } catch (error) {
            console.warn('Não foi possível ler o corpo de erro da resposta.', error);
          }
        }

        throw new ApiRequestError(message, response.status);
      }

      const hasEmptyBody =
        response.status === 204 ||
        response.status === 205 ||
        response.headers.get('content-length') === '0';

      if (hasEmptyBody) {
        return config.fallbackValue as TResponse;
      }

      const responseContentType = response.headers.get('content-type') ?? '';
      const rawBody = await response.text();

      if (!rawBody) {
        return config.fallbackValue as TResponse;
      }

      if (responseContentType.includes('application/json')) {
        try {
          return JSON.parse(rawBody) as TResponse;
        } catch (error) {
          console.warn('Não foi possível parsear a resposta JSON.', error);
          return config.fallbackValue as TResponse;
        }
      }

      if (responseContentType.includes('text/')) {
        return rawBody as unknown as TResponse;
      }

      return config.fallbackValue as TResponse;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async register(data: RegisterData): Promise<void> {
    await this.request<void>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, senha: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });

    if (response.accessToken) {
      this.setToken(response.accessToken);
    }

    return response;
  }

  async logout() {
    this.clearToken();
  }

  async loginWithGoogle() {
    if (typeof window === 'undefined') {
      throw new Error('Login com Google está disponível apenas no navegador.');
    }

    const { clientId, redirectUri } = config.google;

    if (!clientId) {
      throw new Error('Google Client ID não configurado.');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });

    if (response.accessToken) {
      this.setToken(response.accessToken);
    }

    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me', {
      method: 'GET',
    });
  }

  async updateProfile(data: { nome?: string; telefone?: string }): Promise<User> {
    return this.request<User>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Pets
  async registerPet(data: RegisterPetData): Promise<Pet> {
    return this.request<Pet>('/pets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPets(): Promise<Pet[]> {
    return this.request<Pet[]>('/pets', {
      method: 'GET',
    });
  }

  // Admin - Users
  async adminListUsers(): Promise<AdminUser[]> {
    return this.request<AdminUser[]>('/admin/users', { method: 'GET' });
  }

  async adminDisableUser(sub: string): Promise<void> {
    await this.request<void>(`/admin/users/${sub}/disable`, { method: 'POST' });
  }

  async adminEnableUser(sub: string): Promise<void> {
    await this.request<void>(`/admin/users/${sub}/enable`, { method: 'POST' });
  }

  async adminDeleteUser(sub: string): Promise<void> {
    await this.request<void>(`/admin/users/${sub}`, { method: 'DELETE' });
  }

  async adminListUserPets(sub: string): Promise<Pet[]> {
    return this.request<Pet[]>(`/admin/users/${sub}/pets`, { method: 'GET' });
  }

  // Admin - Blocked Dates
  async adminListBlockedDates(): Promise<BlockedDate[]> {
    return this.request<BlockedDate[]>('/admin/blocked-dates', { method: 'GET' });
  }

  async adminCreateBlockedDate(date: string, reason: string): Promise<BlockedDate> {
    return this.request<BlockedDate>('/admin/blocked-dates', {
      method: 'POST',
      body: JSON.stringify({ date, reason }),
    });
  }

  async adminDeleteBlockedDate(id: string): Promise<void> {
    await this.request<void>(`/admin/blocked-dates/${id}`, { method: 'DELETE' });
  }

  async uploadDocument(petId: string, file: File, type: 'vacina' | 'convenio') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = this.resolveToken();
    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${this.baseUrl}/pets/${petId}/documents`, {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

export const api = new ApiService();
