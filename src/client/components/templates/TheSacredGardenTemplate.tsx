import { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { TemplateProps, RSVPRecord, WishRecord } from '@/shared/types';

export function TheSacredGardenTemplate({ data, previewMode = false }: TemplateProps) {
  // Intro Envelope & Opening Animation State
  const [hasStarted, setHasStarted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Audio & Video Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const swansVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (swansVideoRef.current) {
      swansVideoRef.current.play().catch(() => {});
    }
  }, [isIntroComplete]);

  // Modals
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no'>('yes');
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [songRequest, setSongRequest] = useState('');
  const [childrenInfo, setChildrenInfo] = useState('');
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

  // Audio source: Sacred Garden signature soundtrack (Einaudi - Divenire) or customized
  const audioSrc =
    data.theme?.backgroundMusicUrl ||
    '/templates/the-sacred-garden/soundtrack.mp3';

  // Handle Envelope Open Sequence
  const handleOpenEnvelope = () => {
    if (hasStarted) return;
    setHasStarted(true);

    // 1. Play Background Music
    if (audioRef.current) {
      audioRef.current.volume = 0.9;
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((e) => {
        console.log('Audio autoplay prevented:', e);
      });
    }

    // 2. Play Flap Opening Transition Video
    setIsVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((e) => {
        console.log('Video autoplay prevented:', e);
        // Fallback: direct to intro complete
        setTimeout(() => {
          setIsIntroComplete(true);
          setIsVideoPlaying(false);
        }, 1200);
      });
    }
  };

  // Video timeupdate to fade out 0.8s before video finishes
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const v = videoRef.current;
      if (v.duration && v.currentTime >= v.duration - 0.8 && !isIntroComplete) {
        setIsIntroComplete(true);
        setTimeout(() => {
          setIsVideoPlaying(false);
        }, 800);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsIntroComplete(true);
    setIsVideoPlaying(false);
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
            message: childrenInfo,
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
      console.error(err);
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

  const brideFirstName = data.couple.bride.name.split(' ')[0] || 'Rose';
  const groomFirstName = data.couple.groom.name.split(' ')[0] || 'Zohan';
  const formattedDate = new Date(weddingDateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  return (
    <div className="relative min-h-screen bg-[#F9F0E0] text-[#6A5140] font-['Ovo',Georgia,serif] selection:bg-[#E8D4B0] overflow-x-hidden">
      {/* Background Audio Element */}
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />

      {/* ─────────────────────────────────────────────────────────────
          1. INTRO: TAP TO OPEN ENVELOPE OVERLAY (#weiOverlay)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
            onClick={handleOpenEnvelope}
            className="fixed inset-0 z-[99999] bg-[#F9F0E0] flex flex-col items-center justify-center cursor-pointer select-none px-4"
          >
            <div className="relative max-w-[440px] w-full flex flex-col items-center justify-center">
              {/* Realistic Envelope Image */}
              <img
                src="/templates/the-sacred-garden/envelope.png"
                alt="Envelope"
                className="w-full max-w-[420px] object-contain drop-shadow-xl select-none pointer-events-none"
              />

              {/* Pulsing "TAP TO OPEN" Label with Chevron */}
              <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
                <div className="w-2.5 h-2.5 border-r-[1.5px] border-t-[1.5px] border-[#8C643C]/70 -rotate-45 animate-bounce" />
                <span className="font-['Cinzel',Georgia,serif] text-xs sm:text-[13px] tracking-[0.28em] uppercase text-[#8C643C]/80 font-medium whitespace-nowrap animate-pulse">
                  Tap to open
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          2. INTRO TRANSITION VIDEO (#weiVideoWrap)
      ───────────────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[99998] flex items-center justify-center bg-[#F9F0E0] pointer-events-none transition-opacity duration-1000 ${
          isVideoPlaying && !isIntroComplete ? 'opacity-100' : 'opacity-0 hidden'
        }`}
      >
        <video
          ref={videoRef}
          src="/templates/the-sacred-garden/envelope_opening.mp4"
          muted
          playsInline
          onTimeUpdate={handleVideoTimeUpdate}
          onEnded={handleVideoEnded}
          className="w-full max-w-[440px] object-contain"
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FLOATING MUSIC TOGGLE BUTTON (#weiAudioBtn)
      ───────────────────────────────────────────────────────────── */}
      {isIntroComplete && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onClick={toggleMusic}
          aria-label="Toggle background music"
          className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#5A0F1B] hover:bg-[#430B14] text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#D4AF37]/40"
        >
          {isPlayingMusic ? (
            <Volume2 className="w-6 h-6 text-[#F9F0E0]" />
          ) : (
            <VolumeX className="w-6 h-6 text-[#F9F0E0]/80" />
          )}
        </motion.button>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. MAIN SACRED GARDEN INVITATION PAGE
      ───────────────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-24 text-center">
        {/* Looping Swans Video Banner */}
        <section className="relative w-full overflow-hidden rounded-2xl mb-12 shadow-md border border-[#E8D4B0]/60">
          <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-[#2D3319]">
            <video
              ref={swansVideoRef}
              src="/templates/the-sacred-garden/swans.mp4"
              poster="/templates/the-sacred-garden/swans_poster.jpg"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105"
            />
            {/* Subtle soft vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F9F0E0]/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </section>

        {/* Section: Couple Names & Ceremony Date */}
        <section className="mb-14 px-2">
          {/* Decorative Floral Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="https://static.tildacdn.net/tild3638-3336-4136-a131-633463346265/left-element_1.png"
              alt="Ornament"
              className="w-12 sm:w-16 h-auto opacity-70"
            />
            <span className="font-['Cinzel',serif] text-xs sm:text-sm tracking-[0.25em] uppercase text-[#8C643C]">
              Wedding Day
            </span>
            <img
              src="https://static.tildacdn.net/tild6131-6362-4663-b461-626531656438/right-element_1.png"
              alt="Ornament"
              className="w-12 sm:w-16 h-auto opacity-70"
            />
          </div>

          <h1 className="font-['Cinzel',serif] text-4xl sm:text-6xl text-[#4A382B] tracking-wide leading-tight mb-2">
            {groomFirstName}
          </h1>
          <div className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#A67D2B] my-2">&</div>
          <h2 className="font-['Cinzel',serif] text-4xl sm:text-6xl text-[#4A382B] tracking-wide leading-tight mb-6">
            {brideFirstName}
          </h2>

          <div className="inline-block px-5 py-1.5 rounded-full border border-[#D4AF37]/50 bg-[#F3E7D3]/60 mb-8">
            <span className="font-['Cinzel',serif] text-base sm:text-lg tracking-[0.2em] text-[#5A0F1B] font-semibold">
              {formattedDate}
            </span>
          </div>

          {/* Authentic Sacred Poem / Invocation */}
          <div className="max-w-md mx-auto space-y-1 text-[#6A5140] font-['Ovo',serif] text-base sm:text-lg italic leading-relaxed mb-6">
            <p>Two Souls</p>
            <p>One destiny</p>
            <p className="font-medium text-[#8C643C]">
              {data.tagline || 'A Lifetime of Love & Divine Blessings'}
            </p>
          </div>

          <div className="max-w-lg mx-auto text-sm sm:text-base text-[#6A5140] font-['Ovo',serif] leading-relaxed border-t border-b border-[#E8D4B0] py-6 my-6">
            <p className="font-semibold font-['Cinzel',serif] text-[#5A0F1B] mb-2 tracking-wide">
              Dear Friends and Family,
            </p>
            <p>
              {data.welcomeMessage ||
                'Join us for an evening of love, laughter, blessings, and unforgettable memories as we begin our forever.'}
            </p>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-xs text-[#8C643C]/80 font-['Cinzel',serif] tracking-widest pt-2">
            <span>Scroll down</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#8C643C]" />
          </div>
        </section>

        {/* Section: Countdown Timer ("The Celebration Begins In") */}
        <section className="my-16 px-4 py-10 rounded-2xl bg-[#F4E9D8]/70 border border-[#E8D4B0] shadow-sm">
          <span className="font-['Cinzel',serif] text-xs sm:text-sm tracking-[0.22em] uppercase text-[#8C643C] block mb-2">
            The Celebration Begins In
          </span>
          <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#4A382B] mb-8 font-normal">
            Countdown to Our Day
          </h3>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-[#FAF3E7] border border-[#DFCBB0] shadow-sm"
              >
                <span className="font-['Cinzel',serif] text-2xl sm:text-4xl text-[#5A0F1B] font-bold leading-none mb-1">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8C643C] font-['Cinzel',serif]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Schedule of Events */}
        <section className="my-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="https://static.tildacdn.net/tild3363-3665-4330-a361-666466346532/rose_-_Copy.png"
              alt="Rose"
              className="w-6 h-6 object-contain opacity-80"
            />
            <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#4A382B] tracking-wide">
              Schedule of Events
            </h3>
            <img
              src="https://static.tildacdn.net/tild3363-3665-4330-a361-666466346532/rose_-_Copy.png"
              alt="Rose"
              className="w-6 h-6 object-contain opacity-80"
            />
          </div>
          <p className="text-xs sm:text-sm text-[#8C643C] italic font-['Ovo',serif] mb-10">
            A harmonious celebration of rituals and joy
          </p>

          <div className="space-y-6 max-w-xl mx-auto">
            {data.events.map((evt, idx) => (
              <div
                key={evt.id || idx}
                className="relative p-6 rounded-2xl bg-[#F6EDE0] border border-[#E8D4B0] hover:border-[#D4AF37] transition-all text-left shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-['Cinzel',serif] font-semibold tracking-wider text-[#5A0F1B] bg-[#EEDCC7] mb-2">
                    {evt.time}
                  </span>
                  <h4 className="font-['Cinzel',serif] text-lg sm:text-xl font-medium text-[#36281E]">
                    {evt.title}
                  </h4>
                  {evt.description && (
                    <p className="text-xs sm:text-sm text-[#6A5140] mt-1 font-['Ovo',serif] leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                  <p className="text-xs text-[#8C643C] mt-2 flex items-center gap-1 font-['Cinzel',serif]">
                    <MapPin className="w-3.5 h-3.5 text-[#5A0F1B] shrink-0" />
                    <span>{evt.venueName}</span>
                  </p>
                </div>

                {evt.dressCode && (
                  <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8D4B0]">
                    <span className="text-[10px] tracking-widest uppercase font-['Cinzel',serif] text-[#8C643C] block">
                      Attire
                    </span>
                    <span className="text-xs font-['Ovo',serif] text-[#5A0F1B] italic">
                      {evt.dressCode}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section: Location & Venue Details */}
        <section className="my-16 p-8 rounded-2xl bg-[#F4E9D8]/80 border border-[#E8D4B0] shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#EEDCC7] text-[#5A0F1B] flex items-center justify-center mx-auto mb-4 border border-[#DFCBB0]">
            <MapPin className="w-6 h-6" />
          </div>

          <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#8C643C] block mb-2">
            Location
          </span>

          <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#4A382B] mb-2 font-medium">
            {data.events[0]?.venueName || 'The Grand Heritage Estate'}
          </h3>

          <p className="text-sm sm:text-base text-[#6A5140] font-['Ovo',serif] max-w-md mx-auto mb-6 leading-relaxed">
            {data.events[0]?.address || '118 Old East Neck Road, Melville, NY 11747'}
          </p>

          <a
            href={
              data.events[0]?.mapUrl ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                data.events[0]?.venueName + ' ' + (data.events[0]?.address || '')
              )}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5A0F1B] hover:bg-[#430B14] text-white font-['Cinzel',serif] text-xs tracking-widest uppercase transition-all shadow hover:shadow-md cursor-pointer"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* Section: Guest Guidance (Gift Preference & Dress Code) */}
        <section className="my-16 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          {/* Gift Preference */}
          <div className="p-6 rounded-2xl bg-[#F6EDE0] border border-[#E8D4B0] shadow-sm flex flex-col items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#EEDCC7] text-[#8C643C] flex items-center justify-center mb-3">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase text-[#8C643C] block mb-2">
                Gift Preference
              </span>
              <p className="text-sm text-[#4A382B] font-['Ovo',serif] italic mb-4 leading-relaxed">
                {data.giftNote || 'Kindly, no boxed gifts please. Your presence and blessings are our greatest gift.'}
              </p>
            </div>

            {data.upiId && (
              <button
                onClick={handleCopyUpi}
                className="w-full mt-2 py-2 px-4 rounded-xl border border-[#DFCBB0] bg-[#FAF3E7] hover:bg-[#EEDCC7] text-xs font-['Cinzel',serif] text-[#5A0F1B] font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>UPI: {data.upiId}</span>
                <span className="text-[10px] text-[#8C643C]">({copiedUpi ? 'Copied!' : 'Copy'})</span>
              </button>
            )}
          </div>

          {/* Dress Code */}
          <div className="p-6 rounded-2xl bg-[#F6EDE0] border border-[#E8D4B0] shadow-sm flex flex-col items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-[#EEDCC7] text-[#8C643C] flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase text-[#8C643C] block mb-2">
                Dress Code
              </span>
              <p className="text-sm text-[#4A382B] font-['Ovo',serif] italic mb-2 leading-relaxed">
                Traditional Festive / Elegant Evening Attire.
              </p>
              <p className="text-xs text-[#8C643C] font-['Ovo',serif]">
                We kindly ask guests to avoid deep red and maroon attire for the ceremony.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#DFCBB0] w-full text-center">
              <span className="text-[11px] font-['Cinzel',serif] tracking-wider text-[#8C643C] uppercase">
                Formal Evening
              </span>
            </div>
          </div>
        </section>

        {/* Section: Photo Gallery */}
        {data.gallery && data.gallery.length > 0 && (
          <section className="my-16">
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#8C643C] block mb-2">
              Captured Moments
            </span>
            <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#4A382B] mb-8 font-medium">
              Memories in the Sacred Garden
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {data.gallery.slice(0, 6).map((imgUrl, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-[#E8D4B0] group relative"
                >
                  <img
                    src={imgUrl}
                    alt="Couple Memory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#5A0F1B]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Confirm Attendance / RSVP Section */}
        {data.enableRsvp && (
          <section className="my-16 p-8 sm:p-10 rounded-2xl bg-[#F4E9D8] border border-[#E8D4B0] shadow-md text-center">
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#8C643C] block mb-2">
              Confirm Your Attendance
            </span>
            <h3 className="font-['Cinzel',serif] text-2xl sm:text-4xl text-[#4A382B] mb-3 font-normal">
              Will You Grace Us With Your Presence?
            </h3>
            <p className="text-sm sm:text-base text-[#6A5140] font-['Ovo',serif] max-w-md mx-auto mb-8 leading-relaxed">
              To help us prepare for a joyful celebration, kindly confirm your attendance.
            </p>

            <button
              onClick={() => setIsRsvpOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#5A0F1B] hover:bg-[#430B14] text-white font-['Cinzel',serif] text-sm tracking-[0.2em] uppercase font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer border border-[#D4AF37]/50"
            >
              Click to RSVP
            </button>
          </section>
        )}

        {/* Section: Warm Wishes Wall */}
        {data.enableWishes && (
          <section className="my-16 text-center max-w-xl mx-auto">
            <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#8C643C] block mb-2">
              Blessings & Love
            </span>
            <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#4A382B] mb-6 font-medium">
              Leave a Blessing for the Couple
            </h3>

            <form
              onSubmit={handleWishSubmit}
              className="p-6 rounded-2xl bg-[#F6EDE0] border border-[#E8D4B0] shadow-sm mb-6 text-left"
            >
              <div className="mb-4">
                <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#8C643C] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Sunita Patel"
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFCBB0] bg-[#FAF3E7] text-[#4A382B] placeholder-[#9C8773] text-sm focus:outline-none focus:ring-1 focus:ring-[#8C643C]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#8C643C] mb-1.5">
                  Your Heartfelt Wish
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Wishing you a lifetime filled with boundless love, laughter, and happiness..."
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DFCBB0] bg-[#FAF3E7] text-[#4A382B] placeholder-[#9C8773] text-sm focus:outline-none focus:ring-1 focus:ring-[#8C643C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingWish}
                className="w-full py-3 rounded-xl bg-[#5A0F1B] hover:bg-[#430B14] text-white font-['Cinzel',serif] text-xs tracking-widest uppercase transition-all shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingWish ? 'Sending...' : 'Send Warm Wishes'}</span>
              </button>

              {wishSubmitted && (
                <p className="text-center text-xs text-emerald-800 font-['Cinzel',serif] mt-3">
                  Thank you! Your heartfelt blessings have been shared.
                </p>
              )}
            </form>

            {wishes.length > 0 && (
              <div className="space-y-3 text-left">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl bg-[#FAF3E7] border border-[#E8D4B0] shadow-xs"
                  >
                    <p className="text-xs font-['Cinzel',serif] font-semibold text-[#5A0F1B] mb-1">
                      {w.senderName}
                    </p>
                    <p className="text-xs sm:text-sm text-[#4A382B] font-['Ovo',serif] italic">
                      "{w.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Section: Footer Sign-off & Wax Seal */}
        <footer className="mt-20 pt-12 border-t border-[#E8D4B0] text-center">
          {/* Authentic Wax Seal */}
          <div className="flex justify-center mb-6">
            <img
              src="https://static.tildacdn.net/tild6638-6565-4665-a361-653962303137/wax_seal_1.png"
              alt="Wax Seal"
              className="w-20 h-20 object-contain drop-shadow-md"
            />
          </div>

          <h4 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#4A382B] mb-3">
            Hope to see you there!
          </h4>
          <p className="font-['Cinzel',serif] text-lg sm:text-xl text-[#5A0F1B] tracking-wide font-medium">
            {groomFirstName} and {brideFirstName}
          </p>

          <div className="mt-10 text-[11px] font-['Cinzel',serif] tracking-widest text-[#8C643C]/70 uppercase">
            #SacredGarden · Vivaah Digital Invitations
          </div>
        </footer>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          5. AUTHENTIC RSVP MODAL (Confirm Your Attendance)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#F9F0E0] border border-[#DFCBB0] p-6 sm:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh]"
            >
              <div className="text-center mb-6">
                <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.25em] text-[#8C643C] block mb-1">
                  Confirm Your Attendance
                </span>
                <h3 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#4A382B] font-normal">
                  RSVP
                </h3>
                <p className="text-xs text-[#8C643C] font-['Ovo',serif] mt-1">
                  Please confirm before celebration day
                </p>
              </div>

              {rsvpSubmitted ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#5A0F1B] mx-auto animate-bounce" />
                  <h4 className="font-['Cinzel',serif] text-xl text-[#4A382B]">
                    Attendance Confirmed!
                  </h4>
                  <p className="text-sm font-['Ovo',serif] text-[#6A5140]">
                    Thank you! We truly look forward to celebrating this special day with you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#4A382B] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Kirit & Meena Patel"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#DFCBB0] bg-[#FAF3E7] text-[#4A382B] text-sm focus:outline-none focus:ring-1 focus:ring-[#8C643C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#4A382B] mb-2">
                      Will you be attending? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('yes')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-['Cinzel',serif] tracking-wider transition-all cursor-pointer ${
                          rsvpAttending === 'yes'
                            ? 'bg-[#5A0F1B] text-white border-[#5A0F1B] font-semibold'
                            : 'bg-[#FAF3E7] text-[#6A5140] border-[#DFCBB0] hover:border-[#8C643C]'
                        }`}
                      >
                        Accepts with pleasure
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpAttending('no')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-['Cinzel',serif] tracking-wider transition-all cursor-pointer ${
                          rsvpAttending === 'no'
                            ? 'bg-[#5A0F1B] text-white border-[#5A0F1B] font-semibold'
                            : 'bg-[#FAF3E7] text-[#6A5140] border-[#DFCBB0] hover:border-[#8C643C]'
                        }`}
                      >
                        Declines with regret
                      </button>
                    </div>
                  </div>

                  {rsvpAttending === 'yes' && (
                    <>
                      <div>
                        <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#4A382B] mb-1">
                          Number of Guests Attending
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#DFCBB0] bg-[#FAF3E7] text-[#4A382B] text-sm focus:outline-none focus:ring-1 focus:ring-[#8C643C]"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#4A382B] mb-1">
                          A Song That Gets You Dancing (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sanedo, Chogada, or Bollywood favorite"
                          value={songRequest}
                          onChange={(e) => setSongRequest(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#DFCBB0] bg-[#FAF3E7] text-[#4A382B] text-sm focus:outline-none focus:ring-1 focus:ring-[#8C643C]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-['Cinzel',serif] uppercase tracking-wider text-[#4A382B] mb-1">
                          Children / Family Attending
                        </label>
                        <input
                          type="text"
                          placeholder="Please include names and ages"
                          value={childrenInfo}
                          onChange={(e) => setChildrenInfo(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#DFCBB0] bg-[#FAF3E7] text-[#4A382B] text-sm focus:outline-none focus:ring-1 focus:ring-[#8C643C]"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFCBB0]">
                    <button
                      type="button"
                      onClick={() => setIsRsvpOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-[#DFCBB0] bg-[#FAF3E7] text-xs font-['Cinzel',serif] text-[#6A5140] hover:bg-[#EEDCC7] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="px-6 py-2.5 rounded-xl bg-[#5A0F1B] hover:bg-[#430B14] text-white text-xs font-['Cinzel',serif] tracking-wider uppercase transition-all shadow disabled:opacity-50 cursor-pointer"
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

