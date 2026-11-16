import { useState } from 'react';
import { Heart, Gift, MailCheck, MapPin, Navigation, Sparkles } from 'lucide-react';
import { TemplateProps } from '@/shared/types';
import { GaneshaEmblem } from '../common/GaneshaEmblem';
import { CountdownTimer } from '../common/CountdownTimer';
import { WishesWall } from '../common/WishesWall';
import { RSVPModal } from '../common/RSVPModal';
import { GiftRegistryModal } from '../common/GiftRegistryModal';

export function KumkumKankotriTemplate({ data, previewMode = false }: TemplateProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const { couple, events, gallery } = data;
  const gold = '#D4AF37';

  return (
    <div
      className="min-h-screen text-[#FAF5EB] font-sans antialiased selection:bg-[#F3C68F] selection:text-[#5E0D0D]"
      style={{
        backgroundColor: '#4A0808',
        backgroundImage: 'radial-gradient(circle at 50% 15%, #7D1111 0%, #380505 85%)',
      }}
    >
      {/* Outer Traditional Gujarati Kankotri Frame */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-14">
        {/* Auspicious Kumkum Card Stock */}
        <div className="relative bg-[#5E0D0D] border-2 border-[#D4AF37]/50 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] p-6 sm:p-12 overflow-hidden">
          {/* Traditional Jari Gold Inner Border */}
          <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#D4AF37]/20 rounded-xl pointer-events-none" />

          {/* Top Auspicious Ganesha Invocation */}
          <div className="flex flex-col items-center text-center pt-2 sm:pt-4 mb-6">
            <GaneshaEmblem className="w-16 h-16 sm:w-20 sm:h-20 mb-3" color="#D4AF37" />

            <div className="text-sm sm:text-base font-serif font-bold text-[#F9E2AF] tracking-widest uppercase mb-1">
              || Shree Ganeshaya Namah ||
            </div>

            <p className="text-[11px] sm:text-xs text-[#E8C288] font-serif italic max-w-md leading-relaxed px-4">
              {data.gujaratiShlok || '|| Vakratunda Mahakaya Suryakoti Samaprabha | Nirvighnam Kuru Me Deva Sarva Karyeshu Sarvada ||'}
            </p>
          </div>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-4" />

          {/* Couple Announcement in Royal Typography */}
          <div className="text-center my-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-2 font-serif">
              Auspicious Wedding Invitation
            </span>

            <div className="my-3">
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide">
                {couple.bride.name}
              </h1>
              <span className="font-serif text-2xl sm:text-3xl text-[#E8C288] block my-1 font-normal italic">
                weds
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide">
                {couple.groom.name}
              </h1>
            </div>

            {data.hashtag && (
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-[#380505] border border-[#D4AF37]/30 text-[11px] text-[#F9E2AF] font-mono">
                {data.hashtag}
              </span>
            )}
          </div>

          {/* Heartfelt Invitation Note */}
          <div className="my-8 p-4 sm:p-5 rounded-2xl bg-[#3D0606]/80 border border-[#D4AF37]/30 text-center">
            <p className="text-xs sm:text-sm text-[#F9E8D0] font-serif leading-relaxed italic">
              "{data.welcomeMessage}"
            </p>
          </div>

          {/* Wedding Date & Countdown Clock */}
          <div className="my-8 text-center">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 sm:w-12 h-px bg-[#D4AF37]/40" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#F9E2AF] font-serif">
                Auspicious Wedding Date: {data.weddingDate}
              </span>
              <span className="w-8 sm:w-12 h-px bg-[#D4AF37]/40" />
            </div>

            <div className="mt-4">
              <CountdownTimer targetDate={data.weddingDate} accentColor={gold} themeStyle="royal" />
            </div>
          </div>

          {/* RSVP & Shagun Action Buttons */}
          {!previewMode && (
            <div className="flex items-center justify-center gap-3 my-8">
              {data.enableRsvp && (
                <button
                  onClick={() => setRsvpOpen(true)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#380505] bg-gradient-to-r from-[#F9E2AF] via-[#E8C288] to-[#D4AF37] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <MailCheck className="w-3.5 h-3.5" />
                  <span>RSVP Confirmation</span>
                </button>
              )}

              {data.enableGifts && (
                <button
                  onClick={() => setGiftOpen(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F9E2AF] bg-[#380505] border border-[#D4AF37]/40 hover:bg-[#4D0808] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Blessings & Shagun</span>
                </button>
              )}
            </div>
          )}

          {/* Bride & Groom Family Introductions */}
          <section className="py-8 border-t border-[#D4AF37]/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-[#3D0606]/60 border border-[#D4AF37]/20">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37] mb-3 shadow-md">
                  <img src={couple.bride.photoUrl} alt={couple.bride.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">{couple.bride.name}</h3>
                {couple.bride.parents && (
                  <p className="text-xs text-[#E8C288] font-serif mt-1 leading-relaxed">{couple.bride.parents}</p>
                )}
                {couple.bride.bio && (
                  <p className="text-[11px] text-[#FAF5EB]/80 font-sans mt-2">{couple.bride.bio}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#3D0606]/60 border border-[#D4AF37]/20">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-2 border-[#D4AF37] mb-3 shadow-md">
                  <img src={couple.groom.photoUrl} alt={couple.groom.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white">{couple.groom.name}</h3>
                {couple.groom.parents && (
                  <p className="text-xs text-[#E8C288] font-serif mt-1 leading-relaxed">{couple.groom.parents}</p>
                )}
                {couple.groom.bio && (
                  <p className="text-[11px] text-[#FAF5EB]/80 font-sans mt-2">{couple.groom.bio}</p>
                )}
              </div>
            </div>
          </section>

          {/* Gujarati Ceremonial Schedule in English */}
          <section className="py-8 border-t border-[#D4AF37]/30">
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] block mb-1 font-serif">
                Auspicious Itinerary
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Wedding Celebrations
              </h2>
            </div>

            <div className="space-y-4">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl bg-[#3D0606]/90 border border-[#D4AF37]/30 shadow-md transition-all hover:border-[#D4AF37]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div>
                      <h4 className="text-base sm:text-lg font-serif font-bold text-[#F9E2AF]">
                        {evt.title}
                      </h4>
                      <span className="text-[11px] text-[#D4AF37] font-sans">
                        {evt.date}
                      </span>
                    </div>
                    <span className="text-xs font-serif text-[#F9E2AF] bg-[#5E0D0D] px-3 py-1 rounded-full border border-[#D4AF37]/30 self-start sm:self-auto font-medium">
                      {evt.time}
                    </span>
                  </div>

                  {evt.description && (
                    <p className="text-xs text-[#EAD5BA] leading-relaxed mb-3 font-serif">
                      {evt.description}
                    </p>
                  )}

                  {evt.dressCode && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#E8C288] mb-3">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>Dress Code: {evt.dressCode}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-3 border-t border-[#D4AF37]/20 gap-2">
                    <div className="flex items-start gap-2 text-[#F9E8D0]">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">{evt.venueName}</span>
                        <span className="text-[11px] text-[#E8C288] block">{evt.address}</span>
                      </div>
                    </div>

                    <a
                      href={evt.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${evt.venueName} ${evt.address}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#F9E2AF] hover:underline self-end sm:self-auto font-medium"
                    >
                      <Navigation className="w-3 h-3 text-[#D4AF37]" />
                      <span>View on Map</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Photo Gallery */}
          {gallery && gallery.length > 0 && (
            <section className="py-8 border-t border-[#D4AF37]/30">
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] block mb-1 font-serif">
                  Pre-Wedding Moments
                </span>
                <h2 className="text-2xl font-serif font-bold text-white">Captured Memories</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {gallery.map((url, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-md">
                    <img src={url} alt={`Moment ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Live Wishes */}
          {data.enableWishes && (
            <section className="py-8 border-t border-[#D4AF37]/30">
              <WishesWall slug={data.slug} accentColor={gold} themeStyle="royal" />
            </section>
          )}

          {/* Footer Warm Note */}
          <div className="text-center pt-8 border-t border-[#D4AF37]/30 text-xs text-[#E8C288] font-serif">
            <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]/40 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">
              Warmly Invited by the Shah & Patel Families
            </p>
            <p className="text-[11px] text-[#D4AF37] mt-1 italic">
              "We eagerly look forward to welcoming you and celebrating together"
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
