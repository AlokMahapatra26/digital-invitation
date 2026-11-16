# 💍 Vivaah - Animated Digital Wedding Invitations

An animated, music-filled digital wedding invitation web platform built entirely on the **Native Cloudflare Stack** (Workers, D1, R2, KV, Pages) using React, Tailwind CSS, Framer Motion, and Hono.

---

## ✨ Features

- 💌 **Interactive Wax Seal & Envelope Reveal**: Breaks seal on click, triggers particle confetti (petals/gold dust), and auto-starts background romantic music conforming to browser audio policies.
- 🎨 **Multiple Cultural & Contemporary Templates**:
  - **Royal Heritage**: Deep crimson, gold foil, mandalas, and royal arch ornamentation.
  - **Botanical Garden**: Watercolor florals, eucalyptus tones, and soft calligraphy.
- 📅 **Multi-Event Schedule**: Haldi, Mehendi, Sangeet, Wedding, Reception with **"Open in Google Maps"** & **"Add to Google/Apple Calendar"**.
- 👥 **Interactive Live Customizer (Builder)**: Split-screen studio with a live interactive mobile device frame updating in real-time as you type.
- ✍️ **Live RSVP & Headcount Tracker**: Collect guest counts, dietary notes, and event attendance synced to Cloudflare D1.
- 📜 **Wishes Wall / Guestbook**: Live stream where friends and family post blessings with optimistic UI updates.
- 💸 **Digital Shagun via UPI**: Display UPI ID with one-click copy and instant QR code generation.
- 🚀 **Cloudflare Native Zero Egress Architecture**: R2 for zero bandwidth egress costs on media/songs, D1 for edge SQLite, KV for sub-15ms slug resolution.

---

## 🛠️ Architecture & Modularity (DRY)

```
wedding-invitation/
├── docs/                        # Complete context & architectural documentation
│   ├── CONTEXT.md               # Vision, user flows, and product philosophy
│   ├── ARCHITECTURE.md          # Cloudflare native stack mapping
│   ├── API.md                   # REST API schemas and edge endpoints
│   └── DEVELOPMENT.md           # Developer & contribution guide
├── migrations/                  # Cloudflare D1 SQL schemas
│   └── 0001_init.sql
├── src/
│   ├── shared/                  # Shared TypeScript interfaces (DRY across client & server)
│   │   ├── types.ts
│   │   └── defaults.ts
│   ├── server/                  # Cloudflare Workers / Hono API
│   │   ├── index.ts
│   │   └── routes/
│   └── client/                  # React + Framer Motion Frontend
│       ├── components/
│       │   ├── common/          # Reusable shared blocks (Wax Seal, RSVP, Audio, Countdown)
│       │   ├── templates/       # Template engines (Royal, Botanical, Switcher)
│       │   └── builder/         # Customizer studio
│       └── pages/               # HomePage, BuilderPage, InvitePage
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Run local development server (Frontend + Hono API on port 5173)
pnpm run dev

# 3. Build for production
pnpm run build

# 4. Deploy to Cloudflare Workers / Pages
pnpm run deploy
```

---

## 📚 Documentation
- [Project Context & Vision](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/docs/CONTEXT.md)
- [Technical Architecture](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/docs/ARCHITECTURE.md)
- [API Documentation](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/docs/API.md)
- [Developer Guide](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/docs/DEVELOPMENT.md)
