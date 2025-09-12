import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.CUSTOMER_JWT_SECRET || 'customer-secret-key-change-in-production';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export interface CustomerJWTPayload {
  customer_id: string;
  email: string;
  session_id: string;
}

export class CustomerAuth {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static createJWT(payload: CustomerJWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: '30d',
      issuer: 'layniefae',
      audience: 'customer'
    });
  }

  static verifyJWT(token: string): CustomerJWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'layniefae',
        audience: 'customer'
      }) as CustomerJWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static getSessionExpiration(): Date {
    return new Date(Date.now() + SESSION_DURATION);
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isStrongPassword(password: string): { 
    valid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static sanitizeName(name: string): string {
    return name.trim().replace(/[<>\"'&]/g, '');
  }

  static validatePhoneNumber(phone: string): boolean {
    // Basic US phone number validation
    const phoneRegex = /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static formatPhoneNumber(phone: string): string {
    // Format to (XXX) XXX-XXXX
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  }
}