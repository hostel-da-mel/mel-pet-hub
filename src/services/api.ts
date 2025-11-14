import { config } from '@/config/environment';

interface ApiError {
  message: string;
  status: number;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = config.apiUrl, initialToken?: string | null) {
    this.baseUrl = baseUrl;
    this.token = initialToken ?? null;
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage;
    } catch (error) {
      console.warn('Unable to access localStorage:', error);
      return null;
    }
  }

  private getStoredToken(): string | null {
    const storage = this.getStorage();
    return storage?.getItem('auth_token') ?? null;
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

    if (!persist) {
      return;
    }

    const storage = this.getStorage();
    storage?.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    const storage = this.getStorage();
    storage?.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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

      if (!response.ok) {
        const error: ApiError = {
          message: `Erro na requisição: ${response.statusText}`,
          status: response.status,
        };
        throw error;
      }

      return await response.json();
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
      throw new Error('Google login is only available in the browser.');
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
