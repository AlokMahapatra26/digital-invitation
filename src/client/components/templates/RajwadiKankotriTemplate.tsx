import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Send,
  Navigation,
  Copy,
  Crown,
  Flower2,
  Music,
} from 'lucide-react';
import { TemplateProps, WeddingEvent } from '@/shared/types';
import { useConfetti } from '@/client/hooks/useConfetti';
import { GiftRegistryModal } from '../common/GiftRegistryModal';
import { submitRSVP } from '@/client/lib/api';

// Editorial atmosphere slides (Authentic Gujarati Wedding Culture)
const EDITORIAL_SLIDES = [
  {
    src: '/templates/rajwadi-kankotri/01.jpg',
    number: '01 / THE SACRED CHORI',
    caption: 'Where holy vows and mangal phera begin',
    alt: 'Traditional Gujarati royal wedding mandap and chori with marigold garlands and sacred kalash',
  },
  {
    src: '/templates/rajwadi-kankotri/02.jpg',
    number: '02 / PANETAR & KANKAVATI',
    caption: 'Sacred vermilion, silk threads, and timeless blessings',
    alt: 'Gujarati bridal panetar silk, kundan haathphool, and silver kankavati with kumkum',
  },
  {
    src: '/templates/rajwadi-kankotri/03.jpg',
    number: '03 / DANDIYA & CELEBRATION',
    caption: 'Joyous raas rhythms under starlit heritage skies',
    alt: 'Festive royal Gujarati Dandiya sticks, Patola silks, and glowing lotus diyas',
  },
];

// Default authentic Gujarati wedding celebration itinerary
const DEFAULT_GUJARATI_ITINERARY: WeddingEvent[] = [
  {
    id: 'event-mandap',
    title: 'Mandap Muhurat & Ganesh Sthapana',
    type: 'mandap-muhurat',
    date: '2026-12-13',
    time: '09:00 AM',
    venueName: 'Shah Villa',
    address: 'Sindhu Bhavan Road, Bodakdev, Ahmedabad',
    mapUrl: 'https://maps.google.com/?q=Sindhubhavan+Road+Ahmedabad',
    description: 'Invoking the divine blessings of Lord Ganesha to commence the auspicious wedding ceremonies.',
  },
  {
    id: 'event-pithi',
    title: 'Pithi Ceremony',
    type: 'pithi',
    date: '2026-12-13',
    time: '11:30 AM',
    venueName: 'Shah Residence Lawns',
    address: 'Sindhu Bhavan Road, Ahmedabad',
    mapUrl: 'https://maps.google.com/?q=Sindhubhavan+Road+Ahmedabad',
    description: 'A vibrant morning of aromatic turmeric paste, floral showers, and sweet blessings from elders.',
  },
  {
    id: 'event-mameru',
    title: 'Mameru & Mosalu Welcome',
    type: 'mameru',
    date: '2026-12-13',
    time: '04:30 PM',
    venueName: 'The Grand Bhagwati',
    address: 'S.G. Highway, Bodakdev, Ahmedabad',
    mapUrl: 'https://maps.google.com/?q=The+Grand+Bhagwati+Ahmedabad',
    description: 'Welcoming the maternal uncles and family with joyous dhol beats and traditional gifting.',
  },
  {
    id: 'event-garba',
    title: 'Dandiya Raas-Garba & Sangeet',
    type: 'raas-garba',
    date: '2026-12-13',
    time: '08:00 PM',
    venueName: 'Club Otilla Banquets',
    address: 'S.P. Ring Road, Ahmedabad',
    mapUrl: 'https://maps.google.com/?q=Club+Otilla+Ahmedabad',
    description: 'An evening of non-stop traditional Gujarati Garba, energetic Dandiya, and music with live dhol.',
  },
  {
    id: 'event-hastamelap',
    title: 'Jaan Agaman & Shubh Hastamelap',
    type: 'hastamelap',
    date: '2026-12-14',
    time: '05:15 PM (Godhuli Vela)',
    venueName: 'Rajbagh Palace Resort',
    address: 'S.G. Highway, Near Ujala Circle, Ahmedabad',
    mapUrl: 'https://maps.google.com/?q=Rajbagh+Palace+Resort+Ahmedabad',
    description: 'The sacred wedding vows, holy pheras, and Hastamelap under the sunset mandap with Vedic chants.',
  },
  {
    id: 'event-reception',
    title: 'Dinner & Grand Reception',
    type: 'reception',
    date: '2026-12-14',
    time: '08:00 PM',
    venueName: 'Rajbagh Royal Lawns',
    address: 'S.G. Highway, Near Ujala Circle, Ahmedabad',
    mapUrl: 'https://maps.google.com/?q=Rajbagh+Palace+Resort+Ahmedabad',
    description: 'Celebrate the newlyweds with a grand traditional Gujarati feast, live acoustic symphony, and blessings.',
  },
];

// Organic Falling Flower Petals Animation Overlay ("Pushpavrishti / Phoolon Ki Barish")
function FallingPetals({ count = 24 }: { count?: number }) {
  const petals = useMemo(() => {
    const petalColors = [
      '#E63946', // Rose Red
      '#FF4D6D', // Crimson Pink
      '#FF758F', // Soft Rose
      '#FFA69E', // Peach Blossom
      '#F4A261', // Saffron Gold
      '#FFB3C1', // Pale Blush
      '#C9184A', // Deep Vermilion
    ];

    return Array.from({ length: count }).map((_, i) => {
      const left = ((i * 37) % 94) + 3;
      const size = 12 + (i % 5) * 3; // 12px to 24px
      const duration = 5 + (i % 6) * 1.2; // 5s to 11s
      const delay = (i * 0.45) % 6; // staggered entry
      const color = petalColors[i % petalColors.length];
      const sway = 20 + (i % 4) * 12;
      const initialRotate = (i * 53) % 360;

      return {
        id: i,
        left: `${left}%`,
        size,
        duration,
        delay,
        color,
        sway,
        initialRotate,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-20">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: '-8%',
            width: p.size,
            height: p.size * 1.35,
          }}
          animate={{
            y: ['0%', '1150%'],
            x: [0, p.sway, -p.sway, p.sway * 0.5, 0],
            rotateZ: [p.initialRotate, p.initialRotate + 360],
            rotateX: [0, 180, 360],
            opacity: [0, 0.95, 0.9, 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Natural organic curved flower petal ("pan") */}
          <svg
            viewBox="0 0 24 32"
            className="w-full h-full"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(110,20,23,0.18))',
            }}
          >
            <path
              d="M12 2 C6 5 2 12 3 20 C4 27 10 30 13 30 C17 30 22 25 21 18 C20 10 16 3 12 2 Z"
              fill={p.color}
              opacity={0.88}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export function RajwadiKankotriTemplate({ data, previewMode = false }: TemplateProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Hero video state: reveals text 2s after doors open, then permanently stays
  const [isHeroTextVisible, setIsHeroTextVisible] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  // Scratch card state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef(false);
  const [isScratchRevealed, setIsScratchRevealed] = useState(false);

  // RSVP Form state (embedded form as shown in screenshots)
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpAttendance, setRsvpAttendance] = useState<'attending' | 'declined'>('attending');
  const [rsvpGuests, setRsvpGuests] = useState('2');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);

  // Gift modal state
  const [giftOpen, setGiftOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { shootGoldDust, shootPetals } = useConfetti();
  const { couple, gallery, weddingDate } = data;
  const events = data.events && data.events.length > 0 ? data.events : DEFAULT_GUJARATI_ITINERARY;

  // Sound track: Mangal Phera (Instrumental)
  const musicUrl =
    data.theme?.backgroundMusicUrl ||
    '/templates/rajwadi-kankotri/soundtrack.mp3';

  // Format date helper
  const parsedDate = new Date(weddingDate || '2026-12-14');
  const formattedDate = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : 'December 14, 2026';

  const dayOfWeek = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('en-US', { weekday: 'long' })
    : 'Monday';

  // Countdown timer logic
  useEffect(() => {
    const target = new Date(`${weddingDate || '2026-12-14'}T17:15:00`).getTime();
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

  // Audio setup
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
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => { });
    }
  };

  // Auto-play / prompt audio on open conforming to browser policies
  useEffect(() => {
    shootPetals();
    const t = setTimeout(() => {
      shootGoldDust();
    }, 400);

    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {
          const handleFirstInteraction = () => {
            if (audioRef.current) {
              audioRef.current
                .play()
                .then(() => setIsPlayingMusic(true))
                .catch(() => {});
            }
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
          };
          window.addEventListener('click', handleFirstInteraction, { once: true });
          window.addEventListener('touchstart', handleFirstInteraction, { once: true });
        });
    }

    // Reveal hero text 2s after doors open, then permanently stay
    const timer = setTimeout(() => {
      setIsHeroTextVisible(true);
    }, 2000);

    return () => {
      clearTimeout(t);
      clearTimeout(timer);
    };
  }, []);

  const handleHeroVideoTimeUpdate = () => {
    if (heroVideoRef.current && heroVideoRef.current.currentTime >= 1.8) {
      setIsHeroTextVisible(true);
    }
  };

  // Scratch card canvas setup
  useEffect(() => {
    if (!isOpen && !previewMode) return;

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

    // Warm amber gold metallic foil gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#D4A853');
    grad.addColorStop(0.3, '#F3DE9A');
    grad.addColorStop(0.7, '#B88A45');
    grad.addColorStop(1, '#8A622A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Metallic foil sparkles
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = `rgba(255, 245, 220, ${Math.random() * 0.7 + 0.2})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2 + 0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Text: "✦ SCRATCH TO REVEAL DATE ✦"
    ctx.fillStyle = '#4A2818';
    ctx.font = 'bold 12px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SCRATCH TO REVEAL DATE ✦', width / 2, height * 0.5);

    ctx.font = 'italic 10px Georgia, serif';
    ctx.fillStyle = '#6E4226';
    ctx.fillText('Rub with finger or cursor', width / 2, height * 0.5 + 17);

    const scratch = (clientX: number, clientY: number) => {
      if (!isScratchingRef.current || isScratchRevealed) return;
      const b = canvas.getBoundingClientRect();
      const x = clientX - b.left;
      const y = clientY - b.top;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      if (Math.random() > 0.7) {
        checkScratchCompletion(ctx, width * dpr, height * dpr);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isScratchingRef.current = true;
      scratch(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      scratch(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      isScratchingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isScratchingRef.current = true;
      if (e.touches[0]) {
        scratch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        scratch(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      isScratchingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, previewMode, isScratchRevealed]);

  const checkScratchCompletion = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      let transparentPixels = 0;
      const totalPixels = imgData.data.length / 4;
      const step = 32;

      for (let i = 3; i < imgData.data.length; i += step * 4) {
        if (imgData.data[i] < 128) {
          transparentPixels += step;
        }
      }

      const percent = (transparentPixels / totalPixels) * 100;
      if (percent > 40 && !isScratchRevealed) {
        revealDateAutomatically();
      }
    } catch {
      // Fallback
    }
  };

  const revealDateAutomatically = () => {
    setIsScratchRevealed(true);
    shootGoldDust();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = 'opacity 0.6s ease';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 600);
    }
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (evtTitle?: string, venue?: string, dateStr?: string) => {
    const title = encodeURIComponent(
      evtTitle || `${couple.bride.name} & ${couple.groom.name}'s Wedding Ceremony`
    );
    const details = encodeURIComponent(
      `Celebrating the auspicious wedding ceremony of ${couple.bride.name} and ${couple.groom.name}.`
    );
    const location = encodeURIComponent(venue || primaryVenue.venueName + ', ' + primaryVenue.address);
    const dateFormatted = (dateStr || weddingDate || '2026-12-14').replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T113000Z/${dateFormatted}T180000Z`;
  };

  const primaryVenue =
    events.find(
      (e) =>
        e.venueName?.toLowerCase().includes('rajbagh') ||
        e.title?.toLowerCase().includes('reception') ||
        e.title?.toLowerCase().includes('hastamelap')
    ) ||
    events[events.length - 1] || {
      venueName: 'Rajbagh Royal Lawns',
      address: 'S.G. Highway, Near Ujala Circle, Ahmedabad, Gujarat',
      mapUrl: 'https://maps.google.com/?q=Rajbagh+Palace+Resort+Ahmedabad',
    };

  // Handle in-page RSVP submit
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    setIsSubmittingRsvp(true);
    try {
      await submitRSVP(data.slug, {
        guestName: rsvpName,
        attending: rsvpAttendance === 'attending',
        guestCount: Number(rsvpGuests) || 1,
        eventIds: events.map((e) => e.id || e.title),
        message: `${rsvpEmail ? `[Email: ${rsvpEmail}] ` : ''}${rsvpMessage}`.trim(),
      });
      setRsvpSubmitted(true);
      shootGoldDust();
    } catch (err) {
      console.warn('Failed to submit RSVP:', err);
      setRsvpSubmitted(true);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleCopyUpi = () => {
    if (!data.upiId) return;
    navigator.clipboard.writeText(data.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#26080A] font-serif antialiased selection:bg-[#E5C378] selection:text-[#6E1417] relative overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. GRAND CINEMATIC VIDEO HERO STAGE SECTION (100% W x 100% H)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-3.5rem)] sm:min-h-screen py-10 sm:py-14 bg-[#1D0608] flex flex-col items-center justify-center overflow-hidden">
        {/* Muted Autoplay Video Background (Full bleed 100% width & 100% height) */}
        <video
          ref={heroVideoRef}
          src="/templates/rajwadi-kankotri/gemini_generated_video_9a4f1bff.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleHeroVideoTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Cinematic Midnight Crimson / Gold Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D0608]/95 via-[#1D0608]/55 to-[#1D0608]/80 pointer-events-none" />

        {/* Hero Content Written Inside the Video with Staggered Motion Animations */}
        <AnimatePresence>
          {isHeroTextVisible && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.16,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="relative z-10 max-w-lg sm:max-w-4xl mx-auto px-4 py-4 text-center flex flex-col items-center justify-center my-auto"
            >
              {/* Sacred Sanskrit Invocation */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="flex flex-col items-center mb-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <span className="text-xs sm:text-sm font-['Gotu',serif] font-bold tracking-[0.2em] text-[#E5C378] drop-shadow-md">
                    ॥ श्री गणेशाय नमः ॥
                  </span>
                  <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>
                <p className="text-[10px] sm:text-xs font-['Gotu',serif] text-[#F3DE9A]/90 mt-0.5 italic tracking-wide drop-shadow-sm">
                  ॥ मङ्गलं भगवान् विष्णुः मङ्गलं गरुडध्वजः । मङ्गलं पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥
                </p>
              </motion.div>

              {/* Shubh Vivah Badge */}
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="text-[8px] sm:text-[10px] font-['Cinzel',serif] uppercase tracking-[0.3em] text-[#FFFDF7]/85 block mb-2 font-semibold drop-shadow-md"
              >
                Together With Their Families Request The Honour Of Your Presence At The Wedding Of
              </motion.span>

              {/* Couple Names & Lineage (Side by side on desktop, stacked on mobile) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 my-1 sm:my-2 w-full">
                {/* Bride */}
                <div className="text-center sm:text-right">
                  <span className="text-[9px] sm:text-[11px] font-['Cinzel',serif] uppercase tracking-[0.2em] text-[#E5C378] font-semibold block">
                    Sau.Ka. (Bride)
                  </span>
                  <h1 className="font-['Cinzel',serif] text-3xl sm:text-5xl md:text-6xl font-bold text-[#FFFDF7] tracking-wider leading-tight drop-shadow-md my-0.5">
                    {couple.bride.name}
                  </h1>
                  <p className="text-[10px] sm:text-xs font-serif italic text-[#F3DE9A]/90 drop-shadow-sm">
                    {couple.bride.parents || 'Daughter of Mrs. Bhavna & Mr. Viren Shah'}
                  </p>
                </div>

                {/* Golden Script Ampersand */}
                <span className="font-['Allura',cursive] text-4xl sm:text-6xl text-[#E5C378] drop-shadow-md my-0.5 sm:my-0">
                  &amp;
                </span>

                {/* Groom */}
                <div className="text-center sm:text-left">
                  <span className="text-[9px] sm:text-[11px] font-['Cinzel',serif] uppercase tracking-[0.2em] text-[#E5C378] font-semibold block">
                    Chi. (Groom)
                  </span>
                  <h1 className="font-['Cinzel',serif] text-3xl sm:text-5xl md:text-6xl font-bold text-[#FFFDF7] tracking-wider leading-tight drop-shadow-md my-0.5">
                    {couple.groom.name}
                  </h1>
                  <p className="text-[10px] sm:text-xs font-serif italic text-[#F3DE9A]/90 drop-shadow-sm">
                    {couple.groom.parents || 'Son of Mrs. Geeta & Mr. Mukesh Patel'}
                  </p>
                </div>
              </div>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="text-xs sm:text-sm text-[#F7EFE2]/90 font-serif italic mt-1.5 drop-shadow-md max-w-md"
              >
                as they begin their forever in laughter and love.
              </motion.p>

              {/* Date & Venue Pill */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ scale: 1.05 }}
                className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D0608]/85 border border-[#D4AF37]/80 backdrop-blur-md text-xs sm:text-sm text-[#FFFDF7] font-['Cinzel',serif] font-bold tracking-wider shadow-2xl transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>{formattedDate}</span>
                <span className="text-[#E5C378]">✦</span>
                <span>{primaryVenue.venueName}</span>
              </motion.div>

              {/* Scroll Cue (Visibly positioned with ample breathing room) */}
              <motion.a
                href="#welcome"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 1, delay: 1.2 } },
                }}
                className="mt-6 sm:mt-8 mb-2 inline-flex flex-col items-center gap-1 text-[#E5C378] hover:text-[#FFFDF7] transition-colors cursor-pointer text-[10px] sm:text-xs tracking-[0.28em] uppercase font-['Cinzel',serif] font-bold drop-shadow-md"
              >
                <span>SCROLL</span>
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="text-xs font-bold"
                >
                  ↓
                </motion.span>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. WELCOME — A BEAUTIFUL BEGINNING (CLEAN & REFINED)
      ───────────────────────────────────────────────────────────── */}
      <section id="welcome" className="py-14 sm:py-20 px-4 sm:px-6 bg-[#FAF6F0] text-center relative">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
            Welcome
          </span>

          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mt-1 mb-3">
            A Beautiful Beginning
          </h2>

          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-4" />

          {/* Sacred Sanskrit Shloka */}
          <p className="font-['Gotu',serif] text-xs sm:text-sm text-[#6E1417] font-semibold leading-relaxed tracking-wide max-w-md mx-auto mb-6">
            ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।
            <br className="hidden sm:inline" />
            {' '}निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
          </p>

          <p className="font-['Cormorant_Infant',serif] text-base sm:text-lg text-[#3A1A1D]/80 leading-relaxed italic max-w-lg mx-auto">
            &ldquo;{data.welcomeMessage ||
              'With hearts full of gratitude, we warmly invite you to join us as we celebrate this beautiful union with the love and warm wishes of our families. Your presence will make our joy complete.'}&rdquo;
          </p>

          {/* Script Signatures */}
          <div className="font-['Allura',cursive] text-3xl sm:text-4xl text-[#C99E32] mt-6 flex items-center justify-center gap-2">
            <span>{couple.bride.name}</span>
            <span className="font-['Cormorant_Infant',serif] text-xl italic text-[#6E1417]">
              &amp;
            </span>
            <span>{couple.groom.name}</span>
          </div>
        </div>

        {/* Feature Artwork: Indian Wedding Couple Under Blossoms (Grand & Prominent) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-2xl sm:max-w-3xl mx-auto mt-8 px-2 sm:px-4 overflow-hidden rounded-3xl"
        >
          {/* Subtle warm golden ambient backdrop glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F3DE9A]/35 via-[#EAD8B7]/25 to-transparent blur-3xl rounded-full -z-10 transform scale-100" />

          {/* Falling Flower Petals Shower ("Pushpavrishti / Phoolon Ki Barish") */}
          <FallingPetals count={30} />

          <img
            src="/templates/rajwadi-kankotri/indian-wedding-under-blossoms.webp"
            alt="Bride and Groom holding hands under blooming floral tree with falling petals"
            className="w-full max-h-[550px] sm:max-h-[640px] md:max-h-[700px] object-contain mx-auto drop-shadow-[0_20px_50px_rgba(110,20,23,0.18)] transition-transform duration-700 hover:scale-[1.01]"
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. INTERACTIVE SCRATCH TO REVEAL MUHURAT
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 text-center bg-[#F4EAE0] border-y border-[#D4AF37]/30">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
            A Sacred Muhurat to Hold Close
          </span>

          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mt-1 mb-3">
            Scratch to Reveal
          </h2>

          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-4" />

          {/* Sacred Sanskrit Lagna Muhurat Shloka */}
          <p className="font-['Gotu',serif] text-xs sm:text-sm text-[#6E1417] font-semibold leading-relaxed max-w-md mx-auto mb-8">
            ॥ तदेव लग्नं सुदिनं तदेव ताराबलं चन्द्रबलं तदेव ॥
          </p>

          {/* Interactive Scratch Canvas Container framed with Ornate Hindu Wedding Mandap Frame */}
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[3/2] mx-auto rounded-3xl overflow-hidden shadow-[0_16px_45px_rgba(110,20,23,0.15)] border-2 border-[#D4AF37]/70 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] select-none">
            {/* Background Revealed Information ("The Other Side") */}
            <div className="absolute inset-[22%_18%_14%_18%] z-0 flex flex-col items-center justify-center text-center p-2 bg-gradient-to-b from-[#FFFDF9]/95 via-[#FAF6F0]/95 to-[#F5ECE0]/95 rounded-xl">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#C99E32] font-['Gotu',serif] font-bold mb-0.5 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#C99E32]" />
                <span>॥ शुभ विवाह मुहूर्तम् ॥</span>
                <Sparkles className="w-2.5 h-2.5 text-[#C99E32]" />
              </span>

              <h3 className="font-['Cormorant_Infant',serif] text-2xl sm:text-3xl font-semibold text-[#6E1417] leading-tight tracking-wide">
                {formattedDate}
              </h3>

              <p className="text-[10px] sm:text-xs text-[#784246] font-serif italic mt-0.5">
                {dayOfWeek} • {events[0]?.time || 'Godhuli Vela (05:15 PM)'}
              </p>

              <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1 sm:my-1.5" />

              <p className="text-[11px] sm:text-xs font-['Cinzel',serif] font-bold text-[#26080A] leading-tight">
                {primaryVenue.venueName}
              </p>
              <p className="text-[9px] sm:text-[10px] text-[#784246] font-serif truncate max-w-[200px] sm:max-w-[240px]">
                {primaryVenue.address}
              </p>

              {isScratchRevealed && (
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#FAF3E7] border border-[#D4A853]/60 text-[8px] sm:text-[9px] text-[#8A622A] font-serif font-semibold tracking-wider shadow-xs inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#C99E32]" />
                  <span>Auspicious Muhurat Unveiled</span>
                  <Sparkles className="w-2.5 h-2.5 text-[#C99E32]" />
                </div>
              )}
            </div>

            {/* Scratch Foil Overlay Canvas */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full cursor-crosshair touch-none z-10 transition-opacity duration-700 ${isScratchRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            />

            {/* Ornate Hindu Wedding Mandap Frame Overlay (Frames both Scratch Foil & Revealed Side) */}
            <img
              src="/templates/rajwadi-kankotri/Ornate Hindu Wedding Mandap Frame.png"
              alt="Ornate Hindu Wedding Mandap Frame"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20 select-none drop-shadow-md"
            />
          </div>

          <p className="text-xs text-[#784246] font-serif italic mt-4">
            {isScratchRevealed
              ? 'Auspicious date revealed! We cannot wait to celebrate with you.'
              : 'Use your finger or cursor to uncover the moment.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {!isScratchRevealed && (
              <button
                type="button"
                onClick={revealDateAutomatically}
                className="text-xs font-serif text-[#784246] underline hover:text-[#6E1417] cursor-pointer"
              >
                Reveal Date Automatically
              </button>
            )}

            <a
              href={getGoogleCalendarUrl(
                `${couple.bride.name} & ${couple.groom.name}'s Wedding`,
                primaryVenue.venueName,
                weddingDate
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#6E1417] hover:bg-[#520C0F] text-[#FFFDF7] text-xs font-['Cinzel',serif] uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer font-bold"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>Add to Calendar</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. THE ATMOSPHERE — 3 ARCHED EDITORIAL SLIDES (MATCHING SCREENSHOT)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 text-center max-w-4xl mx-auto">
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
          The Atmosphere
        </span>

        <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] tracking-tight mt-1 mb-3">
          An Evening in Bloom
        </h2>
        <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-4xl mx-auto pb-4">
          {EDITORIAL_SLIDES.map((slide, idx) => (
            <figure
              key={idx}
              className={`relative aspect-[4/5] rounded-t-[120px] rounded-b-md overflow-hidden shadow-xl border border-[#D4AF37]/35 group transition-all duration-500 hover:-translate-y-2 ${
                idx === 1 ? 'md:translate-y-6' : ''
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D0608]/90 via-[#1D0608]/25 to-transparent" />
              <figcaption className="absolute bottom-5 left-5 right-5 text-left text-[#FFFDF7]">
                <span className="block text-[10px] tracking-[0.18em] uppercase font-['DM_Sans',sans-serif] text-[#E5C378] mb-1 font-semibold">
                  {slide.number}
                </span>
                <span className="font-['Cormorant_Infant',serif] italic text-base sm:text-lg leading-snug block drop-shadow-sm text-[#FFFDF7]">
                  {slide.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. LIVE COUNTDOWN TIMER — COUNTING EVERY HEARTBEAT
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 text-center bg-[#F4EAE0] border-y border-[#D4AF37]/30">
        <div className="max-w-xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
            Until The Sacred Mangal Phera
          </span>

          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mt-1 mb-3">
            Counting Every Heartbeat
          </h2>

          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-3" />

          {/* Sacred Sanskrit Blessing */}
          <p className="text-xs sm:text-sm font-['Gotu',serif] font-semibold text-[#6E1417] leading-relaxed max-w-md mx-auto mb-8">
            ॥ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥
          </p>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds },
            ].map((unit, i) => (
              <div
                key={i}
                className="bg-[#FFFDF9] p-3 sm:p-5 rounded-2xl border-2 border-[#D4AF37]/45 shadow-sm text-center"
              >
                <div className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-medium text-[#6E1417]">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#C99E32] font-semibold mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. THE VENUE — RAJBAGH ROYAL LAWNS & PALACE RESORT
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
            Celebration Destination
          </span>

          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mt-1 mb-3">
            The Wedding Venue
          </h2>

          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-3" />

          {/* Sacred Sanskrit Hospitality Welcoming */}
          <p className="text-xs sm:text-sm font-['Gotu',serif] text-[#6E1417] font-semibold tracking-wide max-w-md mx-auto mb-8">
            ॥ अतिथिदेवो भव ⬩ स्वागतम् शुभ स्वागतम् ॥
          </p>
        </div>

        <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden bg-[#1D0608] border-2 border-[#D4AF37]/60 shadow-[0_25px_60px_rgba(29,6,8,0.35)] text-center relative group">
          {/* Traditional Gujarati Royal Venue Photography */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden">
            <img
              src="/templates/rajwadi-kankotri/venue.jpg"
              alt="Rajbagh Royal Lawns & Palace Resort"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D0608] via-[#1D0608]/45 to-transparent" />
          </div>

          {/* Venue Details */}
          <div className="p-6 sm:p-10 -mt-6 sm:-mt-8 relative z-10 text-center">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.26em] text-[#E5C378] block mb-2 font-semibold">
              Main Ceremony &amp; Grand Reception
            </span>

            <h3 className="font-['Cormorant_Infant',serif] text-2xl sm:text-4xl font-semibold text-[#FFFDF7] mb-2 tracking-wide">
              {primaryVenue.venueName}
            </h3>

            <p className="text-xs sm:text-sm text-[#F7EFE2]/85 font-serif max-w-md mx-auto mb-8 leading-relaxed italic">
              {primaryVenue.address}
            </p>

            <a
              href={
                primaryVenue.mapUrl ||
                `https://maps.google.com/?q=${encodeURIComponent(`${primaryVenue.venueName} ${primaryVenue.address}`)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3DE9A] to-[#B88728] hover:brightness-110 text-[#1D0608] text-xs sm:text-sm font-['Cinzel',serif] font-bold uppercase tracking-wider shadow-xl transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>View on Google Maps</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. THE FESTIVITIES — DAYS FILLED WITH JOY (NORMAL SIZE RAJWADI CARDS)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="text-center mb-10">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
            The Festivities
          </span>

          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mt-1 mb-3">
            Days filled with joy
          </h2>

          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-3" />

          {/* Sacred Sanskrit Invocation */}
          <p className="text-xs sm:text-sm font-['Gotu',serif] text-[#6E1417] font-semibold tracking-wide max-w-md mx-auto mb-8">
            ॥ ॐ श्री गणेशाय नमः ⬩ ॐ श्री कुलदेवतायै नमः ॥
          </p>
        </div>

        {/* 2-Column Dual-Bordered Event Cards — Normal Size matching AmberTemplate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-center">
          {events.map((evt, idx) => {
            const getEventEmoji = () => {
              const t = (evt.type || evt.title || '').toLowerCase();
              if (t.includes('wedding') || t.includes('ceremony') || t.includes('hastamelap') || idx === 1) return '💍';
              if (t.includes('welcome') || t.includes('mandap') || idx === 0) return '🌿';
              if (t.includes('sangeet') || t.includes('celebration') || t.includes('garba') || idx === 2) return '✨';
              if (t.includes('reception') || idx === 3) return '👑';
              if (t.includes('pithi')) return '🌼';
              return '💍';
            };

            return (
              <div
                key={evt.id || idx}
                className="relative p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] text-[#6E1417] shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col items-center justify-between text-center"
              >
                {/* Inner Decorative Border */}
                <div className="absolute inset-2 border border-[#D4AF37]/35 rounded-xl pointer-events-none" />

                <div className="flex flex-col items-center w-full z-10">
                  {/* Top Emoji */}
                  <div className="text-3xl mb-2 flex justify-center select-none">
                    {getEventEmoji()}
                  </div>

                  {/* Flowing Calligraphy Title */}
                  <h3 className="font-['Allura',cursive] text-3xl sm:text-4xl text-[#6E1417] mb-2 leading-snug">
                    {evt.title}
                  </h3>

                  {/* Date */}
                  <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#C99E32] mb-1 font-['DM_Sans',sans-serif]">
                    {evt.date}
                  </p>

                  {/* Time */}
                  <p className="text-xs text-[#784246] font-medium mb-3 font-['DM_Sans',sans-serif]">
                    {evt.time}
                  </p>

                  {/* Venue */}
                  <p className="font-['Cormorant_Infant',serif] italic text-sm text-[#3A1A1D]/80 max-w-xs mx-auto">
                    {evt.venueName}
                  </p>

                  {/* Description if present */}
                  {evt.description && (
                    <p className="text-xs text-[#3A1A1D]/70 font-serif leading-relaxed mt-2.5 line-clamp-2 max-w-xs">
                      {evt.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 w-12 h-px bg-[#D4AF37]/50 z-10" />
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href={getGoogleCalendarUrl(
              `${couple.bride.name} & ${couple.groom.name}'s Wedding Celebrations`,
              primaryVenue.venueName,
              weddingDate
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#6E1417] hover:bg-[#520C0F] text-[#FFFDF7] text-xs sm:text-sm font-['Cinzel',serif] uppercase tracking-wider shadow-lg transition-all cursor-pointer font-bold"
          >
            <Calendar className="w-4 h-4 text-[#E5C378]" />
            <span>Add All Festivities to Calendar</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. WITH ALL OUR HEARTS — AUSPICIOUS CHANDLO & BLESSINGS
      ───────────────────────────────────────────────────────────── */}
      {data.enableGifts && (
        <section className="py-14 sm:py-20 px-4 text-center max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
              Auspicious Chandlo &amp; Blessings
            </span>

            <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mt-1 mb-3">
              Your Blessings Are Our Greatest Treasure
            </h2>

            <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-3" />

            {/* Sacred Sanskrit Ashirwad */}
            <p className="text-xs sm:text-sm font-['Gotu',serif] text-[#6E1417] font-semibold tracking-wide max-w-md mx-auto mb-6">
              ॥ आयुष्मान् भव । सौमङ्गल्यं भवतु । चिरञ्जीवौ भवताम् ॥
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3A1A1D] font-serif italic max-w-lg mx-auto mb-6 leading-relaxed">
            &ldquo;{data.giftNote ||
              'Your love, blessings and warm wishes are the greatest gifts we could ever ask for. Having you celebrate alongside us is our truest treasure.'}&rdquo;
          </p>

          {data.upiId && (
            <div className="inline-flex items-center gap-2 bg-[#FFFDF9] px-5 py-2.5 rounded-2xl border-2 border-[#D4AF37]/50 shadow-md">
              <span className="font-mono text-xs sm:text-sm text-[#6E1417] font-semibold">
                {data.upiId}
              </span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="p-1.5 rounded-lg bg-[#F4EAE0] hover:bg-[#E5C378] text-[#6E1417] cursor-pointer transition-colors"
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          12. IN-PAGE EMBEDDED RSVP & BLESSINGS FORM (NIMANTRAN SWEEKAR)
      ───────────────────────────────────────────────────────────── */}
      {data.enableRsvp && (
        <section id="rsvp-section" className="py-14 sm:py-20 px-4 bg-[#F4EAE0] border-y border-[#D4AF37]/30">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
                Nimantran Sweekar
              </span>

              <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mt-1 mb-3">
                RSVP &amp; Blessings
              </h2>

              <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-3" />

              {/* Sacred Sanskrit Invocation */}
              <p className="text-xs sm:text-sm font-['Gotu',serif] text-[#6E1417] font-semibold tracking-wide max-w-md mx-auto mb-3">
                ॥ निमन्त्रण स्वीकार ⬩ शुभाशीर्वाद ॥
              </p>

              <p className="text-xs uppercase tracking-[0.2em] text-[#784246] font-['Cinzel',serif] font-bold">
                Kindly respond by December 1, 2026
              </p>
            </div>

            {/* Embedded Form Container */}
            <div className="bg-[#FFFDF9] p-6 sm:p-10 rounded-3xl border-2 border-[#D4AF37]/40 shadow-[0_16px_45px_rgba(110,20,23,0.08)]">
              {rsvpSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-[#F4EAE0] text-[#6E1417] border border-[#D4AF37] flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Check className="w-6 h-6 text-[#6E1417]" />
                  </div>
                  <h3 className="font-['Cormorant_Infant',serif] text-2xl font-bold text-[#6E1417] mb-1">
                    Thank You!
                  </h3>
                  <p className="text-sm text-[#3A1A1D] font-serif italic">
                    Your response has been warmly received. We can&apos;t wait to celebrate with you!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6E1417] font-['Cinzel',serif] font-bold mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/50 bg-white text-sm text-[#26080A] focus:outline-none focus:border-[#6E1417] focus:ring-1 focus:ring-[#6E1417] transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6E1417] font-['Cinzel',serif] font-bold mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/50 bg-white text-sm text-[#26080A] focus:outline-none focus:border-[#6E1417] focus:ring-1 focus:ring-[#6E1417] transition-all"
                    />
                  </div>

                  {/* Attendance & Guest Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6E1417] font-['Cinzel',serif] font-bold mb-1.5">
                        Attendance
                      </label>
                      <select
                        value={rsvpAttendance}
                        onChange={(e) => setRsvpAttendance(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/50 bg-white text-sm text-[#26080A] focus:outline-none focus:border-[#6E1417] focus:ring-1 focus:ring-[#6E1417] transition-all"
                      >
                        <option value="attending">Joyfully Accepts</option>
                        <option value="declined">Regretfully Declines</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6E1417] font-['Cinzel',serif] font-bold mb-1.5">
                        Number of Guests
                      </label>
                      <select
                        value={rsvpGuests}
                        onChange={(e) => setRsvpGuests(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/50 bg-white text-sm text-[#26080A] focus:outline-none focus:border-[#6E1417] focus:ring-1 focus:ring-[#6E1417] transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Warm Wishes / Dietary Notes */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6E1417] font-['Cinzel',serif] font-bold mb-1.5">
                      Warm Wishes / Dietary Notes
                    </label>
                    <textarea
                      rows={3}
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      placeholder="Share a blessing or any dietary preferences..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/50 bg-white text-sm text-[#26080A] focus:outline-none focus:border-[#6E1417] focus:ring-1 focus:ring-[#6E1417] transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full py-3.5 rounded-xl bg-[#6E1417] hover:bg-[#520C0F] text-[#FFFDF7] text-xs font-['Cinzel',serif] uppercase tracking-[0.22em] font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    <Send className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span>{isSubmittingRsvp ? 'Submitting...' : 'Confirm RSVP'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          13. THE SACRED SEVEN STEPS — BACK-VIEW WEDDING COUPLE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 text-center max-w-3xl mx-auto relative overflow-hidden">
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#C99E32] block mb-1">
          The Sacred Seven Steps
        </span>

        <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mt-1 mb-3">
          Hand in Hand, Step by Step
        </h2>

        <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto mb-4" />

        <p className="font-['Gotu',serif] text-xs sm:text-sm text-[#6E1417] font-semibold leading-relaxed max-w-md mx-auto mb-6">
          ॥ ॐ सखा सप्तपदा भव । सख्यं ते गमेयम् ॥
        </p>

        {/* Feature Artwork: Back-View Indian Wedding Couple (Grand & Prominent) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md sm:max-w-lg mx-auto mt-6 px-4 overflow-hidden rounded-3xl"
        >
          {/* Subtle Arch Foil Frame Aura behind couple */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/30 via-[#F3DE9A]/20 to-transparent blur-3xl rounded-t-full -z-10 transform scale-105" />

          {/* Falling Flower Petals Shower ("Pushpavrishti / Phoolon Ki Barish") */}
          <FallingPetals count={26} />

          <img
            src="/templates/rajwadi-kankotri/back-view-indian-wedding-couple.webp"
            alt="Bride and Groom walking hand in hand into happily ever after"
            className="w-full max-h-[520px] sm:max-h-[600px] md:max-h-[640px] object-contain mx-auto drop-shadow-[0_25px_55px_rgba(110,20,23,0.22)] transition-transform duration-700 hover:scale-[1.02]"
            loading="lazy"
          />
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          14. GRAND CLOSING BLESSINGS FOOTER (CLEAN ROYAL IVORY & GOLD)
      ───────────────────────────────────────────────────────────── */}
      <footer className="py-16 sm:py-24 px-4 sm:px-6 bg-[#FAF6F0] text-[#26080A] text-center relative border-t border-[#D4AF37]/40 pb-36">
        <div className="max-w-xl mx-auto">
          {/* Sacred Sanskrit Ashirwad */}
          <p className="font-['Gotu',serif] text-sm sm:text-base text-[#6E1417] font-semibold tracking-wide mb-2">
            ॥ शुभं भवतु ⬩ कल्याणमस्तु ⬩ सदा विजयते ॥
          </p>

          <div className="w-12 h-[1px] bg-[#D4AF37]/60 mx-auto my-4" />

          {/* Closing Headline */}
          <h2 className="font-['Cormorant_Infant',serif] text-3xl sm:text-5xl font-normal text-[#6E1417] mb-4">
            We can&apos;t wait to celebrate with you
          </h2>

          {/* Script Signatures with whitespace-nowrap preventing awkward mid-name wrapping */}
          <div className="font-['Allura',cursive] text-4xl sm:text-6xl text-[#C99E32] my-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="whitespace-nowrap">{couple.bride.name}</span>
            <span className="font-['Cormorant_Infant',serif] text-2xl sm:text-3xl italic text-[#6E1417] px-1">&amp;</span>
            <span className="whitespace-nowrap">{couple.groom.name}</span>
          </div>

          {/* Date & Venue */}
          <p className="text-xs uppercase tracking-[0.22em] text-[#784246] font-semibold font-['DM_Sans',sans-serif] mt-2">
            {formattedDate} ⬩ {primaryVenue.venueName}
          </p>

          {/* Brand Signature */}
          <div className="mt-14 pt-6 border-t border-[#D4AF37]/25 flex flex-col items-center gap-1">
            <span className="font-['Cormorant_Infant',serif] text-base tracking-[0.3em] text-[#C99E32] font-bold uppercase">
              Rajwadi Kankotri
            </span>
            <span className="text-[10px] tracking-[0.2em] text-[#6E1417]/60 uppercase font-sans">
              Royal Gujarati Celebrations
            </span>
          </div>
        </div>
      </footer>

      {/* Shagun Modal */}
      <GiftRegistryModal
        isOpen={giftOpen}
        onClose={() => setGiftOpen(false)}
        upiId={data.upiId}
        giftNote={data.giftNote}
        accentColor="#D4A853"
      />

      {/* ─────────────────────────────────────────────────────────────
          FLOATING AUDIO CONTROL BUTTON (STANDALONE ON BEST SIDE: BOTTOM-RIGHT)
      ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlayingMusic ? 'Mute Background Music' : 'Play Background Music'}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6E1417]/95 hover:bg-[#520C0F] border-2 border-[#D4AF37] text-[#FFFDF7] shadow-[0_8px_30px_rgba(110,20,23,0.45)] backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group"
            title={isPlayingMusic ? 'Mute Music' : 'Play Mangal Phera (Instrumental)'}
          >
            {isPlayingMusic ? (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5C378] animate-pulse" />
            ) : (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-[#E5C378]/70 group-hover:text-[#FFFDF7]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
