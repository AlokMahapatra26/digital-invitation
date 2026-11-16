# Developer Guide & Contribution Handbook

## 1. Quick Start
```bash
# Install dependencies
pnpm install

# Start Unified Dev Server (Frontend + Edge Hono API on port 5173)
pnpm run dev

# Build for production
pnpm run build

# Deploy directly to Cloudflare
pnpm run deploy
```

---

## 2. Cloudflare D1 Local Migrations
The database schema is stored in [migrations/0001_init.sql](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/migrations/0001_init.sql).

To run migrations locally with Wrangler:
```bash
pnpm run d1:migrate
```

To run migrations against production Cloudflare D1:
```bash
pnpm run d1:migrate:prod
```

---

## 3. How to Add a New Template (DRY Principle)

Because the project strictly adheres to DRY:
1. All templates share common interactive widgets:
   - [EnvelopeOpening.tsx](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/src/client/components/common/EnvelopeOpening.tsx): Wax seal and unfold physics.
   - [CountdownTimer.tsx](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/src/client/components/common/CountdownTimer.tsx): Symmetrical countdown clock.
   - [EventCard.tsx](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/src/client/components/common/EventCard.tsx): Event badge, time, address, Google Maps & Calendar buttons.
   - [RSVPModal.tsx](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/src/client/components/common/RSVPModal.tsx): Interactive attendance collector.
   - [WishesWall.tsx](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/src/client/components/common/WishesWall.tsx): Live guestbook wall.
   - [GiftRegistryModal.tsx](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/src/client/components/common/GiftRegistryModal.tsx): Digital Shagun UPI QR code.

2. To add a new template (e.g. `MinimalistEditorial.tsx`):
   - Create `src/client/components/templates/MinimalistEditorial.tsx` implementing `TemplateProps`.
   - Register the template ID in `src/shared/types.ts` (`TemplateId`).
   - Add the case in [TemplateRenderer.tsx](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/src/client/components/templates/TemplateRenderer.tsx).
   - Add the template option button inside [BuilderForm.tsx](file:///home/alok/All%20projects/Davlabs%20Projects/Our%20Projects/wedding-invitation/src/client/components/builder/BuilderForm.tsx).
