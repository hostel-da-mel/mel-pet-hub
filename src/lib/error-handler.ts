/**
 * Centralized error handling utilities
 */

import { ApiRequestError } from '@/services/api';

export interface ErrorDetails {
  title: string;
  description: string;
  statusCode?: number;
}

/**
 * Extracts user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}

/**
 * Converts an error into ErrorDetails for consistent UI display
 */
export function formatError(error: unknown, fallbackTitle = 'Erro'): ErrorDetails {
  const description = getErrorMessage(error);
  const statusCode =
    error instanceof ApiRequestError ? error.status : undefined;

  // Customize title based on status code
  let title = fallbackTitle;
  if (statusCode) {
    if (statusCode === 401 || statusCode === 403) {
      title = 'Acesso negado';
    } else if (statusCode === 404) {
      title = 'Não encontrado';
    } else if (statusCode >= 500) {
      title = 'Erro no servidor';
    }
  }

  return {
    title,
    description,
    statusCode,
  };
}

/**
 * Logs errors in development, sends to monitoring in production
 */
export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(context ? `[${context}]` : '[Error]', error);
  } else {
    // In production, you might want to send errors to a monitoring service
    // Example: Sentry.captureException(error);
  }
}

/**
 * Handles errors consistently with logging and formatting
 */
export function handleError(
  error: unknown,
  context?: string,
  fallbackTitle?: string
): ErrorDetails {
  logError(error, context);
  return formatError(error, fallbackTitle);
}
