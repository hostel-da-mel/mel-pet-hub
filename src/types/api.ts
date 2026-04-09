/**
 * API Types and Interfaces
 */

export interface User {
  id: string;
  sub: string;
  nome: string;
  email: string;
  telefone: string;
  role: string;
  provider?: string;
  endereco?: string;
  aniversario?: string;
  picture?: string;
}

export interface AdminUser {
  sub: string;
  nome: string;
  email: string;
  telefone: string;
  role: string;
  status: string;
  email_verified: boolean;
  created_at: string;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  accessToken: string;
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
  observacoes?: string;
  foto?: string;
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
  observacoes?: string;
}

export interface UpdatePetData extends RegisterPetData {
  foto?: string;
}

export interface PetDocument {
  key: string;
  name: string;
  size: number;
  last_modified: string;
  url: string;
}

export interface BookingPet {
  id: string;
  nome: string;
}

export interface Booking {
  id: string;
  usuario_id: string;
  usuario_nome: string;
  usuario_email: string;
  pets: BookingPet[];
  data_entrada: string;
  periodo: string;
  duracao: number;
  valor_total: number;
  pagamento: string;
  status: 'pendente' | 'confirmada' | 'rejeitada';
  motivo_rejeicao?: string;
  created_at: string;
  updated_at: string;
}
