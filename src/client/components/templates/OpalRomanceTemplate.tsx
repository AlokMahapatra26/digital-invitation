import React, { useState, useEffect, useRef, useId } from 'react';
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
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Phone,
  Plus,
  Minus,
} from 'lucide-react';
import { TemplateProps, WeddingEvent } from '@/shared/types';
import { useConfetti } from '@/client/hooks/useConfetti';

// Asset helper
const asset = (path: string) => `/templates/opal-romance/${path}`;

// Standard ease curves from Invitima
const EASE_Y = [0.22, 1, 0.36, 1] as const;
const EASE_W = [0.16, 1, 0.3, 1] as const;

// Gate configuration
const GATE_CONFIG = {
  portrait: {
    key: 'portrait',
    image: asset('gate/portrait.webp'),
    aspect: 0.75,
    centre: '50.09% 52.3%',
    opening: asset('gate/portrait-opening.png'),
    reveal: { image: asset('hero/portrait.webp'), aspect: 1400 / 2488 },
    revealFit: '50% 88% / auto 150%',
    left: {
      image: asset('gate/portrait-left.webp'),
      box: { left: '37.201%', width: '12.983%', top: '35.221%', height: '30.041%' },
    },
    right: {
      image: asset('gate/portrait-right.webp'),
      box: { left: '50.092%', width: '13.352%', top: '35.221%', height: '30.041%' },
    },
    lamps: [
      { left: '8.1%', top: '47.6%', size: '9%' },
      { left: '92%', top: '47.6%', size: '9%' },
    ],
  },
  landscape: {
    key: 'landscape',
    image: asset('gate/landscape.webp'),
    aspect: 2258 / 941,
    centre: '50% 56%',
    opening: asset('gate/landscape-opening.png'),
    reveal: { image: asset('hero/landscape.webp'), aspect: 2.4 },
    revealFit: '43.2% 88% / auto 150%',
    left: {
      image: asset('gate/landscape-left.webp'),
      box: { left: '43.534%', width: '6.51%', top: '30.074%', height: '46.334%' },
    },
    right: {
      image: asset('gate/landscape-right.webp'),
      box: { left: '50%', width: '6.466%', top: '30.074%', height: '46.334%' },
    },
    lamps: [
      { left: '24.157%', top: '49.4%', size: '6.65%' },
      { left: '75.991%', top: '49.4%', size: '6.65%' },
    ],
  },
};

const GATE_TIMINGS = {
  unlatchAt: 0.15,
  swingAt: 0.55,
  swing: 2.3,
  pushAt: 1.75,
  push: 2.4,
  done: 3.35,
};

// Hand pointer SVG icon
function PointerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M22 14a8 8 0 0 1-8 8" />
      <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
      <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" />
      <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

// Hanger icon for dress code
function HangerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.3 6.2a1.8 1.8 0 1 1 1.7 2.3v1.1" />
      <path d="M12 9.6 3.2 15.7c-.7.5-.4 1.6.5 1.6h16.6c.9 0 1.2-1.1.5-1.6L12 9.6Z" />
    </svg>
  );
}

// Royal gold monogram SVG generator
function GoldMonogram({ first, second, size }: { first: string; second: string; size: string | number }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className="relative flex select-none items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="pointer-events-none h-full w-full drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)]">
        <defs>
          <linearGradient id={`${id}-a`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#cf9e42" />
            <stop offset="45%" stopColor="#966322" />
            <stop offset="100%" stopColor="#5c380f" />
          </linearGradient>
          <linearGradient id={`${id}-b`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbb057" />
            <stop offset="50%" stopColor="#a36e26" />
            <stop offset="100%" stopColor="#673f12" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#${id}-a)`} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />
        <circle cx="50" cy="50" r="43" fill="none" stroke={`url(#${id}-b)`} strokeWidth="0.8" opacity="0.85" />
        <text
          x="36"
          y="62"
          fontFamily="OP Cormorant, Garamond, serif"
          fontSize="44"
          fontStyle="italic"
          fontWeight="bold"
          fill={`url(#${id}-a)`}
          textAnchor="middle"
        >
          {first}
        </text>
        <text
          x="50"
          y="52"
          fontFamily="OP Cormorant, Garamond, serif"
          fontSize="22"
          fontStyle="italic"
          fill={`url(#${id}-b)`}
          textAnchor="middle"
          opacity="0.8"
        >
          &
        </text>
        <text
          x="64"
          y="62"
          fontFamily="OP Cormorant, Garamond, serif"
          fontSize="44"
          fontStyle="italic"
          fontWeight="bold"
          fill={`url(#${id}-b)`}
          textAnchor="middle"
        >
          {second}
        </text>
      </svg>
    </div>
  );
}

// Gold section ornament divider
function GoldOrnament() {
  return (
    <div className="flex items-center justify-center gap-3 text-op-gold py-2" aria-hidden="true">
      <motion.span
        className="h-px w-16 bg-op-gold origin-right"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE_Y }}
      />
      <span className="op-spin inline-block text-xl" style={{ animation: 'op-spin 16s linear infinite' }}>
        ❖
      </span>
      <motion.span
        className="h-px w-16 bg-op-gold origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3, ease: EASE_Y }}
      />
    </div>
  );
}

// Section Header with Kicker & Title
function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div
      className="mb-8 text-center md:mb-14"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE_Y }}
    >
      <p className="op-script op-kicker text-balance text-3xl md:text-4xl lg:text-5xl text-op-gold-deep">
        {kicker}
      </p>
      <h2 className="op-display op-heading mt-2 text-balance text-3xl md:text-5xl lg:text-6xl text-op-primary font-bold">
        {title}
      </h2>
      <div className="mt-4">
        <GoldOrnament />
      </div>
    </motion.div>
  );
}

// Arched Card SVG Path Generator (Invitima exact mathematical formula)
function generateArchPath(w: number, h: number, inset: number, scale: number): string {
  const i = 263 * scale - inset;
  const n = 80 * scale + inset;
  const l = 122 * scale;
  const o = Math.sqrt(Math.max(0, n * n - inset * inset));
  const r = l + o;
  const c = l + inset;
  const d = Math.sqrt(Math.max(0, i * i - Math.pow(263 * scale - c, 2)));
  const p = w / 2 - d;
  const m = w / 2 + d;

  return [
    `M ${inset} ${r}`,
    `A ${n} ${n} 0 0 0 ${o} ${c}`,
    `L ${p} ${c}`,
    `A ${i} ${i} 0 0 1 ${m} ${c}`,
    `L ${w - o} ${c}`,
    `A ${n} ${n} 0 0 0 ${w - inset} ${r}`,
    `L ${w - inset} ${h - r}`,
    `A ${n} ${n} 0 0 0 ${w - o} ${h - c}`,
    `L ${m} ${h - c}`,
    `A ${i} ${i} 0 0 1 ${p} ${h - c}`,
    `L ${o} ${h - c}`,
    `A ${n} ${n} 0 0 0 ${inset} ${h - r}`,
    'Z',
  ].join(' ');
}

// Rounded Banner SVG Path Generator
function generateBannerPath(w: number, h: number, inset: number, r: number): string {
  const i = r + inset;
  const n = Math.sqrt(Math.max(0, i * i - inset * inset));
  return [
    `M ${inset} ${n}`,
    `A ${i} ${i} 0 0 0 ${n} ${inset}`,
    `L ${w - n} ${inset}`,
    `A ${i} ${i} 0 0 0 ${w - inset} ${n}`,
    `L ${w - inset} ${h - n}`,
    `A ${i} ${i} 0 0 0 ${w - n} ${h - inset}`,
    `L ${n} ${h - inset}`,
    `A ${i} ${i} 0 0 0 ${inset} ${h - n}`,
    'Z',
  ].join(' ');
}

// Ceremony Card Component with Architectural Arch
function CeremonyCard({ event, index }: { event: WeddingEvent; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 320, h: 560 });
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.offsetWidth || 320,
          h: containerRef.current.offsetHeight || 560,
        });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const scale = dims.w / 640;
  const outerPath = generateArchPath(dims.w, dims.h, 0, Math.max(0.4, scale));
  const innerPath = generateArchPath(dims.w, dims.h, 8 * Math.max(0.4, scale), Math.max(0.4, scale));
  const venueString = [event.venueName, event.address].filter(Boolean).join(', ');

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay: index * 0.12, ease: EASE_W }}
      whileHover={{ y: -8 }}
      className="relative mx-auto w-full max-w-[24rem] p-6 text-center text-[#f4dcbc] transition-transform"
    >
      <div ref={containerRef} className="relative w-full rounded-[2.5rem] py-10 px-6 overflow-hidden">
        {/* SVG Arched Frame & Gold Border */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_18px_32px_rgba(50,5,10,0.45)]"
        >
          <defs>
            <radialGradient id={`${id}-crimson`} cx="50%" cy="38%" r="75%">
              <stop offset="0%" stopColor="#9c0b08" />
              <stop offset="60%" stopColor="#8a0404" />
              <stop offset="100%" stopColor="#550202" />
            </radialGradient>
            <clipPath id={`${id}-clip`}>
              <path d={innerPath} />
            </clipPath>
            <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffe9b8" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffe9b8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffe9b8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={outerPath} fill="#f2d7b4" stroke="#7a0b0b" strokeWidth="1.5" />
          <path d={innerPath} fill={`url(#${id}-crimson)`} stroke="#7a0b0b" strokeWidth="1.2" />

          {/* Shimmer sweep effect */}
          <g clipPath={`url(#${id}-clip)`}>
            <motion.rect
              y={-dims.h * 0.2}
              width={dims.w * 0.45}
              height={dims.h * 1.4}
              fill={`url(#${id}-sheen)`}
              style={{ skewX: -18 }}
              initial={{ x: -dims.w * 0.8, opacity: 0 }}
              whileInView={{ x: [ -dims.w * 0.8, dims.w * 1.4 ], opacity: [ 0, 1, 1, 0 ] }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.5 + index * 0.2, ease: 'easeInOut' }}
            />
          </g>
        </svg>

        {/* Content Inside Arch */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Ceremony Name */}
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#E8C288] font-serif font-bold">
            Ceremony {index + 1}
          </span>
          <h3 className="op-poster mt-2 text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#FBF7F0] drop-shadow-sm">
            {event.name}
          </h3>

          {event.description && (
            <p className="op-serif mt-3 text-sm italic text-[#F7D8C4] opacity-90 line-clamp-3">
              {event.description}
            </p>
          )}

          {/* Date & Time Ribbon Banner flanked by ribbon flourishes */}
          <div className="relative my-6 w-full max-w-[260px] py-3 px-4 rounded-xl bg-gradient-to-b from-[#f9e6cc] to-[#f1d3ac] text-[#3d0808] border border-[#7a0b0b] shadow-md flex items-center justify-center gap-3">
            <img
              src={asset('events/ribbon-flourish.webp')}
              alt=""
              className="pointer-events-none absolute right-full top-1/2 h-[75%] w-auto -translate-y-1/2 -mr-1"
            />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold uppercase tracking-wider text-[#7a0b0b]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.date}</span>
              </div>
              {event.time && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#5c1010] mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{event.time}</span>
                </div>
              )}
            </div>
            <img
              src={asset('events/ribbon-flourish.webp')}
              alt=""
              className="pointer-events-none absolute left-full top-1/2 h-[75%] w-auto -translate-y-1/2 -scale-x-100 -ml-1"
            />
          </div>

          {/* Venue & Dress Code */}
          <div className="space-y-3 w-full">
            {venueString && (
              <div>
                <p className="op-serif flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-[0.25em] text-[#E8C288]">
                  <span className="h-px w-6 bg-current opacity-60" />
                  <span>Venue</span>
                  <span className="h-px w-6 bg-current opacity-60" />
                </p>
                <div className="mt-1.5 flex items-center justify-center gap-2 text-xs text-[#FAF6F0]">
                  <MapPin className="w-3.5 h-3.5 text-[#E8C288] shrink-0" />
                  <span className="line-clamp-2">{venueString}</span>
                </div>
              </div>
            )}

            {event.dressCode && (
              <div>
                <p className="op-serif flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-[0.25em] text-[#E8C288]">
                  <span className="h-px w-6 bg-current opacity-60" />
                  <span>Dress Code</span>
                  <span className="h-px w-6 bg-current opacity-60" />
                </p>
                <div className="mt-1 flex items-center justify-center gap-2 text-xs text-[#FAF6F0] italic">
                  <HangerIcon className="w-3.5 h-3.5 text-[#E8C288] shrink-0" />
                  <span>{event.dressCode}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Lightbox Modal for Photo Gallery
function Lightbox({
  photos,
  index,
  onClose,
  onStep,
}: {
  photos: { src: string; caption: string }[];
  index: number;
  onClose: () => void;
  onStep: (dir: number) => void;
}) {
  const current = photos[index];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onStep]);

  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh] rounded-2xl border-2 border-op-gold/60 bg-[#FAF6F0] p-4 text-[#2C211E] shadow-2xl flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-[#8E1D2C] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={current.src}
          alt={current.caption}
          className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-inner"
        />

        <div className="mt-3 flex w-full items-center justify-between px-2">
          <span className="op-script text-2xl font-bold text-op-primary">{current.caption}</span>
          <span className="op-serif rounded-full border border-op-gold/50 bg-white/80 px-3 py-1 text-xs font-semibold text-op-gold-deep">
            {index + 1} of {photos.length}
          </span>
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={() => onStep(-1)}
              className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-op-gold/60 bg-white/90 text-op-primary flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => onStep(1)}
              className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-op-gold/60 bg-white/90 text-op-primary flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Interactive Gate Opening Cover Component
function GateCover({
  brideName,
  groomName,
  onOpen,
}: {
  brideName: string;
  groomName: string;
  onOpen: () => void;
}) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const checkAspect = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkAspect();
    window.addEventListener('resize', checkAspect);
    return () => window.removeEventListener('resize', checkAspect);
  }, []);

  const config = isLandscape ? GATE_CONFIG.landscape : GATE_CONFIG.portrait;

  const handleTapToOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, GATE_TIMINGS.done * 1000);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-[#f4d8d6] select-none"
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Blurred background image behind gates */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={config.image}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-90 blur-2xl"
        />
      </div>

      {/* Floating Rose Petals on Gate */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {[12, 34, 56, 78, 92, 22, 68].map((left, idx) => (
          <span
            key={idx}
            className="op-fall absolute -top-6 block h-3.5 w-3 rounded-[80%_0_80%_0]"
            style={{
              left: `${left}%`,
              background: 'linear-gradient(135deg, oklch(0.9 0.06 20), oklch(0.72 0.13 10))',
              animation: `op-fall ${10 + (idx % 4) * 2}s linear ${idx * 0.7}s infinite both`,
              ['--op-x' as any]: `${(idx % 2 ? 1 : -1) * (20 + idx * 5)}px`,
              ['--op-turn' as any]: `${idx % 2 ? 480 : -480}deg`,
            }}
          />
        ))}
      </div>

      {/* Centered Palace Gate Frame */}
      <motion.div
        className="absolute left-1/2 top-1/2 origin-center"
        style={{
          width: isLandscape ? 'max(100vw, 100vh * 2.4)' : 'max(100vw, 100vh * 0.75)',
          aspectRatio: config.aspect,
          transform: 'translate(-50%, -50%)',
          transformOrigin: config.centre,
        }}
        initial={{ scale: 1, opacity: 0 }}
        animate={
          imageLoaded
            ? isOpening
              ? { scale: [1, 1.22, 1.22, 5.5], opacity: [1, 1, 1, 0] }
              : { scale: 1, opacity: 1 }
            : { opacity: 0 }
        }
        transition={
          isOpening
            ? {
                scale: {
                  duration: GATE_TIMINGS.pushAt + GATE_TIMINGS.push,
                  times: [0, 0.6 / 4.15, 1.75 / 4.15, 1],
                  ease: ['easeOut', 'linear', [0.7, 0, 0.3, 1]],
                },
                opacity: { duration: 0.8, delay: 2.6 },
              }
            : { opacity: { duration: 1.2 } }
        }
      >
        <div className="relative inset-0 h-full w-full [perspective:1400px]">
          {/* Gate Background Artwork */}
          <img
            src={config.image}
            alt="Palace Gate"
            className="absolute inset-0 h-full w-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Glowing Golden Lanterns */}
          {config.lamps.map((lamp, idx) => (
            <span
              key={idx}
              className="op-glow pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
              style={{
                left: lamp.left,
                top: lamp.top,
                width: lamp.size,
                background:
                  'radial-gradient(circle, oklch(0.97 0.09 85 / 0.9), oklch(0.88 0.12 75 / 0.35) 40%, transparent 70%)',
                animation: `op-glow 4s ease-in-out ${idx * 1.3}s infinite`,
              }}
            />
          ))}

          {/* Reveal Background Behind Doors (Revealed as doors swing open) */}
          <motion.div
            className="absolute"
            style={{
              left: config.left.box.left,
              top: config.left.box.top,
              height: config.left.box.height,
              width: `calc(${config.right.box.left} + ${config.right.box.width} - ${config.left.box.left})`,
              maskImage: `url(${config.opening})`,
              maskSize: '100% 100%',
              WebkitMaskImage: `url(${config.opening})`,
              WebkitMaskSize: '100% 100%',
              background: `linear-gradient(to bottom, oklch(0.98 0.04 75 / 0.75), oklch(0.96 0.05 60 / 0.2) 24%, transparent 42%), url(${config.reveal.image}) ${config.revealFit}`,
            }}
            initial={{ filter: 'brightness(1.9) saturate(0.4)' }}
            animate={{
              filter: isOpening
                ? ['brightness(1.9) saturate(0.4)', 'brightness(1.9) saturate(0.4)', 'brightness(1) saturate(1)']
                : 'brightness(1.9) saturate(0.4)',
            }}
            transition={{
              duration: GATE_TIMINGS.swing + 0.4,
              delay: isOpening ? GATE_TIMINGS.swingAt : 0,
              times: [0, 0.3, 1],
            }}
          />

          {/* Left Door */}
          <motion.img
            src={config.left.image}
            alt=""
            draggable={false}
            className="absolute max-w-none pointer-events-none"
            style={{ ...config.left.box, transformOrigin: 'left center' }}
            animate={
              isOpening
                ? {
                    rotateY: [0, -3, 94],
                    filter: ['brightness(1)', 'brightness(1.08)', 'brightness(0.7)'],
                  }
                : { rotateY: 0, filter: 'brightness(1)' }
            }
            transition={{
              duration: GATE_TIMINGS.swing,
              delay: isOpening ? GATE_TIMINGS.swingAt - 0.25 : 0,
              times: [0, 0.1, 1],
              ease: [0.45, 0, 0.15, 1],
            }}
          />

          {/* Right Door */}
          <motion.img
            src={config.right.image}
            alt=""
            draggable={false}
            className="absolute max-w-none pointer-events-none"
            style={{ ...config.right.box, transformOrigin: 'right center' }}
            animate={
              isOpening
                ? {
                    rotateY: [0, 3, -94],
                    filter: ['brightness(1)', 'brightness(1.08)', 'brightness(0.7)'],
                  }
                : { rotateY: 0, filter: 'brightness(1)' }
            }
            transition={{
              duration: GATE_TIMINGS.swing,
              delay: isOpening ? GATE_TIMINGS.swingAt - 0.25 : 0,
              times: [0, 0.1, 1],
              ease: [0.45, 0, 0.15, 1],
            }}
          />

          {/* Radiant Light Burst upon opening */}
          {isOpening && (
            <motion.div
              className="pointer-events-none absolute aspect-square mix-blend-screen"
              style={{
                left: '50%',
                top: '50%',
                width: '90%',
                transform: 'translate(-50%, -50%)',
                background:
                  'repeating-conic-gradient(from 0deg, oklch(0.97 0.06 80 / 0.35) 0deg 4deg, transparent 4deg 13deg)',
                maskImage: 'radial-gradient(circle, transparent 12%, black 22%, transparent 62%)',
                WebkitMaskImage: 'radial-gradient(circle, transparent 12%, black 22%, transparent 62%)',
              }}
              initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.45, 0.3], rotate: 25, scale: 1.1 }}
              transition={{ duration: 3, delay: GATE_TIMINGS.swingAt + 0.2, ease: 'easeOut' }}
            />
          )}

          {/* Gate Typography (Destined to Bloom & Couple Names) */}
          {!isOpening && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between py-[8%] px-4">
              <div className="flex flex-col items-center text-center">
                <span className="op-serif font-semibold uppercase tracking-[0.25em] text-[oklch(0.5_0.12_55)] text-xs sm:text-base [text-shadow:0_0_0.35em_rgba(255,255,255,0.95)]">
                  Destined to
                </span>
                <span className="op-script op-text-crimson-grad text-4xl sm:text-6xl md:text-7xl font-bold leading-tight filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
                  Bloom
                </span>
                <div className="flex items-center gap-3 mt-1 text-[#8d5b1d]">
                  <span className="h-[1.5px] w-8 bg-gradient-to-r from-transparent to-[#b8803c]" />
                  <span className="text-sm">❖</span>
                  <span className="h-[1.5px] w-8 bg-gradient-to-l from-transparent to-[#b8803c]" />
                </div>
              </div>

              {/* Couple Names on Gate Doors */}
              <div className="flex flex-col items-center text-center my-auto">
                <p className="op-script text-3xl sm:text-5xl md:text-6xl text-[#8E1D2C] font-bold drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)]">
                  {brideName} & {groomName}
                </p>
              </div>

              {/* Tap to Open CTA Button */}
              <div className="pointer-events-auto mt-auto pb-4">
                <motion.button
                  onClick={handleTapToOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-2.5 rounded-full border-2 border-op-gold bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] px-6 sm:px-8 py-3 text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.2em] text-[#8E1D2C] shadow-[0_10px_25px_rgba(142,29,44,0.25)] transition-all cursor-pointer"
                >
                  <PointerIcon className="h-4 w-4 text-op-gold-deep animate-bounce" />
                  <span>Tap to Open the Gates</span>
                  <Sparkles className="h-4 w-4 text-op-gold-deep" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// MAIN TEMPLATE EXPORT
export function OpalRomanceTemplate({ data, previewMode = false }: TemplateProps) {
  const [hasOpenedGate, setHasOpenedGate] = useState(previewMode);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { shootPetals, shootGoldDust } = useConfetti();

  const bride = data.couple?.bride || { name: 'Rhea Sharma', parents: 'Daughter of Mrs. & Mr. Sharma' };
  const groom = data.couple?.groom || { name: 'Aarav Agarwal', parents: 'Son of Mrs. & Mr. Agarwal' };

  const brideFirstName = bride.name.split(' ')[0] || 'Rhea';
  const groomFirstName = groom.name.split(' ')[0] || 'Aarav';

  const events = data.events && data.events.length > 0 ? data.events : [
    {
      id: 'e1',
      name: 'Ganesh Puja & Haldi',
      date: '12 December 2026',
      time: '10:00 AM',
      venueName: 'The Palm Courtyard',
      address: 'Rambagh Palace, Jaipur',
      description: 'Blessings of Lord Ganesha followed by vibrant turmeric celebrations with fragrant marigold flowers.',
      dressCode: 'Sunlit Yellows & Haldi Florals',
    },
    {
      id: 'e2',
      name: 'Mehendi & Sangeet',
      date: '13 December 2026',
      time: '06:00 PM',
      venueName: 'Mughal Lawns',
      address: 'Rambagh Palace, Jaipur',
      description: 'An evening of intricate bridal henna, rhythmic dholak beats, dance performances and festive cocktails.',
      dressCode: 'Cocktail Couture & Jewel Tones',
    },
    {
      id: 'e3',
      name: 'Mandap Muhurat & Baraat',
      date: '14 December 2026',
      time: '04:00 PM',
      venueName: 'Royal Front Pavilions',
      address: 'Rambagh Palace, Jaipur',
      description: 'The royal arrival of the groom on horse carriage with brass band, shehnai and grand welcome.',
      dressCode: 'Royal Sherwanis & Safas',
    },
    {
      id: 'e4',
      name: 'Sacred Seven Vows & Vivah',
      date: '14 December 2026',
      time: '07:00 PM',
      venueName: 'The Baradari Palace Mandap',
      address: 'Rambagh Palace, Jaipur',
      description: 'The sacred Saat Phere around the holy Agni under the starlit sky, uniting two souls forever.',
      dressCode: 'Traditional Indian Elegance',
    },
    {
      id: 'e5',
      name: 'Grand Royal Reception',
      date: '15 December 2026',
      time: '08:00 PM',
      venueName: 'Grand Ballroom & Courtyard',
      address: 'Rambagh Palace, Jaipur',
      description: 'An enchanting candlelit banquet celebrating the newly wedded couple with culinary delicacies and live music.',
      dressCode: 'Black Tie & Imperial Silk',
    },
  ];

  // Gallery items fallback
  const galleryItems = [
    { src: asset('gallery/1.webp'), caption: 'Bridal Henna & Sacred Bangles' },
    { src: asset('gallery/2.webp'), caption: 'Sacred Floral Mandap' },
    { src: asset('gallery/3.webp'), caption: 'The Royal Groom Arrival' },
    { src: asset('gallery/4.webp'), caption: 'Eternal Rings of Promise' },
    { src: asset('gallery/5.webp'), caption: 'Lanterns & Enchanted Evenings' },
    { src: asset('gallery/6.webp'), caption: 'Sacred Seven Vows' },
    { src: asset('gallery/7.webp'), caption: 'Sangeet Musical Celebration' },
    { src: asset('gallery/8.webp'), caption: 'Joyous Mehndi Ceremony' },
    { src: asset('gallery/9.webp'), caption: 'Auspicious Haldi Blessings' },
    { src: asset('gallery/10.webp'), caption: 'Grand Royal Reception' },
    { src: asset('gallery/11.webp'), caption: 'Together In Eternal Love' },
  ];

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState({ days: 28, hours: 14, minutes: 36, seconds: 20 });
  useEffect(() => {
    const target = new Date('2026-12-14T19:00:00').getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio Playback
  useEffect(() => {
    audioRef.current = new Audio(asset('soundtrack.mp3'));
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  const handleGateOpened = () => {
    setHasOpenedGate(true);
    shootPetals();
    if (audioRef.current && !isPlayingAudio) {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
    }
  };

  // RSVP submission state
  const [guestName, setGuestName] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [guestCount, setGuestCount] = useState(2);
  const [rsvpNote, setRsvpNote] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setRsvpSubmitted(true);
    shootGoldDust();
  };

  return (
    <div className="op-root relative isolate min-h-screen overflow-x-clip bg-[#FAF6F0] text-[#240A10] font-serif selection:bg-[#F3D7B5]">
      {/* 1. Gate Opening Screen */}
      <AnimatePresence>
        {!hasOpenedGate && (
          <GateCover
            brideName={brideFirstName}
            groomName={groomFirstName}
            onOpen={handleGateOpened}
          />
        )}
      </AnimatePresence>

      {/* Floating Audio Button */}
      {hasOpenedGate && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 border-op-gold bg-white/90 text-op-primary shadow-xl backdrop-blur hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title={isPlayingAudio ? 'Mute Music' : 'Play Romantic Music'}
        >
          {isPlayingAudio ? (
            <Volume2 className="h-5 w-5 text-op-gold-deep animate-pulse" />
          ) : (
            <VolumeX className="h-5 w-5 text-[#888]" />
          )}
        </motion.button>
      )}

      {/* 2. Hero Section: Candlelit Pavilion */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center bg-op-night">
        {/* Parallax Hero Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={asset('hero/portrait.webp')}
            alt="Royal Couple in Pavilion"
            className="h-full w-full object-cover object-center"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3.5, ease: EASE_W }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-black/20 to-black/40" />
        </div>

        {/* Floating Sparkles & Soft Candle Light */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[15, 35, 65, 85].map((pos, idx) => (
            <span
              key={idx}
              className="op-sparkle absolute h-2 w-2 rounded-full bg-[#FFE5B4] shadow-[0_0_12px_#FFD700]"
              style={{
                left: `${pos}%`,
                top: `${25 + (idx % 3) * 18}%`,
                animation: `op-sparkle 4s ease-in-out ${idx * 0.9}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Hero Overlay Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-12 max-w-4xl">
          {/* Royal Intertwined Gold Monogram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE_Y }}
          >
            <GoldMonogram first={brideFirstName[0]} second={groomFirstName[0]} size={90} />
          </motion.div>

          {/* Couple Names in Gilded Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: EASE_Y }}
            className="op-serif op-ink-gold mt-6 text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-[0.2em]"
          >
            {brideFirstName} & {groomFirstName}
          </motion.h1>

          {/* Gold Star Divider */}
          <div className="my-4 flex items-center justify-center gap-3 w-48 text-[#8d5b1d]">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#b8803c] to-[#7d501d]" />
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#8d5b1d]">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#b8803c] to-[#7d501d]" />
          </div>

          {/* Wedding Date in Gold Uppercase */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2, ease: EASE_Y }}
            className="op-serif op-ink-gold text-sm sm:text-base font-semibold uppercase tracking-[0.25em]"
          >
            14 December 2026 • Jaipur, Rajasthan
          </motion.p>

          {/* Floating Royal Gold Plaque */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: EASE_Y }}
            className="mt-8 rounded-full border-2 border-op-gold bg-white/90 px-8 py-3.5 shadow-xl backdrop-blur-sm"
          >
            <p className="op-display text-sm sm:text-lg font-bold uppercase tracking-[0.15em] text-op-primary">
              The Wedding Celebration of {brideFirstName} & {groomFirstName}
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-op-gold-deep mt-0.5 font-medium">
              Rambagh Palace, Jaipur
            </p>
          </motion.div>

          {/* Bouncing Chevron Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="mt-10 text-op-primary"
          >
            <ChevronDown className="h-6 w-6 text-op-gold-deep" />
          </motion.div>
        </div>
      </section>

      {/* 3. Formal Invitation & Live Arched Countdown */}
      <section className="relative px-4 py-16 md:py-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: EASE_Y }}
        >
          <p className="op-script text-3xl sm:text-5xl text-op-gold-deep">
            Together with their families
          </p>
          <p className="op-serif mt-4 text-xl sm:text-2xl md:text-3xl italic text-op-primary max-w-2xl mx-auto leading-relaxed">
            request the honour of your presence to celebrate the union of two souls and the joining of two families.
          </p>
          <div className="mt-6">
            <GoldOrnament />
          </div>

          {/* Arched Countdown Timer */}
          <div className="mt-10">
            <p className="op-display text-xs uppercase tracking-[0.3em] text-op-gold-deep font-semibold mb-4">
              Counting the Moments
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Minutes', val: timeLeft.minutes },
                { label: 'Seconds', val: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-2 border-op-gold/60 bg-white/80 shadow-md backdrop-blur-sm"
                >
                  <span className="op-display text-2xl sm:text-3xl font-bold text-op-primary">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-op-gold-deep font-medium mt-0.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. The Royal Couple Section (Golden Baroque Frames & Holding Hands) */}
      <section className="relative px-4 py-16 md:py-24 max-w-5xl mx-auto">
        <SectionHeader kicker="With the blessings of our elders" title="The Royal Couple" />

        <div className="relative mx-auto max-w-[50rem]">
          {/* Soft radiant aura behind frames */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[85%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, oklch(0.9 0.05 5 / 0.7) 0%, oklch(0.76 0.13 5 / 0.3) 45%, transparent 70%)',
            }}
          />

          <div className="relative aspect-[1122/1402] w-full [container-type:inline-size]">
            {/* Floral corner decoration */}
            <div className="absolute left-0 top-0 w-[45%] pointer-events-none">
              <img
                src={asset('couple/floral-corner.webp')}
                alt=""
                className="w-full h-auto object-contain drop-shadow"
              />
            </div>

            {/* Groom Photo in Golden Frame */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE_Y }}
              className="absolute left-[4.58%] top-[30.7%] w-[42.13%]"
              style={{ aspectRatio: '423 / 658' }}
            >
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  maskImage: `url(${asset('couple/frame-groom-mask.png')})`,
                  maskSize: '100% 100%',
                  WebkitMaskImage: `url(${asset('couple/frame-groom-mask.png')})`,
                  WebkitMaskSize: '100% 100%',
                }}
              >
                <img
                  src={bride.photo || asset('couple/groom.webp')}
                  alt={groom.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <img
                src={asset('couple/frame-groom.webp')}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_10px_20px_rgba(142,29,44,0.25)]"
              />
            </motion.div>

            {/* Bride Photo in Golden Frame */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.25, ease: EASE_Y }}
              className="absolute left-[56.67%] top-[3.89%] w-[43.33%]"
              style={{ aspectRatio: '435 / 642' }}
            >
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  maskImage: `url(${asset('couple/frame-bride-mask.png')})`,
                  maskSize: '100% 100%',
                  WebkitMaskImage: `url(${asset('couple/frame-bride-mask.png')})`,
                  WebkitMaskSize: '100% 100%',
                }}
              >
                <img
                  src={groom.photo || asset('couple/bride.webp')}
                  alt={bride.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <img
                src={asset('couple/frame-bride.webp')}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_10px_20px_rgba(142,29,44,0.25)]"
              />
            </motion.div>

            {/* Authentic Hands Holding Together Overlay */}
            <motion.img
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1.5, ease: EASE_Y }}
              src={asset('couple/hands.webp')}
              alt="Hands Holding"
              className="pointer-events-none absolute left-[4.58%] top-[3.89%] h-auto w-[95.42%] drop-shadow-[0_6px_10px_rgba(142,29,44,0.2)]"
            />

            {/* Groom Details Card */}
            <div className="absolute left-[5.5%] top-[65.2%] flex w-[38.5%] flex-col items-center text-center">
              <h3 className="op-script text-2xl sm:text-3xl font-bold text-op-primary">
                {groom.name}
              </h3>
              <img src={asset('couple/flourish-thin.webp')} alt="" className="my-1.5 w-[54%] h-auto" />
              <p className="op-serif text-xs sm:text-sm text-op-primary/80 italic">
                {groom.parents || 'Son of Mrs. & Mr. Agarwal'}
              </p>
              <img src={asset('couple/flourish-tip.webp')} alt="" className="mt-1 w-[42%] h-auto" />
            </div>

            {/* Intertwined Gold Medallion & */}
            <div className="absolute left-[41%] top-[75%] flex w-[23%] items-center justify-center">
              <span className="op-bg-gold-grad h-[2px] w-[20%] flex-none [clip-path:polygon(0_50%,100%_0,100%_100%)]" />
              <img
                src={asset('couple/medallion.webp')}
                alt="&"
                className="h-auto w-[46%] shrink-0 drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]"
              />
              <span className="op-bg-gold-grad h-[2px] w-[20%] flex-none [clip-path:polygon(0_0,100%_50%,0_100%)]" />
            </div>

            {/* Bride Details Card */}
            <div className="absolute left-[54%] top-[49.2%] flex w-[38.5%] flex-col items-center text-center">
              <img src={asset('couple/flourish-crown.webp')} alt="" className="w-[58%] h-auto mb-1" />
              <h3 className="op-script text-2xl sm:text-3xl font-bold text-op-primary">
                {bride.name}
              </h3>
              <img src={asset('couple/flourish-thin.webp')} alt="" className="my-1.5 w-[54%] h-auto" />
              <p className="op-serif text-xs sm:text-sm text-op-primary/80 italic">
                {bride.parents || 'Daughter of Mrs. & Mr. Sharma'}
              </p>
              <img src={asset('couple/flourish-tip.webp')} alt="" className="mt-1 w-[42%] h-auto" />
            </div>

            {/* Floral Base Accent at bottom */}
            <div className="absolute left-[18.5%] top-[86%] w-[63%] pointer-events-none">
              <img
                src={asset('couple/floral-base.webp')}
                alt=""
                className="w-full h-auto object-contain drop-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Royal Wedding Ceremonies Section */}
      <section className="relative px-4 py-16 md:py-28 overflow-hidden">
        <SectionHeader
          kicker={`${events.length} Sacred Festivities`}
          title="The Royal Wedding Ceremonies"
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((ev, idx) => (
            <CeremonyCard key={ev.id || idx} event={ev} index={idx} />
          ))}
        </div>
      </section>

      {/* 6. Our Family Section (Family in Golden Arches) */}
      <section className="relative px-4 py-16 md:py-24 max-w-5xl mx-auto">
        <SectionHeader kicker="With love & lifelong blessings" title="Our Beloved Family" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {[
            { name: 'Smt. & Shri Agarwal', relation: "Groom's Parents", img: asset('family/father-groom.webp') },
            { name: 'Smt. & Shri Sharma', relation: "Bride's Parents", img: asset('family/father-bride.webp') },
            { name: 'Rohan Agarwal', relation: "Groom's Brother", img: asset('family/brother.webp') },
            { name: 'Ananya Sharma', relation: "Bride's Sister", img: asset('family/sister.webp') },
          ].map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: idx * 0.1, ease: EASE_Y }}
              className="flex flex-col items-center text-center group"
            >
              {/* Golden Arch Portrait Frame */}
              <div className="relative aspect-[640/905] w-36 sm:w-44 overflow-hidden rounded-[2.5rem] shadow-md group-hover:scale-105 transition-transform duration-500">
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    maskImage: `url(${asset('family/arch-mask.png')})`,
                    maskSize: '100% 100%',
                    WebkitMaskImage: `url(${asset('family/arch-mask.png')})`,
                    WebkitMaskSize: '100% 100%',
                  }}
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <img
                  src={asset('family/arch.webp')}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full drop-shadow"
                />
              </div>

              <h4 className="op-display mt-3 text-sm sm:text-base font-bold text-op-primary">
                {member.name}
              </h4>
              <p className="op-serif text-xs italic text-op-gold-deep">
                {member.relation}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. Wedding Gallery Section */}
      <section className="relative px-4 py-16 md:py-24 max-w-6xl mx-auto">
        <SectionHeader kicker="Moments to treasure" title="Wedding Gallery" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setActivePhotoIdx(idx)}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-op-gold/40 shadow-md cursor-pointer"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-white">
                <span className="op-script text-base sm:text-lg text-op-gold-light line-clamp-1">
                  {photo.caption}
                </span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/40 text-op-gold border border-op-gold/60">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery Lightbox */}
        <AnimatePresence>
          {activePhotoIdx !== null && (
            <Lightbox
              photos={galleryItems}
              index={activePhotoIdx}
              onClose={() => setActivePhotoIdx(null)}
              onStep={(dir) =>
                setActivePhotoIdx((prev) =>
                  prev !== null ? (prev + dir + galleryItems.length) % galleryItems.length : 0
                )
              }
            />
          )}
        </AnimatePresence>
      </section>

      {/* 8. Venue & Map Directions */}
      <section className="relative px-4 py-16 md:py-24 max-w-4xl mx-auto">
        <SectionHeader kicker="Where hearts unite" title="The Wedding Venue" />

        <div className="rounded-3xl border-2 border-op-gold bg-white/90 p-8 md:p-10 shadow-xl backdrop-blur-sm text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-gradient-to-b from-[#8E1D2C] to-[#5A0C16] text-[#F9E2AF] shadow-md mb-4">
            <MapPin className="h-8 w-8" />
          </div>
          <h3 className="op-display text-2xl md:text-3xl font-bold text-op-primary">
            Rambagh Palace
          </h3>
          <p className="op-serif mt-2 text-base md:text-lg text-[#555] max-w-md mx-auto">
            Bhawani Singh Road, Rambagh, Jaipur, Rajasthan 302005
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://maps.google.com/?q=Rambagh+Palace+Jaipur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8E1D2C] to-[#680C17] px-8 py-3 text-sm font-serif font-bold uppercase tracking-wider text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Navigation className="h-4 w-4" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. Royal RSVP Section */}
      <section className="relative px-4 py-16 md:py-24 max-w-3xl mx-auto">
        <SectionHeader kicker="Kindly respond" title="Will You Join Us?" />

        <div className="rounded-3xl border-2 border-op-gold bg-white/95 p-6 sm:p-10 shadow-xl backdrop-blur-sm">
          {rsvpSubmitted ? (
            <div className="text-center py-8">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[#8E1D2C] text-[#F9E2AF] mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="op-display text-2xl font-bold text-op-primary">
                Thank You, {guestName}!
              </h3>
              <p className="op-serif mt-2 text-base text-op-fg italic">
                Your response has been warmly received. We look forward to celebrating together.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-6">
              <div>
                <label className="op-display block text-xs uppercase tracking-[0.2em] text-op-gold-deep font-semibold mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Mr. & Mrs. Kapoor"
                  className="w-full rounded-xl border border-op-gold/60 bg-white/80 px-4 py-3 text-base text-op-fg outline-none focus:border-op-primary transition shadow-inner"
                />
              </div>

              {/* Attendance Options */}
              <div>
                <label className="op-display block text-xs uppercase tracking-[0.2em] text-op-gold-deep font-semibold mb-2">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAttendance('attending')}
                    className={`py-3 px-4 rounded-xl border-2 font-serif font-bold text-sm tracking-wider uppercase transition cursor-pointer ${
                      attendance === 'attending'
                        ? 'border-op-primary bg-[#8E1D2C] text-white shadow-md'
                        : 'border-op-gold/50 bg-white/60 text-op-fg hover:border-op-gold'
                    }`}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance('declined')}
                    className={`py-3 px-4 rounded-xl border-2 font-serif font-bold text-sm tracking-wider uppercase transition cursor-pointer ${
                      attendance === 'declined'
                        ? 'border-op-primary bg-[#8E1D2C] text-white shadow-md'
                        : 'border-op-gold/50 bg-white/60 text-op-fg hover:border-op-gold'
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {/* Guest Count Stepper */}
              {attendance === 'attending' && (
                <div>
                  <label className="op-display block text-xs uppercase tracking-[0.2em] text-op-gold-deep font-semibold mb-2">
                    Number of Guests Attending
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      className="h-10 w-10 rounded-full border border-op-gold bg-white text-op-primary flex items-center justify-center font-bold hover:bg-op-gold/10 cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="op-display text-2xl font-bold text-op-primary w-8 text-center">
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount((c) => Math.min(10, c + 1))}
                      className="h-10 w-10 rounded-full border border-op-gold bg-white text-op-primary flex items-center justify-center font-bold hover:bg-op-gold/10 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Message Note */}
              <div>
                <label className="op-display block text-xs uppercase tracking-[0.2em] text-op-gold-deep font-semibold mb-2">
                  Warm Wishes or Notes
                </label>
                <textarea
                  rows={3}
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  placeholder="Share a sweet blessing or message for the couple..."
                  className="w-full rounded-xl border border-op-gold/60 bg-white/80 px-4 py-3 text-base text-op-fg outline-none focus:border-op-primary transition shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-[#8E1D2C] via-[#700D1A] to-[#5A0C16] py-3.5 text-sm font-serif font-bold uppercase tracking-[0.2em] text-[#F9E2AF] shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Confirm RSVP</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 10. Family Contacts */}
      <section className="relative px-4 py-12 max-w-4xl mx-auto text-center">
        <p className="op-display text-xs uppercase tracking-[0.25em] text-op-gold-deep font-semibold">
          For any help, call us
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
          {[
            { name: 'Mr. Rajesh Agarwal (Groom)', phone: '+91 98765 43210' },
            { name: 'Mr. Viren Sharma (Bride)', phone: '+91 98765 43211' },
          ].map((c, idx) => (
            <a
              key={idx}
              href={`tel:${c.phone}`}
              className="flex items-center gap-2 rounded-full border border-op-gold/60 bg-white/80 px-6 py-2.5 text-xs sm:text-sm font-serif font-bold text-op-primary shadow-sm hover:border-op-primary transition"
            >
              <Phone className="h-3.5 w-3.5 text-op-gold-deep" />
              <span>{c.name}: {c.phone}</span>
            </a>
          ))}
        </div>
      </section>

      {/* 11. Finale & Grand Blossom Tree */}
      <section className="relative overflow-hidden pt-16 pb-20 text-center">
        <p className="op-script text-3xl sm:text-5xl text-op-gold-deep">
          Awaiting your presence
        </p>
        <h2 className="op-display mt-2 text-4xl sm:text-6xl md:text-7xl font-bold text-op-primary">
          {brideFirstName} & {groomFirstName}
        </h2>
        <p className="op-serif mt-3 text-sm sm:text-base uppercase tracking-[0.2em] text-op-gold-deep font-semibold">
          14 December 2026 • Jaipur
        </p>
        {data.hashtag && (
          <p className="mt-3 text-sm italic text-op-primary/80">
            {data.hashtag}
          </p>
        )}

        {/* Hand-painted Blossom Tree Illustration */}
        <div className="relative mt-8 max-w-3xl mx-auto px-4">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE_Y }}
            src={asset('finale/blossom-tree.webp')}
            alt="Cherry Blossom Wedding Tree"
            className="w-full h-auto object-contain drop-shadow-[0_15px_35px_rgba(200,80,110,0.22)]"
          />

          {/* Twinkling Golden Fireflies on Tree */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {[10, 25, 45, 60, 75, 90, 30, 70].map((left, idx) => (
              <span
                key={idx}
                className="op-twinkle absolute rounded-full bg-op-gold shadow-[0_0_10px_#D4AF37]"
                style={{
                  width: idx % 2 === 0 ? 5 : 3,
                  height: idx % 2 === 0 ? 5 : 3,
                  left: `${left}%`,
                  top: `${20 + (idx % 4) * 18}%`,
                  animation: `op-twinkle 3s ease-in-out ${idx * 0.4}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-xs text-op-gold-deep uppercase tracking-[0.2em]">
          With blessings & love from both families
        </div>
      </section>
    </div>
  );
}
