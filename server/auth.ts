import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from './db.ts';
import { User, UserRole } from '../src/types/index.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'manav-secure-production-jwt-secret-2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generatePairingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MN-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function hashPassword(password: string): Promise<string> {
  // CRITICAL: Preserve exact case sensitivity. Never alter password string before hashing!
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  // CRITICAL: Preserve exact case sensitivity. bcrypt.compare performs exact byte comparison.
  return bcrypt.compare(password, hash);
}

export function createToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function extractTokenFromRequest(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // Check Cookie header (e.g. auth_token=...)
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, c) => {
      const [key, val] = c.trim().split('=');
      if (key && val) acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    if (cookies.auth_token) {
      return cookies.auth_token;
    }
  }

  return null;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await db.users.findById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'User session expired or invalid. Please sign in again.' });
      return;
    }
    if (!user.isVerified) {
      res.status(403).json({ error: 'Please verify your email address before logging in. Check your inbox for the verification link.' });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

export function requireRole(allowedRole: UserRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (req.user.role !== allowedRole) {
      res.status(403).json({ error: `Access denied. ${allowedRole.toUpperCase()} permission required.` });
      return;
    }
    next();
  };
}
