import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Copy, Share2, ExternalLink } from 'lucide-react';
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
  const [weddingDate, setWeddingDate] = useState('2026-09-19');
  const [cityVenue, setCityVenue] = useState('The Glass Conservatory, Provence');
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

    const newInvitation: WeddingInvitation = {
      ...SAMPLE_INVITATION,
      id: `inv-${Date.now()}`,
      slug: generatedSlug,
      couple: {
        bride: {
          name: brideName,
          parents: `Daughter of the ${brideName.split(' ')[1] || brideName} Family`,
          photoUrl: SAMPLE_INVITATION.couple.bride.photoUrl,
        },
        groom: {
          name: groomName,
          parents: `Son of the ${groomName.split(' ')[1] || groomName} Family`,
          photoUrl: SAMPLE_INVITATION.couple.groom.photoUrl,
        },
      },
      weddingDate,
      hashtag: `#${brideName.replace(/\s+/g, '')}And${groomName.replace(/\s+/g, '')}`,
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
    } catch {
      setCreatedUrl(`${window.location.origin}/invite/${newInvitation.slug}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!createdUrl) return;
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-lg bg-white border border-[#E8DFD0] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(50,40,30,0.15)] text-[#2C2724]"
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8C827A] hover:text-[#2C2724] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {createdUrl ? (
              <div className="py-6 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#C8A97E] border border-[#E8DFD0] flex items-center justify-center mb-4">
                  <CheckCircle className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-display text-[#2C2724] mb-2">
                  Your Invitation is Ready
                </h3>

                <p className="text-xs sm:text-sm text-[#6B635B] max-w-sm mb-6 leading-relaxed font-serif italic">
                  Your animated stationery page is now live and ready to be shared with family and friends.
                </p>

                <div className="w-full bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl p-2.5 flex items-center justify-between gap-2 mb-6">
                  <span className="text-xs text-[#2C2724] font-mono truncate pl-2">
                    {createdUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-[#2C2724] text-[#FAF7F2] text-xs font-medium shrink-0 cursor-pointer hover:bg-[#453E3A] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={createdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#2C2724] hover:bg-[#453E3A] text-[#FAF7F2] font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>Open Invitation</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C8A97E]" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `We cordially invite you to celebrate our wedding! Click here to open our invitation: ${createdUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#C8A97E] block mb-1">
                    Design Selected: {selectedTemplateId.toUpperCase()}
                  </span>
                  <h3 className="text-2xl font-display text-[#2C2724]">
                    Enter Your Details
                  </h3>
                  <p className="text-xs text-[#7C746C] font-serif italic mt-1">
                    Create your bespoke animated stationery in moments
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1 font-medium">
                      Bride's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="e.g. Sophia"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1 font-medium">
                      Groom's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="e.g. Julian"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1 font-medium">
                    Wedding Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1 font-medium">
                    Venue & Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityVenue}
                    onChange={(e) => setCityVenue(e.target.value)}
                    placeholder="e.g. The Glass Conservatory, Provence"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1">
                    UPI ID or Registry Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. couple@registry"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-[#FAF7F2] bg-[#2C2724] hover:bg-[#453E3A] transition-all cursor-pointer shadow-xs disabled:opacity-50 mt-4"
                >
                  {loading ? 'Creating Invitation...' : 'Create Invitation Page'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
