import { config } from '@/config/environment';

interface ApiError {
  message: string;
  status: number;
}

interface RequestConfig<TResponse> {
  fallbackValue?: TResponse;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = config.apiUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
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

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('Content-Type') ?? '';
      const isJsonResponse = contentType.includes('application/json');

      if (!response.ok) {
        let errorMessage = `Erro na requisição: ${response.statusText}`;

        if (isJsonResponse) {
          try {
            const errorBody = await response.json();
            if (errorBody?.message) {
              errorMessage = errorBody.message;
            }
          } catch (parseError) {
            console.warn('Erro ao ler resposta JSON de erro:', parseError);
          }
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
        };
        throw error;
      }

      const hasBody =
        response.status !== 204 &&
        response.status !== 205 &&
        response.status !== 304 &&
        options.method?.toUpperCase() !== 'HEAD';

      const hasCustomFallback = Object.prototype.hasOwnProperty.call(
        config,
        'fallbackValue'
      );

      if (!hasBody || !isJsonResponse) {
        if (hasCustomFallback) {
          return config.fallbackValue as TResponse;
        }

        return undefined as TResponse;
      }

      return (await response.json()) as TResponse;
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
