import { WeddingInvitation, RSVPRecord, WishRecord } from '@/shared/types';
import { SAMPLE_INVITATION } from '@/shared/defaults';

const API_BASE = '/api';

export async function getInvitation(slug: string): Promise<WeddingInvitation> {
  try {
    const res = await fetch(`${API_BASE}/invitations/${slug}`);
    if (!res.ok) {
      if (res.status === 404 && (slug === 'demo' || slug === 'ananya-and-karan')) {
        return SAMPLE_INVITATION;
      }
      throw new Error(`Failed to load invitation (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.warn('API error, falling back to sample or local storage:', err);
    // Check localStorage fallback for offline/client-only creates
    const saved = localStorage.getItem(`wedding_inv_${slug}`);
    if (saved) return JSON.parse(saved);
    return SAMPLE_INVITATION;
  }
}

export async function saveInvitation(invitation: WeddingInvitation): Promise<{ success: boolean; slug: string }> {
  try {
    const res = await fetch(`${API_BASE}/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invitation),
    });
    if (!res.ok) {
      throw new Error('Server error saving invitation');
    }
    const data = await res.json();
    // Also save in localStorage as client backup
    localStorage.setItem(`wedding_inv_${invitation.slug}`, JSON.stringify(invitation));
    return data;
  } catch (err) {
    console.warn('Backend unavailable, saving locally in browser storage:', err);
    localStorage.setItem(`wedding_inv_${invitation.slug}`, JSON.stringify(invitation));
    return { success: true, slug: invitation.slug };
  }
}

export async function getRSVPs(slug: string): Promise<RSVPRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/rsvp/${slug}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function submitRSVP(
  slug: string,
  payload: {
    guestName: string;
    attending: boolean;
    guestCount: number;
    eventIds: string[];
    dietary?: string;
    message?: string;
  }
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/rsvp/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit RSVP');
  return await res.json();
}

export async function getWishes(slug: string): Promise<WishRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/wishes/${slug}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function submitWish(
  slug: string,
  payload: {
    senderName: string;
    relation?: string;
    message: string;
  }
): Promise<{ success: boolean; wish: WishRecord }> {
  const res = await fetch(`${API_BASE}/wishes/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to post wish');
  return await res.json();
}

