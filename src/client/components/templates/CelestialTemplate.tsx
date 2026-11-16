import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, MailCheck, Moon } from 'lucide-react';
import { TemplateProps } from '@/shared/types';
import { CountdownTimer } from '../common/CountdownTimer';
import { EventCard } from '../common/EventCard';
import { WishesWall } from '../common/WishesWall';
import { RSVPModal } from '../common/RSVPModal';
import { GiftRegistryModal } from '../common/GiftRegistryModal';

export function CelestialTemplate({ data, previewMode = false }: TemplateProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const { couple, events, story, gallery } = data;
  const accent = '#ffd166';

  return (
    <div
      className="min-h-screen text-slate-100 selection:bg-indigo-500/30"
      style={{
        backgroundColor: '#070b19',
        backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(99, 102, 241, 0.25), transparent 60%), radial-gradient(circle at 80% 80%, rgba(217, 119, 6, 0.15), transparent 50%)',
      }}
    >
      {/* Hero Header */}
      <div className="pt-20 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-indigo-300 text-xs font-serif tracking-[0.25em] uppercase mb-4"
        >
          <Moon className="w-3.5 h-3.5 text-amber-300" />
          <span>Written in the Stars</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </motion.div>

        <h1 className="text-4xl sm:text-7xl font-serif text-white tracking-tight my-4">
          <span className="block">{couple.bride.name}</span>
          <span className="font-script text-4xl sm:text-6xl text-amber-300 block my-2 italic">
            &
          </span>
          <span className="block">{couple.groom.name}</span>
        </h1>

        <p className="max-w-md mx-auto text-sm sm:text-base text-slate-300 font-serif italic mt-3">
          "{data.tagline || 'Under a sky full of stars, two souls find their forever.'}"
        </p>

        <CountdownTimer targetDate={data.weddingDate} accentColor={accent} themeStyle="royal" />

        {!previewMode && (
          <div className="flex items-center justify-center gap-4 mt-8">
            {data.enableRsvp && (
              <button
                onClick={() => setRsvpOpen(true)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <MailCheck className="w-4 h-4" />
                <span>RSVP</span>
              </button>
            )}

            {data.enableGifts && (
              <button
                onClick={() => setGiftOpen(true)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-200 bg-indigo-950/60 border border-indigo-500/30 hover:bg-indigo-900/60 flex items-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-300" />
                <span>Send Blessings</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Couple Profiles */}
      <section className="py-14 px-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/30 flex flex-col items-center text-center shadow-xl">
            <img src={couple.bride.photoUrl} alt={couple.bride.name} className="w-44 h-44 rounded-full object-cover mb-4 border-2 border-indigo-400/50 shadow-lg" />
            <h3 className="text-2xl font-serif text-white">{couple.bride.name}</h3>
            {couple.bride.parents && <p className="text-xs text-indigo-300/80 italic mb-2">{couple.bride.parents}</p>}
            {couple.bride.bio && <p className="text-sm text-slate-300">{couple.bride.bio}</p>}
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-indigo-500/30 flex flex-col items-center text-center shadow-xl">
            <img src={couple.groom.photoUrl} alt={couple.groom.name} className="w-44 h-44 rounded-full object-cover mb-4 border-2 border-indigo-400/50 shadow-lg" />
            <h3 className="text-2xl font-serif text-white">{couple.groom.name}</h3>
            {couple.groom.parents && <p className="text-xs text-indigo-300/80 italic mb-2">{couple.groom.parents}</p>}
            {couple.groom.bio && <p className="text-sm text-slate-300">{couple.groom.bio}</p>}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-14 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif text-center text-white mb-10">Celebration Schedule</h2>
        <div className="space-y-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} accentColor={accent} themeStyle="royal" />
          ))}
        </div>
      </section>

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="py-14 px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((url, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg">
                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Wishes Wall */}
      {data.enableWishes && (
        <section className="py-14 px-6 max-w-4xl mx-auto">
          <WishesWall slug={data.slug} accentColor={accent} themeStyle="royal" />
        </section>
      )}

      {/* Modals */}
      <RSVPModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        slug={data.slug}
        events={data.events}
        accentColor={accent}
      />

      <GiftRegistryModal
        isOpen={giftOpen}
        onClose={() => setGiftOpen(false)}
        upiId={data.upiId}
        giftNote={data.giftNote}
        accentColor={accent}
      />
    </div>
  );
}

