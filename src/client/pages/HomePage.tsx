import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Check, LogIn, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { TemplateId } from '@/shared/types';
import { TemplateViewerModal } from '@/client/components/templates/TemplateViewerModal';
import { GaneshaEmblem } from '@/client/components/common/GaneshaEmblem';
import { useAuth } from '@/client/context/AuthContext';

interface TemplateCardData {
  id: TemplateId;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
  colors: [string, string];
  features: string[];
  price?: string;
  validity?: string;
}

const TEMPLATES: TemplateCardData[] = [
  {
    id: 'rajwadi-kankotri',
    title: 'Rajwadi Kankotri',
    subtitle: 'Royal Mandap & Peacocks • Mangal Phera Symphony • Godhuli Vela Muhurat',
    description:
      'Authentic royal Gujarati Kankotri framed with auspicious Mandap peacocks, Mangal Phera soundtrack, sacred Toran, Godhuli Vela countdown, 7-event vidhi, and persistent bottom action bar.',
    image: '/templates/rajwadi-kankotri/preview.jpg',
    tag: 'GUJARATI RAJWADI',
    colors: ['#D4AF37', '#7E121D'],
    features: ['Royal Mandap Arch', 'Mangal Phera Symphony', 'Godhuli Vela Muhurat', 'Persistent Bottom Action Bar'],
    price: '₹999',
    validity: 'one-time · 3 months live',
  },
  {
    id: 'amber',
    title: 'Rajasthani Royal',
    subtitle: 'Grand Padharo Sa • Jharokha Parallax • Royal Festivities',
    description:
      'Grand Padharo Sa Rajasthani palace wedding theme with 3D jharokha parallax, floating peacocks, marigold garlands, and royal festivities.',
    image: '/templates/amber/opening-poster-v3.webp',
    tag: 'RAJPUTANA GRANDEUR',
    colors: ['#D4AF37', '#800E13'],
    features: ['3D Jharokha Parallax', 'Theme Switcher', 'Floating Peacocks', '5-Day Programme'],
    price: '₹999',
    validity: 'one-time · 3 months live',
  },
  {
    id: 'opal-romance',
    title: 'Opal Romance',
    subtitle: 'Blush Palace Garden • Rose-Covered Gates • Candlelit Pavilion',
    description:
      'Blush-pink garden wedding invitation that opens through rose-covered palace gates into a candlelit pavilion with royal ceremonies in red arched cards.',
    image: '/templates/opal-romance/preview.webp',
    tag: 'PALACE GARDEN',
    colors: ['#C9A24A', '#8E1D2C'],
    features: ['3D Gate Reveal', 'Baroque Frames', 'Red Arched Cards', 'Blossom Tree Finale'],
    price: '₹999',
    validity: 'one-time · 3 months live',
  },
  {
    id: 'ever-after-bloom',
    title: 'Ever After Bloom',
    subtitle: 'Wax Seal Envelope • Watercolor Storybook • Amrit Mahal Palace',
    description:
      'Hand-painted watercolor animation, gold wax seal opening video, floating wish lanterns, couple portraits, countdown, and love story chapters.',
    image: '/templates/ever-after-bloom/invite-seal.png',
    tag: 'STORYBOOK ROMANCE',
    colors: ['#E8A0AE', '#B8860B'],
    features: ['Wax Seal Video', 'Floating Lanterns', 'Storybook Chapters', 'Route Maps'],
    price: '₹999',
    validity: 'one-time · 3 months live',
  },
  {
    id: 'mountain',
    title: 'Mountain Bliss',
    subtitle: 'Indian Destination Wedding • Misty Pines • Savoy Mussoorie',
    description:
      'Serene mountain landscape artwork, Ganesh invocation, multi-event timeline, venue route maps, weather & staff essentials, countdown, and RSVP.',
    image: '/templates/mountain/hero_mountain.png',
    tag: 'DESTINATION LUXURY',
    colors: ['#3A5A40', '#BC6C25'],
    features: ['Himalayan Art', 'Ganesh Invocation', 'Route Weather & Maps', 'Instant RSVP'],
    price: '₹999',
    validity: 'one-time · 3 months live',
  },
  {
    id: 'the-sacred-garden',
    title: 'The Sacred Garden',
    subtitle: 'Interactive Wax Seal Envelope • Swans Video • Einaudi Soundtrack',
    description:
      'Stationery luxury with interactive tap-to-open envelope, flap video transition, serene looping swans banner, countdown clock, and RSVP.',
    image: '/templates/the-sacred-garden/swans_poster.jpg',
    tag: 'SIGNATURE EXPERIENCE',
    colors: ['#5B7065', '#D4AF37'],
    features: ['Interactive Wax Seal', 'Swans & Lotus Video', 'Einaudi Soundtrack', 'Wishes Wall'],
    price: '₹999',
    validity: 'one-time · 3 months live',
  },
  {
    id: 'royal-grace',
    title: 'Royal Grace',
    subtitle: 'Video Intro • Interactive Scratch Foil Card • Olive Linen Luxury',
    description:
      'Cinematic video intro, interactive canvas scratch-to-reveal Save The Date card, program itinerary, dress code, and instant WhatsApp RSVP.',
    image: '/templates/royal-grace/intro_poster.jpg',
    tag: 'VIRAL INTERACTIVE',
    colors: ['#6B705C', '#C68B59'],
    features: ['Video Intro Reveal', 'Scratch Foil Card', 'Olive Linen Luxury', 'Interactive RSVP'],
    price: '₹999',
    validity: 'one-time · 3 months live',
  },
];

export function HomePage() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [viewingTemplate, setViewingTemplate] = useState<TemplateCardData | null>(null);

  const handleOpenPreview = (tmpl: TemplateCardData) => {
    setViewingTemplate(tmpl);
  };

  const handleSelectTemplate = (id: TemplateId) => {
    setViewingTemplate(null);
    navigate(`/create?template=${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C211E] font-sans antialiased selection:bg-[#F3D7B5]">
      {/* Top Auspicious Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#E8D4B0]">
        <div className="flex items-center gap-3">
          <GaneshaEmblem className="w-10 h-10" color="#8C2323" />
          <div>
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-wide text-[#8C2323] block leading-tight">
              Shubh Vivah
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#7A6B56] block font-serif">
              Royal & Destination Digital Wedding Invitations
            </span>
          </div>
        </div>

        {/* Auth / Dashboard Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-full bg-[#8C2323] hover:bg-[#681818] text-white text-xs font-serif font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>My Invitations</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-full text-xs font-serif font-semibold text-[#8C2323] border border-[#8C2323]/30 hover:bg-[#8C2323] hover:text-white transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-6 pt-12 pb-14 text-center">
        <span className="text-xs font-serif font-semibold text-[#8C2323] uppercase tracking-widest block mb-3">
          || Shree Ganeshaya Namah ||
        </span>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#8C2323] tracking-tight leading-tight mb-4">
          Auspicious Digital Invitations for Your Wedding Celebration.
        </h1>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#5D4E3E] font-serif leading-relaxed mb-6">
          Soulful Shehnai melodies, traditional auspicious ceremonies, and heartfelt celebrations
          tailored for effortless WhatsApp sharing.
        </p>
      </section>

      {/* Featured Templates Collection */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <span className="text-[11px] font-serif uppercase tracking-[0.25em] text-[#7A6B56] block mb-1 font-semibold">
            Curated Collection
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#8C2323]">
            Choose Your Invitation Design
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group bg-white rounded-[1.75rem] border border-[#EFE4DC] shadow-[0_12px_36px_-10px_rgba(50,25,15,0.08)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(50,25,15,0.16)] flex flex-col justify-between"
            >
              {/* Top Smartphone Mockup Area */}
              <div className="relative pt-8 pb-5 px-6 bg-[#F8ECE8] flex items-center justify-center overflow-hidden">
                {/* Top-Left Category Tag */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3.5 py-1 rounded-full bg-[#C29452] text-[#1E140F] text-[10px] font-serif font-bold uppercase tracking-[0.16em] shadow-xs">
                    {tmpl.tag}
                  </span>
                </div>

                {/* Smartphone Device Frame */}
                <div
                  className="relative w-[210px] sm:w-[220px] rounded-[2.3rem] p-[7px] bg-gradient-to-b from-[#2E2825] via-[#1A1614] to-[#120F0E] shadow-[0_20px_45px_-10px_rgba(40,15,10,0.35)] transition-transform duration-500 group-hover:-translate-y-1.5 cursor-pointer"
                  onClick={() => handleOpenPreview(tmpl)}
                >
                  {/* Screen Bezel & Dynamic Island */}
                  <div className="relative rounded-[2rem] overflow-hidden bg-[#FAF6F0] aspect-[9/18.5]">
                    {/* Top Dynamic Island / Speaker Pill */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-[#120F0E] rounded-full z-20 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#201B18] -mr-6" />
                    </div>

                    {/* Screen Preview Image */}
                    <img
                      src={tmpl.image}
                      alt={tmpl.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Subtle Screen Glass Sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
                  </div>
                </div>

                {/* Floating "Preview" Pill on Bottom-Right */}
                <button
                  onClick={() => handleOpenPreview(tmpl)}
                  className="absolute bottom-4 right-4 z-20 rounded-full bg-white/95 backdrop-blur-xs px-3.5 py-1.5 border border-[#EBE0D8] shadow-md flex items-center gap-1.5 text-xs font-serif font-medium text-[#2C1F1B] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#2C1F1B]" />
                  <span>Preview</span>
                </button>
              </div>

              {/* Card Body Details */}
              <div className="p-6 bg-white flex flex-col justify-between flex-1">
                <div>
                  {/* Title & Color Dots Row */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-serif font-bold text-[#201515] tracking-tight">
                      {tmpl.title}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {tmpl.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full shadow-xs border border-black/10"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description (2 lines clamp) */}
                  <p className="mt-2 text-xs text-[#736460] font-serif leading-relaxed line-clamp-2">
                    {tmpl.description}
                  </p>

                  {/* Feature Badges Grid (4 badges with checkmark) */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {tmpl.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAF4EF] border border-[#ECDCD3] rounded-lg px-2.5 py-1.5 text-[11px] text-[#6E5850] font-serif font-medium flex items-center gap-1.5"
                      >
                        <span className="text-[#A62B55] text-xs font-bold">✓</span>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Price & Action Buttons */}
                <div className="pt-5 mt-4 border-t border-[#F2E7E0]">
                  {/* Price & Validity */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-serif font-bold text-[#1F1614]">
                      {tmpl.price || '₹999'}
                    </span>
                    <span className="text-xs text-[#8C7B75] font-serif">
                      {tmpl.validity || 'one-time · 3 months live'}
                    </span>
                  </div>

                  {/* Two CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleOpenPreview(tmpl)}
                      className="w-full py-2.5 rounded-full border border-[#D8C7BD] bg-white hover:bg-[#FAF5F0] text-xs sm:text-sm font-serif font-medium text-[#241715] transition-all flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      Live demo
                    </button>

                    <button
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className="w-full py-2.5 rounded-full bg-[#A62B55] hover:bg-[#8F2247] text-xs sm:text-sm font-serif font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Use theme</span>
                      <span className="text-base leading-none">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8D4B0] py-8 text-center text-xs text-[#7A6B56] font-serif">
        <p>Shubh Vivah • Crafted with love and auspicious blessings</p>
      </footer>

      {/* Live Preview Modal */}
      {viewingTemplate && (
        <TemplateViewerModal
          isOpen={Boolean(viewingTemplate)}
          onClose={() => setViewingTemplate(null)}
          templateId={viewingTemplate.id}
          templateTitle={viewingTemplate.title}
          onSelectTemplate={handleSelectTemplate}
        />
      )}
    </div>
  );
}
