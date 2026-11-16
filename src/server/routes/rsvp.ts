import { Hono } from 'hono';
import { Bindings } from '../types/env';
import { RSVPRecord } from '../../shared/types';

export const rsvpRoute = new Hono<{ Bindings: Bindings }>();

// In-memory fallback
const memoryRsvps = new Map<string, RSVPRecord[]>();

// GET /api/rsvp/:slug
rsvpRoute.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  if (c.env.DB) {
    try {
      const stmt = c.env.DB.prepare(`
        SELECT r.* FROM rsvps r
        JOIN invitations i ON r.invitation_id = i.id
        WHERE i.slug = ?
        ORDER BY r.created_at DESC
      `);
      const { results } = await stmt.bind(slug).all();
      const mapped: RSVPRecord[] = (results || []).map((row: any) => ({
        id: row.id,
        invitationId: row.invitation_id,
        guestName: row.guest_name,
        attending: Boolean(row.attending),
        guestCount: row.guest_count,
        eventIds: row.event_ids ? JSON.parse(row.event_ids) : [],
        dietary: row.dietary,
        message: row.message,
        createdAt: row.created_at,
      }));
      return c.json(mapped);
    } catch (err) {
      console.error('Failed to query RSVPs from D1:', err);
    }
  }

  return c.json(memoryRsvps.get(slug) || []);
});

// POST /api/rsvp/:slug
rsvpRoute.post('/:slug', async (c) => {
  const slug = c.req.param('slug');
  try {
    const body = await c.req.json();
    if (!body.guestName) {
      return c.json({ error: 'Guest name is required' }, 400);
    }

    const record: RSVPRecord = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      invitationId: slug,
      guestName: body.guestName,
      attending: body.attending !== false,
      guestCount: Number(body.guestCount) || 1,
      eventIds: Array.isArray(body.eventIds) ? body.eventIds : [],
      dietary: body.dietary || '',
      message: body.message || '',
      createdAt: new Date().toISOString(),
    };

    if (c.env.DB) {
      try {
        const stmt = c.env.DB.prepare(`
          INSERT INTO rsvps (id, invitation_id, guest_name, attending, guest_count, event_ids, dietary, message)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        await stmt.bind(
          record.id,
          slug,
          record.guestName,
          record.attending ? 1 : 0,
          record.guestCount,
          JSON.stringify(record.eventIds),
          record.dietary,
          record.message
        ).run();
      } catch (err) {
        console.error('Failed to save RSVP to D1:', err);
      }
    }

    const current = memoryRsvps.get(slug) || [];
    memoryRsvps.set(slug, [record, ...current]);

    return c.json({ success: true, rsvp: record }, 201);
  } catch {
    return c.json({ error: 'Invalid RSVP payload' }, 400);
  }
});

