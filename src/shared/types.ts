// Shared Types across Server and Client (DRY principle)

export type TemplateId = 'mountain' | 'royal-grace' | 'the-sacred-garden' | 'kumkum-kankotri' | 'patola-ivory';

export type EventType =
  | 'mandap-muhurat'
  | 'grah-shanti'
  | 'pithi'
  | 'mameru'
  | 'raas-garba'
  | 'hastamelap'
  | 'reception'
  | 'ceremony'
  | 'other';

export interface WeddingEvent {
  id: string;
  title: string;
  gujaratiTitle?: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "05:00 PM"
  venueName: string;
  address: string;
  mapUrl?: string;
  dressCode?: string;
  description?: string;
}

export interface StoryMoment {
  id: string;
  dateOrYear: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface PersonDetails {
  name: string;
  gujaratiName?: string;
  parents?: string;
  bio?: string;
  photoUrl?: string;
}

export interface CoupleDetails {
  bride: PersonDetails;
  groom: PersonDetails;
}

export interface ThemeConfig {
  templateId: TemplateId;
  primaryColor: string;
  accentColor: string;
  backgroundMusicUrl: string;
  musicTitle: string;
  envelopeSealText: string;
  animationEffect: 'petals' | 'sparkles' | 'gold-dust' | 'hearts';
}

export interface WeddingInvitation {
  id: string;
  slug: string;
  couple: CoupleDetails;
  tagline: string;
  gujaratiShlok?: string;
  welcomeMessage: string;
  weddingDate: string; // YYYY-MM-DD
  hashtag?: string;
  events: WeddingEvent[];
  story: StoryMoment[];
  gallery: string[];
  theme: ThemeConfig;
  enableRsvp: boolean;
  enableWishes: boolean;
  enableGifts: boolean;
  giftNote?: string;
  upiId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RSVPRecord {
  id: string;
  invitationId: string;
  guestName: string;
  attending: boolean;
  guestCount: number;
  eventIds: string[];
  dietary?: string;
  message?: string;
  createdAt: string;
}

export interface WishRecord {
  id: string;
  invitationId: string;
  senderName: string;
  relation?: string;
  message: string;
  createdAt: string;
}

export interface TemplateProps {
  data: WeddingInvitation;
  previewMode?: boolean;
}
