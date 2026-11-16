import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift, MailCheck } from 'lucide-react';
import { TemplateProps } from '@/shared/types';
import { CountdownTimer } from '../common/CountdownTimer';
import { EventCard } from '../common/EventCard';
import { WishesWall } from '../common/WishesWall';
import { RSVPModal } from '../common/RSVPModal';
import { GiftRegistryModal } from '../common/GiftRegistryModal';

export function RoyalTemplate({ data, previewMode = false }: TemplateProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const { couple, events, story, gallery, theme } = data;
  const primary = theme.primaryColor || '#721c24';
  const accent = theme.accentColor || '#d4af37';

  return (
    <div
      className="min-h-screen text-stone-100 overflow-x-hidden selection:bg-amber-500/30"
      style={{
        backgroundColor: '#0c0708',
        backgroundImage: `radial-gradient(circle at 50% 0%, ${primary}35, transparent 55%), radial-gradient(circle at 50% 100%, ${primary}20, transparent 40%)`,
      }}
    >
      {/* Top Royal Mandala / Arch Ornament Header */}
      <div className="relative pt-16 pb-12 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 text-amber-300/80 mb-4"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-serif tracking-[0.25em] text-xs uppercase text-amber-200/90">
            Shubh Vivaah • Royal Union
          </span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </motion.div>

        {/* Couple Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="my-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white mb-2">
            <span className="block">{couple.bride.name}</span>
            <span
              className="font-script text-3xl sm:text-5xl md:text-6xl block my-1 italic"
              style={{ color: accent }}
            >
              weds
            </span>
            <span className="block">{couple.groom.name}</span>
          </h1>

          {data.hashtag && (
            <p className="font-sans text-xs tracking-widest text-amber-200/60 uppercase mt-3">
              {data.hashtag}
            </p>
          )}
        </motion.div>

        {/* Tagline & Welcome */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl mx-auto text-sm sm:text-base text-stone-300 font-serif italic mt-6 leading-relaxed"
        >
          "{data.tagline || 'Two lives, two hearts, joined together in friendship and united forever in love.'}"
        </motion.p>

        {/* Countdown */}
        <CountdownTimer targetDate={data.weddingDate} accentColor={accent} themeStyle="royal" />

        {/* Quick Action Floating Bar for RSVP & Shagun */}
        {!previewMode && (
          <div className="flex items-center justify-center gap-4 mt-8">
            {data.enableRsvp && (
              <button
                onClick={() => setRsvpOpen(true)}
                className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <MailCheck className="w-4 h-4" />
                <span>RSVP Now</span>
              </button>
            )}

            {data.enableGifts && (
              <button
                onClick={() => setGiftOpen(true)}
                className="px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-200 bg-neutral-900/80 border border-amber-500/40 hover:bg-neutral-800 flex items-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Send Shagun</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Meet the Couple Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-400/80 font-serif block mb-1">
            With Joyous Hearts
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            The Bride & Groom
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Bride Card */}
          <div className="relative group p-6 rounded-3xl bg-neutral-950/70 border border-amber-500/25 flex flex-col items-center text-center shadow-xl">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden mb-6 border-4 border-amber-400/40 shadow-2xl">
              <img
                src={couple.bride.photoUrl}
                alt={couple.bride.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-white mb-1">
              {couple.bride.name}
            </h3>
            {couple.bride.parents && (
              <p className="text-xs text-amber-200/70 font-serif italic mb-3">
                {couple.bride.parents}
              </p>
            )}
            {couple.bride.bio && (
              <p className="text-sm text-stone-300 font-sans leading-relaxed">
                {couple.bride.bio}
              </p>
            )}
          </div>

          {/* Groom Card */}
          <div className="relative group p-6 rounded-3xl bg-neutral-950/70 border border-amber-500/25 flex flex-col items-center text-center shadow-xl">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden mb-6 border-4 border-amber-400/40 shadow-2xl">
              <img
                src={couple.groom.photoUrl}
                alt={couple.groom.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-white mb-1">
              {couple.groom.name}
            </h3>
            {couple.groom.parents && (
              <p className="text-xs text-amber-200/70 font-serif italic mb-3">
                {couple.groom.parents}
              </p>
            )}
            {couple.groom.bio && (
              <p className="text-sm text-stone-300 font-sans leading-relaxed">
                {couple.groom.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Wedding Events Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-400/80 font-serif block mb-1">
            Celebration Schedule
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Wedding Itinerary
          </h2>
        </div>

        <div className="space-y-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} accentColor={accent} themeStyle="royal" />
          ))}
        </div>
      </section>

      {/* Love Story Timeline */}
      {story && story.length > 0 && (
        <section className="py-16 px-4 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-400/80 font-serif block mb-1">
              How It All Began
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Our Love Story
            </h2>
          </div>

          <div className="relative border-l-2 border-amber-500/30 ml-4 sm:ml-32 space-y-10 pl-6 sm:pl-8">
            {story.map((moment) => (
              <div key={moment.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-stone-900"
                  style={{ backgroundColor: accent }}
                />

                {/* Date tag positioned on left in desktop */}
                <div className="sm:absolute sm:-left-36 sm:top-1 sm:w-28 sm:text-right mb-1 sm:mb-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/90 font-serif">
                    {moment.dateOrYear}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-950/60 border border-amber-500/20">
                  <h4 className="text-lg font-serif font-bold text-white mb-2">
                    {moment.title}
                  </h4>
                  <p className="text-sm text-stone-300 leading-relaxed font-sans mb-4">
                    {moment.description}
                  </p>
                  {moment.imageUrl && (
                    <img
                      src={moment.imageUrl}
                      alt={moment.title}
                      className="w-full max-h-64 object-cover rounded-xl border border-white/10"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pre-wedding Photo Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="py-16 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-amber-400/80 font-serif block mb-1">
              Captured Moments
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Photo Gallery
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((imgUrl, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl aspect-[3/4] border border-amber-500/20 group cursor-pointer shadow-lg"
              >
                <img
                  src={imgUrl}
                  alt={`Gallery moment ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live Wishes & Blessings Wall */}
      {data.enableWishes && (
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <WishesWall slug={data.slug} accentColor={accent} themeStyle="royal" />
        </section>
      )}

      {/* Footer Blessing */}
      <footer className="py-16 text-center border-t border-amber-500/20 text-neutral-400 font-serif text-xs">
        <Heart className="w-4 h-4 text-amber-400 fill-amber-400/30 mx-auto mb-3" />
        <p className="tracking-widest uppercase text-stone-300">
          Warmly Invited by the Sharma & Mehra Families
        </p>
        <p className="text-[11px] text-neutral-500 mt-2 font-sans">
          Created with Vivaah Digital Invitations • Cloudflare Edge Platform
        </p>
      </footer>

      {/* RSVP & Gift Modals */}
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
