import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Gift, MailCheck, Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { TemplateProps } from '@/shared/types';
import { CountdownTimer } from '../common/CountdownTimer';
import { WishesWall } from '../common/WishesWall';
import { RSVPModal } from '../common/RSVPModal';
import { GiftRegistryModal } from '../common/GiftRegistryModal';

// Elegant Embossed Orchid SVG Icon
function EmbossedOrchid({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M50 22C46 28 42 38 46 45C49 50 51 50 54 45C58 38 54 28 50 22Z"
        stroke="#C8A97E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M50 48C42 45 32 46 26 53C22 58 24 62 30 63C38 64 45 56 50 48Z"
        stroke="#C8A97E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M50 48C58 45 68 46 74 53C78 58 76 62 70 63C62 64 55 56 50 48Z"
        stroke="#C8A97E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M45 54C47 62 50 72 50 82"
        stroke="#8A9A86"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="1.5 2"
      />
      <circle cx="50" cy="48" r="2.5" fill="#C8A97E" />
    </svg>
  );
}

export function OrchideeTemplate({ data, previewMode = false }: TemplateProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const { couple, events, story, gallery } = data;
  const champagne = '#C8A97E';

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2724] font-sans antialiased selection:bg-[#EFE6D8]">
      {/* Outer Stationery Frame */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-16">
        {/* The Luxury Paper Card Container */}
        <div className="bg-white border border-[#E8DFD0] rounded-2xl shadow-[0_20px_50px_-15px_rgba(50,40,30,0.06)] p-6 sm:p-14 relative overflow-hidden">
          {/* Subtle Inner Champagne Hairline Border */}
          <div className="absolute inset-2 sm:inset-3 border border-[#EFE7DC] rounded-xl pointer-events-none" />

          {/* Top Embossed Emblem */}
          <div className="flex flex-col items-center text-center pt-4 sm:pt-6 mb-8 sm:mb-10">
            <EmbossedOrchid className="w-14 h-14 sm:w-16 sm:h-16 mb-4 opacity-90" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.3em] uppercase text-[#8C827A] block">
              Together With Their Families
            </span>
          </div>

          {/* Couple Names in Didone & Garamond Typography */}
          <div className="text-center my-6 sm:my-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display tracking-wide text-[#231F1D] font-normal leading-tight">
              {couple.bride.name}
            </h1>
            <span className="font-script text-3xl sm:text-4xl text-[#C8A97E] block my-2 font-normal">
              and
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-display tracking-wide text-[#231F1D] font-normal leading-tight">
              {couple.groom.name}
            </h1>

            <p className="mt-8 text-xs sm:text-sm font-serif italic text-[#6B635B] max-w-md mx-auto leading-relaxed">
              "{data.tagline || 'Request the honour of your presence as they exchange vows and celebrate the beginning of their marriage.'}"
            </p>
          </div>

          {/* Wedding Date in Spaced Roman Caps */}
          <div className="my-10 text-center">
            <div className="inline-flex items-center gap-4">
              <span className="w-8 sm:w-12 h-px bg-[#DCD3C5]" />
              <span className="text-xs sm:text-sm tracking-[0.25em] uppercase font-sans text-[#4D453E] font-medium">
                {data.weddingDate}
              </span>
              <span className="w-8 sm:w-12 h-px bg-[#DCD3C5]" />
            </div>

            {/* Architectural Countdown Clock */}
            <div className="mt-4">
              <CountdownTimer targetDate={data.weddingDate} accentColor={champagne} themeStyle="minimalist" />
            </div>
          </div>

          {/* RSVP & Registry Action Buttons */}
          {!previewMode && (
            <div className="flex items-center justify-center gap-3 sm:gap-4 my-8 pb-4 border-b border-[#F0E8DC]">
              {data.enableRsvp && (
                <button
                  onClick={() => setRsvpOpen(true)}
                  className="px-6 py-2.5 rounded-full text-xs font-medium tracking-[0.15em] uppercase bg-[#2C2724] hover:bg-[#453E3A] text-[#FAF7F2] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <MailCheck className="w-3.5 h-3.5 text-[#C8A97E]" />
                  <span>RSVP</span>
                </button>
              )}

              {data.enableGifts && (
                <button
                  onClick={() => setGiftOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-medium tracking-[0.15em] uppercase border border-[#D5C7B5] text-[#554C44] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-[#C8A97E]" />
                  <span>Gift Registry</span>
                </button>
              )}
            </div>
          )}

          {/* Couple Introductions */}
          <section className="py-8 sm:py-10 border-b border-[#F0E8DC]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
              <div>
                <div className="w-32 h-44 sm:w-36 sm:h-48 mx-auto rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E8DFD0] mb-4 shadow-xs">
                  <img
                    src={couple.bride.photoUrl}
                    alt={couple.bride.name}
                    className="w-full h-full object-cover filter contrast-[1.03]"
                  />
                </div>
                <h3 className="font-display text-lg tracking-wider text-[#2C2724]">{couple.bride.name}</h3>
                {couple.bride.parents && (
                  <p className="text-[11px] font-serif italic text-[#7C746C] mt-1">{couple.bride.parents}</p>
                )}
                {couple.bride.bio && (
                  <p className="text-xs text-[#5D554D] mt-2 font-sans leading-relaxed px-4">{couple.bride.bio}</p>
                )}
              </div>

              <div>
                <div className="w-32 h-44 sm:w-36 sm:h-48 mx-auto rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E8DFD0] mb-4 shadow-xs">
                  <img
                    src={couple.groom.photoUrl}
                    alt={couple.groom.name}
                    className="w-full h-full object-cover filter contrast-[1.03]"
                  />
                </div>
                <h3 className="font-display text-lg tracking-wider text-[#2C2724]">{couple.groom.name}</h3>
                {couple.groom.parents && (
                  <p className="text-[11px] font-serif italic text-[#7C746C] mt-1">{couple.groom.parents}</p>
                )}
                {couple.groom.bio && (
                  <p className="text-xs text-[#5D554D] mt-2 font-sans leading-relaxed px-4">{couple.groom.bio}</p>
                )}
              </div>
            </div>
          </section>

          {/* Celebration Program (Event Schedule) */}
          <section className="py-10 sm:py-12 border-b border-[#F0E8DC]">
            <div className="text-center mb-8">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C827A] block mb-1">
                Programme
              </span>
              <h2 className="text-2xl sm:text-3xl font-display tracking-wide text-[#231F1D]">
                The Celebration
              </h2>
            </div>

            <div className="space-y-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 sm:p-6 rounded-xl border border-[#EDE5DA] bg-[#FDFCFA] transition-all hover:border-[#D5C7B5]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <h4 className="text-lg font-display text-[#2C2724] font-medium tracking-wide">
                      {evt.title}
                    </h4>
                    <span className="text-xs font-sans tracking-wider text-[#C8A97E] uppercase font-medium">
                      {evt.time}
                    </span>
                  </div>

                  {evt.description && (
                    <p className="text-xs text-[#6B635B] leading-relaxed mb-4 font-serif italic">
                      {evt.description}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5D554D] pt-3 border-t border-[#F2ECE2] gap-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A97E] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-[#2C2724] block">{evt.venueName}</span>
                        <span className="text-[11px] text-[#7E756D] block">{evt.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <a
                        href={evt.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${evt.venueName} ${evt.address}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-[#2C2724] hover:text-[#C8A97E] font-medium uppercase tracking-wider underline underline-offset-4"
                      >
                        <Navigation className="w-3 h-3 text-[#C8A97E]" />
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Photo Gallery */}
          {gallery && gallery.length > 0 && (
            <section className="py-10 sm:py-12 border-b border-[#F0E8DC]">
              <div className="text-center mb-6">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C827A] block mb-1">
                  Moments
                </span>
                <h2 className="text-2xl font-display text-[#231F1D]">Memories Together</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {gallery.map((url, i) => (
                  <div key={i} className="aspect-[4/5] rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E8DFD0]">
                    <img src={url} alt={`Moment ${i}`} className="w-full h-full object-cover filter contrast-[1.02]" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Live Guest Wishes */}
          {data.enableWishes && (
            <section className="py-10 sm:py-12">
              <WishesWall slug={data.slug} accentColor={champagne} themeStyle="minimalist" />
            </section>
          )}

          {/* Card Footer Stamp */}
          <div className="text-center pt-8 border-t border-[#F0E8DC] text-[11px] text-[#8C827A] font-serif italic">
            <p>With love from Sophia & Julian</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RSVPModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        slug={data.slug}
        events={data.events}
        accentColor={champagne}
      />

      <GiftRegistryModal
        isOpen={giftOpen}
        onClose={() => setGiftOpen(false)}
        upiId={data.upiId}
        giftNote={data.giftNote}
        accentColor={champagne}
      />
    </div>
  );
}

