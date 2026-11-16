import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types/env';
import { invitationsRoute } from './routes/invitations';
import { rsvpRoute } from './routes/rsvp';
import { wishesRoute } from './routes/wishes';

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for development and cross-origin embed
app.use('/api/*', cors());

// Health Check
app.get('/api/health', (c) => c.json({ status: 'ok', runtime: 'cloudflare-worker', time: new Date().toISOString() }));

// Mount Modular Routes
app.route('/api/invitations', invitationsRoute);
app.route('/api/rsvp', rsvpRoute);
app.route('/api/wishes', wishesRoute);

export default app;

