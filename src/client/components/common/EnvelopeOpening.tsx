import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface EnvelopeOpeningProps {
  sealText: string;
  coupleNames: string;
  onOpen: () => void;
  primaryColor?: string;
  accentColor?: string;
}

export function EnvelopeOpening({
  sealText,
  coupleNames,
  onOpen,
  primaryColor = '#721c24',
  accentColor = '#d4af37',
}: EnvelopeOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-md"
        >
          {/* Subtle Ambient Background Aura */}
          <div
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm flex flex-col items-center"
          >
            {/* Top Ornamental Header */}
            <div className="flex items-center gap-2 mb-6 text-amber-200/80 tracking-widest text-xs uppercase font-serif">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Wedding Invitation</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>

            {/* The Envelope Body */}
            <div
              onClick={handleOpen}
              className="relative w-80 h-56 rounded-xl shadow-2xl cursor-pointer overflow-hidden border border-amber-500/30 transition-transform duration-300 hover:scale-102 flex flex-col items-center justify-center text-center p-6"
              style={{
                background: `linear-gradient(145deg, #1c1917, #0c0a09)`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${primaryColor}40`,
              }}
            >
              {/* Envelope Flap Fold Lines */}
              <div className="absolute inset-0 border-2 border-amber-400/20 m-2 rounded-lg pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-28 border-b border-amber-500/20 bg-white/2 pointer-events-none" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />

              {/* Couple Initial Monogram */}
              <div className="text-stone-300 font-serif text-lg tracking-wider mb-2">
                {coupleNames}
              </div>

              <div className="text-xs text-amber-200/60 font-sans tracking-wide">
                Cordially invite you to celebrate their union
              </div>

              {/* The Wax Seal Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg border-2 relative cursor-pointer group"
                style={{
                  backgroundColor: primaryColor,
                  borderColor: accentColor,
                  boxShadow: `0 0 20px ${accentColor}60`,
                }}
              >
                <span className="font-serif font-bold text-amber-100 text-sm tracking-wider">
                  {sealText || 'WED'}
                </span>
                <Heart className="w-2.5 h-2.5 text-amber-300 fill-amber-300 mt-0.5" />

                {/* Pulsing Ring */}
                <div className="absolute -inset-1 rounded-full border border-amber-400/40 animate-ping pointer-events-none" />
              </motion.div>
            </div>

            {/* Call to action label */}
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-6 text-sm text-amber-200/90 font-serif tracking-widest uppercase flex items-center gap-2 cursor-pointer"
              onClick={handleOpen}
            >
              Tap Wax Seal to Open
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

