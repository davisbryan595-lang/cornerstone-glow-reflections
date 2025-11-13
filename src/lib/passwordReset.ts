import db from './database';

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

export async function generatePasswordResetToken(userId: string): Promise<string> {
  const token = generateRandomString(64);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await db.passwordResetTokens.create(userId, token, expiresAt);
  return token;
}

export async function validatePasswordResetToken(token: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  try {
    const resetToken = await db.passwordResetTokens.getByToken(token);

    if (!resetToken) {
      return { valid: false, error: 'Invalid or expired reset token' };
    }

    if (resetToken.used_at) {
      return { valid: false, error: 'This reset token has already been used' };
    }

    const expiresAt = new Date(resetToken.expires_at);
    if (expiresAt < new Date()) {
      return { valid: false, error: 'Reset token has expired' };
    }

    return { valid: true, userId: resetToken.user_id };
  } catch (error) {
    return { valid: false, error: 'Error validating reset token' };
  }
}

export function generateSimpleToken(): string {
  return generateRandomString(32);
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === hash;
}
