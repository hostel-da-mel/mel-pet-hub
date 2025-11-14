/**
 * Phone mask utilities for Brazilian phone numbers
 */

/**
 * Formats a phone number with Brazilian mask
 * Examples:
 * - 11 digits: (11) 98765-4321
 * - 10 digits: (11) 8765-4321
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');

  // Apply mask based on length
  if (numbers.length <= 10) {
    // (XX) XXXX-XXXX
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 14);
  } else {
    // (XX) XXXXX-XXXX
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  }
}

/**
 * Removes mask from phone number, leaving only digits
 */
export function unmaskPhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validates if phone number has correct length (10 or 11 digits)
 */
export function isValidPhoneNumber(value: string): boolean {
  const numbers = unmaskPhoneNumber(value);
  return numbers.length === 10 || numbers.length === 11;
}
