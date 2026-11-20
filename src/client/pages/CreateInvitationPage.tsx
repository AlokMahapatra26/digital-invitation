import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  Calendar,
  Clock,
  MapPin,
  Music,
  Plus,
  Trash2,
  Image as ImageIcon,
  Users,
  CheckCircle,
  Copy,
  Share2,
  ExternalLink,
  Sparkles,
  LayoutDashboard,
  Eye,
  ChevronRight,
  Heart,
  Play,
  Pause,
} from 'lucide-react';
import { TemplateId, WeddingInvitation, WeddingEvent } from '@/shared/types';
import { SAMPLE_INVITATION } from '@/shared/defaults';
import { saveInvitation } from '@/client/lib/api';
import { useConfetti } from '@/client/hooks/useConfetti';
import { useAuth } from '@/client/context/AuthContext';
import { GaneshaEmblem } from '@/client/components/common/GaneshaEmblem';
import { TemplateRenderer } from '@/client/components/templates/TemplateRenderer';

const TEMPLATE_OPTIONS: { id: TemplateId; name: string; tag: string; musicTitle: string; musicUrl: string }[] = [
  {
    id: 'rajwadi-kankotri',
    name: 'Rajwadi Kankotri',
    tag: 'Gujarati Rajwadi',
    musicTitle: 'મંગલ ફેરા (Mangal Phera Instrumental)',
    musicUrl: '/templates/rajwadi-kankotri/soundtrack.mp3',
  },
  {
    id: 'opal-romance',
    name: 'Opal Romance',
    tag: 'Garden Royalty',
    musicTitle: 'Opal Palace Garden Romance Symphony',
    musicUrl: '/templates/opal-romance/soundtrack.mp3',
  },
  {
    id: 'amber',
    name: 'Sunehri / Amber',
    tag: 'Royal Heritage',
    musicTitle: 'Sunehri Candlelit Symphony',
    musicUrl: '/templates/amber/music-placeholder.mp3',
  },
  {
    id: 'ever-after-bloom',
    name: 'Ever After Bloom',
    tag: 'Illustrated Storybook',
    musicTitle: 'Amrit Mahal Dawn Symphony',
    musicUrl: '/templates/ever-after-bloom/soundtrack.mp3',
  },
  {
    id: 'mountain',
    name: 'Himalayan Mountain',
    tag: 'Destination Luxury',
    musicTitle: 'Himalayan Santoor & Flute Symphony',
    musicUrl: '/templates/mountain/soundtrack.mp3',
  },
  {
    id: 'the-sacred-garden',
    name: 'The Sacred Garden',
    tag: 'Signature Experience',
    musicTitle: 'Ludovico Einaudi — Divenire',
    musicUrl: '/templates/the-sacred-garden/soundtrack.mp3',
  },
  {
    id: 'royal-grace',
    name: 'Royal Grace',
    tag: 'Viral Interactive',
    musicTitle: 'Royal Grace Acoustic Symphony',
    musicUrl: '/templates/royal-grace/soundtrack.mp3',
  },
];

export function CreateInvitationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { shootPetals } = useConfetti();

  // Template ID from URL query param (?template=mountain)
  const initialTemplateParam = searchParams.get('template') as TemplateId;
  const validTemplateId = TEMPLATE_OPTIONS.some((t) => t.id === initialTemplateParam)
    ? initialTemplateParam
    : 'mountain';

  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(validTemplateId);
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'gallery' | 'preview'>('couple');

  // Couple Details
  const [brideName, setBrideName] = useState('Riya Shah');
  const [brideParents, setBrideParents] = useState('Daughter of Mrs. Bhavna & Mr. Viren Shah');
  const [bridePhoto, setBridePhoto] = useState(SAMPLE_INVITATION.couple.bride.photoUrl || '');

  const [groomName, setGroomName] = useState('Parth Patel');
  const [groomParents, setGroomParents] = useState('Son of Mrs. Geeta & Mr. Mukesh Patel');
  const [groomPhoto, setGroomPhoto] = useState(SAMPLE_INVITATION.couple.groom.photoUrl || '');

  const [weddingDate, setWeddingDate] = useState('2026-12-14');
  const [weddingHashtag, setWeddingHashtag] = useState('#RiyaWedsParth');
  const [welcomeMessage, setWelcomeMessage] = useState(SAMPLE_INVITATION.welcomeMessage);

  // Events List
  const [events, setEvents] = useState<WeddingEvent[]>(SAMPLE_INVITATION.events);

  // Gallery Photos
  const [gallery, setGallery] = useState<string[]>(SAMPLE_INVITATION.gallery);

  // Music & Gifting
  const currentTemplateMeta = TEMPLATE_OPTIONS.find((t) => t.id === selectedTemplateId)!;
  const [musicTitle, setMusicTitle] = useState(currentTemplateMeta.musicTitle);
  const [musicUrl, setMusicUrl] = useState(currentTemplateMeta.musicUrl);
  const [upiId, setUpiId] = useState('shah.patel@okhdfcbank');

  // Preview Audio Player
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingPreviewMusic, setIsPlayingPreviewMusic] = useState(false);

  // Publishing State
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // File Input Refs
  const brideFileRef = useRef<HTMLInputElement>(null);
  const groomFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  // Handle template switch
  const handleTemplateChange = (newId: TemplateId) => {
    setSelectedTemplateId(newId);
    setSearchParams({ template: newId });
    const meta = TEMPLATE_OPTIONS.find((t) => t.id === newId);
    if (meta) {
      setMusicTitle(meta.musicTitle);
      setMusicUrl(meta.musicUrl);
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        setIsPlayingPreviewMusic(false);
      }
    }
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'bride' | 'groom' | 'gallery'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (target === 'gallery') {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setGallery((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (target === 'bride') setBridePhoto(event.target.result as string);
          if (target === 'groom') setGroomPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateEvent = (id: string, field: keyof WeddingEvent, value: string) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, [field]: value } : evt))
    );
  };

  const handleAddEvent = () => {
    const newEvt: WeddingEvent = {
      id: `evt-${Date.now()}`,
      title: 'New Ceremony',
      type: 'other',
      date: weddingDate,
      time: '07:00 PM',
      venueName: 'The Royal Banquet',
      address: 'Ahmedabad, Gujarat',
      dressCode: 'Traditional Festive Attire',
      description: 'Join us for an auspicious evening of celebrations and family blessings.',
    };
    setEvents((prev) => [...prev, newEvt]);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const togglePreviewAudio = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreviewMusic) {
      audioPreviewRef.current.pause();
      setIsPlayingPreviewMusic(false);
    } else {
      audioPreviewRef.current.play();
      setIsPlayingPreviewMusic(true);
    }
  };

  const generatedSlug = brideName && groomName
    ? `${brideName}-${groomName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'our-wedding';

  // Construct active invitation payload for preview & save
  const currentInvitation: WeddingInvitation = {
    ...SAMPLE_INVITATION,
    id: `inv-${Date.now()}`,
    slug: generatedSlug,
    userId: user?.id,
    couple: {
      bride: {
        name: brideName,
        parents: brideParents,
        photoUrl: bridePhoto,
      },
      groom: {
        name: groomName,
        parents: groomParents,
        photoUrl: groomPhoto,
      },
    },
    weddingDate,
    hashtag: weddingHashtag,
    welcomeMessage,
    events,
    gallery,
    theme: {
      ...SAMPLE_INVITATION.theme,
      templateId: selectedTemplateId,
      musicTitle,
      backgroundMusicUrl: musicUrl,
      envelopeSealText: '|| SHREE ||',
    },
    upiId: upiId || undefined,
    enableGifts: Boolean(upiId),
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) {
      alert("Please enter Bride and Groom names before publishing.");
      return;
    }

    setLoading(true);

    try {
      await saveInvitation(currentInvitation);
      const fullUrl = `${window.location.origin}/invite/${currentInvitation.slug}`;
      setCreatedUrl(fullUrl);
      shootPetals();
    } catch {
      setCreatedUrl(`${window.location.origin}/invite/${currentInvitation.slug}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdUrl) return;
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C211E] font-sans antialiased selection:bg-[#F3D7B5] pb-24">
      {/* Hidden Audio Element for Music Preview */}
      <audio ref={audioPreviewRef} src={musicUrl} loop />

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={brideFileRef}
        accept="image/*"
        onChange={(e) => handlePhotoUpload(e, 'bride')}
        className="hidden"
      />
      <input
        type="file"
        ref={groomFileRef}
        accept="image/*"
        onChange={(e) => handlePhotoUpload(e, 'groom')}
        className="hidden"
      />
      <input
        type="file"
        ref={galleryFileRef}
        accept="image/*"
        multiple
        onChange={(e) => handlePhotoUpload(e, 'gallery')}
        className="hidden"
      />

      {/* ─────────────────────────────────────────────────────────────
          STICKY TOP NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8D4B0] px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Back button & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-full text-[#7A6B56] hover:text-[#8C2323] hover:bg-[#EFE2CC] transition-colors"
              title="Back to Templates"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="hidden sm:flex items-center gap-2.5">
              <GaneshaEmblem className="w-7 h-7" color="#8C2323" />
              <div>
                <span className="font-serif font-bold text-base text-[#8C2323] block leading-tight">
                  Personalize Your Invitation
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#7A6B56] block font-serif">
                  Shubh Vivah Digital Suite
                </span>
              </div>
            </div>
          </div>

          {/* Template Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-semibold text-[#7A6B56] hidden md:inline">
              Design:
            </span>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value as TemplateId)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E8D4B0] text-xs font-serif font-bold text-[#8C2323] focus:outline-none focus:border-[#8C2323] shadow-xs cursor-pointer"
            >
              {TEMPLATE_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.tag})
                </option>
              ))}
            </select>
          </div>

          {/* Right Action: Publish CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePublish}
              disabled={loading}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#8C2323] to-[#681818] hover:brightness-110 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F9E2AF]" />
              <span>{loading ? 'Publishing...' : 'Publish Card'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          SUCCESS MODAL / OVERLAY (When Published)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {createdUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#FAF6F0] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#EFE2CC] text-[#8C2323] border border-[#D4AF37] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9" />
              </div>

              <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8C2323] font-bold block mb-1">
                || Shree Ganeshaya Namah ||
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2323] mb-2">
                Your Wedding Invitation is Live! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-[#5D4E3E] font-serif mb-6 leading-relaxed">
                Your customized invitation with portraits, itinerary, and sacred soundtrack is published
                and ready to be shared with your loved ones.
              </p>

              <div className="w-full bg-white border border-[#D4AF37]/60 rounded-xl p-3 flex items-center justify-between gap-2 mb-6 shadow-xs">
                <span className="text-xs text-[#8C2323] font-mono truncate pl-2 font-semibold">
                  {createdUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-1.5 rounded-lg bg-[#8C2323] text-white text-xs font-serif font-semibold shrink-0 cursor-pointer hover:bg-[#721B1B] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 inline mr-1" />
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={createdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 rounded-xl bg-[#8C2323] hover:bg-[#721B1B] text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Open Invitation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `|| Shree Ganeshaya Namah ||\nWe warmly invite you with family to celebrate the wedding ceremonies of ${brideName} & ${groomName}!\nClick here to view our invitation: ${createdUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>

                {user ? (
                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 rounded-xl border border-[#E8D4B0] bg-white hover:bg-[#FAF6F0] text-[#8C2323] font-serif font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Go to My Dashboard</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal('register')}
                    className="w-full py-2.5 rounded-xl border border-[#E8D4B0] bg-white hover:bg-[#FAF6F0] text-[#8C2323] font-serif font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Create Free Account to Save & Manage RSVPs</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MAIN FULL PAGE CONTENT CONTAINER
      ───────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl border border-[#E8D4B0] p-1.5 flex items-center justify-between mb-8 shadow-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('couple')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-serif font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'couple'
              ? 'bg-[#8C2323] text-white shadow-sm'
              : 'text-[#7A6B56] hover:text-[#2C211E] hover:bg-[#FAF6F0]'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Couple & Photos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-serif font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'events'
              ? 'bg-[#8C2323] text-white shadow-sm'
              : 'text-[#7A6B56] hover:text-[#2C211E] hover:bg-[#FAF6F0]'
              }`}
          >
            <Calendar className="w-4 h-4" />
            <span>2. Events ({events.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-serif font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'gallery'
              ? 'bg-[#8C2323] text-white shadow-sm'
              : 'text-[#7A6B56] hover:text-[#2C211E] hover:bg-[#FAF6F0]'
              }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3. Gallery & Music</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-serif font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${activeTab === 'preview'
              ? 'bg-[#8C2323] text-white shadow-sm'
              : 'text-[#7A6B56] hover:text-[#2C211E] hover:bg-[#FAF6F0]'
              }`}
          >
            <Eye className="w-4 h-4" />
            <span>4. Live Preview</span>
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: COUPLE & AUSPICIOUS DETAILS
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'couple' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bride Card */}
              <div className="p-6 rounded-3xl bg-white border border-[#E8D4B0] shadow-sm text-center">
                <span className="text-[11px] font-serif uppercase tracking-widest text-[#8C2323] font-bold block mb-4">
                  Bride's Details
                </span>

                {/* Bride Photo Circle */}
                <div
                  onClick={() => brideFileRef.current?.click()}
                  className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37] mb-3 group cursor-pointer shadow-sm bg-[#FAF6F0]"
                >
                  <img
                    src={bridePhoto}
                    alt="Bride"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 mb-1 text-[#F9E2AF]" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Change Photo</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => brideFileRef.current?.click()}
                  className="text-xs text-[#8C2323] hover:underline font-serif font-bold mb-5 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Bride Photo</span>
                </button>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                      Bride's Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="e.g. Riya Shah"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-sm text-[#2C211E] font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                      Bride's Parents & Family
                    </label>
                    <input
                      type="text"
                      value={brideParents}
                      onChange={(e) => setBrideParents(e.target.value)}
                      placeholder="Daughter of Mrs. Bhavna & Mr. Viren Shah"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-sm text-[#2C211E] font-serif"
                    />
                  </div>
                </div>
              </div>

              {/* Groom Card */}
              <div className="p-6 rounded-3xl bg-white border border-[#E8D4B0] shadow-sm text-center">
                <span className="text-[11px] font-serif uppercase tracking-widest text-[#8C2323] font-bold block mb-4">
                  Groom's Details
                </span>

                {/* Groom Photo Circle */}
                <div
                  onClick={() => groomFileRef.current?.click()}
                  className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37] mb-3 group cursor-pointer shadow-sm bg-[#FAF6F0]"
                >
                  <img
                    src={groomPhoto}
                    alt="Groom"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 mb-1 text-[#F9E2AF]" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Change Photo</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => groomFileRef.current?.click()}
                  className="text-xs text-[#8C2323] hover:underline font-serif font-bold mb-5 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Groom Photo</span>
                </button>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                      Groom's Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="e.g. Parth Patel"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-sm text-[#2C211E] font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                      Groom's Parents & Family
                    </label>
                    <input
                      type="text"
                      value={groomParents}
                      onChange={(e) => setGroomParents(e.target.value)}
                      placeholder="Son of Mrs. Geeta & Mr. Mukesh Patel"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-sm text-[#2C211E] font-serif"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Wedding Date & Welcome Message Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8D4B0] shadow-sm space-y-5">
              <span className="text-[11px] font-serif uppercase tracking-widest text-[#8C2323] font-bold block mb-2">
                Celebration Timing & Message
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                    Wedding Date (Lagna Tithi) *
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-sm text-[#2C211E] font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                    Wedding Hashtag
                  </label>
                  <input
                    type="text"
                    value={weddingHashtag}
                    onChange={(e) => setWeddingHashtag(e.target.value)}
                    placeholder="#RiyaWedsParth"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-sm text-[#2C211E] font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                  Auspicious Welcome Message
                </label>
                <textarea
                  rows={3}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="With the divine blessings of Lord Ganesha and our elders..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-sm text-[#2C211E] font-serif"
                />
              </div>

              {/* Action Button: Next Step */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('events')}
                  className="px-6 py-2.5 rounded-full bg-[#8C2323] hover:bg-[#721B1B] text-white text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <span>Next: Ceremonies & Itinerary</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: CEREMONIES & MULTI-EVENT ITINERARY
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#8C2323]">
                  Wedding Itinerary & Ceremonies
                </h3>
                <p className="text-xs text-[#7A6B56] font-serif">
                  Add or customize every ceremony: Haldi, Mehendi, Sangeet, Mandap, and Reception.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEvent}
                className="px-4 py-2 rounded-full border border-[#8C2323] text-[#8C2323] hover:bg-[#8C2323] hover:text-white text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ceremony</span>
              </button>
            </div>

            <div className="space-y-4">
              {events.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="p-6 rounded-3xl bg-white border border-[#E8D4B0] shadow-sm relative group"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0E2CC]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#8C2323] text-white flex items-center justify-center text-xs font-serif font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-serif font-bold text-[#8C2323] uppercase tracking-wider">
                        Ceremony #{idx + 1}
                      </span>
                    </div>

                    {events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEvent(evt.id)}
                        className="text-xs text-neutral-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                        Ceremony Title *
                      </label>
                      <input
                        type="text"
                        value={evt.title}
                        onChange={(e) => handleUpdateEvent(evt.id, 'title', e.target.value)}
                        placeholder="e.g. Mandap Muhurat / Haldi"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={evt.date}
                        onChange={(e) => handleUpdateEvent(evt.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                        Time / Auspicious Muhurat *
                      </label>
                      <input
                        type="text"
                        value={evt.time}
                        onChange={(e) => handleUpdateEvent(evt.id, 'time', e.target.value)}
                        placeholder="e.g. 10:30 AM"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                        Venue Name *
                      </label>
                      <input
                        type="text"
                        value={evt.venueName}
                        onChange={(e) => handleUpdateEvent(evt.id, 'venueName', e.target.value)}
                        placeholder="e.g. The Savoy, Mussoorie"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                        Address / City
                      </label>
                      <input
                        type="text"
                        value={evt.address}
                        onChange={(e) => handleUpdateEvent(evt.id, 'address', e.target.value)}
                        placeholder="e.g. Library Chowk, Mussoorie, Uttarakhand"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                        Google Maps Route URL
                      </label>
                      <input
                        type="url"
                        value={evt.mapUrl || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'mapUrl', e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                        Dress Code / Attire
                      </label>
                      <input
                        type="text"
                        value={evt.dressCode || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'dressCode', e.target.value)}
                        placeholder="e.g. Traditional Yellow & Orange / Pastel Festive"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('couple')}
                className="px-5 py-2.5 rounded-full border border-[#E8D4B0] bg-white hover:bg-[#FAF6F0] text-xs font-serif font-bold uppercase tracking-wider text-[#7A6B56] cursor-pointer"
              >
                ← Back: Couple Details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className="px-6 py-2.5 rounded-full bg-[#8C2323] hover:bg-[#721B1B] text-white text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>Next: Gallery & Music</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: PHOTO ALBUM, SACRED MUSIC & DIGITAL GIFTS
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {/* Gallery Uploader */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8D4B0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#8C2323]">
                    Couple Photo Album
                  </h3>
                  <p className="text-xs text-[#7A6B56] font-serif">
                    Upload pre-wedding shots and candid photos to show in your invitation gallery.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => galleryFileRef.current?.click()}
                  className="px-4 py-2 rounded-full border border-[#8C2323] text-[#8C2323] hover:bg-[#8C2323] hover:text-white text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Photos</span>
                </button>
              </div>

              {gallery.length === 0 ? (
                <div
                  onClick={() => galleryFileRef.current?.click()}
                  className="border-2 border-dashed border-[#E8D4B0] rounded-2xl p-10 text-center cursor-pointer hover:bg-[#FAF6F0] transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-xs text-[#7A6B56] font-serif">
                    No gallery photos added yet. Tap to upload your couple portraits.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-2xl overflow-hidden aspect-square border border-[#E8D4B0] shadow-xs"
                    >
                      <img src={photo} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sacred Background Soundtrack */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8D4B0] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#8C2323]">
                    Background Soundtrack
                  </h3>
                  <p className="text-xs text-[#7A6B56] font-serif">
                    Music plays automatically or when guests tap to open the invitation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={togglePreviewAudio}
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E8D4B0] text-[#8C2323] hover:bg-[#8C2323] hover:text-white text-xs font-serif font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isPlayingPreviewMusic ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pause Track</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Preview Track</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                    Soundtrack Name
                  </label>
                  <input
                    type="text"
                    value={musicTitle}
                    onChange={(e) => setMusicTitle(e.target.value)}
                    placeholder="e.g. Himalayan Santoor & Flute Symphony"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                    Audio File URL (.mp3)
                  </label>
                  <input
                    type="text"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    placeholder="/templates/mountain/soundtrack.mp3"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                  />
                </div>
              </div>
            </div>

            {/* Digital Shagun UPI ID */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8D4B0] shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#8C2323] mb-1">
                Digital Shagun & Blessings (UPI)
              </h3>
              <p className="text-xs text-[#7A6B56] font-serif mb-4">
                Optional: Enable guests to send auspicious digital Shagun via GPay, PhonePe, or Paytm.
              </p>

              <div className="max-w-md">
                <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. couple@okhdfcbank"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className="px-5 py-2.5 rounded-full border border-[#E8D4B0] bg-white hover:bg-[#FAF6F0] text-xs font-serif font-bold uppercase tracking-wider text-[#7A6B56] cursor-pointer"
              >
                ← Back: Events
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-5 py-2.5 rounded-full border border-[#D4AF37] bg-white hover:bg-[#FAF6F0] text-[#8C2323] text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>View Live Preview</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={loading}
                  className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#8C2323] to-[#681818] hover:brightness-110 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F9E2AF]" />
                  <span>{loading ? 'Publishing...' : 'Publish Wedding Card'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: FULL LIVE PREVIEW OF CUSTOMIZED CARD
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E8D4B0] shadow-xs">
              <div>
                <span className="text-[10px] uppercase font-serif tracking-[0.2em] text-[#8C2323] font-bold block">
                  Interactive Card Preview
                </span>
                <p className="text-xs text-[#7A6B56] font-serif">
                  Here is how your wedding guests will experience your invitation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('couple')}
                  className="px-4 py-2 rounded-full border border-[#E8D4B0] bg-[#FAF6F0] text-xs font-serif font-bold text-[#7A6B56] hover:text-[#2C211E] cursor-pointer"
                >
                  Edit Details
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={loading}
                  className="px-6 py-2 rounded-full bg-[#8C2323] hover:bg-[#721B1B] text-white text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F9E2AF]" />
                  <span>{loading ? 'Publishing...' : 'Publish Card'}</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Template */}
            <div className="rounded-3xl border-2 border-[#D4AF37] overflow-hidden shadow-2xl bg-white">
              <TemplateRenderer data={currentInvitation} previewMode={true} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

