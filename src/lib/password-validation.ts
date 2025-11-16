/**
 * Password validation rules and utilities
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  checks: {
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    noInvalidChars: boolean;
  };
}

const MIN_PASSWORD_LENGTH = 8;

/**
 * Validates a password against security requirements:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (excluding '<' and '>')
 * - No '<' or '>' characters
 */
export function validatePassword(password: string): PasswordValidationResult {
  const checks = {
    hasMinLength: password.length >= MIN_PASSWORD_LENGTH,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,./?]/.test(password),
    noInvalidChars: !/[<>]/.test(password),
  };

  const errors: string[] = [];

  if (!checks.hasMinLength) {
    errors.push(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`);
  }
  if (!checks.hasUpperCase) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  if (!checks.hasLowerCase) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  if (!checks.hasNumber) {
    errors.push('A senha deve conter pelo menos um número');
  }
  if (!checks.hasSpecialChar) {
    errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*...)');
  }
  if (!checks.noInvalidChars) {
    errors.push('A senha não pode conter os caracteres "<" ou ">"');
  }

  return {
    isValid: Object.values(checks).every((check) => check === true),
    errors,
    checks,
  };
}

/**
 * Gets a user-friendly error message for password validation
 */
export function getPasswordErrorMessage(validation: PasswordValidationResult): string {
  if (validation.isValid) {
    return '';
  }

  return validation.errors.join('. ');
}
