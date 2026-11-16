import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  Copy,
  Share2,
  ExternalLink,
  Camera,
  Plus,
  Trash2,
  Calendar,
  Image as ImageIcon,
  Music,
  Users,
} from 'lucide-react';
import { TemplateId, WeddingInvitation, WeddingEvent } from '@/shared/types';
import { SAMPLE_INVITATION } from '@/shared/defaults';
import { saveInvitation } from '@/client/lib/api';
import { useConfetti } from '@/client/hooks/useConfetti';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: TemplateId;
}

export function QuickCreateModal({
  isOpen,
  onClose,
  selectedTemplateId,
}: QuickCreateModalProps) {
  // Active Tab inside modal
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'gallery'>('couple');

  // Couple Info & Photos
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
  const [musicTitle, setMusicTitle] = useState('Mangal Shehnai & Wedding Symphony');
  const [musicUrl, setMusicUrl] = useState(SAMPLE_INVITATION.theme.backgroundMusicUrl);
  const [upiId, setUpiId] = useState('shah.patel@okhdfcbank');

  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { shootPetals } = useConfetti();

  const brideFileRef = useRef<HTMLInputElement>(null);
  const groomFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

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
      title: 'New Celebration',
      type: 'other',
      date: weddingDate,
      time: '07:00 PM',
      venueName: 'The Grand Ballroom',
      address: 'Ahmedabad, Gujarat',
      dressCode: 'Traditional Festive Attire',
      description: 'Join us for a memorable evening of celebration and joy.',
    };
    setEvents((prev) => [...prev, newEvt]);
  };

  const handleRemoveEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const generatedSlug = (brideName && groomName)
    ? `${brideName}-${groomName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'our-wedding';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) return;

    setLoading(true);

    const newInvitation: WeddingInvitation = {
      ...SAMPLE_INVITATION,
      id: `inv-${Date.now()}`,
      slug: generatedSlug,
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

    try {
      await saveInvitation(newInvitation);
      const fullUrl = `${window.location.origin}/invite/${newInvitation.slug}`;
      setCreatedUrl(fullUrl);
      shootPetals();
    } catch {
      setCreatedUrl(`${window.location.origin}/invite/${newInvitation.slug}`);
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

  const handleClose = () => {
    setCreatedUrl(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-2xl bg-[#FAF6F0] border-2 border-[#D4AF37] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] my-6 text-[#2C211E] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Top Header Bar */}
            <div className="p-4 sm:p-5 border-b border-[#E8D4B0] bg-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8C2323] font-bold block">
                  || Shree Ganeshaya Namah ||
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#8C2323]">
                  Personalize Your Invitation
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full text-[#7A6B56] hover:text-[#8C2323] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdUrl ? (
              /* Success Screen */
              <div className="p-6 sm:p-10 text-center flex flex-col items-center overflow-y-auto">
                <div className="w-16 h-16 rounded-full bg-[#EFE2CC] text-[#8C2323] border border-[#D4AF37] flex items-center justify-center mb-4">
                  <CheckCircle className="w-9 h-9" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2323] mb-2">
                  Your Wedding Invitation is Live! 🎉
                </h3>

                <p className="text-xs sm:text-sm text-[#5D4E3E] max-w-md mb-6 leading-relaxed font-serif">
                  Your customized invitation card with photos, itinerary, and Shehnai music is ready to share.
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

                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={createdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 rounded-xl bg-[#8C2323] hover:bg-[#721B1B] text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Open My Invitation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `|| Shree Ganeshaya Namah ||\nWe warmly invite you with family to celebrate our wedding!\nClick here to open our invitation: ${createdUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Multi-Tab Detailed Customizer Form */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Clean Tab Switcher */}
                <div className="flex items-center border-b border-[#E8D4B0] bg-[#FAF5EB] px-4 pt-2 gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('couple')}
                    className={`pb-2.5 px-3 text-xs font-serif font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'couple'
                        ? 'border-[#8C2323] text-[#8C2323]'
                        : 'border-transparent text-[#7A6B56] hover:text-[#2C211E]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>1. Couple & Photos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('events')}
                    className={`pb-2.5 px-3 text-xs font-serif font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'events'
                        ? 'border-[#8C2323] text-[#8C2323]'
                        : 'border-transparent text-[#7A6B56] hover:text-[#2C211E]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>2. Events & Itinerary ({events.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('gallery')}
                    className={`pb-2.5 px-3 text-xs font-serif font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                      activeTab === 'gallery'
                        ? 'border-[#8C2323] text-[#8C2323]'
                        : 'border-transparent text-[#7A6B56] hover:text-[#2C211E]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>3. Gallery & Music</span>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
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

                  {/* TAB 1: COUPLE & PHOTOS */}
                  {activeTab === 'couple' && (
                    <div className="space-y-5">
                      {/* Photos & Names Side-by-Side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Bride Box */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E8D4B0] shadow-xs text-center">
                          <span className="text-[11px] font-serif uppercase tracking-widest text-[#8C2323] font-bold block mb-3">
                            Bride's Details
                          </span>

                          {/* Bride Photo Upload Circle */}
                          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37] mb-3 group cursor-pointer shadow-xs">
                            <img
                              src={bridePhoto}
                              alt="Bride"
                              className="w-full h-full object-cover"
                            />
                            <div
                              onClick={() => brideFileRef.current?.click()}
                              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Camera className="w-5 h-5 mb-0.5" />
                              <span className="text-[9px] uppercase tracking-wider font-semibold">Change</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => brideFileRef.current?.click()}
                            className="text-[11px] text-[#8C2323] hover:underline font-serif font-bold mb-3 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3 h-3" />
                            <span>Upload Bride Photo</span>
                          </button>

                          <div className="space-y-2.5 text-left">
                            <div>
                              <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                                Bride's Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={brideName}
                                onChange={(e) => setBrideName(e.target.value)}
                                placeholder="e.g. Riya Shah"
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                                Parents' Names
                              </label>
                              <input
                                type="text"
                                value={brideParents}
                                onChange={(e) => setBrideParents(e.target.value)}
                                placeholder="Daughter of Mrs. Bhavna & Mr. Viren Shah"
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Groom Box */}
                        <div className="p-4 rounded-2xl bg-white border border-[#E8D4B0] shadow-xs text-center">
                          <span className="text-[11px] font-serif uppercase tracking-widest text-[#8C2323] font-bold block mb-3">
                            Groom's Details
                          </span>

                          {/* Groom Photo Upload Circle */}
                          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37] mb-3 group cursor-pointer shadow-xs">
                            <img
                              src={groomPhoto}
                              alt="Groom"
                              className="w-full h-full object-cover"
                            />
                            <div
                              onClick={() => groomFileRef.current?.click()}
                              className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Camera className="w-5 h-5 mb-0.5" />
                              <span className="text-[9px] uppercase tracking-wider font-semibold">Change</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => groomFileRef.current?.click()}
                            className="text-[11px] text-[#8C2323] hover:underline font-serif font-bold mb-3 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3 h-3" />
                            <span>Upload Groom Photo</span>
                          </button>

                          <div className="space-y-2.5 text-left">
                            <div>
                              <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                                Groom's Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={groomName}
                                onChange={(e) => setGroomName(e.target.value)}
                                placeholder="e.g. Parth Patel"
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-serif font-semibold text-[#5D4E3E] mb-1">
                                Parents' Names
                              </label>
                              <input
                                type="text"
                                value={groomParents}
                                onChange={(e) => setGroomParents(e.target.value)}
                                placeholder="Son of Mrs. Geeta & Mr. Mukesh Patel"
                                className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wedding Date, Hashtag & Welcome Note */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E8D4B0] space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1">
                              Wedding Date (Lagna Tithi) *
                            </label>
                            <input
                              type="date"
                              required
                              value={weddingDate}
                              onChange={(e) => setWeddingDate(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1">
                              Wedding Hashtag
                            </label>
                            <input
                              type="text"
                              value={weddingHashtag}
                              onChange={(e) => setWeddingHashtag(e.target.value)}
                              placeholder="#RiyaWedsParth"
                              className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1">
                            Welcome Invitation Message
                          </label>
                          <textarea
                            rows={2}
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: EVENTS & ITINERARY */}
                  {activeTab === 'events' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-serif font-bold text-[#8C2323]">
                            Ceremony Itinerary
                          </h4>
                          <p className="text-[11px] text-[#7A6B56] font-serif">
                            Customize timings, venues, and ceremonies (Mandap Muhurat, Pithi, Mameru, Garba, Hastamelap)
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddEvent}
                          className="px-3 py-1.5 rounded-xl bg-[#8C2323] text-white text-xs font-serif font-semibold flex items-center gap-1 hover:bg-[#721B1B] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Function</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {events.map((evt, idx) => (
                          <div
                            key={evt.id}
                            className="p-3.5 rounded-2xl bg-white border border-[#E8D4B0] space-y-2.5 shadow-xs relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-serif font-bold text-[#8C2323]">
                                Ceremony #{idx + 1}
                              </span>
                              {events.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEvent(evt.id)}
                                  className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-serif text-[#7A6B56] mb-0.5">
                                  Ceremony Name
                                </label>
                                <input
                                  type="text"
                                  value={evt.title}
                                  onChange={(e) => handleUpdateEvent(evt.id, 'title', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#E8D4B0] text-xs font-serif text-[#2C211E]"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-serif text-[#7A6B56] mb-0.5">
                                  Time
                                </label>
                                <input
                                  type="text"
                                  value={evt.time}
                                  onChange={(e) => handleUpdateEvent(evt.id, 'time', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#E8D4B0] text-xs font-serif text-[#2C211E]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-serif text-[#7A6B56] mb-0.5">
                                  Venue Name
                                </label>
                                <input
                                  type="text"
                                  value={evt.venueName}
                                  onChange={(e) => handleUpdateEvent(evt.id, 'venueName', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#E8D4B0] text-xs font-serif text-[#2C211E]"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-serif text-[#7A6B56] mb-0.5">
                                  Address / Location
                                </label>
                                <input
                                  type="text"
                                  value={evt.address}
                                  onChange={(e) => handleUpdateEvent(evt.id, 'address', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#E8D4B0] text-xs font-serif text-[#2C211E]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: GALLERY & MUSIC */}
                  {activeTab === 'gallery' && (
                    <div className="space-y-5">
                      {/* Photo Gallery Picker */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E8D4B0] space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-serif font-bold text-[#8C2323] uppercase tracking-wider">
                              Pre-Wedding Gallery Photos
                            </h4>
                            <p className="text-[11px] text-[#7A6B56] font-serif">
                              Upload couple photos from your camera or phone gallery
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => galleryFileRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#D4AF37] text-[#8C2323] text-xs font-serif font-bold flex items-center gap-1 hover:bg-[#F2ECE2] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Photo</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                          {gallery.map((imgUrl, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#D4AF37]/50 group shadow-xs">
                              <img src={imgUrl} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryPhoto(i)}
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Music & Audio Settings */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E8D4B0] space-y-3">
                        <h4 className="text-xs font-serif font-bold text-[#8C2323] uppercase tracking-wider flex items-center gap-1.5">
                          <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Background Music</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-serif text-[#7A6B56] mb-0.5">
                              Song Title
                            </label>
                            <input
                              type="text"
                              value={musicTitle}
                              onChange={(e) => setMusicTitle(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#E8D4B0] text-xs font-serif text-[#2C211E]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-serif text-[#7A6B56] mb-0.5">
                              Audio MP3 URL
                            </label>
                            <input
                              type="text"
                              value={musicUrl}
                              onChange={(e) => setMusicUrl(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#E8D4B0] text-xs font-serif text-[#2C211E]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Digital Shagun UPI */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E8D4B0] space-y-2">
                        <h4 className="text-xs font-serif font-bold text-[#8C2323] uppercase tracking-wider">
                          Digital Shagun / Gifting (Optional)
                        </h4>
                        <div>
                          <label className="block text-[11px] font-serif text-[#7A6B56] mb-0.5">
                            UPI ID for Shagun QR Code
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="shah.patel@okhdfcbank"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF6F0] border border-[#E8D4B0] text-xs font-mono text-[#2C211E]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-[#E8D4B0] flex items-center justify-between">
                    <div className="text-[11px] font-serif text-[#7A6B56]">
                      Design: <span className="font-bold text-[#8C2323] uppercase">{selectedTemplateId}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-xl font-serif font-bold text-xs uppercase tracking-wider text-white bg-[#8C2323] hover:bg-[#721B1B] transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {loading ? 'Creating Invitation...' : 'Create Wedding Invitation Page'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
