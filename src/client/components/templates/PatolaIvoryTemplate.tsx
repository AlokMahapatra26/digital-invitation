import { useState } from 'react';
import { MailCheck, Gift, MapPin, Navigation, Sparkles, Heart } from 'lucide-react';
import { TemplateProps } from '@/shared/types';
import { GaneshaEmblem } from '../common/GaneshaEmblem';
import { CountdownTimer } from '../common/CountdownTimer';
import { WishesWall } from '../common/WishesWall';
import { RSVPModal } from '../common/RSVPModal';
import { GiftRegistryModal } from '../common/GiftRegistryModal';

export function PatolaIvoryTemplate({ data, previewMode = false }: TemplateProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const { couple, events, gallery } = data;
  const gold = '#C59A44';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C211E] font-sans antialiased selection:bg-[#F0E2CA]">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14">
        {/* Luxury Raw Silk Ivory Card */}
        <div className="relative bg-[#FFFFFF] border-2 border-[#EAD8B7] rounded-3xl shadow-[0_20px_60px_-10px_rgba(70,50,30,0.08)] p-6 sm:p-12 overflow-hidden">
          {/* Subtle Patola Geometric Gold Foil Frame */}
          <div className="absolute inset-2 sm:inset-3 border border-[#E8D4B0] rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#C59A44]/30 rounded-xl pointer-events-none" />

          {/* Top Auspicious Ganesha Emblem */}
          <div className="flex flex-col items-center text-center pt-2 sm:pt-4 mb-6">
            <GaneshaEmblem className="w-14 h-14 sm:w-16 sm:h-16 mb-3" color="#C59A44" />

            <div className="text-sm font-serif font-bold text-[#8C2323] tracking-widest uppercase">
              || Shree Ganeshaya Namah ||
            </div>

            <p className="text-[11px] sm:text-xs text-[#7A6B56] font-serif italic max-w-md mt-1 leading-relaxed">
              {data.gujaratiShlok || '|| Vakratunda Mahakaya Suryakoti Samaprabha | Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada ||'}
            </p>
          </div>

          <div className="w-20 h-px bg-[#E2CCA5] mx-auto my-4" />

          {/* Couple Announcement in English */}
          <div className="text-center my-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C59A44] font-semibold block mb-2 font-serif">
              Wedding Invitation
            </span>

            <div className="my-3">
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#8C2323] tracking-wide">
                {couple.bride.name}
              </h1>
              <span className="font-serif text-2xl sm:text-3xl text-[#C59A44] block my-1 font-normal italic">
                weds
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#8C2323] tracking-wide">
                {couple.groom.name}
              </h1>
            </div>

            {data.hashtag && (
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#FAF5EB] border border-[#C59A44]/30 text-[11px] text-[#8C2323] font-mono">
                {data.hashtag}
              </span>
            )}
          </div>

          {/* Invitation Message */}
          <div className="my-8 p-4 sm:p-5 rounded-2xl bg-[#FCFAF5] border border-[#EFE2CC] text-center">
            <p className="text-xs sm:text-sm text-[#4E3F30] font-serif leading-relaxed italic">
              "{data.welcomeMessage}"
            </p>
          </div>

          {/* Date & Countdown */}
          <div className="my-8 text-center">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 sm:w-12 h-px bg-[#E2CCA5]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#8C2323] font-serif">
                Wedding Date: {data.weddingDate}
              </span>
              <span className="w-8 sm:w-12 h-px bg-[#E2CCA5]" />
            </div>

            <div className="mt-4">
              <CountdownTimer targetDate={data.weddingDate} accentColor={gold} themeStyle="minimalist" />
            </div>
          </div>

          {/* Action Buttons */}
          {!previewMode && (
            <div className="flex items-center justify-center gap-3 my-8">
              {data.enableRsvp && (
                <button
                  onClick={() => setRsvpOpen(true)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#8C2323] hover:bg-[#721B1B] shadow-md shadow-[#8C2323]/20 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <MailCheck className="w-3.5 h-3.5 text-[#EFE2CC]" />
                  <span>RSVP</span>
                </button>
              )}

              {data.enableGifts && (
                <button
                  onClick={() => setGiftOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#8C2323] border border-[#8C2323]/40 bg-[#FFFDF9] hover:bg-[#F9F4EB] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Gift className="w-3.5 h-3.5 text-[#C59A44]" />
                  <span>Blessings / Shagun</span>
                </button>
              )}
            </div>
          )}

          {/* Family Profiles */}
          <section className="py-8 border-t border-[#EFE2CC]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-[#FCFAF5] border border-[#EFE2CC]">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-2 border-[#C59A44] mb-3 shadow-sm">
                  <img src={couple.bride.photoUrl} alt={couple.bride.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#8C2323]">{couple.bride.name}</h3>
                {couple.bride.parents && (
                  <p className="text-xs text-[#6B5A47] font-serif mt-1 leading-relaxed">{couple.bride.parents}</p>
                )}
                {couple.bride.bio && (
                  <p className="text-[11px] text-[#6B5A47] font-sans mt-2">{couple.bride.bio}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#FCFAF5] border border-[#EFE2CC]">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-2 border-[#C59A44] mb-3 shadow-sm">
                  <img src={couple.groom.photoUrl} alt={couple.groom.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#8C2323]">{couple.groom.name}</h3>
                {couple.groom.parents && (
                  <p className="text-xs text-[#6B5A47] font-serif mt-1 leading-relaxed">{couple.groom.parents}</p>
                )}
                {couple.groom.bio && (
                  <p className="text-[11px] text-[#6B5A47] font-sans mt-2">{couple.groom.bio}</p>
                )}
              </div>
            </div>
          </section>

          {/* Events Itinerary */}
          <section className="py-8 border-t border-[#EFE2CC]">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C59A44] block mb-1 font-serif">
                Ceremonial Schedule
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2323]">
                Wedding Itinerary
              </h2>
            </div>

            <div className="space-y-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl bg-[#FCFAF5] border border-[#EFE2CC] shadow-xs transition-all hover:border-[#C59A44]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div>
                      <h4 className="text-base sm:text-lg font-serif font-bold text-[#8C2323]">
                        {evt.title}
                      </h4>
                      <span className="text-[11px] text-[#7A6B56] font-sans">
                        {evt.date}
                      </span>
                    </div>
                    <span className="text-xs font-serif text-[#8C2323] bg-[#F7EFE1] px-3 py-1 rounded-full border border-[#E2CCA5] self-start sm:self-auto font-medium">
                      {evt.time}
                    </span>
                  </div>

                  {evt.description && (
                    <p className="text-xs text-[#5D4E3E] leading-relaxed mb-3 font-serif">
                      {evt.description}
                    </p>
                  )}

                  {evt.dressCode && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7A6B56] mb-3">
                      <Sparkles className="w-3 h-3 text-[#C59A44]" />
                      <span>Dress Code: {evt.dressCode}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-3 border-t border-[#EFE2CC] gap-2">
                    <div className="flex items-start gap-2 text-[#4E3F30]">
                      <MapPin className="w-3.5 h-3.5 text-[#8C2323] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">{evt.venueName}</span>
                        <span className="text-[11px] text-[#7A6B56] block">{evt.address}</span>
                      </div>
                    </div>

                    <a
                      href={evt.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${evt.venueName} ${evt.address}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#8C2323] hover:underline self-end sm:self-auto font-medium"
                    >
                      <Navigation className="w-3 h-3 text-[#C59A44]" />
                      <span>View on Map</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery */}
          {gallery && gallery.length > 0 && (
            <section className="py-8 border-t border-[#EFE2CC]">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-[#C59A44] block mb-1 font-serif">
                  Moments
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#8C2323]">Captured Memories</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {gallery.map((url, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden border border-[#EFE2CC] shadow-xs">
                    <img src={url} alt={`Moment ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Wishes */}
          {data.enableWishes && (
            <section className="py-8 border-t border-[#EFE2CC]">
              <WishesWall slug={data.slug} accentColor={gold} themeStyle="minimalist" />
            </section>
          )}

          {/* Footer Card */}
          <div className="text-center pt-8 border-t border-[#EFE2CC] text-xs text-[#7A6B56] font-serif">
            <Heart className="w-4 h-4 text-[#8C2323] fill-[#8C2323]/30 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#8C2323]">
              With Warm Blessings from the Shah & Patel Families
            </p>
            <p className="text-[11px] text-[#C59A44] mt-1 italic">
              "We look forward to celebrating together"
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RSVPModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        slug={data.slug}
        events={data.events}
        accentColor={gold}
      />

      <GiftRegistryModal
        isOpen={giftOpen}
        onClose={() => setGiftOpen(false)}
        upiId={data.upiId}
        giftNote={data.giftNote}
        accentColor={gold}
      />
    </div>
  );
}
