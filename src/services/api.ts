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
