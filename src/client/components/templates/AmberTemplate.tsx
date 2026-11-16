import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
  Check,
  Send,
  Navigation,
} from 'lucide-react';
import { TemplateProps, WeddingEvent } from '@/shared/types';
import { useConfetti } from '@/client/hooks/useConfetti';

// Default ceremony program if none specified
const DEFAULT_PROGRAM = [
  { time: '06:30 PM', title: 'Guest Arrival', note: 'Welcome & evening refreshments' },
  { time: '07:00 PM', title: 'Wedding Ceremony', note: 'Exchange of vows, varmala & rings' },
  { time: '08:00 PM', title: 'Toasts & Photos', note: 'Family greetings & joyful memories' },
  { time: '08:30 PM', title: 'Royal Dinner', note: 'A grand feast shared with love' },
];

// 3 Editorial Atmosphere images
const EDITORIAL_SLIDES = [
  {
    src: '/templates/amber/01-v2.webp',
    number: '01 / The setting',
    caption: 'Where the evening begins',
    alt: 'Ivory roses and candlelit courtyard wedding stage',
  },
  {
    src: '/templates/amber/02-v2.webp',
    number: '02 / The details',
    caption: 'Every little detail, held dear',
    alt: 'Fine mehndi, heirloom kundan and peach silk embroidery',
  },
  {
    src: '/templates/amber/03-v2.webp',
    number: '03 / Together',
    caption: 'A table filled with love',
    alt: 'An elegant courtyard dinner with ivory florals and brass thalis',
  },
];

// Dress code palette swatches
const DRESS_SWATCHES = [
  { color: '#6B1020', name: 'Ruby Silk' },
  { color: '#2D5016', name: 'Royal Emerald' },
  { color: '#B88A45', name: 'Antique Gold' },
  { color: '#3B2058', name: 'Regal Plum' },
  { color: '#1A3A5C', name: 'Midnight Navy' },
];

export function AmberTemplate({ data, previewMode = false }: TemplateProps) {
  const { couple, events, weddingDate, venue, story, rsvpDeadline, theme } = data;
  const { shootPetals, shootStars } = useConfetti();

  // Media state
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Scratch card state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef(false);
  const [isScratchRevealed, setIsScratchRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  // RSVP Form state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpAttendance, setRsvpAttendance] = useState<'attending' | 'declined'>('attending');
  const [rsvpGuests, setRsvpGuests] = useState('2');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Audio & Video refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const musicUrl = theme?.backgroundMusicUrl || '/templates/amber/music-placeholder.mp3';

  // Format date helper
  const parsedDate = new Date(weddingDate);
  const formattedDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'October 16, 2026';

  const dayOfWeek = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('en-US', { weekday: 'long' })
    : 'Friday';

  const ceremonyTime = events?.[0]?.time || '07:00 PM';

  // 1. Audio setup & sync
  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [musicUrl]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // 2. Open Invitation sequence
  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Play intro video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => {})
        .catch(() => {
          setIsVideoFinished(true);
        });
    }
    // Start background music
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {});
    }
    shootStars();
  };

  // Handle video finish or skip
  const handleVideoEnded = () => {
    setIsVideoFinished(true);
  };

  const handleSkipIntro = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVideoFinished(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // 3. Countdown timer
  useEffect(() => {
    const target = new Date(weddingDate).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  // 4. Scratch-to-Reveal Canvas Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 340;
    const height = rect.height || 180;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Fill with warm amber gold metallic foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#D4A853');
    grad.addColorStop(0.3, '#F3DE9A');
    grad.addColorStop(0.7, '#B88A45');
    grad.addColorStop(1, '#8A622A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add metallic foil speckles & sparkles
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = `rgba(255, 245, 220, ${Math.random() * 0.7 + 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add subtle text "✦ SCRATCH TO REVEAL ✦"
    ctx.fillStyle = '#5A4035';
    ctx.font = '600 13px "Cormorant Infant", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SCRATCH TO REVEAL DATE ✦', width / 2, height / 2 + 5);

    const scratch = (clientX: number, clientY: number) => {
      if (!isScratchingRef.current || isScratchRevealed) return;
      const b = canvas.getBoundingClientRect();
      const x = clientX - b.left;
      const y = clientY - b.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      // Check percentage scratched periodically
      if (Math.random() > 0.65) {
        checkScratchCompletion(ctx, width * dpr, height * dpr);
      }
    };

    const checkScratchCompletion = (c: CanvasRenderingContext2D, w: number, h: number) => {
      try {
        const imgData = c.getImageData(0, 0, w, h);
        const dataArr = imgData.data;
        let transparentCount = 0;
        const totalPixels = dataArr.length / 4;

        // Sample every 16th pixel for silky fast performance
        for (let i = 3; i < dataArr.length; i += 64) {
          if (dataArr[i] === 0) transparentCount += 16;
        }

        const pct = Math.min(100, Math.round((transparentCount / totalPixels) * 100));
        setScratchPercent(pct);

        if (pct >= 35 && !isScratchRevealed) {
          setIsScratchRevealed(true);
          shootPetals();
        }
      } catch (err) {
        // ignore fallback
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isScratchingRef.current = true;
      scratch(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      scratch(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      isScratchingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      isScratchingRef.current = true;
      if (e.touches[0]) {
        scratch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        scratch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      isScratchingRef.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isScratchRevealed, isOpen, shootPetals]);

  // Force reveal
  const handleForceReveal = () => {
    setIsScratchRevealed(true);
    setScratchPercent(100);
    shootPetals();
  };

  // Calendar .ics download
  const handleDownloadCalendar = () => {
    const title = `${couple.bride.name} & ${couple.groom.name}'s Wedding`;
    const description = `We warmly invite you to celebrate our wedding. Venue: ${venue.name}, ${venue.address}`;
    const startStr = parsedDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(parsedDate.getTime() + 4 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Shubh Vivah//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${venue.name}, ${venue.address}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${couple.bride.name}-${couple.groom.name}-Wedding.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // RSVP submit handler
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpSubmitted(true);
    shootPetals();
  };

  const programList = events && events.length > 0 ? events : DEFAULT_PROGRAM;

  return (
    <div
      className="min-h-screen bg-[#5A4035] text-[#5A4035] font-['DM_Sans',sans-serif] selection:bg-[#D4A853]/30 selection:text-[#5A4035] relative overflow-x-hidden"
      style={{
        // @ts-ignore
        '--plum': '#5A4035',
        '--ivory': '#F7EFE2',
        '--champagne': '#B88A45',
        '--mauve': '#B97D6D',
        '--lavender': '#D8B7A6',
        '--lilac': '#A8A28A',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. FLOATING EQUALIZER MUSIC TOGGLE (Sunehri Style)
      ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={toggleMusic}
        className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full border backdrop-blur-md transition-all duration-300 text-xs tracking-widest uppercase font-semibold select-none shadow-lg ${
          isPlayingMusic
            ? 'bg-[#5A4035]/90 border-[#B88A45] text-[#F7EFE2]'
            : 'bg-[#5A4035]/65 border-[#B88A45]/40 text-[#F7EFE2]/80 hover:bg-[#5A4035]/90'
        }`}
        aria-label="Toggle background music"
      >
        <span className="flex items-center gap-[2px] h-[14px]">
          <span
            className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
              isPlayingMusic ? 'h-3 animate-pulse' : 'h-1.5'
            }`}
          />
          <span
            className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
              isPlayingMusic ? 'h-4 animate-bounce' : 'h-2'
            }`}
          />
          <span
            className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
              isPlayingMusic ? 'h-2.5 animate-pulse' : 'h-1'
            }`}
          />
        </span>
        <span className="font-['DM_Sans',sans-serif] text-[10px] tracking-[0.2em]">Music</span>
      </button>

      {/* ─────────────────────────────────────────────────────────────
          2. CINEMATIC VIDEO INTRO HERO (Tap to Open / Reveal)
      ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        onClick={!isOpen ? handleOpenInvitation : undefined}
        className={`relative w-full overflow-hidden select-none transition-all duration-700 flex flex-col items-center justify-center text-center ${
          isOpen
            ? 'min-h-[92vh] sm:min-h-screen py-16 sm:py-24'
            : 'h-screen cursor-pointer'
        }`}
      >
        {/* Background Intro Video */}
        <video
          ref={videoRef}
          src="/templates/amber/opening-v3.mp4"
          poster="/templates/amber/opening-poster-v3.webp"
          playsInline
          muted
          loop={isOpen && isVideoFinished}
          onEnded={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isOpen ? 'opacity-85' : 'opacity-95'
          }`}
        />

        {/* Ambient Dark Veils */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2E1A11]/60 via-[#40271B]/40 to-[#2E1A11]/85 pointer-events-none" />

        {/* TAP TO OPEN CUE (Visible when closed) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative z-20 flex flex-col items-center gap-4 cursor-pointer"
            >
              {/* Pulsing Ripple Mark */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-[#D4A853]/60 animate-ping opacity-40" />
                <span className="absolute inset-2 rounded-full border border-[#D4A853]/40 animate-pulse" />
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#5A4035]/80 border border-[#D4A853] flex items-center justify-center text-[#F7EFE2] shadow-2xl backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4A853] animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>

              {/* Text Cue */}
              <div className="flex flex-col items-center">
                <span className="text-[#F7EFE2] font-['DM_Sans',sans-serif] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-shadow">
                  Tap to open
                </span>
                <span className="text-[#D4A853] font-['Cormorant_Infant',serif] italic text-sm mt-1">
                  Wedding Invitation · Sunehri
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO INVITATION CONTENT (Revealed when open) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: isVideoFinished ? 0.1 : 3.5 }}
              className="relative z-20 max-w-2xl mx-auto px-6 text-[#F7EFE2] flex flex-col items-center"
            >
              {/* Ornate Star */}
              <div className="text-[#D4A853] text-lg sm:text-xl mb-4 tracking-widest">
                ✦
              </div>

              {/* Welcome Line */}
              <p className="font-['DM_Sans',sans-serif] text-xs sm:text-sm uppercase tracking-[0.22em] text-[#D8B7A6] font-medium max-w-md mb-6 leading-relaxed">
                Together with their families
                <br />
                request the honour of your presence
              </p>

              {/* Couple Names & Lineage */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 my-2 sm:my-4">
                <div className="text-center sm:text-right">
                  <h1 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl md:text-6xl font-normal text-[#F7EFE2] tracking-wide leading-none">
                    {couple.bride.name}
                  </h1>
                  <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#D4A853] font-medium mt-1">
                    Daughter of
                  </p>
                  <p className="font-['Cormorant_Infant',serif] italic text-xs sm:text-sm text-[#F7EFE2]/80 mt-0.5">
                    {couple.bride.parents || 'Mr. & Mrs. George Wells'}
                  </p>
                </div>

                <span className="font-['Allura',cursive] text-4xl sm:text-5xl text-[#D4A853] my-1 sm:my-0">
                  &amp;
                </span>

                <div className="text-center sm:text-left">
                  <h1 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl md:text-6xl font-normal text-[#F7EFE2] tracking-wide leading-none">
                    {couple.groom.name}
                  </h1>
                  <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#D4A853] font-medium mt-1">
                    Son of
                  </p>
                  <p className="font-['Cormorant_Infant',serif] italic text-xs sm:text-sm text-[#F7EFE2]/80 mt-0.5">
                    {couple.groom.parents || 'Mr. & Mrs. Oliver Cole'}
                  </p>
                </div>
              </div>

              {/* Hero Closing */}
              <p className="font-['Cormorant_Infant',serif] italic text-base sm:text-lg text-[#F7EFE2]/90 max-w-sm mt-6 mb-8 leading-relaxed">
                as they begin their forever in
                <br />
                laughter and love.
              </p>

              {/* Skip Intro Button if video still playing */}
              {!isVideoFinished && (
                <button
                  type="button"
                  onClick={handleSkipIntro}
                  className="mb-6 px-4 py-1.5 rounded-full border border-[#D4A853]/40 bg-[#5A4035]/60 text-xs text-[#F7EFE2]/80 hover:text-[#F7EFE2] hover:border-[#D4A853] transition"
                >
                  Skip Intro ➔
                </button>
              )}

              {/* Scroll Cue */}
              <a
                href="#welcome"
                className="inline-flex flex-col items-center gap-1 text-[#F7EFE2]/70 hover:text-[#D4A853] transition text-xs tracking-[0.2em] uppercase font-medium mt-2"
              >
                <span>Scroll</span>
                <ChevronDown className="w-4 h-4 animate-bounce text-[#D4A853]" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FLORAL DIVIDER HELPER
      ───────────────────────────────────────────────────────────── */}
      <div className="flex justify-center py-6 sm:py-10 bg-[#F7EFE2]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. WELCOME SECTION ("A Beautiful Beginning")
      ───────────────────────────────────────────────────────────── */}
      <section id="welcome" className="py-14 sm:py-20 px-6 bg-[#F7EFE2] text-center relative">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#B97D6D]">
            Welcome
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-3 mb-5">
            A Beautiful Beginning
          </h2>
          <p className="font-['Cormorant_Infant',serif] text-lg sm:text-xl text-[#5A4035]/85 leading-relaxed italic max-w-lg mx-auto">
            &ldquo;With hearts full of gratitude, we warmly invite you to join us as we celebrate
            this beautiful union with the love and warm wishes of our families. Your presence will
            make our joy complete.&rdquo;
          </p>

          {/* Script Signatures */}
          <div className="font-['Allura',cursive] text-4xl sm:text-5xl text-[#B97D6D] mt-8 flex items-center justify-center gap-2">
            <span>{couple.bride.name}</span>
            <span className="font-['Cormorant_Infant',serif] text-xl italic text-[#B88A45]">&amp;</span>
            <span>{couple.groom.name}</span>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#E7D3B8]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE SCRATCH-TO-REVEAL SAVE THE DATE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#E7D3B8] text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#B97D6D]">
            A date to hold close
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-2 mb-3">
            Scratch to Reveal
          </h2>
          <div className="w-12 h-[1px] bg-[#B88A45]/60 mx-auto mb-8" />

          {/* Ornate Frame Container */}
          <div className="relative w-full max-w-[420px] aspect-[1536/1024] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[#B88A45]/30">
            {/* Background window gradient */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
              style={{
                background: 'radial-gradient(circle at 50% 42%, #FCF5EE, #F4E6DC 70%, #EBD6CB)',
              }}
            >
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#B97D6D]">
                You&apos;re Invited!
              </span>
              <h3 className="font-['Cormorant_Infant',serif] text-2xl sm:text-4xl font-normal text-[#5A4035] my-1 sm:my-2">
                {formattedDate}
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-[#5A4035]/80 font-['DM_Sans',sans-serif]">
                <span>{dayOfWeek}</span>
                <span className="text-[#B88A45]">⬩</span>
                <span>{ceremonyTime}</span>
              </div>
            </div>

            {/* Canvas Scratch Layer */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full cursor-pointer z-10 transition-opacity duration-700 ${
                isScratchRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            />

            {/* Frame Ornate Overlay */}
            <img
              src="/templates/amber/scratch-frame-v2.webp"
              alt="Ornate frame overlay"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-20"
            />
          </div>

          <p className="text-xs sm:text-sm text-[#5A4035]/75 font-['DM_Sans',sans-serif] mt-5">
            {isScratchRevealed
              ? '✨ Date unlocked! We cannot wait to celebrate with you.'
              : 'Use your finger or cursor to uncover the moment.'}
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            {!isScratchRevealed && (
              <button
                type="button"
                onClick={handleForceReveal}
                className="text-xs text-[#5A4035] underline underline-offset-4 hover:text-[#B88A45] transition font-medium"
              >
                Reveal Date Automatically
              </button>
            )}

            <button
              type="button"
              onClick={handleDownloadCalendar}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5A4035] text-[#F7EFE2] text-xs sm:text-sm tracking-wider uppercase font-semibold hover:bg-[#40271B] transition shadow-md"
            >
              <Calendar className="w-4 h-4 text-[#D4A853]" />
              Add to Calendar
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#F8EFE1]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. ATMOSPHERE EDITORIAL ("An evening in bloom")
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-[#F8EFE1] text-center relative">
        <div className="max-w-4xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#B97D6D]">
            The atmosphere
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-2 mb-3">
            An evening in bloom
          </h2>
          <div className="w-12 h-[1px] bg-[#B88A45]/60 mx-auto mb-10" />

          {/* Desktop 3-Card Staggered Arched Layout */}
          <div className="hidden md:grid grid-cols-3 gap-6 items-center">
            {EDITORIAL_SLIDES.map((slide, idx) => (
              <figure
                key={idx}
                className={`relative aspect-[4/5] rounded-t-[120px] rounded-b-md overflow-hidden shadow-xl border border-[#B88A45]/20 group transition-all duration-500 ${
                  idx === 1 ? 'translate-y-6' : ''
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#26180E]/85 via-transparent to-transparent" />
                <figcaption className="absolute bottom-5 left-5 right-5 text-left text-[#FFF6E5]">
                  <span className="block text-[10px] tracking-[0.18em] uppercase font-['DM_Sans',sans-serif] text-[#D4A853] mb-1 font-semibold">
                    {slide.number}
                  </span>
                  <span className="font-['Cormorant_Infant',serif] italic text-lg sm:text-xl leading-snug">
                    {slide.caption}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Mobile Swiper / Carousel */}
          <div className="md:hidden relative max-w-sm mx-auto">
            <figure className="relative aspect-[4/5] rounded-t-[100px] rounded-b-md overflow-hidden shadow-xl border border-[#B88A45]/20">
              <img
                src={EDITORIAL_SLIDES[activeSlide].src}
                alt={EDITORIAL_SLIDES[activeSlide].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#26180E]/85 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 right-5 text-left text-[#FFF6E5]">
                <span className="block text-[10px] tracking-[0.18em] uppercase font-['DM_Sans',sans-serif] text-[#D4A853] mb-1 font-semibold">
                  {EDITORIAL_SLIDES[activeSlide].number}
                </span>
                <span className="font-['Cormorant_Infant',serif] italic text-lg leading-snug">
                  {EDITORIAL_SLIDES[activeSlide].caption}
                </span>
              </figcaption>
            </figure>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {EDITORIAL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full border border-[#95613C] transition-all ${
                    activeSlide === i ? 'bg-[#95613C] scale-125' : 'bg-transparent'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#F7EFE2]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. COUNTDOWN TIMER ("Until we say I do")
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F7EFE2] text-center relative">
        <div className="max-w-2xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#B97D6D]">
            Until we say I do
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-2 mb-3">
            Counting every heartbeat
          </h2>
          <div className="w-12 h-[1px] bg-[#B88A45]/60 mx-auto mb-10" />

          {/* 4 Digital Timer Cards */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Minutes' },
              { val: timeLeft.seconds, label: 'Seconds' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FCF5EE] border border-[#B88A45]/30 rounded-xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-md"
              >
                <span className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] leading-none">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#B97D6D] mt-2 font-['DM_Sans',sans-serif]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#F7EFE2]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          7. PROGRAM / TIMELINE ("Our Wedding Day")
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F7EFE2] text-center relative">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#B97D6D]">
            The celebration
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-2 mb-3">
            Our Wedding Day
          </h2>
          <div className="w-12 h-[1px] bg-[#B88A45]/60 mx-auto mb-12" />

          {/* Vertical Timeline */}
          <div className="relative text-left max-w-md mx-auto pl-2">
            {/* Connecting Golden Line */}
            <div className="absolute top-4 bottom-4 left-[86px] sm:left-[96px] w-[1px] bg-[#B88A45]/40" />

            {programList.map((item, idx) => (
              <div
                key={idx}
                className="relative grid grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] gap-6 sm:gap-8 items-start py-5"
              >
                {/* Time */}
                <time className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#B97D6D] text-right pt-0.5 font-['DM_Sans',sans-serif]">
                  {'time' in item ? item.time : '07:00 PM'}
                </time>

                {/* Bullet Marker */}
                <div className="absolute left-[86px] sm:left-[96px] top-[26px] w-[9px] h-[9px] rounded-full bg-[#B88A45] border-2 border-[#F7EFE2] -translate-x-1/2 z-10" />

                {/* Event Info */}
                <div className="pl-3">
                  <h3 className="font-['Cormorant_Infant',serif] text-xl sm:text-2xl font-normal text-[#5A4035] leading-tight">
                    {'title' in item ? item.title : (item as WeddingEvent).title}
                  </h3>
                  <p className="font-['Cormorant_Infant',serif] italic text-sm text-[#5A4035]/70 mt-1">
                    {'note' in item
                      ? (item as any).note
                      : (item as WeddingEvent).description || (item as WeddingEvent).venueName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#5A4035]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-80 invert hue-rotate-180 brightness-150"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          8. THE VENUE CARD
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#5A4035] text-center relative">
        <div className="max-w-2xl mx-auto">
          <div className="relative p-8 sm:p-14 rounded-2xl border border-[#B88A45]/50 bg-gradient-to-b from-[#40271B] to-[#2E1A11] text-[#F7EFE2] shadow-2xl overflow-hidden">
            {/* Inner Border */}
            <div className="absolute inset-3 border border-[#B88A45]/30 rounded-xl pointer-events-none" />

            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#D4A853]">
              The Venue
            </span>

            <div className="text-[#D4A853] text-lg my-3">✦</div>

            <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#F7EFE2] mb-3">
              {venue.name || 'Rambagh Palace'}
            </h2>

            <p className="font-['DM_Sans',sans-serif] text-sm sm:text-base text-[#F7EFE2]/80 max-w-md mx-auto mb-8 leading-relaxed">
              {venue.address || 'Bhawani Singh Road, Jaipur, Rajasthan, India'}
            </p>

            <a
              href={
                venue.mapUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${venue.name} ${venue.address}`
                )}`
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4A853] bg-[#5A4035]/80 text-[#F7EFE2] text-xs sm:text-sm tracking-wider uppercase font-semibold hover:bg-[#D4A853] hover:text-[#2E1A11] transition-all shadow-lg"
            >
              <Navigation className="w-4 h-4" />
              View on Google Maps
            </a>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#F7EFE2]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          9. DRESS CODE ("Festive Formal")
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F7EFE2] text-center relative">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#B97D6D]">
            Dress code
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-2 mb-3">
            Festive Formal
          </h2>
          <p className="font-['Cormorant_Infant',serif] text-base sm:text-lg text-[#5A4035]/80 italic max-w-lg mx-auto mb-8 leading-relaxed">
            Traditional or formal attire is encouraged. Shalwar Kameez, Sherwani, Kurta, Lehenga,
            Saree, Anarkali, and formal suits are all warmly welcome. We kindly ask guests to dress
            elegantly for the occasion.
          </p>

          {/* Color Palette Swatches */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {DRESS_SWATCHES.map((swatch, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-md border-2 border-[#FCF5EE] transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.name}
                />
                <span className="text-[10px] font-['DM_Sans',sans-serif] uppercase tracking-wider text-[#5A4035]/70">
                  {swatch.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#F7EFE2]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          10. THE FESTIVITIES (Multi-Event Itinerary Cards)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F7EFE2] text-center relative">
        <div className="max-w-4xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#B97D6D]">
            The Festivities
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-2 mb-3">
            Days filled with joy
          </h2>
          <div className="w-12 h-[1px] bg-[#B88A45]/60 mx-auto mb-10" />

          {/* Grid of 4 Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-center">
            {[
              {
                title: 'Welcome Night',
                date: 'October 15, 2026',
                time: '5:00 PM — 8:00 PM',
                venue: 'Courtyard Terrace, Rambagh Palace',
                icon: '🌿',
              },
              {
                title: 'Wedding Ceremony',
                date: 'October 16, 2026',
                time: '7:00 PM — 10:00 PM',
                venue: 'Mughal Gardens, Rambagh Palace',
                icon: '💍',
              },
              {
                title: 'Celebration & Sangeet',
                date: 'October 17, 2026',
                time: '7:00 PM — 10:00 PM',
                venue: 'Jaigarh Ballroom, Rambagh Palace',
                icon: '✨',
              },
              {
                title: 'Royal Reception',
                date: 'October 18, 2026',
                time: '7:00 PM — 10:00 PM',
                venue: 'Grand Durbar Hall, Rambagh Palace',
                icon: '👑',
              },
            ].map((evt, idx) => (
              <div
                key={idx}
                className="relative p-6 sm:p-8 rounded-2xl border border-[#CDAF78] bg-gradient-to-br from-[#EFE8DC] via-[#EAE2D5] to-[#E5DCCD] text-[#5A4035] shadow-lg hover:-translate-y-1 transition duration-300"
              >
                {/* Inner Border */}
                <div className="absolute inset-2 border border-[#CDAF78]/40 rounded-xl pointer-events-none" />

                <div className="text-3xl mb-2">{evt.icon}</div>
                <h3 className="font-['Allura',cursive] text-3xl sm:text-4xl text-[#5A4035] mb-2">
                  {evt.title}
                </h3>
                <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#B87868] mb-1 font-['DM_Sans',sans-serif]">
                  {evt.date}
                </p>
                <p className="text-xs text-[#5A4035]/80 font-medium mb-3 font-['DM_Sans',sans-serif]">
                  {evt.time}
                </p>
                <p className="font-['Cormorant_Infant',serif] italic text-sm text-[#5A4035]/75">
                  {evt.venue}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button
              type="button"
              onClick={handleDownloadCalendar}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5A4035] text-[#F7EFE2] text-xs sm:text-sm tracking-wider uppercase font-semibold hover:bg-[#40271B] transition shadow-md"
            >
              <Calendar className="w-4 h-4 text-[#D4A853]" />
              Add all festivities to calendar
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#F7EFE2]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          11. GIFTS NOTE ("Your presence is our present")
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F7EFE2] text-center relative">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#B97D6D]">
            With all our hearts
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-2 mb-4">
            Your presence is our present
          </h2>
          <p className="font-['Cormorant_Infant',serif] italic text-lg sm:text-xl text-[#5A4035]/85 max-w-lg mx-auto leading-relaxed">
            &ldquo;Your love, blessings and warm wishes are the greatest gifts we could ever ask
            for. Having you celebrate alongside us is our truest treasure.&rdquo;
          </p>
        </div>
      </section>

      <div className="flex justify-center py-6 sm:py-8 bg-[#F7EFE2]">
        <img
          src="/templates/amber/floral-divider-v2.webp"
          alt="Floral ornament"
          className="max-w-[130px] sm:max-w-[170px] opacity-85"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          12. INTERACTIVE RSVP FORM & BLESSINGS
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-[#F7EFE2] text-center relative">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#B97D6D]">
            Celebrate with us
          </span>
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#5A4035] mt-2 mb-3">
            RSVP &amp; Blessings
          </h2>
          <p className="text-xs uppercase tracking-[0.16em] text-[#5A4035]/70 mb-8 font-['DM_Sans',sans-serif]">
            Kindly respond by {rsvpDeadline || 'October 1, 2026'}
          </p>

          {rsvpSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-[#FCF5EE] border border-[#B88A45]/40 text-[#5A4035] shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-[#B88A45]/20 text-[#B88A45] flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-['Cormorant_Infant',serif] text-2xl font-normal text-[#5A4035] mb-2">
                Thank you, {rsvpName}!
              </h3>
              <p className="font-['Cormorant_Infant',serif] italic text-base text-[#5A4035]/80">
                {rsvpAttendance === 'attending'
                  ? 'Your response has been joyfully recorded. We cannot wait to celebrate with you!'
                  : 'We have received your response and will miss your presence on our special day.'}
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleRsvpSubmit}
              className="p-6 sm:p-8 rounded-2xl bg-[#FCF5EE] border border-[#B88A45]/30 text-left shadow-lg space-y-4"
            >
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-[#5A4035] mb-1 font-['DM_Sans',sans-serif]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#B88A45]/40 bg-white/80 focus:bg-white focus:outline-none focus:border-[#B88A45] text-sm text-[#5A4035]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-[#5A4035] mb-1 font-['DM_Sans',sans-serif]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={rsvpEmail}
                  onChange={(e) => setRsvpEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#B88A45]/40 bg-white/80 focus:bg-white focus:outline-none focus:border-[#B88A45] text-sm text-[#5A4035]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-[#5A4035] mb-1 font-['DM_Sans',sans-serif]">
                    Attendance
                  </label>
                  <select
                    value={rsvpAttendance}
                    onChange={(e) => setRsvpAttendance(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#B88A45]/40 bg-white/80 focus:bg-white focus:outline-none focus:border-[#B88A45] text-sm text-[#5A4035]"
                  >
                    <option value="attending">Joyfully Accepts</option>
                    <option value="declined">Regretfully Declines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-[#5A4035] mb-1 font-['DM_Sans',sans-serif]">
                    Number of Guests
                  </label>
                  <select
                    value={rsvpGuests}
                    onChange={(e) => setRsvpGuests(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#B88A45]/40 bg-white/80 focus:bg-white focus:outline-none focus:border-[#B88A45] text-sm text-[#5A4035]"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-semibold text-[#5A4035] mb-1 font-['DM_Sans',sans-serif]">
                  Warm Wishes / Dietary Notes
                </label>
                <textarea
                  rows={3}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Share a blessing or any dietary preferences..."
                  className="w-full px-4 py-2.5 rounded-lg border border-[#B88A45]/40 bg-white/80 focus:bg-white focus:outline-none focus:border-[#B88A45] text-sm text-[#5A4035] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#5A4035] text-[#F7EFE2] font-semibold uppercase tracking-wider text-xs sm:text-sm hover:bg-[#40271B] transition shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4 text-[#D4A853]" />
                Confirm RSVP
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. CLOSING BLESSINGS FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="py-20 sm:py-28 px-4 sm:px-6 bg-[#40271B] text-[#F7EFE2] text-center relative border-t border-[#B88A45]/40">
        <div className="max-w-xl mx-auto">
          {/* Light Ornament */}
          <div className="text-[#D4A853] text-lg mb-4">✦</div>

          <p className="font-['Cormorant_Infant',serif] italic text-2xl sm:text-3xl text-[#F7EFE2] mb-2 leading-relaxed">
            &ldquo;Two hearts, one beautiful journey.&rdquo;
          </p>
          <p className="font-['DM_Sans',sans-serif] text-xs sm:text-sm uppercase tracking-[0.2em] text-[#D8B7A6] mb-8 font-medium">
            May your life together be filled with laughter, kindness and endless love.
          </p>

          <h2 className="font-['Cormorant_Infant',serif] text-2xl sm:text-4xl font-normal text-[#F7EFE2] mb-4">
            We can&apos;t wait to celebrate with you.
          </h2>

          <div className="font-['Allura',cursive] text-4xl sm:text-6xl text-[#D4A853] my-6 flex items-center justify-center gap-3">
            <span>{couple.bride.name}</span>
            <span className="font-['Cormorant_Infant',serif] text-2xl italic text-[#F7EFE2]">&amp;</span>
            <span>{couple.groom.name}</span>
          </div>

          <p className="text-xs uppercase tracking-[0.22em] text-[#F7EFE2]/70 font-semibold font-['DM_Sans',sans-serif] mt-2">
            {formattedDate} ⬩ {venue.name || 'Jaipur, Rajasthan'}
          </p>

          {/* Sunehri Brand Signature */}
          <div className="mt-16 pt-8 border-t border-[#B88A45]/20 flex flex-col items-center gap-1 text-[#F7EFE2]/50 text-xs tracking-widest uppercase">
            <span className="font-['Cormorant_Infant',serif] text-sm tracking-[0.3em] text-[#D4A853]">
              SUNEHRI
            </span>
            <span className="text-[10px] tracking-[0.16em]">Candlelit celebrations</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
