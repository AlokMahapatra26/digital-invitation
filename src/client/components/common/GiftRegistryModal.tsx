import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check } from 'lucide-react';

interface GiftRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  upiId?: string;
  giftNote?: string;
  accentColor?: string;
}

export function GiftRegistryModal({
  isOpen,
  onClose,
  upiId,
  giftNote,
}: GiftRegistryModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-sm bg-[#FFFFFF] border border-[#E8DFD0] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(50,40,30,0.15)] text-center text-[#2C2724]"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8C827A] hover:text-[#2C2724] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DFD0] text-[#C8A97E] mx-auto flex items-center justify-center mb-3">
              <Gift className="w-5 h-5" />
            </div>

            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C827A] block mb-1">
              Registry
            </span>
            <h3 className="text-2xl font-display text-[#2C2724] mb-2">
              Gift of Love
            </h3>

            <p className="text-xs text-[#6B635B] font-serif italic leading-relaxed mb-6">
              {giftNote ||
                'Your warm presence is the greatest gift of all. If you wish to send a token of love, you may do so digitally:'}
            </p>

            {upiId && (
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] flex flex-col items-center gap-3">
                <div className="w-36 h-36 bg-white rounded-lg p-2 flex items-center justify-center shadow-xs border border-[#EDE5DA]">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                      `upi://pay?pa=${upiId}&pn=Wedding+Gift&cu=INR`
                    )}`}
                    alt="Registry QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-[#EDE5DA] text-xs">
                  <span className="text-[#453E3A] font-mono truncate text-[11px]">{upiId}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[#2C2724] hover:text-[#C8A97E] font-medium ml-2 px-2 py-1 rounded bg-[#FAF7F2] text-[11px] cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#C8A97E]" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
