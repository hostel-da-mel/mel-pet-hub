import { config } from '@/config/environment';

interface ApiError {
  message: string;
  status: number;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = config.apiUrl;
    this.token = this.storage?.getItem('auth_token') ?? null;
  }

  hydrateFromStorage() {
    const storedToken = this.storage?.getItem('auth_token') ?? null;

    if (storedToken) {
      this.token = storedToken;
      return;
    }

    if (!storedToken) {
      this.token = null;
    }
  }

  private get storage(): Storage | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    return window.localStorage;
  }

  setToken(token: string) {
    this.token = token;
    this.storage?.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    this.storage?.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

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

        const error: ApiError = {
          message,
          status: response.status,
        };
        throw error;
      }

      if (response.status === 204 || response.status === 205) {
        return undefined as T;
      }

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        return (await response.json()) as T;
      }

      if (contentType?.includes('text/')) {
        return (await response.text()) as unknown as T;
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

  async login(email: string, senha: string) {
    const response = await this.request<{ token: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      }
    );
    
    if (response.token) {
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

  async handleGoogleCallback(code: string) {
    const response = await this.request<{ token: string; user: any }>(
      '/auth/google/callback',
      {
        method: 'POST',
        body: JSON.stringify({ code }),
      }
    );
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me', {
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

    return fetch(`${this.baseUrl}/pets/${petId}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });
  }
}

export const api = new ApiService();
