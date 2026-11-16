import { Hono } from 'hono';
import { Bindings } from '../types/env';
import { SAMPLE_INVITATION } from '../../shared/defaults';
import { WeddingInvitation } from '../../shared/types';

export const invitationsRoute = new Hono<{ Bindings: Bindings }>();

// In-memory fallback for local dev when D1 is not provisioned
const memoryStore = new Map<string, WeddingInvitation>();
memoryStore.set(SAMPLE_INVITATION.slug, SAMPLE_INVITATION);

// GET /api/invitations/:slug
invitationsRoute.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  // 1. Try KV cache if configured
  if (c.env.KV_CACHE) {
    try {
      const cached = await c.env.KV_CACHE.get(`invite:${slug}`, 'json');
      if (cached) return c.json(cached);
    } catch {
      // Continue to DB
    }
  }

  // 2. Try D1 Database if configured
  if (c.env.DB) {
    try {
      const stmt = c.env.DB.prepare('SELECT data FROM invitations WHERE slug = ?');
      const row = await stmt.bind(slug).first();
      if (row && row.data) {
        const parsed = JSON.parse(row.data as string);
        return c.json(parsed);
      }
    } catch (err) {
      console.error('D1 query error:', err);
    }
  }

  // 3. Check memory store or fallback sample
  if (memoryStore.has(slug)) {
    return c.json(memoryStore.get(slug));
  }

  if (slug === 'ananya-and-karan' || slug === 'demo') {
    return c.json(SAMPLE_INVITATION);
  }

  return c.json({ error: 'Invitation not found' }, 404);
});

// POST /api/invitations
invitationsRoute.post('/', async (c) => {
  try {
    const body = (await c.req.json()) as WeddingInvitation;

    if (!body.slug || !body.couple?.bride?.name || !body.couple?.groom?.name) {
      return c.json({ error: 'Missing required invitation fields' }, 400);
    }

    const id = body.id || `inv-${Date.now()}`;
    const invitationData: WeddingInvitation = {
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    // Save in D1 if available
    if (c.env.DB) {
      try {
        const stmt = c.env.DB.prepare(`
          INSERT INTO invitations (id, slug, template_id, data, updated_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(slug) DO UPDATE SET
            template_id = excluded.template_id,
            data = excluded.data,
            updated_at = CURRENT_TIMESTAMP
        `);
        await stmt.bind(id, body.slug, body.theme.templateId, JSON.stringify(invitationData)).run();
      } catch (err) {
        console.error('Failed to write to D1:', err);
      }
    }

    // Save in KV cache if available
    if (c.env.KV_CACHE) {
      try {
        await c.env.KV_CACHE.put(`invite:${body.slug}`, JSON.stringify(invitationData), {
          expirationTtl: 86400 * 30, // 30 days
        });
      } catch (err) {
        console.error('Failed to write to KV:', err);
      }
    }

    // Always keep memory store updated
    memoryStore.set(body.slug, invitationData);

    return c.json({
      success: true,
      id,
      slug: body.slug,
      url: `/invite/${body.slug}`,
      data: invitationData,
    }, 201);
  } catch {
    return c.json({ error: 'Invalid payload' }, 400);
  }
});
