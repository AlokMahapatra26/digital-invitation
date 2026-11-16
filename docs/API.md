# API Documentation & Schema

## 1. REST Endpoints (Hono on Cloudflare Workers)

All endpoints run on Cloudflare Workers at the edge.

### `GET /api/invitations/:slug`
Fetches a published wedding invitation by its unique URL slug.
- **Response**: `200 OK` with JSON `WeddingInvitation` object, or `404 Not Found`.

### `POST /api/invitations`
Creates or updates a wedding invitation configuration.
- **Request Body**: `WeddingInvitation` JSON.
- **Response**: `201 Created` with `{ id: string, slug: string, url: string }`.

### `GET /api/invitations/:slug/rsvps`
Lists RSVPs for the invitation (host view).
- **Response**: `200 OK` with array of `RSVPRecord`.

### `POST /api/invitations/:slug/rsvps`
Submits a guest RSVP.
- **Request Body**:
  ```json
  {
    "guestName": "Ananya Sharma",
    "attending": true,
    "guestCount": 2,
    "eventIds": ["event-1", "event-2"],
    "message": "Can't wait to celebrate with you!"
  }
  ```
- **Response**: `201 Created`.

### `GET /api/invitations/:slug/wishes`
Fetches guestbook wishes for the invitation.
- **Response**: `200 OK` with array of `WishRecord`.

### `POST /api/invitations/:slug/wishes`
Posts a new blessing / wish to the couple's guestbook.
- **Request Body**:
  ```json
  {
    "senderName": "Karan & Meera",
    "relation": "Bride's Friends",
    "message": "Wishing both of you a lifetime of love and joy! ❤️"
  }
  ```
- **Response**: `201 Created`.

