# Technical Architecture: Cloudflare Native Stack

## 1. Cloudflare Stack Mapping

| Layer | Cloudflare Service | Responsibility |
| :--- | :--- | :--- |
| **Compute & API** | Cloudflare Workers | Edge server running Hono API router. |
| **Database** | Cloudflare D1 | Serverless SQLite at the edge for invitations, RSVPs, and wishes. |
| **Media / Storage** | Cloudflare R2 | S3-compatible asset store for photos and audio tracks with $0 egress fees. |
| **Edge Cache / Routing**| Cloudflare KV | O(1) slug resolution (`/invite/:slug` -> invite ID) without hitting DB. |
| **Frontend UI** | Cloudflare Pages / Workers Static Assets | React 19 + Vite SPA with client routing, Framer Motion, and Tailwind CSS. |

---

## 2. Directory Structure

```
wedding-invitation/
├── docs/                        # Project context, architecture, and API documentation
│   ├── CONTEXT.md
│   ├── ARCHITECTURE.md
│   └── API.md
├── wrangler.jsonc               # Cloudflare configuration (D1, R2, KV bindings)
├── migrations/                  # D1 SQL schemas
│   ├── 0001_init.sql
│   └── 0002_auth.sql
├── src/
│   ├── server/                  # Cloudflare Workers / Hono API
│   │   ├── index.ts             # Hono app entry point
│   │   ├── lib/
│   │   │   └── crypto.ts        # Edge-native Web Crypto SHA-256 + HMAC JWT
│   │   ├── routes/              # Modular API routes
│   │   │   ├── auth.ts          # Register, Login, Me, My-Invitations
│   │   │   ├── invitations.ts   # CRUD operations for invitations
│   │   │   ├── rsvp.ts          # RSVP management and counters
│   │   │   └── wishes.ts        # Guestbook live wishes
│   │   ├── db/                  # D1 query helpers and database bindings
│   │   └── types/               # Server environment bindings (DB, R2, KV)
│   ├── shared/                  # Shared data schemas and types between Client & Server
│   │   └── types.ts
│   └── client/                  # React Frontend (Vite)
│       ├── index.html
│       ├── src/
│       │   ├── App.tsx          # Client router
│       │   ├── hooks/           # Reusable stateful hooks (useAudio, useCountdown, useWishes)
│       │   ├── lib/             # API client, audio helpers, storage utilities
│       │   ├── components/
│       │   │   ├── ui/          # Generic atomic UI components
│       │   │   ├── common/      # Shared animated components (AudioPlayer, PetalsCanvas, Countdown)
│       │   │   ├── templates/   # Template Engines (Royal, Botanical, Minimalist, etc.)
│       │   │   └── builder/     # Multi-step creation wizard & live split preview
│       │   └── pages/
│       │       ├── HomePage.tsx       # Landing page & showcase
│       │       ├── BuilderPage.tsx    # Live customizer
│       │       └── InvitePage.tsx     # Guest invitation view
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 3. Data Flow & DRY Component Design

All templates implement the standardized `TemplateProps` interface:
```typescript
interface TemplateProps {
  data: WeddingInvitation;
  previewMode?: boolean;
}
```

This guarantees:
1. **DRY Principle**: Adding a new template only requires creating a single visual layout component that consumes existing shared blocks (`EnvelopeOpening`, `WishesWall`, `RSVPModal`, `CountdownTimer`, `AudioPlayer`, `EventCard`).
2. **Unified Preview**: The Builder page renders the exact same template component in real-time as the guest page does in production.

