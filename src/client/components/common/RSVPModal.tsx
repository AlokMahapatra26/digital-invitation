import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Heart, Users, Utensils } from 'lucide-react';
import { WeddingEvent } from '@/shared/types';
import { submitRSVP } from '@/client/lib/api';
import { useConfetti } from '@/client/hooks/useConfetti';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  events: WeddingEvent[];
  accentColor?: string;
}

export function RSVPModal({
  isOpen,
  onClose,
  slug,
  events,
}: RSVPModalProps) {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(events.map((e) => e.id));
  const [dietary, setDietary] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { shootPetals } = useConfetti();

  const handleToggleEvent = (id: string) => {
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setSubmitting(true);
    try {
      await submitRSVP(slug, {
        guestName,
        attending,
        guestCount,
        eventIds: selectedEvents,
        dietary,
        message,
      });
      setSubmitted(true);
      shootPetals();
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#E8DFD0] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(50,40,30,0.15)] my-8 text-[#2C2724]"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-[#8C827A] hover:text-[#2C2724] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-[#F4EFE6] text-[#C8A97E] border border-[#E8DFD0]">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display text-[#2C2724] mb-2">
                  Thank You, {guestName}
                </h3>
                <p className="text-[#6B635B] text-xs sm:text-sm max-w-xs mb-6 leading-relaxed">
                  {attending
                    ? 'Your reply has been joyfully received. We eagerly look forward to celebrating with you.'
                    : 'We will miss your presence dearly, and thank you warmly for letting us know.'}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider bg-[#2C2724] hover:bg-[#453E3A] text-[#FAF7F2] transition-colors cursor-pointer"
                >
                  Return to Invitation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C827A] block mb-1">
                    Répondez S'il Vous Plaît
                  </span>
                  <h3 className="text-2xl font-display text-[#2C2724]">RSVP Response</h3>
                  <p className="text-xs text-[#7C746C] font-serif italic mt-1">
                    Kindly reply at your earliest convenience
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1 font-medium">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Eleanor & Robert Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
                  />
                </div>

                {/* Attendance */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1.5 font-medium">
                    Attendance
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAttending(true)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        attending
                          ? 'bg-[#2C2724] text-[#FAF7F2] border-[#2C2724]'
                          : 'bg-[#FAF7F2] border-[#E8DFD0] text-[#6B635B]'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 text-[#C8A97E]" />
                      <span>Joyfully Accepts</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending(false)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        !attending
                          ? 'bg-[#2C2724] text-[#FAF7F2] border-[#2C2724]'
                          : 'bg-[#FAF7F2] border-[#E8DFD0] text-[#6B635B]'
                      }`}
                    >
                      <span>Regretfully Declines</span>
                    </button>
                  </div>
                </div>

                {attending && (
                  <>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C8A97E]" />
                        <span>Number of Attending Guests</span>
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1 flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-[#C8A97E]" />
                        <span>Dietary Preferences (Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder="e.g. Vegetarian, Gluten-free"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B635B] mb-1">
                    Note for the Couple (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Warm wishes or arrival details..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl font-medium text-xs uppercase tracking-wider text-[#FAF7F2] bg-[#2C2724] hover:bg-[#453E3A] transition-all cursor-pointer shadow-xs disabled:opacity-50 mt-4"
                >
                  {submitting ? 'Submitting...' : 'Confirm Reply'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
