import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeOpeningProps {
  sealText?: string;
  coupleNames: string;
  onOpen: () => void;
  primaryColor?: string;
  accentColor?: string;
}

export function EnvelopeOpening({
  sealText = '|| શ્રી ||',
  coupleNames,
  onOpen,
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
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#380505] select-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 20%, #6E0F0F 0%, #290303 90%)',
          }}
        >
          <motion.div
            initial={{ scale: 0.94, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm flex flex-col items-center relative z-10"
          >
            {/* Top Auspicious Shubh Vivah Tag */}
            <span className="text-xs font-serif tracking-[0.25em] uppercase text-[#F9E2AF] mb-5 block text-center font-bold">
              || શ્રી ગણેશાય નમઃ ||
            </span>

            {/* Traditional Kumkum Red & Gold Foil Kankotri Envelope */}
            <div
              onClick={handleOpen}
              className="relative w-80 sm:w-88 h-56 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-2 border-[#D4AF37] cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-6 bg-[#5E0D0D] transition-all duration-300 hover:scale-102"
            >
              {/* Inner Jari Gold Fillet */}
              <div className="absolute inset-2 border border-[#D4AF37]/50 rounded-xl pointer-events-none" />
              <div className="absolute inset-3 border border-dashed border-[#D4AF37]/30 rounded-lg pointer-events-none" />

              {/* Envelope Flap Lines */}
              <div
                className="absolute top-0 left-0 right-0 h-28 border-b border-[#D4AF37]/40 bg-[#4A0808]/70 pointer-events-none"
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              />

              <span className="text-[11px] font-serif uppercase tracking-widest text-[#F9E2AF] block mb-1">
                શુભ લગ્ન કંકોત્રી
              </span>

              {/* Couple Names */}
              <div className="font-serif text-xl sm:text-2xl text-white tracking-wide mb-1 font-bold">
                {coupleNames}
              </div>

              <div className="text-xs text-[#E8C288] font-serif italic">
                સપરિવાર પધારવા ભાવભર્યું નિમંત્રણ
              </div>

              {/* Traditional Auspicious Wax Seal */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="mt-5 w-16 h-16 rounded-full flex flex-col items-center justify-center relative cursor-pointer shadow-[0_8px_25px_rgba(212,175,55,0.4)] border-2 border-[#FFE8A3] bg-gradient-to-tr from-[#9B111E] via-[#D4AF37] to-[#B31B1B]"
              >
                <div className="w-13 h-13 rounded-full border border-[#FFF3C4]/60 flex items-center justify-center bg-[#800C17]/90 shadow-inner">
                  <span className="font-serif font-bold text-[#F9E2AF] text-xs tracking-wider">
                    {sealText}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Prompt in Gujarati & English */}
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={handleOpen}
              className="mt-6 text-xs font-serif tracking-widest text-[#F9E2AF] cursor-pointer flex items-center gap-1.5"
            >
              <span>કંકોત્રી ખોલવા માટે સ્પર્શ કરો (Tap to Open)</span>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
