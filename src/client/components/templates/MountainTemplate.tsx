import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  Send,
  Gift,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  CloudSun,
  Car,
  Users,
  Compass,
} from 'lucide-react';
import { TemplateProps, RSVPRecord, WishRecord } from '@/shared/types';
import { GaneshaEmblem } from '@/client/components/common/GaneshaEmblem';

export function MountainTemplate({ data, previewMode = false }: TemplateProps) {
  // Audio state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Modals & Form
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no'>('yes');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [songRequest, setSongRequest] = useState('');
  const [dietaryInfo, setDietaryInfo] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  // Wishes state
  const [wishName, setWishName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);
  const [wishSubmitted, setWishSubmitted] = useState(false);

  // Copy UPI state
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const weddingDateStr = data.weddingDate || '2026-12-14';

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${weddingDateStr}T18:00:00`).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr]);

  const audioSrc =
    data.theme?.backgroundMusicUrl || '/templates/mountain/soundtrack.mp3';

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setIsSubmittingRsvp(true);

    try {
      if (!previewMode) {
        await fetch(`/api/rsvp/${data.slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName,
            attending: rsvpAttending === 'yes',
            guestCount: rsvpAttending === 'yes' ? Number(guestCount) : 0,
            eventIds: data.events.map((ev) => ev.id),
            dietary: songRequest,
            message: dietaryInfo,
          }),
        });
      }
      setRsvpSubmitted(true);
      setTimeout(() => {
        setIsRsvpOpen(false);
        setRsvpSubmitted(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      setRsvpSubmitted(true);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;
    setIsSubmittingWish(true);

    const newWish: WishRecord = {
      id: 'wish-' + Date.now(),
      invitationId: data.id,
      senderName: wishName,
      message: wishMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      if (!previewMode) {
        await fetch(`/api/wishes/${data.slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderName: wishName,
            message: wishMessage,
          }),
        });
      }
      setWishes((prev) => [newWish, ...prev]);
      setWishSubmitted(true);
      setWishName('');
      setWishMessage('');
      setTimeout(() => setWishSubmitted(false), 3000);
    } catch (err) {
      setWishes((prev) => [newWish, ...prev]);
      setWishSubmitted(true);
    } finally {
      setIsSubmittingWish(false);
    }
  };

  const handleCopyUpi = () => {
    if (data.upiId) {
      navigator.clipboard.writeText(data.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const groomName = data.couple.groom.name || 'Abhishek';
  const brideName = data.couple.bride.name || 'Kanika';
  const groomParents = data.couple.groom.parents || 'Son of Mrs. Reena & Mr. Rajiv Kapoor';
  const brideParents = data.couple.bride.parents || 'Daughter of Mrs. Shalini & Mr. Aakash Mittal';

  return (
    <div className="relative min-h-screen bg-[#F7F4EE] text-[#2B4336] font-['Manrope',sans-serif] selection:bg-[#E2DACB] overflow-x-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />

      {/* Floating Music Control */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onClick={toggleMusic}
        aria-label="Toggle background music"
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#2B4336] hover:bg-[#1E3328] text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#C29B38]/50"
      >
        {isPlayingMusic ? (
          <Volume2 className="w-6 h-6 text-[#F7F4EE]" />
        ) : (
          <VolumeX className="w-6 h-6 text-[#F7F4EE]/80" />
        )}
      </motion.button>

      {/* ─────────────────────────────────────────────────────────────
          1. HERO HEADER: HIMALAYAN MOUNTAINS & GANESHA INVOCATION
      ───────────────────────────────────────────────────────────── */}
      <header className="relative pt-12 pb-16 px-6 text-center max-w-3xl mx-auto overflow-hidden">
        {/* Auspicious Ganesh Invocation */}
        <div className="flex flex-col items-center justify-center mb-6">
          <GaneshaEmblem className="w-10 h-10 mb-2" color="#9B4A34" />
          <span className="font-['Gotu',serif] text-sm tracking-widest text-[#9B4A34] font-medium">
            ॐ श्री गणेशाय नमः
          </span>
        </div>

        {/* Mountain Landscape Art */}
        <div className="relative w-full max-w-lg mx-auto mb-8">
          <img
            src="/templates/mountain/hero_mountain.png"
            alt="Mountain Heritage Landscape"
            className="w-full h-auto object-contain drop-shadow-md mx-auto"
          />
        </div>

        {/* Blessings & Invocations */}
        <div className="space-y-1 text-xs uppercase tracking-[0.2em] text-[#55695C] mb-6 font-['Cormorant_Unicase',serif] font-semibold">
          <p>With the heavenly blessings of</p>
          <p className="text-sm text-[#2B4336] normal-case font-['Cormorant_Garamond',serif] italic font-semibold">
            Our Elders & Ancestors
          </p>
          <p className="pt-2">{groomParents}</p>
        </div>

        <div className="my-6">
          <span className="inline-block font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.35em] text-[#9B4A34] px-4 py-1 border-t border-b border-[#9B4A34]/30">
            INVITE
          </span>
          <p className="text-xs uppercase tracking-widest text-[#55695C] mt-2 font-['Cormorant_Unicase',serif]">
            You to join us in the wedding celebrations of
          </p>
        </div>

        {/* Main Couple Names */}
        <div className="py-4">
          <h1 className="font-['Cormorant_Unicase',serif] text-5xl sm:text-7xl font-light text-[#2B4336] tracking-wide uppercase leading-none">
            {groomName}
          </h1>
          <div className="font-['Gotu',serif] text-xl sm:text-2xl text-[#9B4A34] my-2 italic">
            weds
          </div>
          <h2 className="font-['Cormorant_Unicase',serif] text-5xl sm:text-7xl font-light text-[#2B4336] tracking-wide uppercase leading-none">
            {brideName}
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#55695C] mt-3 font-['Cormorant_Unicase',serif]">
            {brideParents}
          </p>
        </div>

        <div className="w-24 h-px bg-[#C29B38] mx-auto mt-8 opacity-60" />
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. CELEBRATION EVENTS ITINERARY
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.3em] text-[#9B4A34] block mb-2 font-semibold">
            Ceremony Schedule
          </span>
          <h3 className="font-['Cormorant_Unicase',serif] text-3xl sm:text-4xl text-[#2B4336] font-light uppercase">
            On The Following Events
          </h3>
          <p className="text-xs text-[#55695C] font-['Cormorant_Garamond',serif] italic mt-1 text-base">
            Amidst the misty pines and serene mountain peaks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {data.events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="relative p-6 sm:p-7 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm hover:border-[#C29B38] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-['Cormorant_Unicase',serif] font-bold tracking-wider text-[#9B4A34] bg-[#E5DFD1]">
                    {evt.time}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#55695C] font-semibold">
                    {evt.date}
                  </span>
                </div>

                <h4 className="font-['Cormorant_Unicase',serif] text-2xl font-medium text-[#2B4336] mb-2 uppercase">
                  {evt.title}
                </h4>

                {evt.description && (
                  <p className="text-xs sm:text-sm text-[#465A4D] font-['Manrope',sans-serif] leading-relaxed mb-4">
                    {evt.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#DDD7C8] flex items-center justify-between gap-2">
                <div className="text-xs text-[#55695C] flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#9B4A34] shrink-0" />
                  <span className="truncate">{evt.venueName}</span>
                </div>

                <a
                  href={
                    evt.mapUrl ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      evt.venueName + ' ' + (evt.address || '')
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#9B4A34] hover:text-[#7A3624] tracking-wider uppercase shrink-0"
                >
                  <span>See the route</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. ROUTE & VENUE MAP CARD
      ───────────────────────────────────────────────────────────── */}
      <section className="py-10 px-4 max-w-2xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-[#EFECE3] border border-[#DDD7C8] shadow-md relative overflow-hidden">
          <Compass className="w-8 h-8 text-[#9B4A34] mx-auto mb-3" />

          <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.25em] text-[#9B4A34] block mb-1 font-semibold">
            Venue Directions
          </span>
          <h3 className="font-['Cormorant_Unicase',serif] text-2xl sm:text-3xl text-[#2B4336] uppercase font-medium mb-2">
            {data.events[0]?.venueName || 'The Savoy, Mussoorie'}
          </h3>
          <p className="text-xs sm:text-sm text-[#55695C] max-w-md mx-auto mb-6">
            {data.events[0]?.address || 'Library Bazaar, Mussoorie, Uttarakhand 248179'}
          </p>

          <a
            href={
              data.events[0]?.mapUrl ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                (data.events[0]?.venueName || '') + ' ' + (data.events[0]?.address || '')
              )}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#2B4336] hover:bg-[#1E3328] text-white text-xs font-['Cormorant_Unicase',serif] tracking-widest uppercase transition-all shadow cursor-pointer font-bold"
          >
            <span>Click to open the map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. MEET THE BRIDE & GROOM
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 max-w-3xl mx-auto text-center">
        <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.3em] text-[#9B4A34] block mb-1 font-semibold">
          Meet The
        </span>
        <h3 className="font-['Cormorant_Unicase',serif] text-3xl sm:text-4xl text-[#2B4336] uppercase font-light mb-4">
          Bride & Groom
        </h3>
        <p className="text-sm text-[#465A4D] font-['Cormorant_Garamond',serif] italic text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives."
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
          {/* Groom */}
          <div className="p-5 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm text-center">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-sm">
              <img
                src={
                  data.couple.groom.photoUrl ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                }
                alt={groomName}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-['Cormorant_Unicase',serif] text-xl font-bold text-[#2B4336] uppercase">
              {groomName}
            </h4>
            <p className="text-xs text-[#55695C] mt-1">
              {data.couple.groom.bio || 'Data Scientist, Trekker & Mountain Explorer'}
            </p>
          </div>

          {/* Bride */}
          <div className="p-5 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm text-center">
            <div className="aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-sm">
              <img
                src={
                  data.couple.bride.photoUrl ||
                  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
                }
                alt={brideName}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-['Cormorant_Unicase',serif] text-xl font-bold text-[#2B4336] uppercase">
              {brideName}
            </h4>
            <p className="text-xs text-[#55695C] mt-1">
              {data.couple.bride.bio || 'Architect, Coffee Aficionado & Nature Lover'}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. THINGS TO KNOW (4 Guest Guidance Cards)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.3em] text-[#9B4A34] block mb-1 font-semibold">
            Guest Essentials
          </span>
          <h3 className="font-['Cormorant_Unicase',serif] text-3xl sm:text-4xl text-[#2B4336] uppercase font-light">
            Things To Know
          </h3>
          <p className="text-xs text-[#55695C] font-['Cormorant_Garamond',serif] italic text-base max-w-lg mx-auto mt-2">
            To help you feel at ease and enjoy every moment of the celebrations, we’ve gathered a few thoughtful notes:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Hashtag */}
          <div className="p-6 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#E5DFD1] text-[#9B4A34] flex items-center justify-center mb-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
              <h4 className="font-['Cormorant_Unicase',serif] text-base font-bold text-[#2B4336] uppercase mb-1">
                Hashtag
              </h4>
              <p className="text-xs text-[#465A4D] leading-relaxed">
                While posting photos on social media please use the hashtag:
              </p>
            </div>
            <span className="text-xs font-bold text-[#9B4A34] mt-3 block font-mono">
              {data.hashtag || '#AbhiWedsKani'}
            </span>
          </div>

          {/* Weather */}
          <div className="p-6 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#E5DFD1] text-[#9B4A34] flex items-center justify-center mb-3">
                <CloudSun className="w-5 h-5" />
              </div>
              <h4 className="font-['Cormorant_Unicase',serif] text-base font-bold text-[#2B4336] uppercase mb-1">
                Weather
              </h4>
              <p className="text-xs text-[#465A4D] leading-relaxed">
                Pleasant mountain breeze with daytime temperatures around 20-22°C. Light evening wrap recommended.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2B4336] mt-3 block">
              20°C - 22°C
            </span>
          </div>

          {/* Staff */}
          <div className="p-6 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#E5DFD1] text-[#9B4A34] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-['Cormorant_Unicase',serif] text-base font-bold text-[#2B4336] uppercase mb-1">
                Staff & Drivers
              </h4>
              <p className="text-xs text-[#465A4D] leading-relaxed">
                We recommend the nearby lodge called Amba Valley near the venue for staff and driver accommodations.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2B4336] mt-3 block">
              Lodge Near Venue
            </span>
          </div>

          {/* Parking */}
          <div className="p-6 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm flex flex-col justify-between text-left">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#E5DFD1] text-[#9B4A34] flex items-center justify-center mb-3">
                <Car className="w-5 h-5" />
              </div>
              <h4 className="font-['Cormorant_Unicase',serif] text-base font-bold text-[#2B4336] uppercase mb-1">
                Valet Parking
              </h4>
              <p className="text-xs text-[#465A4D] leading-relaxed">
                Valet parking for all our guests will be available right at the venue entrance.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2B4336] mt-3 block">
              Complimentary Valet
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. DIGITAL SHAGUN & GIFT PREFERENCE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 max-w-xl mx-auto text-center">
        <div className="p-6 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm">
          <Gift className="w-6 h-6 text-[#9B4A34] mx-auto mb-2" />
          <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-wider text-[#9B4A34] block mb-2 font-bold">
            Gift Preference
          </span>
          <p className="text-xs sm:text-sm text-[#465A4D] font-['Cormorant_Garamond',serif] italic text-base mb-4 leading-relaxed">
            {data.giftNote ||
              'Your warm presence and blessings in the hills are the greatest gifts we could ever ask for!'}
          </p>

          {data.upiId && (
            <button
              onClick={handleCopyUpi}
              className="py-2 px-5 rounded-full border border-[#C29B38] bg-[#E5DFD1] hover:bg-[#DDD6C5] text-xs font-['Cormorant_Unicase',serif] text-[#2B4336] font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Digital Shagun UPI: {data.upiId}</span>
              <span className="text-[10px] text-[#9B4A34]">
                ({copiedUpi ? 'Copied!' : 'Copy'})
              </span>
            </button>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. THE COUNTDOWN BEGINS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 max-w-lg mx-auto text-center">
        <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.3em] text-[#9B4A34] block mb-1 font-semibold">
          Anticipating The Magic
        </span>
        <h3 className="font-['Cormorant_Unicase',serif] text-3xl sm:text-4xl text-[#2B4336] uppercase font-light mb-8">
          The Countdown Begins
        </h3>

        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl bg-[#EFECE3] border border-[#DDD7C8] shadow-xs flex flex-col items-center"
            >
              <span className="font-['Cormorant_Unicase',serif] text-2xl sm:text-3xl font-bold text-[#2B4336]">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-['Cormorant_Unicase',serif] tracking-wider text-[#9B4A34] mt-1 font-semibold">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. RSVP SECTION ("LOOKING FORWARD TO SEE YOU")
      ───────────────────────────────────────────────────────────── */}
      {data.enableRsvp && (
        <section className="py-12 px-4 max-w-xl mx-auto text-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#EFECE3] border border-[#DDD7C8] shadow-md">
            <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.25em] text-[#9B4A34] block mb-1 font-semibold">
              RSVP
            </span>
            <h3 className="font-['Cormorant_Unicase',serif] text-3xl sm:text-4xl text-[#2B4336] uppercase font-light mb-3">
              Looking Forward To See You
            </h3>
            <p className="text-xs sm:text-sm text-[#55695C] max-w-md mx-auto mb-8 font-['Cormorant_Garamond',serif] italic text-base">
              Please let us know if you will be able to join our celebration in the mountains.
            </p>

            <button
              onClick={() => setIsRsvpOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#2B4336] hover:bg-[#1E3328] text-white font-['Cormorant_Unicase',serif] text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-md cursor-pointer border border-[#C29B38]/50"
            >
              Click The Link To RSVP
            </button>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. WISHES WALL
      ───────────────────────────────────────────────────────────── */}
      {data.enableWishes && (
        <section className="py-12 px-4 max-w-xl mx-auto text-center">
          <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.25em] text-[#9B4A34] block mb-1 font-semibold">
            Guestbook
          </span>
          <h3 className="font-['Cormorant_Unicase',serif] text-3xl text-[#2B4336] uppercase font-light mb-6">
            Blessings For The Couple
          </h3>

          <form
            onSubmit={handleWishSubmit}
            className="p-6 rounded-2xl bg-[#EFECE3] border border-[#DDD7C8] shadow-sm mb-6 text-left"
          >
            <div className="mb-4">
              <label className="block text-xs font-['Cormorant_Unicase',serif] uppercase tracking-wider text-[#2B4336] mb-1 font-bold">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajiv & Meera Kapoor"
                value={wishName}
                onChange={(e) => setWishName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7C8] bg-white text-[#2B4336] text-sm focus:outline-none focus:ring-1 focus:ring-[#2B4336]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-['Cormorant_Unicase',serif] uppercase tracking-wider text-[#2B4336] mb-1 font-bold">
                Your Heartfelt Message
              </label>
              <textarea
                rows={3}
                required
                placeholder="Sending our warmest love and blessings for your new beginning..."
                value={wishMessage}
                onChange={(e) => setWishMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7C8] bg-white text-[#2B4336] text-sm focus:outline-none focus:ring-1 focus:ring-[#2B4336]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingWish}
              className="w-full py-3 rounded-xl bg-[#2B4336] hover:bg-[#1E3328] text-white font-['Cormorant_Unicase',serif] text-xs tracking-widest uppercase transition-all shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 font-bold"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmittingWish ? 'Sending...' : 'Send Warm Wishes'}</span>
            </button>

            {wishSubmitted && (
              <p className="text-center text-xs text-emerald-800 font-['Cormorant_Unicase',serif] mt-3 font-bold">
                Thank you! Your heartfelt blessings have been shared.
              </p>
            )}
          </form>

          {wishes.length > 0 && (
            <div className="space-y-3 text-left">
              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-xl bg-[#EFECE3] border border-[#DDD7C8] shadow-xs"
                >
                  <p className="text-xs font-['Cormorant_Unicase',serif] font-bold text-[#9B4A34] mb-1 uppercase">
                    {w.senderName}
                  </p>
                  <p className="text-xs sm:text-sm text-[#465A4D] italic font-['Cormorant_Garamond',serif] text-base">
                    "{w.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. FOOTER SIGN-OFF
      ───────────────────────────────────────────────────────────── */}
      <footer className="pt-16 pb-16 px-4 text-center border-t border-[#DDD7C8]">
        <p className="text-xs uppercase tracking-[0.25em] text-[#55695C] mb-2 font-['Cormorant_Unicase',serif]">
          With Gratitude
        </p>
        <h4 className="font-['Cormorant_Unicase',serif] text-2xl sm:text-3xl text-[#2B4336] uppercase font-light mb-2">
          {groomName} & {brideName}
        </h4>
        <p className="text-xs text-[#55695C] font-['Cormorant_Garamond',serif] italic text-base max-w-md mx-auto">
          Both families are excited that you are able to join us in celebrating what we hope will be one of the happiest days of our lives.
        </p>

        <div className="mt-12 text-[10px] uppercase font-['Cormorant_Unicase',serif] tracking-[0.25em] text-[#55695C]">
          #Mountain · Vivaah Digital Invitations
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          11. RSVP MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#F7F4EE] border border-[#DDD7C8] p-6 sm:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh]"
            >
              <div className="text-center mb-6">
                <span className="font-['Cormorant_Unicase',serif] text-xs uppercase tracking-[0.25em] text-[#9B4A34] block mb-1 font-semibold">
                  Confirm Your Presence
                </span>
                <h3 className="font-['Cormorant_Unicase',serif] text-3xl text-[#2B4336] uppercase font-light">
                  RSVP
                </h3>
              </div>

              {rsvpSubmitted ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#2B4336] mx-auto animate-bounce" />
                  <h4 className="font-['Cormorant_Unicase',serif] text-xl text-[#2B4336] font-bold uppercase">
                    Attendance Confirmed!
                  </h4>
                  <p className="text-sm text-[#55695C]">
                    Thank you! We can't wait to celebrate with you in the mountains.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-['Cormorant_Unicase',serif] uppercase tracking-wider text-[#2B4336] mb-1 font-bold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. & Mrs. Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7C8] bg-white text-[#2B4336] text-sm focus:outline-none focus:ring-1 focus:ring-[#2B4336]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-['Cormorant_Unicase',serif] uppercase tracking-wider text-[#2B4336] mb-2 font-bold">
                      Will you be attending? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('yes')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-['Cormorant_Unicase',serif] tracking-wider uppercase transition-all cursor-pointer font-bold ${
                          rsvpAttending === 'yes'
                            ? 'bg-[#2B4336] text-white border-[#2B4336]'
                            : 'bg-white text-[#55695C] border-[#DDD7C8]'
                        }`}
                      >
                        Accepts with pleasure
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('no')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-['Cormorant_Unicase',serif] tracking-wider uppercase transition-all cursor-pointer font-bold ${
                          rsvpAttending === 'no'
                            ? 'bg-[#2B4336] text-white border-[#2B4336]'
                            : 'bg-white text-[#55695C] border-[#DDD7C8]'
                        }`}
                      >
                        Declines with regret
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === 'yes' && (
                    <>
                      <div>
                        <label className="block text-xs font-['Cormorant_Unicase',serif] uppercase tracking-wider text-[#2B4336] mb-1 font-bold">
                          Number of Guests Attending
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7C8] bg-white text-[#2B4336] text-sm focus:outline-none focus:ring-1 focus:ring-[#2B4336]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-['Cormorant_Unicase',serif] uppercase tracking-wider text-[#2B4336] mb-1 font-bold">
                          Dietary Preferences / Notes (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Vegetarian, Jain food"
                          value={dietaryInfo}
                          onChange={(e) => setDietaryInfo(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7C8] bg-white text-[#2B4336] text-sm focus:outline-none focus:ring-1 focus:ring-[#2B4336]"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DDD7C8]">
                    <button
                      type="button"
                      onClick={() => setIsRsvpOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-[#DDD7C8] bg-white text-xs font-['Cormorant_Unicase',serif] text-[#55695C] hover:bg-[#EFECE3] transition-all cursor-pointer font-bold uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="px-6 py-2.5 rounded-xl bg-[#2B4336] hover:bg-[#1E3328] text-white text-xs font-['Cormorant_Unicase',serif] tracking-wider uppercase transition-all shadow disabled:opacity-50 cursor-pointer font-bold"
                    >
                      {isSubmittingRsvp ? 'Submitting...' : 'Confirm Attendance'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
