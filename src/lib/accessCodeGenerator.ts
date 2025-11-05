// Access Code Generator & Validator
// Generates unique codes for member access to their dashboard

export interface AccessCodeGenOptions {
  prefix?: string;
  length?: number;
}

/**
 * Generate a unique access code for members
 * Format: PREFIX-XXXXXXXX (e.g., MEM-ABC123XY)
 */
export function generateAccessCode(options?: AccessCodeGenOptions): string {
  const prefix = options?.prefix || "MEM";
  const length = options?.length || 8;

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return `${prefix}-${code}`;
}

/**
 * Validate access code format
 */
export function isValidAccessCodeFormat(code: string): boolean {
  // Format: PREFIX-XXXXXXXX (e.g., MEM-ABC123XY)
  const pattern = /^[A-Z]+-[A-Z0-9]+$/;
  return pattern.test(code);
}

/**
 * Format access code with dashes for display
 */
export function formatAccessCode(code: string): string {
  // Remove any existing dashes
  const clean = code.replace(/-/g, "");

  // Add dash after every 4 characters
  if (clean.length <= 4) {
    return clean;
  }

  const parts = [];
  for (let i = 0; i < clean.length; i += 4) {
    parts.push(clean.substring(i, i + 4));
  }

  return parts.join("-");
}

/**
 * Generate a batch of access codes
 */
export function generateAccessCodeBatch(count: number, prefix?: string): string[] {
  const codes: Set<string> = new Set();

  while (codes.size < count) {
    codes.add(generateAccessCode({ prefix }));
  }

  return Array.from(codes);
}

/**
 * Calculate access code expiration date
 * Default: 365 days from now
 */
export function calculateAccessCodeExpiration(days: number = 365): Date {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  return expirationDate;
}

/**
 * Check if access code is expired
 */
export function isAccessCodeExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

/**
 * Get remaining validity days for an access code
 */
export function getAccessCodeRemainingDays(expiresAt: string): number {
  const now = new Date();
  const expiration = new Date(expiresAt);
  const diffTime = expiration.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
