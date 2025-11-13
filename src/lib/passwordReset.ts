import crypto from 'crypto';
import db from './database';

export async function generatePasswordResetToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
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
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
