import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  body: any;
  params: any;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token tidak valid atau sudah expired' });
  }
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Akses ditolak. Hanya admin yang dapat mengakses.' });
  }
  next();
}