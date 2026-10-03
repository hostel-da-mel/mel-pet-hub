import type { Pet } from '@/types/api';

export const daycareOptions = [
  { value: 'duas_vezes_semana', label: '2 vezes por semana' },
  { value: 'diariamente', label: 'Diariamente' },
  { value: 'esporadicamente', label: 'Esporadicamente' },
  { value: 'nao', label: 'Não frequenta' },
] as const;

export type DaycareFrequency = typeof daycareOptions[number]['value'];

export function getDaycareFrequency(pet: Pet): DaycareFrequency | '' {
  return pet.frequencia_creche || (pet.frequenta_creche ? '' : 'nao');
}

export function daycareLabel(pet: Pet): string {
  return daycareOptions.find(option => option.value === getDaycareFrequency(pet))?.label
    || 'Frequência não informada';
}
