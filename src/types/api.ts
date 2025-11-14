/**
 * API Types and Interfaces
 */

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  aniversario?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface Pet {
  id: string;
  nome: string;
  raca: string;
  peso: number;
  aniversario?: string;
  frequenta_creche: boolean;
  adestrado: boolean;
  castrado: boolean;
  alimentacao?: string;
  usuario_id: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  aniversario?: string;
  senha: string;
}

export interface RegisterPetData {
  nome: string;
  raca: string;
  peso: number;
  aniversario?: string;
  frequenta_creche: boolean;
  adestrado: boolean;
  castrado: boolean;
  alimentacao?: string;
}

export interface Document {
  id: string;
  pet_id: string;
  type: 'vacina' | 'convenio';
  file_path: string;
  created_at: string;
}
