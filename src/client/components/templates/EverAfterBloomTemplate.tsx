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
  ExternalLink,
  ChevronDown,
  Sparkles,
  Compass,
  CheckCircle,
  X,
} from 'lucide-react';
import { TemplateProps, RSVPRecord, WishRecord } from '@/shared/types';

interface FloatingWish {
  id: number;
  text: string;
  left: number;
}

const LANTERN_BLESSINGS = [
  'May your evenings always be unhurried.',
  'May the tea be hot and the arguments short.',
  'May you keep choosing each other.',
  'May your house be loud with the right people.',
  'May the monsoon always find you together.',
  'A lifetime of starlit courtyard laughter.',
  'May love bloom in every quiet morning.',
];

export function EverAfterBloomTemplate({ data, previewMode = false }: TemplateProps) {
  // Intro State: seal -> video -> opened
  const [introStep, setIntroStep] = useState<'seal' | 'video' | 'opened'>(
    previewMode ? 'opened' : 'seal'
  );
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const introVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Floating Wishes State
  const [wishes, setWishes] = useState<FloatingWish[]>([]);

  // Countdown timer
  const weddingDateStr = data.weddingDate || '2027-02-14';
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${weddingDateStr}T18:30:00`).getTime();
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

  // Handle Envelope Wax Seal Tap
  const handleOpenInvitation = () => {
    if (introStep !== 'seal') return;
    setIntroStep('video');

    if (introVideoRef.current) {
      introVideoRef.current.currentTime = 0;
      introVideoRef.current.play().catch(() => {});
    }

    if (audioRef.current) {
      audioRef.current.volume = 0.9;
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {});
    }
  };

  // Video timeupdate: fade out near end (at 7.2s out of 8.0s)
  const handleVideoTimeUpdate = () => {
    if (introVideoRef.current) {
      const v = introVideoRef.current;
      if (v.duration && v.currentTime >= v.duration - 0.7 && introStep === 'video') {
        setIntroStep('opened');
      }
    }
  };

  const handleSkipIntro = () => {
    setIntroStep('opened');
    if (audioRef.current && !isPlayingMusic) {
      audioRef.current.volume = 0.9;
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play();
      setIsPlayingMusic(true);
    }
  };

  // Release a wish lantern
  const handleReleaseLantern = () => {
    const id = Date.now();
    const text = LANTERN_BLESSINGS[Math.floor(Math.random() * LANTERN_BLESSINGS.length)];
    const left = 15 + Math.random() * 70;

    setWishes((prev) => [...prev, { id, text, left }]);
    setTimeout(() => {
      setWishes((prev) => prev.filter((w) => w.id !== id));
    }, 7000);
  };

  // RSVP State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no'>('yes');
  const [dietaryInfo, setDietaryInfo] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

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
            message: dietaryInfo,
          }),
        });
      }
      setRsvpSubmitted(true);
      setTimeout(() => {
        setIsRsvpOpen(false);
        setRsvpSubmitted(false);
      }, 2500);
    } catch {
      setRsvpSubmitted(true);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const brideName = data.couple.bride.name || 'Aarohi';
  const groomName = data.couple.groom.name || 'Ishaan';
  const brideBio =
    data.couple.bride.bio ||
    'Grew up chasing monsoon light with a sketchbook under her arm. She still stops mid-sentence for a good sunset, and she laughs before the joke has finished landing.';
  const groomBio =
    data.couple.groom.bio ||
    'Learned to cook from his grandmother and to be patient from long train rides. He remembers every song he has ever loved, and he will always make the second cup of chai.';

  const mainVenue = data.events?.[0]?.venueName || 'Amrit Mahal Palace';
  const mainAddress = data.events?.[0]?.address || 'Jal Marg, Old City, Jaipur, Rajasthan';
  const mainTime = data.events?.[0]?.time || '6:30 in the evening';
  const dressCode = data.events?.[0]?.dressCode || 'Festive Indian — pastels, ivory & gold';
  const mapUrl =
    data.events?.[0]?.mapUrl ||
    'https://maps.google.com/?q=Amrit+Mahal+Palace+Jaipur';

  const audioSrc =
    data.theme?.backgroundMusicUrl || '/templates/ever-after-bloom/soundtrack.mp3';

  return (
    <div className="relative min-h-screen w-full bg-[#fdf8ef] text-[#573b2c] font-['Karla',sans-serif] selection:bg-[#f7eee1] overflow-x-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />

      {/* ─────────────────────────────────────────────────────────────
          1. INTRO: WAX SEAL ON MARBLE PEDESTAL & FLAP VIDEO UNVEILING
      ───────────────────────────────────────────────────────────── */}
      {introStep !== 'opened' && (
        <div
          className={`fixed inset-0 z-[100] overflow-hidden bg-[#fdf8ef] transition-opacity duration-700 ${
            introStep === 'seal' || introStep === 'video'
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Envelope Opening Video (plays upon tap) */}
          <video
            ref={introVideoRef}
            src="/templates/ever-after-bloom/invite-open.mp4"
            playsInline
            muted
            preload="auto"
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={() => setIntroStep('opened')}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              introStep === 'video' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          {/* Static Wax Seal Button (Initial State) */}
          {introStep === 'seal' && (
            <button
              type="button"
              onClick={handleOpenInvitation}
              aria-label="Tap the seal to open the invitation"
              className="absolute inset-0 h-full w-full cursor-pointer select-none group"
            >
              <img
                src="/templates/ever-after-bloom/invite-seal.png"
                alt="Ivory wedding envelope with gold wax seal"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Pulsing Golden Glow behind the Wax Seal */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[46%] left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(212,175,55,0.65), transparent 70%)',
                }}
              />

              {/* Tap Cue */}
              <div className="absolute bottom-16 inset-x-0 flex flex-col items-center gap-2">
                <span className="font-['Marcellus',serif] text-xs uppercase tracking-[0.3em] text-[#a97d3e] font-semibold bg-[#fdf8ef]/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-xs">
                  Tap seal to open
                </span>
              </div>
            </button>
          )}

          {/* Skip Button */}
          <button
            type="button"
            onClick={handleSkipIntro}
            className="absolute right-5 bottom-6 z-10 rounded-full bg-[#fdf8ef]/70 px-4 py-2 font-['Karla',sans-serif] text-[0.62rem] tracking-[0.28em] text-[#573b2c] uppercase backdrop-blur-md hover:bg-[#fdf8ef] transition-all cursor-pointer shadow-xs border border-[#a97d3e]/20"
          >
            Skip
          </button>
        </div>
      )}

      {/* Floating Audio Control Button */}
      {introStep === 'opened' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMusic}
          aria-label="Toggle background soundtrack"
          className="fixed bottom-6 right-6 z-[9999] w-13 h-13 rounded-full bg-[#fdf8ef]/90 hover:bg-[#fdf8ef] text-[#573b2c] flex items-center justify-center shadow-xl border border-[#a97d3e]/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isPlayingMusic ? (
            <Volume2 className="w-5 h-5 text-[#a97d3e]" />
          ) : (
            <VolumeX className="w-5 h-5 text-[#573b2c]/60" />
          )}
        </motion.button>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION: DAWN PALACE WITH FLOATING LANTERNS
      ───────────────────────────────────────────────────────────── */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden flex flex-col justify-between items-center text-center px-4 pt-16 pb-12">
        {/* Background Palace Artwork */}
        <div className="absolute inset-0">
          <img
            src="/templates/ever-after-bloom/hero-palace.jpg"
            alt="Sandstone palace beneath blush dawn sky"
            className="h-full w-full object-cover object-bottom"
          />
        </div>

        {/* Ambient Gradient Wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(230,218,228,0.3) 0%, transparent 35%, rgba(247,238,225,0.4) 75%, rgba(253,248,239,0.85) 100%)',
          }}
        />

        {/* Lush Bougainvillea Corner Artwork */}
        <img
          src="/templates/ever-after-bloom/bougainvillea.png"
          alt="Bougainvillea"
          className="pointer-events-none absolute -top-4 -left-4 w-44 sm:w-64 h-auto object-contain opacity-95 select-none"
        />
        <img
          src="/templates/ever-after-bloom/bougainvillea.png"
          alt="Bougainvillea"
          className="pointer-events-none absolute -top-4 -right-4 w-44 sm:w-64 h-auto object-contain opacity-95 select-none -scale-x-100"
        />

        {/* Ambient Floating Lanterns */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { left: '10%', bottom: '15%', delay: '0s', size: 30 },
            { left: '22%', bottom: '38%', delay: '2s', size: 34 },
            { left: '42%', bottom: '20%', delay: '1s', size: 28 },
            { left: '60%', bottom: '45%', delay: '3s', size: 36 },
            { left: '78%', bottom: '18%', delay: '1.5s', size: 32 },
            { left: '88%', bottom: '40%', delay: '2.5s', size: 26 },
          ].map((l, i) => (
            <motion.img
              key={i}
              src="/templates/ever-after-bloom/lantern.png"
              alt=""
              initial={{ y: 0, opacity: 0.6 }}
              animate={{ y: [-20, -70, -20], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
              className="absolute drop-shadow-[0_0_14px_rgba(212,175,55,0.65)]"
              style={{ left: l.left, bottom: l.bottom, width: `${l.size}px` }}
            />
          ))}
        </div>

        {/* Top Header Inscription */}
        <div className="relative z-10 pt-4">
          <p className="font-['Karla',sans-serif] text-[0.62rem] sm:text-xs tracking-[0.5em] text-[#573b2c]/80 uppercase">
            Together with our families
          </p>
        </div>

        {/* Center Couple Names Calligraphy */}
        <div className="relative z-10 my-auto py-6">
          <h1 className="font-['Cormorant_Garamond',serif] italic text-6xl sm:text-7xl md:text-8xl text-[#573b2c] leading-none drop-shadow-xs">
            {brideName}
          </h1>
          <p className="font-['Cormorant_Garamond',serif] italic text-3xl sm:text-4xl text-[#a97d3e] my-1 sm:my-2">
            &
          </p>
          <h2 className="font-['Cormorant_Garamond',serif] italic text-6xl sm:text-7xl md:text-8xl text-[#573b2c] leading-none drop-shadow-xs">
            {groomName}
          </h2>
          <p className="mt-4 font-['Karla',sans-serif] text-[0.68rem] tracking-[0.42em] text-[#a97d3e] uppercase font-semibold">
            {data.tagline || 'Two rivers, one sky'}
          </p>
        </div>

        {/* Bottom Save the Date & Scroll Cue */}
        <div className="relative z-10 pb-4 flex flex-col items-center gap-2">
          <div className="px-6 py-2 rounded-full bg-[#fdf8ef]/80 border border-[#a97d3e]/30 shadow-xs backdrop-blur-xs">
            <span className="font-['Karla',sans-serif] text-[0.68rem] tracking-[0.3em] uppercase text-[#573b2c] font-semibold">
              Save the Date
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#a97d3e] animate-bounce" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CHAPTER ONE: THE TWO OF THEM (PORTRAITS & BIOS)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 py-24 sm:py-28 max-w-4xl mx-auto text-center">
        <p className="font-['Karla',sans-serif] text-[0.62rem] tracking-[0.4em] text-[#a97d3e] uppercase font-semibold mb-2">
          Chapter One
        </p>
        <img
          src="/templates/ever-after-bloom/gold-flourish.png"
          alt=""
          className="w-36 sm:w-44 mx-auto mb-4 opacity-80"
        />
        <h2 className="font-['Marcellus',serif] text-3xl sm:text-4xl text-[#573b2c] mb-2">
          The Two of Them
        </h2>
        <p className="font-['Cormorant_Garamond',serif] italic text-lg sm:text-xl text-[#573b2c]/80 mb-12">
          A love story in three brushstrokes
        </p>

        {/* Bride & Groom Illustrated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Bride Card */}
          <div className="p-7 sm:p-9 rounded-3xl bg-[#fcf6ed] border border-[#a97d3e]/30 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] font-['Karla',sans-serif] uppercase tracking-[0.3em] text-[#a97d3e] font-semibold mb-3">
              The Bride
            </span>
            <div className="w-44 h-56 rounded-t-full overflow-hidden border-2 border-[#a97d3e]/40 mb-4 shadow-sm">
              <img
                src={data.couple.bride.photoUrl || '/templates/ever-after-bloom/portrait-bride.jpg'}
                alt={brideName}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-['Cormorant_Garamond',serif] italic text-3xl text-[#573b2c] mb-2 font-medium">
              {brideName}
            </h3>
            <p className="font-['Cormorant_Garamond',serif] italic text-sm sm:text-base text-[#573b2c]/85 leading-relaxed max-w-sm">
              {brideBio}
            </p>
          </div>

          {/* Groom Card */}
          <div className="p-7 sm:p-9 rounded-3xl bg-[#fcf6ed] border border-[#a97d3e]/30 shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] font-['Karla',sans-serif] uppercase tracking-[0.3em] text-[#a97d3e] font-semibold mb-3">
              The Groom
            </span>
            <div className="w-44 h-56 rounded-t-full overflow-hidden border-2 border-[#a97d3e]/40 mb-4 shadow-sm">
              <img
                src={data.couple.groom.photoUrl || '/templates/ever-after-bloom/portrait-groom.jpg'}
                alt={groomName}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-['Cormorant_Garamond',serif] italic text-3xl text-[#573b2c] mb-2 font-medium">
              {groomName}
            </h3>
            <p className="font-['Cormorant_Garamond',serif] italic text-sm sm:text-base text-[#573b2c]/85 leading-relaxed max-w-sm">
              {groomBio}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. THE WAITING: LIVE COUNTDOWN CLOCK
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 py-20 bg-[#f7eee1]/60 border-y border-[#a97d3e]/20 text-center">
        <p className="font-['Karla',sans-serif] text-[0.62rem] tracking-[0.4em] text-[#a97d3e] uppercase font-semibold mb-2">
          The Waiting
        </p>
        <h2 className="font-['Marcellus',serif] text-2xl sm:text-3xl text-[#573b2c] mb-8">
          Until the gates open
        </h2>

        {/* 4 Countdown Plates */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto mb-6">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((unit, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-[#fdf8ef] border border-[#a97d3e]/30 shadow-sm flex flex-col items-center justify-center"
            >
              <span className="font-['Marcellus',serif] text-3xl sm:text-4xl text-[#573b2c] font-normal leading-tight">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="mt-1 font-['Karla',sans-serif] text-[0.55rem] sm:text-[0.62rem] tracking-[0.3em] text-[#a97d3e] uppercase font-semibold">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <p className="font-['Karla',sans-serif] text-xs tracking-[0.3em] text-[#573b2c]/75 uppercase">
          {new Date(weddingDateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. CHAPTER TWO: WHERE THE STORY GATHERS (VENUE & MAP)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 py-24 max-w-4xl mx-auto text-center">
        <p className="font-['Karla',sans-serif] text-[0.62rem] tracking-[0.4em] text-[#a97d3e] uppercase font-semibold mb-2">
          Chapter Two
        </p>
        <img
          src="/templates/ever-after-bloom/gold-flourish.png"
          alt=""
          className="w-36 sm:w-44 mx-auto mb-4 opacity-80"
        />
        <h2 className="font-['Marcellus',serif] text-3xl sm:text-4xl text-[#573b2c] mb-12">
          Where the story gathers
        </h2>

        {/* Event Plate with Details */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#fcf6ed] border border-[#a97d3e]/30 shadow-sm mb-8 text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <span className="block font-['Karla',sans-serif] text-[0.6rem] tracking-[0.36em] text-[#a97d3e] uppercase font-semibold mb-1">
                The Day
              </span>
              <p className="font-['Marcellus',serif] text-xl text-[#573b2c]">
                {new Date(weddingDateStr).toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div>
              <span className="block font-['Karla',sans-serif] text-[0.6rem] tracking-[0.36em] text-[#a97d3e] uppercase font-semibold mb-1">
                The Hour
              </span>
              <p className="font-['Marcellus',serif] text-xl text-[#573b2c]">
                {mainTime}
              </p>
            </div>

            <div>
              <span className="block font-['Karla',sans-serif] text-[0.6rem] tracking-[0.36em] text-[#a97d3e] uppercase font-semibold mb-1">
                The Place
              </span>
              <p className="font-['Marcellus',serif] text-lg text-[#573b2c] leading-snug">
                {mainVenue}
              </p>
              <p className="font-['Karla',sans-serif] text-xs text-[#573b2c]/80 mt-1">
                {mainAddress}
              </p>
            </div>

            <div>
              <span className="block font-['Karla',sans-serif] text-[0.6rem] tracking-[0.36em] text-[#a97d3e] uppercase font-semibold mb-1">
                Dress Code
              </span>
              <p className="font-['Cormorant_Garamond',serif] italic text-base text-[#573b2c]">
                {dressCode}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-[#573b2c] hover:bg-[#432d21] text-white font-['Karla',sans-serif] text-[0.66rem] tracking-[0.24em] uppercase transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>

              <button
                type="button"
                onClick={() => setIsRsvpOpen(true)}
                className="px-6 py-2.5 rounded-full border border-[#a97d3e] bg-white hover:bg-[#fdf8ef] text-[#573b2c] font-['Karla',sans-serif] text-[0.66rem] tracking-[0.24em] uppercase transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#a97d3e]" />
                <span>RSVP to Celebrate</span>
              </button>
            </div>
          </div>

          {/* Illustrated Map & Car Artwork */}
          <div className="relative rounded-2xl overflow-hidden border border-[#a97d3e]/30 shadow-xs">
            <img
              src="/templates/ever-after-bloom/map-plate.jpg"
              alt="Hand-painted Jaipur map"
              className="w-full h-auto object-cover"
            />
            <img
              src="/templates/ever-after-bloom/wedding-car.png"
              alt="Vintage car"
              className="absolute bottom-2 right-2 w-28 sm:w-36 h-auto drop-shadow-md"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CHAPTER THREE: HOW IT HAPPENED (STORY TIMELINE)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 py-24 bg-[#f7eee1]/50 border-t border-[#a97d3e]/20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-['Karla',sans-serif] text-[0.62rem] tracking-[0.4em] text-[#a97d3e] uppercase font-semibold mb-2">
            Chapter Three
          </p>
          <img
            src="/templates/ever-after-bloom/gold-flourish.png"
            alt=""
            className="w-36 sm:w-44 mx-auto mb-4 opacity-80"
          />
          <h2 className="font-['Marcellus',serif] text-3xl sm:text-4xl text-[#573b2c] mb-2">
            How it happened
          </h2>
          <p className="font-['Cormorant_Garamond',serif] italic text-lg text-[#573b2c]/80 mb-12">
            Four pages, briefly
          </p>

          {/* Courtyard Illustration */}
          <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden border border-[#a97d3e]/30 mb-12 shadow-sm">
            <img
              src="/templates/ever-after-bloom/garden-courtyard.jpg"
              alt="Garden courtyard illustration"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 4 Story Moments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#fdf8ef] border border-[#a97d3e]/25 shadow-xs">
              <span className="font-['Marcellus',serif] text-sm text-[#a97d3e] block mb-1">I</span>
              <span className="font-['Karla',sans-serif] text-[0.65rem] tracking-[0.25em] text-[#a97d3e] uppercase font-semibold block mb-2">
                December 2021
              </span>
              <h4 className="font-['Marcellus',serif] text-lg text-[#573b2c] mb-2">
                A Courtyard in Winter
              </h4>
              <p className="font-['Cormorant_Garamond',serif] italic text-sm text-[#573b2c]/85 leading-relaxed">
                They met beside a fountain at a friend's mehndi, arguing gently about whether the
                marigolds were orange or gold. Neither of them won.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdf8ef] border border-[#a97d3e]/25 shadow-xs">
              <span className="font-['Marcellus',serif] text-sm text-[#a97d3e] block mb-1">II</span>
              <span className="font-['Karla',sans-serif] text-[0.65rem] tracking-[0.25em] text-[#a97d3e] uppercase font-semibold block mb-2">
                2022 — 2024
              </span>
              <h4 className="font-['Marcellus',serif] text-lg text-[#573b2c] mb-2">
                Letters and Long Calls
              </h4>
              <p className="font-['Cormorant_Garamond',serif] italic text-sm text-[#573b2c]/85 leading-relaxed">
                Two cities, one time zone, and a habit of narrating ordinary evenings to each other
                until the ordinary began to feel rare and irreplaceable.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdf8ef] border border-[#a97d3e]/25 shadow-xs">
              <span className="font-['Marcellus',serif] text-sm text-[#a97d3e] block mb-1">III</span>
              <span className="font-['Karla',sans-serif] text-[0.65rem] tracking-[0.25em] text-[#a97d3e] uppercase font-semibold block mb-2">
                November 2024
              </span>
              <h4 className="font-['Marcellus',serif] text-lg text-[#573b2c] mb-2">
                The Terrace in Udaipur
              </h4>
              <p className="font-['Cormorant_Garamond',serif] italic text-sm text-[#573b2c]/85 leading-relaxed">
                Under Diwali paper lanterns floating over Lake Pichola, Ishaan asked. Aarohi didn't wait
                for the sentence to finish.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdf8ef] border border-[#a97d3e]/25 shadow-xs">
              <span className="font-['Marcellus',serif] text-sm text-[#a97d3e] block mb-1">IV</span>
              <span className="font-['Karla',sans-serif] text-[0.65rem] tracking-[0.25em] text-[#a97d3e] uppercase font-semibold block mb-2">
                February 2027
              </span>
              <h4 className="font-['Marcellus',serif] text-lg text-[#573b2c] mb-2">
                The Palace Gate
              </h4>
              <p className="font-['Cormorant_Garamond',serif] italic text-sm text-[#573b2c]/85 leading-relaxed">
                Where you will meet us with flowers, blessings, and unhurried smiles. The chapter where
                everyone we love steps onto the page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CHAPTER FOUR: PAINTED MOMENTS (ILLUSTRATED ALBUM)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 py-24 max-w-4xl mx-auto text-center">
        <p className="font-['Karla',sans-serif] text-[0.62rem] tracking-[0.4em] text-[#a97d3e] uppercase font-semibold mb-2">
          Chapter Four
        </p>
        <img
          src="/templates/ever-after-bloom/gold-flourish.png"
          alt=""
          className="w-36 sm:w-44 mx-auto mb-4 opacity-80"
        />
        <h2 className="font-['Marcellus',serif] text-3xl sm:text-4xl text-[#573b2c] mb-2">
          Painted moments
        </h2>
        <p className="font-['Cormorant_Garamond',serif] italic text-lg text-[#573b2c]/80 mb-12">
          A few pages from the album
        </p>

        {/* 4 Painted Scene Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left">
          {[
            {
              img: '/templates/ever-after-bloom/scene-walking.jpg',
              title: 'Walking through palace arches',
              caption: 'Morning sun warming the pink sandstone corridors.',
            },
            {
              img: '/templates/ever-after-bloom/scene-dancing.jpg',
              title: 'Under the courtyard stars',
              caption: 'Barefoot turns on marble tiles as the santoor plays.',
            },
            {
              img: '/templates/ever-after-bloom/scene-hands.jpg',
              title: 'Henna and gold bangles',
              caption: 'Fragrance of clove oil and blessings whispered by elders.',
            },
            {
              img: '/templates/ever-after-bloom/scene-balcony.jpg',
              title: 'A view of the Jaipur hills',
              caption: 'Watching dawn break over the desert city together.',
            },
          ].map((scene, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden bg-[#fcf6ed] border border-[#a97d3e]/30 shadow-sm group"
            >
              <div className="overflow-hidden aspect-4/3">
                <img
                  src={scene.img}
                  alt={scene.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h4 className="font-['Marcellus',serif] text-lg text-[#573b2c] mb-1">
                  {scene.title}
                </h4>
                <p className="font-['Cormorant_Garamond',serif] italic text-sm text-[#573b2c]/80">
                  {scene.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Couple Lanterns Illustration */}
        <div className="max-w-md mx-auto">
          <img
            src="/templates/ever-after-bloom/couple-lanterns.png"
            alt="Releasing lanterns"
            className="w-full h-auto object-contain mx-auto"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FOOTER: RELEASE A WISH LANTERN & CELEBRATION
      ───────────────────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden pt-28 pb-14 text-center">
        {/* Background Sunset Sky Artwork */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/templates/ever-after-bloom/sunset-sky.jpg"
            alt="Sunset sky"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#fdf8ef]/70 backdrop-blur-xs" />
        </div>

        {/* Floating Released Wish Lanterns Container */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          <AnimatePresence>
            {wishes.map((w) => (
              <motion.div
                key={w.id}
                initial={{ y: 0, opacity: 0, scale: 0.7 }}
                animate={{ y: -540, opacity: [0, 1, 1, 0], scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 7, ease: 'easeOut' }}
                className="absolute bottom-10 flex w-48 flex-col items-center text-center"
                style={{ left: `${w.left}%` }}
              >
                <img
                  src="/templates/ever-after-bloom/lantern.png"
                  alt="Lantern"
                  className="w-10 h-auto drop-shadow-[0_0_18px_rgba(212,175,55,0.75)]"
                />
                <span className="mt-2 font-['Cormorant_Garamond',serif] text-sm text-[#573b2c] italic bg-[#fdf8ef]/90 px-3 py-1 rounded-full border border-[#a97d3e]/30 shadow-xs">
                  {w.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="relative z-20 mx-auto max-w-xl px-6">
          <img
            src="/templates/ever-after-bloom/gold-flourish.png"
            alt=""
            className="w-40 sm:w-52 mx-auto mb-6 opacity-80"
          />

          <h2 className="font-['Cormorant_Garamond',serif] italic text-3xl sm:text-4xl text-[#573b2c] leading-snug">
            Come early. Stay late.
            <br />
            Dance badly with us.
          </h2>

          {/* Interactive Wish Lantern Trigger Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleReleaseLantern}
            className="mt-10 rounded-full px-8 py-3.5 font-['Karla',sans-serif] text-[0.66rem] tracking-[0.3em] uppercase text-[#573b2c] font-semibold bg-[#fdf8ef]/90 border border-[#a97d3e]/40 shadow-md backdrop-blur-md hover:bg-[#fdf8ef] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a97d3e]" />
            <span>Release a wish lantern</span>
          </motion.button>

          <p className="mt-12 font-['Marcellus',serif] text-lg text-[#573b2c]">
            With all our love, {brideName} & {groomName}
          </p>

          <p className="mt-3 font-['Karla',sans-serif] text-[0.6rem] tracking-[0.34em] text-[#573b2c]/65 uppercase">
            Sunday, 14 February 2027
          </p>

          <p className="mt-8 inline-flex items-center gap-1.5 font-['Karla',sans-serif] text-[0.6rem] tracking-[0.3em] text-[#573b2c]/55 uppercase">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-[#c85a6a] fill-[#c85a6a]" />
            <span>for our people</span>
          </p>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          9. RSVP MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#fdf8ef] border-2 border-[#a97d3e] rounded-3xl p-6 sm:p-8 text-[#573b2c] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsRsvpOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-[#573b2c]/60 hover:text-[#573b2c] hover:bg-[#f7eee1] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="font-['Karla',sans-serif] text-[0.62rem] uppercase tracking-[0.3em] text-[#a97d3e] font-semibold block mb-1">
                  Amrit Mahal Palace
                </span>
                <h3 className="font-['Marcellus',serif] text-2xl text-[#573b2c]">
                  Confirm Your Presence
                </h3>
              </div>

              {rsvpSubmitted ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-bounce" />
                  <h4 className="font-['Marcellus',serif] text-xl text-[#573b2c] mb-1">
                    Thank You!
                  </h4>
                  <p className="font-['Cormorant_Garamond',serif] italic text-sm text-[#573b2c]/80">
                    Your blessings and RSVP have been received with love.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-['Karla',sans-serif] font-semibold uppercase tracking-wider text-[#573b2c] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Dr. Aryan Mehta & Family"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#a97d3e]/30 focus:border-[#a97d3e] focus:outline-none text-xs text-[#573b2c] font-['Karla',sans-serif]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-['Karla',sans-serif] font-semibold uppercase tracking-wider text-[#573b2c] mb-1">
                      Will you attend?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('yes')}
                        className={`py-2 rounded-xl text-xs font-['Karla',sans-serif] font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                          rsvpAttending === 'yes'
                            ? 'bg-[#573b2c] text-white border-[#573b2c]'
                            : 'bg-white text-[#573b2c] border-[#a97d3e]/30'
                        }`}
                      >
                        Joyfully Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('no')}
                        className={`py-2 rounded-xl text-xs font-['Karla',sans-serif] font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                          rsvpAttending === 'no'
                            ? 'bg-[#573b2c] text-white border-[#573b2c]'
                            : 'bg-white text-[#573b2c] border-[#a97d3e]/30'
                        }`}
                      >
                        Regretfully Decline
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === 'yes' && (
                    <div>
                      <label className="block text-xs font-['Karla',sans-serif] font-semibold uppercase tracking-wider text-[#573b2c] mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#a97d3e]/30 focus:border-[#a97d3e] focus:outline-none text-xs text-[#573b2c] font-['Karla',sans-serif]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-['Karla',sans-serif] font-semibold uppercase tracking-wider text-[#573b2c] mb-1">
                      Warm Wishes or Dietary Note
                    </label>
                    <input
                      type="text"
                      value={dietaryInfo}
                      onChange={(e) => setDietaryInfo(e.target.value)}
                      placeholder="e.g. Vegetarian / Sending all our love!"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#a97d3e]/30 focus:border-[#a97d3e] focus:outline-none text-xs text-[#573b2c] font-['Karla',sans-serif]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full py-3 rounded-xl bg-[#573b2c] hover:bg-[#432d21] text-white font-['Karla',sans-serif] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-50 mt-2"
                  >
                    {isSubmittingRsvp ? 'Sending...' : 'Send RSVP'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

