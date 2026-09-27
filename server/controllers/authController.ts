import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { config } from '../config/config.js';
import { isDbConnected } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

// In-memory user fallback store when MongoDB is in memory/offline mode
const inMemoryUsers: Map<string, { id: string; name: string; email: string; passwordHash: string; createdAt: Date }> = new Map();

// Pre-seeded demo accounts
const DEMO_CREDENTIALS = [
  {
    name: 'Commander Shepard',
    email: 'shepard@normandy.space',
    password: 'NormandyMission2026!',
    role: 'commander',
  },
  {
    name: 'Astra Flight Director',
    email: 'admin@astra.space',
    password: 'AstraMission2026!',
    role: 'commander',
  }
];

// Initialize demo users
(async () => {
  try {
    for (const demo of DEMO_CREDENTIALS) {
      const passwordHash = await bcrypt.hash(demo.password, 10);
      inMemoryUsers.set(demo.email.toLowerCase(), {
        id: `demo_${demo.email.split('@')[0]}`,
        name: demo.name,
        email: demo.email.toLowerCase(),
        passwordHash,
        createdAt: new Date(),
      });
    }
  } catch (err) {
    console.error('Error seeding in-memory demo users:', err);
  }
})();

function generateToken(userId: string, email: string, name: string): string {
  return jwt.sign(
    { userId, email, name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

export class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ success: false, message: 'Full name is required.' });
        return;
      }

      if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        res.status(400).json({ success: false, message: 'A valid mission email address is required.' });
        return;
      }

      if (!password || password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters in length.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check MongoDB
      if (isDbConnected()) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
          return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
          role: 'commander',
        });

        const token = generateToken(newUser._id.toString(), newUser.email, newUser.name);

        res.status(201).json({
          success: true,
          message: 'Commander registration successful.',
          token,
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt,
          },
        });
        return;
      }

      // Memory Store Fallback
      if (inMemoryUsers.has(normalizedEmail)) {
        res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = `user_mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const memUser = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        createdAt: new Date(),
      };
      inMemoryUsers.set(normalizedEmail, memUser);

      const token = generateToken(userId, memUser.email, memUser.name);

      res.status(201).json({
        success: true,
        message: 'Commander registration successful.',
        token,
        user: {
          id: userId,
          name: memUser.name,
          email: memUser.email,
          role: 'commander',
          createdAt: memUser.createdAt,
        },
      });
    } catch (error: any) {
      console.error('[Auth Register Error]', error);
      res.status(500).json({ success: false, message: 'Registration failed due to an internal server error.' });
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password credentials are required.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check MongoDB
      if (isDbConnected()) {
        let user = await User.findOne({ email: normalizedEmail });
        
        // Auto-seed demo credentials if first time logging in with demo account
        if (!user) {
          const matchingDemo = DEMO_CREDENTIALS.find(d => d.email.toLowerCase() === normalizedEmail);
          if (matchingDemo && matchingDemo.password === password) {
            const passwordHash = await bcrypt.hash(password, 10);
            user = await User.create({
              name: matchingDemo.name,
              email: matchingDemo.email.toLowerCase(),
              passwordHash,
              role: matchingDemo.role,
            });
          }
        }

        if (!user) {
          res.status(401).json({ success: false, message: 'Invalid email or access passcode.' });
          return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          res.status(401).json({ success: false, message: 'Invalid email or access passcode.' });
          return;
        }

        const token = generateToken(user._id.toString(), user.email, user.name);

        res.json({
          success: true,
          message: 'Access granted. Welcome back, Commander.',
          token,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        });
        return;
      }

      // Memory Store Fallback
      const memUser = inMemoryUsers.get(normalizedEmail);
      if (!memUser) {
        res.status(401).json({ success: false, message: 'Invalid email or access passcode.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, memUser.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or access passcode.' });
        return;
      }

      const token = generateToken(memUser.id, memUser.email, memUser.name);

      res.json({
        success: true,
        message: 'Access granted. Welcome back, Commander.',
        token,
        user: {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          role: 'commander',
          createdAt: memUser.createdAt,
        },
      });
    } catch (error: any) {
      console.error('[Auth Login Error]', error);
      res.status(500).json({ success: false, message: 'Authentication failed due to an internal server error.' });
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Not authenticated.' });
        return;
      }

      if (isDbConnected()) {
        const user = await User.findById(userId).select('-passwordHash');
        if (!user) {
          res.status(404).json({ success: false, message: 'User profile not found.' });
          return;
        }

        res.json({
          success: true,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        });
        return;
      }

      // Memory fallback lookup
      let foundMem: any = null;
      inMemoryUsers.forEach((u) => {
        if (u.id === userId) foundMem = u;
      });

      if (!foundMem && req.user) {
        foundMem = { id: req.user.id, name: req.user.name, email: req.user.email, role: 'commander' };
      }

      if (!foundMem) {
        res.status(404).json({ success: false, message: 'User profile not found.' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: foundMem.id,
          name: foundMem.name,
          email: foundMem.email,
          role: foundMem.role || 'commander',
        },
      });
    } catch (error: any) {
      console.error('[Auth GetMe Error]', error);
      res.status(500).json({ success: false, message: 'Failed to verify session profile.' });
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'Mission session closed successfully.',
    });
  }
}
