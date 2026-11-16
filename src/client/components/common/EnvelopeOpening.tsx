import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeOpeningProps {
  sealText: string;
  coupleNames: string;
  onOpen: () => void;
  primaryColor?: string;
  accentColor?: string;
}

export function EnvelopeOpening({
  sealText = 'S & J',
  coupleNames,
  onOpen,
  primaryColor = '#FAF7F2',
  accentColor = '#C8A97E',
}: EnvelopeOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 750);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#FAF7F2] select-none"
        >
          {/* Subtle Ambient Depth */}
          <div className="absolute inset-0 bg-radial from-[#FFFFFF] via-[#FAF7F2] to-[#EFEAE1] opacity-70 pointer-events-none" />

          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm flex flex-col items-center relative z-10"
          >
            {/* Top Minimalist Header */}
            <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#8C827A] mb-6 block text-center">
              Wedding Invitation
            </span>

            {/* Tactile Ivory Linen Envelope */}
            <div
              onClick={handleOpen}
              className="relative w-76 sm:w-84 h-56 rounded-2xl shadow-[0_25px_60px_-15px_rgba(60,45,35,0.12)] border border-[#E8DFD0] cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-6 bg-[#FCFBF8] transition-all duration-300 hover:shadow-[0_30px_70px_-15px_rgba(60,45,35,0.18)]"
            >
              {/* Inner Hairline Fillet */}
              <div className="absolute inset-2 border border-[#EFE7DC] rounded-xl pointer-events-none" />

              {/* Envelope Flap Lines */}
              <div
                className="absolute top-0 left-0 right-0 h-28 border-b border-[#E8DFD0] bg-[#FAF7F2]/50 pointer-events-none"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              />

              {/* Couple Names */}
              <div className="font-display text-xl sm:text-2xl text-[#2C2724] tracking-wider mb-1 mt-4">
                {coupleNames}
              </div>

              <div className="text-[11px] text-[#7C746C] font-serif italic tracking-wide">
                Cordially invite you
              </div>

              {/* The Stamped Wax Seal */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="mt-6 w-15 h-15 rounded-full flex flex-col items-center justify-center relative cursor-pointer shadow-[0_6px_20px_rgba(140,110,80,0.25)] border border-[#BFA074] bg-gradient-to-br from-[#D5BA93] via-[#C8A97E] to-[#A8885B]"
              >
                {/* Monogram Seal Stamped Inside */}
                <div className="w-12 h-12 rounded-full border border-[#DFCEB3]/50 flex items-center justify-center shadow-inner">
                  <span className="font-serif font-semibold text-[#FFFFFF] text-xs tracking-widest deboss-text">
                    {sealText || 'S & J'}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Prompt */}
            <motion.p
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
              onClick={handleOpen}
              className="mt-6 text-[11px] font-sans tracking-[0.25em] uppercase text-[#7A7169] cursor-pointer"
            >
              Tap Wax Seal to Open
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
