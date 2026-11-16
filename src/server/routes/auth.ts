import { Hono } from 'hono';
import { Bindings } from '../types/env';
import { hashPassword, verifyPassword, createToken, verifyToken } from '../lib/crypto';
import { User, WeddingInvitation } from '../../shared/types';
import { memoryStore } from './invitations';

export const authRoute = new Hono<{ Bindings: Bindings }>();

// In-memory user store for dev fallback when D1 is not provisioned
export const userMemoryStore = new Map<string, { user: User; passwordHash: string }>();

// Demo user pre-populated
(async () => {
  const defaultHash = await hashPassword('password123');
  userMemoryStore.set('demo@shubhvivah.com', {
    user: {
      id: 'usr-demo-1',
      email: 'demo@shubhvivah.com',
      name: 'Pooja & Rohan',
      avatarUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      createdAt: new Date().toISOString(),
    },
    passwordHash: defaultHash,
  });
})();

// Helper: Extract Bearer token from header
async function authenticateRequest(c: any): Promise<User | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  const secret = c.env?.JWT_SECRET;
  const payload = await verifyToken<User>(token, secret);
  return payload;
}

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────
authRoute.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Name, email, and password are required' }, 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return c.json({ error: 'Please enter a valid email address' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    // Check if user already exists in D1
    if (c.env?.DB) {
      try {
        const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
          .bind(normalizedEmail)
          .first();
        if (existing) {
          return c.json({ error: 'An account with this email already exists' }, 409);
        }
      } catch (err) {
        console.error('D1 check user error:', err);
      }
    }

    // Check memory store
    if (userMemoryStore.has(normalizedEmail)) {
      return c.json({ error: 'An account with this email already exists' }, 409);
    }

    const userId = `usr-${Date.now()}`;
    const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: userId,
      email: normalizedEmail,
      name: String(name).trim(),
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    // Store in D1 if available
    if (c.env?.DB) {
      try {
        await c.env.DB.prepare(`
          INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `)
          .bind(newUser.id, newUser.email, passwordHash, newUser.name, newUser.role)
          .run();
      } catch (err) {
        console.error('D1 insert user error:', err);
      }
    }

    // Store in memory store
    userMemoryStore.set(normalizedEmail, { user: newUser, passwordHash });

    // Generate JWT Token
    const secret = c.env?.JWT_SECRET;
    const token = await createToken({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, secret);

    return c.json({
      success: true,
      user: newUser,
      token,
    }, 201);
  } catch (err) {
    console.error('Register error:', err);
    return c.json({ error: 'Failed to create account. Please try again.' }, 500);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────
authRoute.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let matchedUser: User | null = null;
    let storedHash: string | null = null;

    // 1. Try D1 Database
    if (c.env?.DB) {
      try {
        const row = await c.env.DB.prepare('SELECT id, email, password_hash, name, avatar_url, role, created_at FROM users WHERE email = ?')
          .bind(normalizedEmail)
          .first();
        if (row) {
          matchedUser = {
            id: row.id as string,
            email: row.email as string,
            name: row.name as string,
            avatarUrl: row.avatar_url as string | undefined,
            role: (row.role as 'user' | 'admin') || 'user',
            createdAt: row.created_at as string,
          };
          storedHash = row.password_hash as string;
        }
      } catch (err) {
        console.error('D1 query error:', err);
      }
    }

    // 2. Check memory store fallback
    if (!matchedUser && userMemoryStore.has(normalizedEmail)) {
      const entry = userMemoryStore.get(normalizedEmail)!;
      matchedUser = entry.user;
      storedHash = entry.passwordHash;
    }

    if (!matchedUser || !storedHash) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Verify password
    const isMatch = await verifyPassword(password, storedHash);
    if (!isMatch) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const secret = c.env?.JWT_SECRET;
    const token = await createToken({
      id: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
    }, secret);

    return c.json({
      success: true,
      user: matchedUser,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ error: 'Failed to sign in. Please try again.' }, 500);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────────
authRoute.get('/me', async (c) => {
  const user = await authenticateRequest(c);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return c.json({ user });
});

// ─────────────────────────────────────────────────────────────
// GET /api/auth/my-invitations
// ─────────────────────────────────────────────────────────────
authRoute.get('/my-invitations', async (c) => {
  const user = await authenticateRequest(c);
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const invitations: WeddingInvitation[] = [];

  // Try D1
  if (c.env?.DB) {
    try {
      const { results } = await c.env.DB.prepare('SELECT data FROM invitations WHERE user_id = ? ORDER BY created_at DESC')
        .bind(user.id)
        .all();
      if (results && results.length > 0) {
        for (const r of results) {
          if (r.data) {
            invitations.push(JSON.parse(r.data as string));
          }
        }
      }
    } catch (err) {
      console.error('D1 query my-invitations error:', err);
    }
  }

  // Memory store fallback
  if (invitations.length === 0) {
    memoryStore.forEach((inv) => {
      if (inv.userId === user.id) {
        invitations.push(inv);
      }
    });
  }

  return c.json({ invitations });
});

