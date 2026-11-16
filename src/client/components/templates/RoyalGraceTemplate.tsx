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
  Car,
  Hotel,
} from 'lucide-react';
import { TemplateProps, RSVPRecord, WishRecord } from '@/shared/types';
import { useConfetti } from '@/client/hooks/useConfetti';

// Gold-Sage Foil Palette for Scratch Card
const SCRATCH_PALETTE = {
  gradStart: '#eee6d2',
  gradMid: '#9aa584',
  gradEnd: '#4a5540',
  speckLight: '238, 230, 210',
  speckMid: '154, 165, 132',
  speckDark: '74, 85, 64',
  sparkle: '247, 242, 230',
  revealBg: 'hsl(45, 42%, 96%)',
};

export function RoyalGraceTemplate({ data, previewMode = false }: TemplateProps) {
  // Video Intro & Music State
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [showHeroText, setShowHeroText] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isScratchRevealed, setIsScratchRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  // Audio & Video Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef(false);

  // Modals & Forms
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

  const { shootPetals } = useConfetti();

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const weddingDateStr = data.weddingDate || '2027-01-31';

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${weddingDateStr}T10:30:00`).getTime();
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

  // Audio source: Zareqia Royal Grace soundtrack (track3.mp3) or custom
  const audioSrc =
    data.theme?.backgroundMusicUrl ||
    'https://zareqia.com/__l5e/assets-v1/d58c0b7f-ae8f-429c-bb86-d0dee3a95d9b/track3.mp3';

  // Handle Video Tap / Click to Start Experience
  const handleStartExperience = async () => {
    if (isVideoStarted) return;
    setIsVideoStarted(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    if (audioRef.current) {
      audioRef.current.volume = 0.9;
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {});
    }

    // After 5.5s, animate couple names into view if not already shown
    setTimeout(() => {
      setShowHeroText(true);
    }, 5500);
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 4.5 && !showHeroText) {
      setShowHeroText(true);
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

  // Canvas Scratch Card Implementation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isScratchRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 340;
    const height = rect.height || 180;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Draw shimmering gold-sage foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, SCRATCH_PALETTE.gradStart);
    grad.addColorStop(0.5, SCRATCH_PALETTE.gradMid);
    grad.addColorStop(1, SCRATCH_PALETTE.gradEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add metallic foil speckles & sparkles
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = `rgba(${SCRATCH_PALETTE.sparkle}, ${Math.random() * 0.6 + 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.8 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add subtle text "✨ Scratch to Reveal Date ✨"
    ctx.fillStyle = '#3E5634';
    ctx.font = '600 13px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SCRATCH TO REVEAL DATE ✦', width / 2, height / 2 + 5);

    // Scratch drawing function
    const scratch = (clientX: number, clientY: number) => {
      if (!isScratchingRef.current || isScratchRevealed) return;
      const b = canvas.getBoundingClientRect();
      const x = clientX - b.left;
      const y = clientY - b.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      // Check scratched percentage periodically
      if (Math.random() > 0.7) {
        checkScratchCompletion(ctx, width * dpr, height * dpr);
      }
    };

    const checkScratchCompletion = (c: CanvasRenderingContext2D, w: number, h: number) => {
      try {
        const imgData = c.getImageData(0, 0, w, h);
        const dataArr = imgData.data;
        let transparentCount = 0;
        const totalPixels = dataArr.length / 4;

        // Sample every 16th pixel for performance
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
        // Fallback
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
  }, [isScratchRevealed, shootPetals]);

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

  const groomName = data.couple.groom.name || 'Zayn';
  const brideName = data.couple.bride.name || 'Nora';
  const groomParents = data.couple.groom.parents || 'Son of Mr. & Mrs. Malik';
  const brideParents = data.couple.bride.parents || 'Daughter of Mr. & Mrs. Nasser';

  const dateObj = new Date(weddingDateStr);
  const formattedDay = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedMonth = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const formattedDateNum = dateObj.getDate();
  const formattedYear = dateObj.getFullYear();

  return (
    <div className="relative min-h-screen bg-[#D6C5AC] text-[#3B4432] font-['Cormorant_Garamond',serif] selection:bg-[#C9D6B8] overflow-x-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />

      {/* Floating Music Control */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onClick={toggleMusic}
        aria-label="Toggle background music"
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#3E5634] hover:bg-[#2F4227] text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#D4AF37]/50"
      >
        {isPlayingMusic ? (
          <Volume2 className="w-6 h-6 text-[#FAF2E6]" />
        ) : (
          <VolumeX className="w-6 h-6 text-[#FAF2E6]/80" />
        )}
      </motion.button>

      {/* ─────────────────────────────────────────────────────────────
          1. HERO VIDEO INTRO (demo-v3-royal-grace.mp4)
      ───────────────────────────────────────────────────────────── */}
      <section
        onClick={handleStartExperience}
        className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-[#0F0F0F] cursor-pointer"
      >
        {/* Looping Ambient Video */}
        <video
          ref={videoRef}
          src="https://zareqia.com/__l5e/assets-v1/ed2c9cdc-e26f-46e3-8d7e-c91764fe28f1/demo-v3-royal-grace.mp4"
          playsInline
          muted
          loop
          onTimeUpdate={handleVideoTimeUpdate}
          className="absolute inset-0 h-full w-full object-cover select-none"
        />

        {/* Tap to Start Prompt (fades out after tap) */}
        {!isVideoStarted && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs select-none">
            <div className="p-4 rounded-full bg-[#3E5634]/90 border border-[#D4AF37]/60 text-white mb-4 animate-pulse shadow-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="font-['Cinzel',serif] text-xs sm:text-sm tracking-[0.3em] uppercase text-white font-medium drop-shadow-md">
              Tap to Open Invitation
            </span>
          </div>
        )}

        {/* Animated Couple Header Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showHeroText ? 1 : 0, y: showHeroText ? 0 : 30 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative -top-10 md:-top-16 z-10 flex w-full flex-col items-center justify-center px-6 text-center pointer-events-none"
        >
          {/* Delicate Laurel Emblem */}
          <div className="mb-3 text-[#3B4432] drop-shadow-sm">
            <Heart className="w-7 h-7 mx-auto fill-current" />
          </div>

          <p
            className="mb-2 font-['Dancing_Script',cursive] text-2xl sm:text-4xl text-[#3B4432] tracking-wide"
            style={{ textShadow: '0 2px 14px rgba(255,255,255,0.7)' }}
          >
            We Are Getting Married
          </p>

          {/* Ornamental Divider */}
          <div className="my-3 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[#3B4432]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B4432]" />
            <div className="h-px w-16 bg-[#3B4432]/50" />
          </div>

          {/* Groom Name */}
          <div className="space-y-0.5">
            <h1
              className="font-['Dancing_Script',cursive] text-6xl sm:text-8xl md:text-9xl text-[#3B4432] leading-none"
              style={{ textShadow: '0 2px 16px rgba(255,255,255,0.7)' }}
            >
              {groomName}
            </h1>
            <p className="text-xs sm:text-sm font-['Cinzel',serif] uppercase tracking-widest text-[#3B4432]/90">
              {groomParents}
            </p>
          </div>

          <span
            className="my-1 sm:my-2 font-['Dancing_Script',cursive] text-3xl sm:text-5xl text-[#3B4432]/85"
            style={{ textShadow: '0 2px 10px rgba(255,255,255,0.6)' }}
          >
            &
          </span>

          {/* Bride Name */}
          <div className="space-y-0.5">
            <h1
              className="font-['Dancing_Script',cursive] text-6xl sm:text-8xl md:text-9xl text-[#3B4432] leading-none"
              style={{ textShadow: '0 2px 16px rgba(255,255,255,0.7)' }}
            >
              {brideName}
            </h1>
            <p className="text-xs sm:text-sm font-['Cinzel',serif] uppercase tracking-widest text-[#3B4432]/90">
              {brideParents}
            </p>
          </div>
        </motion.div>

        {/* Scroll Cue */}
        {showHeroText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ opacity: { duration: 0.8 }, y: { duration: 2, repeat: Infinity } }}
            className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-1.5 pointer-events-none"
          >
            <span
              className="text-xs uppercase font-['Cinzel',serif] font-bold tracking-[0.25em] text-[#3B4432]"
              style={{ textShadow: '0 1px 3px rgba(255,255,255,0.9)' }}
            >
              Scroll
            </span>
            <ChevronDown
              className="w-6 h-6 text-[#3B4432]"
              style={{ filter: 'drop-shadow(0 1px 3px rgba(255,255,255,0.9))' }}
            />
          </motion.div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SEAMLESS REPEATING ROYAL GRACE BACKGROUND FLOW
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#D6C5AC',
          backgroundImage: `url('https://zareqia.com/__l5e/assets-v1/5dfd7a80-483d-4a6d-860d-da3e341fa151/royal-grace-welcome-bg.jpg'), url('https://zareqia.com/__l5e/assets-v1/272e334b-37a6-4ac3-a323-2eac657eb963/royal-grace-general-bg.jpg')`,
          backgroundPosition: 'top center, center 140.48vw',
          backgroundRepeat: 'no-repeat, repeat-y',
          backgroundSize: '100% auto, 100% auto',
        }}
        className="relative z-10"
      >
        {/* Welcome Message Section */}
        <section className="relative px-6 py-20 md:py-28 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#8A7A4E]" />
            <Heart className="w-3.5 h-3.5 text-[#8A7A4E] fill-current" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#8A7A4E]" />
          </div>

          <p
            className="font-['Dancing_Script',cursive] text-2xl sm:text-3xl leading-relaxed italic text-[#3B4432] whitespace-pre-line"
            style={{ textShadow: '0 1px 6px rgba(255,255,255,0.6)' }}
          >
            {data.welcomeMessage ||
              `We are honored to welcome you to the wedding celebration of ${groomName} & ${brideName}.\nAs we begin our journey together in love and faith, we thank you for being part of this blessed occasion.`}
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#8A7A4E]" />
            <Heart className="w-3.5 h-3.5 text-[#8A7A4E] fill-current" />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#8A7A4E]" />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. INTERACTIVE SCRATCH-TO-REVEAL SAVE THE DATE CARD
        ───────────────────────────────────────────────────────────── */}
        <section className="px-4 py-8 max-w-lg mx-auto text-center">
          <div className="relative rounded-2xl bg-[#F6EFE3] border border-[#CBB89D] shadow-xl p-6 overflow-hidden">
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#3E5634] block mb-2 font-semibold">
              Save The Date
            </span>

            {/* Revealed Content underneath */}
            <div className="py-6 space-y-4">
              <p className="font-['Cinzel',serif] text-xs uppercase tracking-widest text-[#8A7A4E]">
                {formattedDay}
              </p>
              <div className="font-['Cinzel',serif] text-4xl sm:text-5xl font-bold text-[#3E5634] tracking-wide">
                {formattedDateNum} {formattedMonth} {formattedYear}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm font-['Cinzel',serif] text-[#5C6650]">
                <Clock className="w-4 h-4 text-[#3E5634]" />
                <span>10:30 AM Onwards</span>
              </div>
              <p className="font-['Dancing_Script',cursive] text-xl text-[#3B4432] italic">
                {data.events[0]?.venueName || 'Grand Palace Hall'}
              </p>
            </div>

            {/* HTML5 Scratch Foil Canvas Overlay */}
            {!isScratchRevealed && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none select-none rounded-2xl transition-opacity duration-700"
                style={{ opacity: scratchPercent > 35 ? 0 : 1 }}
              />
            )}

            {/* Status prompt */}
            <div className="mt-4 pt-3 border-t border-[#DFCBB0] flex items-center justify-between text-xs text-[#5C6650]">
              <span className="font-['Cinzel',serif]">
                {isScratchRevealed ? '✓ Date Unlocked!' : '✨ Swipe finger to scratch'}
              </span>
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  `${groomName} & ${brideName}'s Wedding`
                )}&dates=${weddingDateStr.replace(/-/g, '')}T103000Z/${weddingDateStr.replace(
                  /-/g,
                  ''
                )}T180000Z&details=${encodeURIComponent(
                  `Wedding celebration of ${groomName} & ${brideName}`
                )}&location=${encodeURIComponent(data.events[0]?.venueName || 'Grand Palace Hall')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3E5634] font-semibold underline flex items-center gap-1 hover:text-[#2F4227]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. LIVE COUNTDOWN CLOCK
        ───────────────────────────────────────────────────────────── */}
        <section className="px-4 py-12 max-w-lg mx-auto text-center">
          <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#3E5634] block mb-2 font-semibold">
            Countdown to the Celebration
          </span>
          <h3 className="font-['Dancing_Script',cursive] text-4xl sm:text-5xl text-[#3B4432] mb-6">
            The Big Day In
          </h3>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl bg-[#FAF2E6]/90 border border-[#DFCBB0] shadow-sm flex flex-col items-center"
              >
                <span className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-[#3E5634]">
                  {String(t.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-['Cinzel',serif] tracking-wider text-[#8A7A4E] mt-1">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            5. PROGRAM TIMELINE
        ───────────────────────────────────────────────────────────── */}
        <section className="px-4 py-12 max-w-xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#3E5634] block mb-2 font-semibold">
              Celebration Itinerary
            </span>
            <h3 className="font-['Dancing_Script',cursive] text-4xl sm:text-5xl text-[#3B4432]">
              Program Timeline
            </h3>
            <div className="w-16 h-px bg-[#8A7A4E] mx-auto mt-3" />
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-px before:bg-[#8A7A4E]/40">
            {data.events.map((evt, idx) => (
              <div key={evt.id || idx} className="relative flex items-start gap-5 pl-3">
                <div className="w-6 h-6 rounded-full bg-[#3E5634] text-white flex items-center justify-center text-[11px] font-serif shrink-0 mt-1 shadow z-10">
                  {idx + 1}
                </div>
                <div className="flex-1 p-5 rounded-2xl bg-[#FAF2E6]/90 border border-[#DFCBB0] shadow-sm text-left">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-['Cinzel',serif] text-base sm:text-lg font-bold text-[#3B4432]">
                      {evt.title}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8DEC7] text-xs font-['Cinzel',serif] font-semibold text-[#3E5634]">
                      {evt.time}
                    </span>
                  </div>
                  {evt.description && (
                    <p className="text-sm text-[#5C6650] font-['Cormorant_Garamond',serif] leading-relaxed mb-2">
                      {evt.description}
                    </p>
                  )}
                  <p className="text-xs text-[#8A7A4E] flex items-center gap-1 font-['Cinzel',serif]">
                    <MapPin className="w-3.5 h-3.5 text-[#3E5634]" />
                    <span>{evt.venueName}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            6. VENUE & GOOGLE MAPS
        ───────────────────────────────────────────────────────────── */}
        <section className="px-4 py-12 max-w-xl mx-auto text-center">
          <div className="p-8 rounded-2xl bg-[#FAF2E6]/95 border border-[#DFCBB0] shadow-md">
            <div className="w-12 h-12 rounded-full bg-[#E8DEC7] text-[#3E5634] flex items-center justify-center mx-auto mb-4 border border-[#CBB89D]">
              <MapPin className="w-6 h-6" />
            </div>

            <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#3E5634] block mb-2 font-semibold">
              Venue Location
            </span>
            <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#3B4432] mb-2 font-bold">
              {data.events[0]?.venueName || 'Grand Palace Hall'}
            </h3>
            <p className="text-sm text-[#5C6650] font-['Cormorant_Garamond',serif] max-w-md mx-auto mb-6">
              {data.events[0]?.address || 'City Centre, London'}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3E5634] hover:bg-[#2F4227] text-white font-['Cinzel',serif] text-xs tracking-widest uppercase transition-all shadow cursor-pointer"
            >
              <span>View on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            7. DRESS CODE & GUEST GUIDANCE
        ───────────────────────────────────────────────────────────── */}
        <section className="px-4 py-8 max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Women */}
          <div className="p-6 rounded-2xl bg-[#FAF2E6]/90 border border-[#DFCBB0] shadow-sm text-center">
            <Heart className="w-5 h-5 text-[#8A7A4E] mx-auto mb-2" />
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-wider text-[#3E5634] block mb-1 font-semibold">
              Dress Code · Women
            </span>
            <p className="text-sm text-[#3B4432] italic">
              Elegant formal attire in pastel or jewel tones
            </p>
          </div>

          {/* Men */}
          <div className="p-6 rounded-2xl bg-[#FAF2E6]/90 border border-[#DFCBB0] shadow-sm text-center">
            <Sparkles className="w-5 h-5 text-[#8A7A4E] mx-auto mb-2" />
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-wider text-[#3E5634] block mb-1 font-semibold">
              Dress Code · Men
            </span>
            <p className="text-sm text-[#3B4432] italic">
              Suit or traditional formal wear
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            8. ACCOMMODATION & TRANSPORTATION
        ───────────────────────────────────────────────────────────── */}
        <section className="px-4 py-8 max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#FAF2E6]/90 border border-[#DFCBB0] shadow-sm text-left">
            <Hotel className="w-5 h-5 text-[#3E5634] mb-2" />
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-wider text-[#3E5634] block mb-1 font-semibold">
              Accommodation
            </span>
            <p className="text-xs text-[#5C6650] leading-relaxed">
              Special rates at The Grand Palace Hotel (5 min from venue). Use code{' '}
              <strong className="text-[#3E5634]">WEDDING2026</strong> when booking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF2E6]/90 border border-[#DFCBB0] shadow-sm text-left">
            <Car className="w-5 h-5 text-[#3E5634] mb-2" />
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-wider text-[#3E5634] block mb-1 font-semibold">
              Transportation
            </span>
            <p className="text-xs text-[#5C6650] leading-relaxed">
              Shuttle service will be available from the city center to the venue. Pickup at Central Station.
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            9. GIFT PREFERENCE & DIGITAL SHAGUN
        ───────────────────────────────────────────────────────────── */}
        <section className="px-4 py-8 max-w-xl mx-auto text-center">
          <div className="p-6 rounded-2xl bg-[#FAF2E6]/95 border border-[#DFCBB0] shadow-sm">
            <Gift className="w-6 h-6 text-[#8A7A4E] mx-auto mb-2" />
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-wider text-[#3E5634] block mb-2 font-semibold">
              Gift Preference
            </span>
            <p className="text-sm text-[#3B4432] italic mb-4 max-w-md mx-auto leading-relaxed">
              {data.giftNote ||
                'Your love, blessings, and presence are the greatest gifts we could ever ask for.'}
            </p>

            {data.upiId && (
              <button
                onClick={handleCopyUpi}
                className="py-2 px-5 rounded-xl border border-[#CBB89D] bg-[#E8DEC7] hover:bg-[#DECDB1] text-xs font-['Cinzel',serif] text-[#3E5634] font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Digital Shagun UPI: {data.upiId}</span>
                <span className="text-[10px] text-[#8A7A4E]">
                  ({copiedUpi ? 'Copied!' : 'Copy'})
                </span>
              </button>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            10. CONFIRM ATTENDANCE (RSVP)
        ───────────────────────────────────────────────────────────── */}
        {data.enableRsvp && (
          <section className="px-4 py-12 max-w-xl mx-auto text-center">
            <div className="p-8 sm:p-10 rounded-2xl bg-[#FAF2E6] border border-[#DFCBB0] shadow-md">
              <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#3E5634] block mb-2 font-semibold">
                RSVP
              </span>
              <h3 className="font-['Dancing_Script',cursive] text-4xl sm:text-5xl text-[#3B4432] mb-3">
                Will You Join Us?
              </h3>
              <p className="text-sm text-[#5C6650] max-w-md mx-auto mb-8 font-['Cormorant_Garamond',serif]">
                Please confirm your attendance to help us prepare for this joyous day.
              </p>

              <button
                onClick={() => setIsRsvpOpen(true)}
                className="px-8 py-3.5 rounded-full bg-[#3E5634] hover:bg-[#2F4227] text-white font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-md cursor-pointer border border-[#D4AF37]/50"
              >
                Confirm Attendance
              </button>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            11. WISHES GUESTBOOK
        ───────────────────────────────────────────────────────────── */}
        {data.enableWishes && (
          <section className="px-4 py-12 max-w-xl mx-auto text-center">
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#3E5634] block mb-2 font-semibold">
              Guestbook
            </span>
            <h3 className="font-['Dancing_Script',cursive] text-4xl sm:text-5xl text-[#3B4432] mb-6">
              Warm Wishes & Prayers
            </h3>

            <form
              onSubmit={handleWishSubmit}
              className="p-6 rounded-2xl bg-[#FAF2E6]/95 border border-[#DFCBB0] shadow-sm mb-6 text-left"
            >
              <div className="mb-4">
                <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#3E5634] mb-1 font-semibold">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aunt Meena & Uncle Rajesh"
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBB89D] bg-white text-[#3B4432] text-sm focus:outline-none focus:ring-1 focus:ring-[#3E5634]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#3E5634] mb-1 font-semibold">
                  Your Message
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="May your union be blessed with endless happiness and love..."
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBB89D] bg-white text-[#3B4432] text-sm focus:outline-none focus:ring-1 focus:ring-[#3E5634]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingWish}
                className="w-full py-3 rounded-xl bg-[#3E5634] hover:bg-[#2F4227] text-white font-['Cinzel',serif] text-xs tracking-widest uppercase transition-all shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingWish ? 'Submitting...' : 'Send Wishes'}</span>
              </button>

              {wishSubmitted && (
                <p className="text-center text-xs text-emerald-800 font-['Cinzel',serif] mt-3 font-semibold">
                  Thank you! Your heartfelt blessings have been shared.
                </p>
              )}
            </form>

            {wishes.length > 0 && (
              <div className="space-y-3 text-left">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl bg-[#FAF2E6] border border-[#DFCBB0] shadow-xs"
                  >
                    <p className="text-xs font-['Cinzel',serif] font-bold text-[#3E5634] mb-1">
                      {w.senderName}
                    </p>
                    <p className="text-sm text-[#3B4432] italic font-['Cormorant_Garamond',serif]">
                      "{w.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            12. FOOTER CLOSING & SIGNATURE (royal-grace-end-bg.jpg)
        ───────────────────────────────────────────────────────────── */}
        <footer
          style={{
            backgroundImage: `url('https://zareqia.com/__l5e/assets-v1/58cfc8f1-f2cf-4f50-835e-ee53400ff9e4/royal-grace-end-bg.jpg')`,
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% auto',
          }}
          className="pt-24 pb-16 text-center px-4"
        >
          <h4 className="font-['Dancing_Script',cursive] text-4xl sm:text-5xl text-[#3B4432] mb-3">
            We can't wait to celebrate with you!
          </h4>
          <p className="font-['Dancing_Script',cursive] text-2xl sm:text-3xl text-[#3E5634]">
            {groomName} & {brideName}
          </p>

          <div className="mt-12 text-[10px] uppercase font-['Cinzel',serif] tracking-[0.25em] text-[#5C6650]">
            #RoyalGrace · Vivaah Digital Invitations
          </div>
        </footer>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          13. RSVP MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#FAF2E6] border border-[#DFCBB0] p-6 sm:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh]"
            >
              <div className="text-center mb-6">
                <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#3E5634] block mb-1 font-semibold">
                  Confirm Your Attendance
                </span>
                <h3 className="font-['Dancing_Script',cursive] text-4xl text-[#3B4432]">
                  RSVP
                </h3>
              </div>

              {rsvpSubmitted ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#3E5634] mx-auto animate-bounce" />
                  <h4 className="font-['Cinzel',serif] text-xl text-[#3B4432] font-bold">
                    Attendance Confirmed!
                  </h4>
                  <p className="text-sm text-[#5C6650]">
                    Thank you! We look forward to celebrating this special day together.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#3B4432] mb-1 font-semibold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. & Mrs. Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#CBB89D] bg-white text-[#3B4432] text-sm focus:outline-none focus:ring-1 focus:ring-[#3E5634]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#3B4432] mb-2 font-semibold">
                      Will you be attending? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('yes')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-['Cinzel',serif] tracking-wider transition-all cursor-pointer ${
                          rsvpAttending === 'yes'
                            ? 'bg-[#3E5634] text-white border-[#3E5634] font-semibold'
                            : 'bg-white text-[#5C6650] border-[#CBB89D]'
                        }`}
                      >
                        Accepts with pleasure
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('no')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-['Cinzel',serif] tracking-wider transition-all cursor-pointer ${
                          rsvpAttending === 'no'
                            ? 'bg-[#3E5634] text-white border-[#3E5634] font-semibold'
                            : 'bg-white text-[#5C6650] border-[#CBB89D]'
                        }`}
                      >
                        Declines with regret
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === 'yes' && (
                    <>
                      <div>
                        <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#3B4432] mb-1 font-semibold">
                          Number of Guests Attending
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBB89D] bg-white text-[#3B4432] text-sm focus:outline-none focus:ring-1 focus:ring-[#3E5634]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#3B4432] mb-1 font-semibold">
                          Dietary Preferences / Notes (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Vegetarian, Jain food, Vegan"
                          value={dietaryInfo}
                          onChange={(e) => setDietaryInfo(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#CBB89D] bg-white text-[#3B4432] text-sm focus:outline-none focus:ring-1 focus:ring-[#3E5634]"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFCBB0]">
                    <button
                      type="button"
                      onClick={() => setIsRsvpOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-[#CBB89D] bg-white text-xs font-['Cinzel',serif] text-[#5C6650] hover:bg-[#E8DEC7] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="px-6 py-2.5 rounded-xl bg-[#3E5634] hover:bg-[#2F4227] text-white text-xs font-['Cinzel',serif] tracking-wider uppercase transition-all shadow disabled:opacity-50 cursor-pointer font-semibold"
                    >
                      {isSubmittingRsvp ? 'Submitting...' : 'Confirm RSVP'}
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
