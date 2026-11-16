import { Hono } from 'hono';
import { Bindings } from '../types/env';
import { WishRecord } from '../../shared/types';

export const wishesRoute = new Hono<{ Bindings: Bindings }>();

// Seed default wishes for demo
const memoryWishes = new Map<string, WishRecord[]>();
memoryWishes.set('ananya-and-karan', [
  {
    id: 'wish-1',
    invitationId: 'ananya-and-karan',
    senderName: 'Uncle Ramesh & Family',
    relation: "Bride's Family",
    message: 'May your union be blessed with lifelong companionship, smiles, and overflowing prosperity! Heartiest congratulations to both families.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'wish-2',
    invitationId: 'ananya-and-karan',
    senderName: 'Rohit & Tanya',
    relation: 'College Buddies',
    message: 'Still cannot believe the coffee shop guy got the girl! So thrilled for you two, counting down the days for the Sangeet dance floor! 🕺💃',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
]);

// GET /api/wishes/:slug
wishesRoute.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  if (c.env.DB) {
    try {
      const stmt = c.env.DB.prepare(`
        SELECT w.* FROM wishes w
        JOIN invitations i ON w.invitation_id = i.id
        WHERE i.slug = ?
        ORDER BY w.created_at DESC
      `);
      const { results } = await stmt.bind(slug).all();
      const mapped: WishRecord[] = (results || []).map((row: any) => ({
        id: row.id,
        invitationId: row.invitation_id,
        senderName: row.sender_name,
        relation: row.relation,
        message: row.message,
        createdAt: row.created_at,
      }));
      return c.json(mapped);
    } catch (err) {
      console.error('Failed to query wishes from D1:', err);
    }
  }

  return c.json(memoryWishes.get(slug) || []);
});

// POST /api/wishes/:slug
wishesRoute.post('/:slug', async (c) => {
  const slug = c.req.param('slug');
  try {
    const body = await c.req.json();
    if (!body.senderName || !body.message) {
      return c.json({ error: 'Sender name and message are required' }, 400);
    }

    const record: WishRecord = {
      id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      invitationId: slug,
      senderName: body.senderName,
      relation: body.relation || '',
      message: body.message,
      createdAt: new Date().toISOString(),
    };

    if (c.env.DB) {
      try {
        const stmt = c.env.DB.prepare(`
          INSERT INTO wishes (id, invitation_id, sender_name, relation, message)
          VALUES (?, ?, ?, ?, ?)
        `);
        await stmt.bind(
          record.id,
          slug,
          record.senderName,
          record.relation,
          record.message
        ).run();
      } catch (err) {
        console.error('Failed to save wish to D1:', err);
      }
    }

    const current = memoryWishes.get(slug) || [];
    memoryWishes.set(slug, [record, ...current]);

    return c.json({ success: true, wish: record }, 201);
  } catch {
    return c.json({ error: 'Invalid wish payload' }, 400);
  }
});

