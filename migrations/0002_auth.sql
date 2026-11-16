-- Migration: 0002_auth.sql
-- Add users table and user ownership to invitations

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add user_id column to invitations table for user ownership
ALTER TABLE invitations ADD COLUMN user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);

