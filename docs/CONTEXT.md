# Project Context: Animated Digital Wedding Invitation Platform

## 1. Vision & Purpose
A high-aesthetic, mobile-first digital wedding invitation web platform built entirely on the **native Cloudflare stack**. 
The platform empowers couples to:
1. Select from visually rich, culture-informed, animated templates (Royal Heritage, Floral Botanical, Modern Editorial, Celestial).
2. Customize wedding details, events (Haldi, Mehendi, Sangeet, Ceremony, Reception), couple story, pre-wedding photo gallery, and background music in an intuitive live builder.
3. Publish and share unique, animated guest invitation links with rich WhatsApp preview cards, live RSVP collection, Google/Apple Maps integration, calendar sync, and an interactive wishes guestbook.

---

## 2. Core User Personas & Flows

### Curated Active Templates (Exactly 2 Designs)
1. **The Sacred Garden (`the-sacred-garden`)**:
   - Exact replica of the high-end stationery template from `https://webgencyinvitations.com/thesacredgarden`.
   - **Interactive Envelope Overlay (`#weiOverlay`)**: Warm cream background (`#F9F0E0`), realistic physical envelope image, pulsing "TAP TO OPEN" prompt with animated chevron.
   - **Flap Opening Transition Video (`#weiVideoWrap`)**: Smooth opening animation (`1782224012851_1_m6ww6v.mp4`) that fades out 0.8s before finishing.
   - **Soundtrack**: Ludovico Einaudi - *Divenire* looping in background.
   - **Floating Audio Control**: Circular `#5A0F1B` deep maroon button at bottom right (60px) with play/pause icons.
   - **Cinematic Looping Banner**: Serene white swans swimming on water (`Swans2_1_qwzsod.mov`).
   - **Typography & Theme**: Authentic `Cinzel` serif titles, `Ovo` body copy, floral arch dividers, countdown clock, timeline schedule, Google Maps link, dress code, and interactive RSVP modal.
2. **Royal Kumkum Kankotri (`kumkum-kankotri`)**:
   - Traditional Gujarati crimson (`#5E0D0D`) and Jari gold foil borders.
   - All text in English with auspicious invocations (|| Shree Ganeshaya Namah ||).
   - Full ceremony timeline (Mandap Muhurat, Pithi, Mameru, Raas-Garba, Hastamelap, Reception).

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

