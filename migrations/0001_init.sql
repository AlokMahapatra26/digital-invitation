-- Migration: 0001_init.sql
-- Cloudflare D1 Relational Schema for Wedding Invitations

CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  template_id TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);

CREATE TABLE IF NOT EXISTS rsvps (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  attending INTEGER NOT NULL DEFAULT 1,
  guest_count INTEGER NOT NULL DEFAULT 1,
  event_ids TEXT,
  dietary TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON rsvps(invitation_id);

CREATE TABLE IF NOT EXISTS wishes (
  id TEXT PRIMARY KEY,
  invitation_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  relation TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON wishes(invitation_id);
