import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check, QrCode } from 'lucide-react';

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
  accentColor = '#d4af37',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-neutral-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-neutral-100"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 mx-auto flex items-center justify-center mb-4">
              <Gift className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              Blessings & Shagun
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed mb-6 font-sans">
              {giftNote ||
                'Your warm presence and blessings are the sweetest gifts! If you wish to send a token of love, you may do so digitally:'}
            </p>

            {upiId && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center gap-3">
                <div className="w-40 h-40 bg-white rounded-xl p-2 flex items-center justify-center shadow-inner">
                  {/* Generated QR Code for UPI */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      `upi://pay?pa=${upiId}&pn=Wedding+Gift&cu=INR`
                    )}`}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full flex items-center justify-between bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800 text-xs">
                  <span className="text-neutral-300 font-mono truncate">{upiId}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium ml-2 px-2 py-1 rounded bg-amber-500/10"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
