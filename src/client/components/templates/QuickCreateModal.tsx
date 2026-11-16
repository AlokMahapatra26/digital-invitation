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
  const [brideParents, setBrideParents] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-12-14');
  const [cityVenue, setCityVenue] = useState('અમદાવાદ (Ahmedabad)');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { shootPetals } = useConfetti();

  const generatedSlug = (brideName && groomName)
    ? `${brideName}-${groomName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'shubh-lagna';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) return;

    setLoading(true);

    const newInvitation: WeddingInvitation = {
      ...SAMPLE_INVITATION,
      id: `inv-${Date.now()}`,
      slug: generatedSlug,
      couple: {
        bride: {
          name: brideName,
          gujaratiName: brideName,
          parents: brideParents || `સુપુત્રી: ${brideName} પરિવાર`,
          photoUrl: SAMPLE_INVITATION.couple.bride.photoUrl,
        },
        groom: {
          name: groomName,
          gujaratiName: groomName,
          parents: groomParents || `સુપુત્ર: ${groomName} પરિવાર`,
          photoUrl: SAMPLE_INVITATION.couple.groom.photoUrl,
        },
      },
      weddingDate,
      hashtag: `#${brideName.replace(/\s+/g, '')}Sang${groomName.replace(/\s+/g, '')}`,
      events: SAMPLE_INVITATION.events.map((evt) => ({
        ...evt,
        date: weddingDate,
        venueName: cityVenue,
      })),
      theme: {
        ...SAMPLE_INVITATION.theme,
        templateId: selectedTemplateId,
        envelopeSealText: '|| શ્રી ||',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-lg bg-[#FAF5EB] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] my-8 text-[#2C211E]"
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#7A6B56] hover:text-[#2C211E] hover:bg-[#EFE2CC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {createdUrl ? (
              <div className="py-6 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#EFE2CC] text-[#8C2323] border border-[#D4AF37] flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2323] mb-2">
                  તમારી ડિજિટલ કંકોત્રી તૈયાર છે! 🎉
                </h3>

                <p className="text-xs sm:text-sm text-[#5D4E3E] max-w-sm mb-6 leading-relaxed font-serif">
                  આપની ડિજિટલ કંકોત્રી બની ગઈ છે. હવે તમે સગા-સંબંધીઓ અને મિત્રોને WhatsApp પર સીધી મોકલી શકો છો.
                </p>

                <div className="w-full bg-white border border-[#D4AF37]/50 rounded-xl p-3 flex items-center justify-between gap-2 mb-6 shadow-xs">
                  <span className="text-xs text-[#8C2323] font-mono truncate pl-2 font-semibold">
                    {createdUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-1.5 rounded-lg bg-[#8C2323] text-white text-xs font-serif font-semibold shrink-0 cursor-pointer hover:bg-[#721B1B] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 inline mr-1" />
                    <span>{copied ? 'લિંક કોપી થઈ!' : 'લિંક કોપી કરો'}</span>
                  </button>
                </div>

                <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={createdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 rounded-xl bg-[#8C2323] hover:bg-[#721B1B] text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>કંકોત્રી જુઓ (Open)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `|| શ્રી ગણેશાય નમઃ ||\nસ્નેહી શ્રી, અમારા પરિવારના શુભ લગ્ન પ્રસંગે આપને સપરિવાર પધારવા ભાવભર્યું નિમંત્રણ છે.\nકંકોત્રી જોવા અહીં ક્લિક કરો: ${createdUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-serif font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp પર મોકલો</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <span className="text-xs font-serif text-[#8C2323] font-bold block mb-1">
                    || શ્રી ગણેશાય નમઃ ||
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#8C2323]">
                    કંકોત્રીની વિગત દાખલ કરો
                  </h3>
                  <p className="text-xs text-[#7A6B56] font-serif mt-1">
                    માત્ર ૨ મિનિટમાં તમારી સુંદર ગુજરાતી લગ્ન કંકોત્રી બનાવો
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1">
                      કન્યાનું નામ (Bride Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="દા.ત. રિયા (Riya)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1">
                      વરરાજાનું નામ (Groom Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="દા.ત. પાર્થ (Parth)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif text-[#5D4E3E] mb-1">
                      કન્યાના માતા-પિતાનું નામ
                    </label>
                    <input
                      type="text"
                      value={brideParents}
                      onChange={(e) => setBrideParents(e.target.value)}
                      placeholder="દા.ત. ભાવનાબેન અને વિરેનભાઈ શાહ"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif text-[#5D4E3E] mb-1">
                      વરના માતા-પિતાનું નામ
                    </label>
                    <input
                      type="text"
                      value={groomParents}
                      onChange={(e) => setGroomParents(e.target.value)}
                      placeholder="દા.ત. ગીતાબેન અને મુકેશભાઈ પટેલ"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1">
                      લગ્ન તિથિ (Wedding Date) *
                    </label>
                    <input
                      type="date"
                      required
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1">
                      મુખ્ય સ્થળ / ગામ (City / Venue) *
                    </label>
                    <input
                      type="text"
                      required
                      value={cityVenue}
                      onChange={(e) => setCityVenue(e.target.value)}
                      placeholder="દા.ત. અમદાવાદ (Ahmedabad)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-serif"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif text-[#5D4E3E] mb-1">
                    ડિજિટલ ચાંદલો માટે UPI ID (મરજિયાત - Optional)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="દા.ત. shah.patel@okhdfcbank"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/50 focus:border-[#8C2323] focus:outline-none text-[#2C211E] text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-serif font-bold text-xs uppercase tracking-wider text-white bg-[#8C2323] hover:bg-[#721B1B] transition-all cursor-pointer shadow-md disabled:opacity-50 mt-4"
                >
                  {loading ? 'કંકોત્રી બની રહી છે...' : 'લગ્ન કંકોત્રી બનાવો (Create Kankotri)'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
