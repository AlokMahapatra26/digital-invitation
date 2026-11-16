# Project Context: Animated Digital Wedding Invitation Platform

## 1. Vision & Purpose
A high-aesthetic, mobile-first digital wedding invitation web platform built entirely on the **native Cloudflare stack**. 
The platform empowers couples to:
1. Select from visually rich, culture-informed, animated templates (Royal Heritage, Floral Botanical, Modern Editorial, Celestial).
2. Customize wedding details, events (Haldi, Mehendi, Sangeet, Ceremony, Reception), couple story, pre-wedding photo gallery, and background music in an intuitive live builder.
3. Publish and share unique, animated guest invitation links with rich WhatsApp preview cards, live RSVP collection, Google/Apple Maps integration, calendar sync, and an interactive wishes guestbook.

---

## 2. Core User Personas & Flows

### A. The Invitee / Guest Flow
```
[WhatsApp / Link Click] 
         │
         ▼
[Envelope / Wax Seal Screen] ──(Tap to Unfold)──► [Plays Background Music & Spawns Petals/Confetti]
                                                        │
                                                        ▼
                                           [Smooth Animated Story Scroll]
                                             • Hero & Countdown Timer
                                             • Bride & Groom Story
                                             • Multi-Event Schedule + "Add to Calendar"
                                             • Interactive Venue Map Pins
                                             • Pre-wedding Photo Gallery
                                             • Instant RSVP Form
                                             • Live Wishes & Blessings Wall
```

### B. The Couple Flow (Simplified 1-Click Experience)
```
[Template Catalog]
       │
       ▼
[Interactive Template Preview] ──(Taps "Use This Template")──► [Quick Details Modal]
 (Full animation, wax seal,                                      • Bride & Groom Names
  music, events, countdown)                                      • Wedding Date
                                                                 • Main Venue & City
                                                                 • Optional Shagun UPI ID
                                                                 │
                                                                 ▼
                                                    [Instant Live Invitation Page]
                                                      • Unique URL (/invite/:slug)
                                                      • 1-Click WhatsApp Share Card
                                                      • Direct Invitation Open
```

---

## 3. Guiding Principles
- **Cloudflare Native**: Serverless edge compute (Workers), edge relational database (D1), edge media storage (R2), and ultra-fast edge caching (KV).
- **Mobile First & Ultra-Fast**: Most wedding guests open invites on mobile phones via WhatsApp or Instagram. Hydration must be snappy, animations silky at 60fps.
- **DRY & Modular**:
  - Template engines share common visual primitives (`EnvelopeOpening`, `WishesWall`, `RSVPModal`, `CountdownTimer`, `AudioPlayer`, `EventCard`).
  - Themes only define their aesthetic tokens (colors, fonts, ornamentations, animations) while sharing business logic and state.
- **Auto-Play Compliance**: Modern browsers block unprompted audio autoplay. The "Wax Seal / Open Envelope" action serves as both an emotional reveal and the explicit user gesture required to start music playback.

