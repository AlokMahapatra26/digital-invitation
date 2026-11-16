import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Gift, MailCheck } from 'lucide-react';
import { TemplateProps } from '@/shared/types';
import { CountdownTimer } from '../common/CountdownTimer';
import { EventCard } from '../common/EventCard';
import { WishesWall } from '../common/WishesWall';
import { RSVPModal } from '../common/RSVPModal';
import { GiftRegistryModal } from '../common/GiftRegistryModal';

export function MinimalistTemplate({ data, previewMode = false }: TemplateProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const { couple, events, story, gallery } = data;
  const accent = '#d4af37';

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 selection:bg-neutral-800">
      {/* Editorial High-Fashion Hero */}
      <div className="pt-20 pb-16 px-6 text-center max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-6 font-sans"
        >
          Request the honour of your presence
        </motion.p>

        <h1 className="text-4xl sm:text-7xl font-serif font-light text-white tracking-tight uppercase leading-none">
          {couple.bride.name}
          <span className="block text-2xl sm:text-4xl text-neutral-500 font-sans tracking-widest my-3 font-thin">
            &
          </span>
          {couple.groom.name}
        </h1>

        <div className="w-12 h-px bg-neutral-700 mx-auto my-6" />

        <p className="text-sm font-sans tracking-widest uppercase text-neutral-400">
          {data.weddingDate}
        </p>

        <CountdownTimer targetDate={data.weddingDate} accentColor={accent} themeStyle="minimalist" />

        {!previewMode && (
          <div className="flex items-center justify-center gap-4 mt-8">
            {data.enableRsvp && (
              <button
                onClick={() => setRsvpOpen(true)}
                className="px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MailCheck className="w-4 h-4" />
                <span>RSVP</span>
              </button>
            )}

            {data.enableGifts && (
              <button
                onClick={() => setGiftOpen(true)}
                className="px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider text-neutral-300 border border-neutral-700 hover:border-neutral-500 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>Registry / Shagun</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Couple Profiles */}
      <section className="py-14 px-6 max-w-4xl mx-auto border-t border-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-64 rounded-xl overflow-hidden bg-neutral-900 mb-4">
              <img src={couple.bride.photoUrl} alt={couple.bride.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <h3 className="text-xl font-serif text-white uppercase tracking-wider">{couple.bride.name}</h3>
            {couple.bride.parents && <p className="text-xs text-neutral-500 mt-1">{couple.bride.parents}</p>}
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-64 rounded-xl overflow-hidden bg-neutral-900 mb-4">
              <img src={couple.groom.photoUrl} alt={couple.groom.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
            <h3 className="text-xl font-serif text-white uppercase tracking-wider">{couple.groom.name}</h3>
            {couple.groom.parents && <p className="text-xs text-neutral-500 mt-1">{couple.groom.parents}</p>}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-14 px-6 max-w-3xl mx-auto border-t border-neutral-900">
        <h2 className="text-xs font-sans tracking-[0.3em] uppercase text-neutral-500 text-center mb-8">
          Itinerary
        </h2>
        <div className="space-y-4">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} accentColor="#ffffff" themeStyle="minimalist" />
          ))}
        </div>
      </section>

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="py-14 px-6 max-w-5xl mx-auto border-t border-neutral-900">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((url, i) => (
              <div key={i} className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900">
                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Wishes Wall */}
      {data.enableWishes && (
        <section className="py-14 px-6 max-w-3xl mx-auto border-t border-neutral-900">
          <WishesWall slug={data.slug} accentColor="#ffffff" themeStyle="minimalist" />
        </section>
      )}

      {/* Modals */}
      <RSVPModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        slug={data.slug}
        events={data.events}
        accentColor="#ffffff"
      />

      <GiftRegistryModal
        isOpen={giftOpen}
        onClose={() => setGiftOpen(false)}
        upiId={data.upiId}
        giftNote={data.giftNote}
        accentColor="#ffffff"
      />
    </div>
  );
}

