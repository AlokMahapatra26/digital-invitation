import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, CheckCircle, Copy, Share2, ExternalLink } from 'lucide-react';
import { TemplateId, WeddingInvitation } from '@/shared/types';
import { SAMPLE_INVITATION } from '@/shared/defaults';
import { saveInvitation } from '@/client/lib/api';
import { useConfetti } from '@/client/hooks/useConfetti';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: TemplateId;
}

export function QuickCreateModal({
  isOpen,
  onClose,
  selectedTemplateId,
}: QuickCreateModalProps) {
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-12-18');
  const [cityVenue, setCityVenue] = useState('The Grand Heritage Lawn, New Delhi');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { shootPetals } = useConfetti();

  const generatedSlug = (brideName && groomName)
    ? `${brideName}-${groomName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'our-wedding';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) return;

    setLoading(true);

    const initials = `${brideName.charAt(0)} & ${groomName.charAt(0)}`.toUpperCase();

    // Create customized invitation based on sample skeleton and chosen template
    const newInvitation: WeddingInvitation = {
      ...SAMPLE_INVITATION,
      id: `inv-${Date.now()}`,
      slug: generatedSlug,
      couple: {
        bride: {
          name: brideName,
          parents: `D/o the ${brideName.split(' ')[1] || brideName} Family`,
          photoUrl: SAMPLE_INVITATION.couple.bride.photoUrl,
        },
        groom: {
          name: groomName,
          parents: `S/o the ${groomName.split(' ')[1] || groomName} Family`,
          photoUrl: SAMPLE_INVITATION.couple.groom.photoUrl,
        },
      },
      weddingDate,
      hashtag: `#${brideName.replace(/\s+/g, '')}Weds${groomName.replace(/\s+/g, '')}`,
      events: SAMPLE_INVITATION.events.map((evt) => ({
        ...evt,
        date: weddingDate,
        venueName: cityVenue,
      })),
      theme: {
        ...SAMPLE_INVITATION.theme,
        templateId: selectedTemplateId,
        envelopeSealText: initials,
      },
      upiId: upiId || undefined,
      enableGifts: Boolean(upiId),
    };

    try {
      await saveInvitation(newInvitation);
      const fullUrl = `${window.location.origin}/invite/${newInvitation.slug}`;
      setCreatedUrl(fullUrl);
      shootPetals();
    } catch (err) {
      console.error(err);
      // Fallback
      setCreatedUrl(`${window.location.origin}/invite/${newInvitation.slug}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdUrl) return;
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClose = () => {
    setCreatedUrl(null);
    setBrideName('');
    setGroomName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-neutral-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-100"
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {createdUrl ? (
              /* Success Screen */
              <div className="py-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  Your Invitation is Live! 🎉
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mb-6 leading-relaxed">
                  We have created your animated wedding invitation page. You can share this link directly on WhatsApp or open it to preview.
                </p>

                {/* Link Box */}
                <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between gap-2 mb-6">
                  <span className="text-xs text-amber-300 font-mono truncate text-left pl-2">
                    {createdUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={createdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-neutral-950 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <span>Open My Invitation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `We cordially invite you to celebrate our wedding! Click here to open our invitation: ${createdUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Simple Details Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <span className="text-xs font-serif text-amber-300 uppercase tracking-widest block mb-1">
                    Template Selected: {selectedTemplateId.toUpperCase()}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Enter Your Wedding Details
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Fill in your details below and we will instantly create your animated page.
                  </p>
                </div>

                {/* Bride & Groom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                      Bride's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                      Groom's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Wedding Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                {/* Venue & City */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Main Venue & City *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityVenue}
                    onChange={(e) => setCityVenue(e.target.value)}
                    placeholder="e.g. The Leela Palace, Udaipur"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                {/* Optional UPI */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    UPI ID for Digital Shagun (Optional)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. rahul@okhdfcbank"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm font-mono"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-6"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Creating Invitation...' : 'Create My Invitation Page'}</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
