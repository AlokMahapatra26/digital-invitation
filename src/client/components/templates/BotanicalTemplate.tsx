import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flower2, Heart, Gift, MailCheck } from 'lucide-react';
import { TemplateProps } from '@/shared/types';
import { CountdownTimer } from '../common/CountdownTimer';
import { EventCard } from '../common/EventCard';
import { WishesWall } from '../common/WishesWall';
import { RSVPModal } from '../common/RSVPModal';
import { GiftRegistryModal } from '../common/GiftRegistryModal';

export function BotanicalTemplate({ data, previewMode = false }: TemplateProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const { couple, events, story, gallery, theme } = data;
  const accent = theme.accentColor || '#606c38';

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 overflow-x-hidden selection:bg-emerald-500/20">
      {/* Hero Header with Floral Garden Aura */}
      <div className="relative pt-16 pb-12 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-emerald-300/80 mb-3"
        >
          <Flower2 className="w-4 h-4 text-emerald-400" />
          <span className="font-sans tracking-[0.2em] text-xs uppercase text-emerald-200/80">
            Together with our families
          </span>
          <Flower2 className="w-4 h-4 text-emerald-400" />
        </motion.div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight my-4">
          <span className="block">{couple.bride.name}</span>
          <span className="font-script text-4xl sm:text-5xl md:text-6xl text-emerald-300 block my-2 italic">
            &
          </span>
          <span className="block">{couple.groom.name}</span>
        </h1>

        <p className="max-w-lg mx-auto text-stone-300 font-serif italic text-sm sm:text-base mt-4">
          "{data.tagline || 'A journey of love, blooming each day into something forever.'}"
        </p>

        {/* Countdown */}
        <CountdownTimer targetDate={data.weddingDate} accentColor="#6ee7b7" themeStyle="botanical" />

        {!previewMode && (
          <div className="flex items-center justify-center gap-4 mt-8">
            {data.enableRsvp && (
              <button
                onClick={() => setRsvpOpen(true)}
                className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-950 bg-emerald-300 hover:bg-emerald-200 shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <MailCheck className="w-4 h-4" />
                <span>RSVP Now</span>
              </button>
            )}

            {data.enableGifts && (
              <button
                onClick={() => setGiftOpen(true)}
                className="px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-200 bg-stone-900 border border-emerald-500/30 hover:bg-stone-800 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Blessings & Shagun</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Couple Profiles */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-stone-900/60 border border-emerald-500/20 flex flex-col items-center text-center">
            <img
              src={couple.bride.photoUrl}
              alt={couple.bride.name}
              className="w-44 h-44 rounded-full object-cover mb-4 border-2 border-emerald-400/40"
            />
            <h3 className="text-2xl font-serif text-white">{couple.bride.name}</h3>
            {couple.bride.parents && (
              <p className="text-xs text-stone-400 italic mb-2">{couple.bride.parents}</p>
            )}
            {couple.bride.bio && <p className="text-sm text-stone-300">{couple.bride.bio}</p>}
          </div>

          <div className="p-6 rounded-3xl bg-stone-900/60 border border-emerald-500/20 flex flex-col items-center text-center">
            <img
              src={couple.groom.photoUrl}
              alt={couple.groom.name}
              className="w-44 h-44 rounded-full object-cover mb-4 border-2 border-emerald-400/40"
            />
            <h3 className="text-2xl font-serif text-white">{couple.groom.name}</h3>
            {couple.groom.parents && (
              <p className="text-xs text-stone-400 italic mb-2">{couple.groom.parents}</p>
            )}
            {couple.groom.bio && <p className="text-sm text-stone-300">{couple.groom.bio}</p>}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-14 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif text-center text-white mb-10">Events & Celebrations</h2>
        <div className="space-y-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} accentColor="#6ee7b7" themeStyle="botanical" />
          ))}
        </div>
      </section>

      {/* Story */}
      {story && story.length > 0 && (
        <section className="py-14 px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-center text-white mb-10">Our Story</h2>
          <div className="space-y-8">
            {story.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-stone-900/50 border border-emerald-500/20"
              >
                <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block mb-1">
                  {item.dateOrYear}
                </span>
                <h4 className="text-xl font-serif text-white mb-2">{item.title}</h4>
                <p className="text-sm text-stone-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="py-14 px-4 max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif text-center text-white mb-10">Moments</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gallery.map((url, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Wishes */}
      {data.enableWishes && (
        <section className="py-14 px-4 max-w-4xl mx-auto">
          <WishesWall slug={data.slug} accentColor="#6ee7b7" themeStyle="botanical" />
        </section>
      )}

      {/* Modals */}
      <RSVPModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        slug={data.slug}
        events={data.events}
        accentColor="#6ee7b7"
      />

      <GiftRegistryModal
        isOpen={giftOpen}
        onClose={() => setGiftOpen(false)}
        upiId={data.upiId}
        giftNote={data.giftNote}
        accentColor="#6ee7b7"
      />
    </div>
  );
}

