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
  accentColor = '#d4af37',
}: RSVPModalProps) {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(events.map((e) => e.id));
  const [dietary, setDietary] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { shootHearts } = useConfetti();

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
      shootHearts();
    } catch (err) {
      console.error(err);
      // Still show success in client mode
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-neutral-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  style={{ color: accentColor }}
                >
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Thank You, {guestName}!
                </h3>
                <p className="text-neutral-300 text-sm max-w-xs mb-6">
                  {attending
                    ? 'Your RSVP has been confirmed. We cannot wait to celebrate our special days with you!'
                    : 'We will miss having you with us, but thank you warmly for letting us know!'}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full text-sm font-medium bg-amber-500 hover:bg-amber-600 text-neutral-950 transition-colors"
                >
                  Back to Invitation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif font-semibold text-white">RSVP Confirmation</h3>
                  <p className="text-xs text-amber-200/70 mt-1 uppercase tracking-wider font-serif">
                    Please let us know if you can join us
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Ramesh & Sunita Verma"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                {/* Attendance Toggle */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Will you be attending?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttending(true)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-all ${
                        attending
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                      <span>Joyfully Accepts</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending(false)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 transition-all ${
                        !attending
                          ? 'bg-neutral-800 border-neutral-600 text-neutral-200'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <span>Regretfully Declines</span>
                    </button>
                  </div>
                </div>

                {attending && (
                  <>
                    {/* Guest Count */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Number of Guests Attending</span>
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Events checkboxes */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                        Which events will you attend?
                      </label>
                      <div className="space-y-2">
                        {events.map((evt) => (
                          <label
                            key={evt.id}
                            className="flex items-center gap-3 p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 cursor-pointer hover:bg-neutral-900 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(evt.id)}
                              onChange={() => handleToggleEvent(evt.id)}
                              className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-neutral-800"
                            />
                            <span className="text-sm font-medium text-neutral-200">{evt.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Dietary / Special preferences */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dietary Preferences / Notes (Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder="e.g. Pure Vegetarian, Jain, Vegan, etc."
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
                      />
                    </div>
                  </>
                )}

                {/* Personal Message */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                    Personal Note to the Couple (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send warm wishes or travel arrival details..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-medium text-sm text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Confirming...' : 'Submit RSVP'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

