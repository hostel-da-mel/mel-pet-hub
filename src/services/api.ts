import { config } from '@/config/environment';

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

  constructor() {
    this.baseUrl = config.apiUrl;
    this.token = this.storage?.getItem('auth_token') ?? null;
  }

  private get storage(): Storage | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    return window.localStorage;
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
    this.storage?.setItem('auth_token', token);
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
        return undefined as T;
      }

      const contentType = response.headers.get('content-type') ?? '';
      const rawBody = await response.text();

      if (!rawBody) {
        return undefined as T;
      }

      if (contentType.includes('application/json')) {
        try {
          return JSON.parse(rawBody) as T;
        } catch (error) {
          console.warn('Não foi possível parsear a resposta JSON.', error);
          return undefined as T;
        }
      }

      if (contentType.includes('text/')) {
        return rawBody as unknown as T;
      }

      return undefined as T;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async register(data: {
    nome: string;
    telefone: string;
    email: string;
    endereco: string;
    aniversario?: string;
    senha: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(
    email: string,
    senha: string
  ): Promise<{ token: string; user: any } | undefined> {
    const response = await this.request<{ token: string; user: any } | undefined>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      }
    );

    if (response?.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    this.clearToken();
  }

  async loginWithGoogle() {
    // Redirect to Google OAuth endpoint
    if (typeof window === 'undefined') {
      throw new Error('Login com Google está disponível apenas no navegador.');
    }

    window.location.href = `${this.baseUrl}/auth/google`;
  }

  async handleGoogleCallback(
    code: string
  ): Promise<{ token: string; user: any } | undefined> {
    const response = await this.request<{ token: string; user: any } | undefined>(
      '/auth/google/callback',
      {
        method: 'POST',
        body: JSON.stringify({ code }),
      }
    );

    if (response?.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async getCurrentUser<T = any>(): Promise<T | undefined> {
    return this.request<T | undefined>('/auth/me', {
      method: 'GET',
    });
  }

  // Pets
  async registerPet(data: {
    nome: string;
    raca: string;
    peso: number;
    aniversario?: string;
    frequenta_creche: boolean;
    adestrado: boolean;
    castrado: boolean;
    alimentacao?: string;
  }) {
    return this.request('/pets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPets() {
    return this.request('/pets', {
      method: 'GET',
    });
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
