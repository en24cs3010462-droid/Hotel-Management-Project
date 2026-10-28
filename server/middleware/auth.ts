import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { UserRole } from '../models/types.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'hotelpro_jwt_secret_super_secure_key_2026';

export interface AuthUserPayload {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    req.user = undefined;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUserPayload;
    // Verify user still exists
    const user = db.findUserById(decoded._id);
    if (user) {
      req.user = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    }
  } catch {
    req.user = undefined;
  }

  next();
};

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    return;
  }
  next();
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}] roles.`
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireStaffOrAdmin = requireRole('admin', 'staff');
