import { useState } from 'react';
import { Eye, Check, Play } from 'lucide-react';
import { TemplateId } from '@/shared/types';
import { TemplateViewerModal } from '@/client/components/templates/TemplateViewerModal';
import { QuickCreateModal } from '@/client/components/templates/QuickCreateModal';

interface TemplateCardData {
  id: TemplateId;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
  paletteName: string;
}

const TEMPLATES: TemplateCardData[] = [
  {
    id: 'orchidee',
    title: 'Orchidée',
    subtitle: 'Ivory Paper & Embossed Orchid',
    description:
      'An invitation that unfolds behind an embossed orchid on ivory paper. Champagne-gold fillets and serene Didone typography create an unpretentious, refined experience.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    tag: 'Flagship Design',
    paletteName: 'Ivory · Champagne Gold · Warm Ink',
  },
  {
    id: 'elysee',
    title: 'Élysée',
    subtitle: 'Cream Arch & Antique Gold Calligraphy',
    description:
      'An embossed cream arch with handwritten script accents and subtle textured stationery stock. An homage to historic French châteaux weddings.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    tag: 'Timeless Classic',
    paletteName: 'Warm Linen · Antique Gold · Espresso',
  },
  {
    id: 'minimal',
    title: 'Sérénité',
    subtitle: 'Generous Whitespace & Editorial Restraint',
    description:
      'High-fashion minimalism inspired by modern editorial monographs. Quiet letterspacing, delicate rules, and unhurried elegance.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    tag: 'Architectural Minimal',
    paletteName: 'Onyx · Pure White · Soft Gray',
  },
  {
    id: 'sage',
    title: 'Sauge Royale',
    subtitle: 'Sage Foliage & Botanical Blind Deboss',
    description:
      'Muted sage green watercolor textures, delicate eucalyptus leaf silhouettes, and soft deckle-edge paper borders for destination celebrations.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    tag: 'Botanical Garden',
    paletteName: 'Sage Leaf · Natural Cream · Champagne',
  },
];

export function HomePage() {
  const [viewingTemplate, setViewingTemplate] = useState<TemplateCardData | null>(null);
  const [creatingTemplateId, setCreatingTemplateId] = useState<TemplateId | null>(null);

  const handleOpenPreview = (tmpl: TemplateCardData) => {
    setViewingTemplate(tmpl);
  };

  const handleSelectTemplate = (id: TemplateId) => {
    setViewingTemplate(null);
    setCreatingTemplateId(id);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2724] font-sans antialiased selection:bg-[#EFE6D8]">
      {/* Refined Stationery Header */}
      <header className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between border-b border-[#EDE5DA]">
        <div className="flex flex-col">
          <span className="font-display text-2xl sm:text-3xl tracking-wider text-[#231F1D]">
            Vivaah
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C827A] mt-0.5">
            Atelier de Papeterie Digitale
          </span>
        </div>

        <button
          onClick={() => handleOpenPreview(TEMPLATES[0])}
          className="px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase text-[#453E3A] border border-[#D5C7B5] hover:border-[#2C2724] hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3 h-3 text-[#C8A97E] fill-[#C8A97E]" />
          <span>Live Demo</span>
        </button>
      </header>

      {/* Editorial Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#8C827A] block mb-4">
          Digital Wedding Stationery
        </span>

        <h1 className="text-4xl sm:text-6xl font-display text-[#231F1D] tracking-tight leading-[1.15] mb-6">
          Unpretentious, serene, and refined digital invitations.
        </h1>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#6B635B] font-serif italic leading-relaxed mb-8">
          Crafted like fine paper stationery with embossed botanical covers, gentle acoustic melodies,
          and a tranquil flow tailored for WhatsApp sharing.
        </p>
      </section>

      {/* The Stationery Collection Gallery */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C827A] block mb-1">
            Curated Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-display text-[#231F1D]">
            Select an Invitation Suite
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group bg-white rounded-2xl border border-[#EDE5DA] shadow-[0_10px_35px_-10px_rgba(50,40,30,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_45px_-10px_rgba(50,40,30,0.1)] flex flex-col justify-between"
            >
              {/* Image Preview Window */}
              <div
                className="relative h-64 sm:h-72 overflow-hidden bg-[#FAF7F2] cursor-pointer"
                onClick={() => handleOpenPreview(tmpl)}
              >
                <img
                  src={tmpl.image}
                  alt={tmpl.title}
                  className="w-full h-full object-cover filter contrast-[1.02] transition-transform duration-700 group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[#E8DFD0] text-[10px] uppercase tracking-widest text-[#554C44] font-medium">
                  {tmpl.tag}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs opacity-95">
                  <span className="text-[11px] font-sans tracking-wide drop-shadow-sm">
                    {tmpl.paletteName}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#C8A97E] block mb-1 font-medium">
                    {tmpl.subtitle}
                  </span>
                  <h3 className="text-2xl font-display text-[#231F1D] mb-2 font-normal">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B635B] font-serif italic leading-relaxed mb-6">
                    {tmpl.description}
                  </p>
                </div>

                {/* Refined Action Buttons */}
                <div className="flex items-center gap-3 pt-5 border-t border-[#F2ECE2]">
                  <button
                    onClick={() => handleOpenPreview(tmpl)}
                    className="flex-1 py-2.5 rounded-full border border-[#D5C7B5] hover:border-[#2C2724] hover:bg-[#FAF7F2] text-xs font-medium uppercase tracking-wider text-[#453E3A] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C8A97E]" />
                    <span>View Suite</span>
                  </button>

                  <button
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className="flex-1 py-2.5 rounded-full bg-[#2C2724] hover:bg-[#453E3A] text-xs font-medium uppercase tracking-wider text-[#FAF7F2] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-[#C8A97E]" />
                    <span>Personalize</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Understated Editorial Footer */}
      <footer className="border-t border-[#EDE5DA] py-12 text-center text-xs text-[#8C827A] font-serif italic">
        <p>Vivaah Atelier • Dedicated to quiet, unpretentious elegance</p>
      </footer>

      {/* Full-Screen Interactive Preview */}
      {viewingTemplate && (
        <TemplateViewerModal
          isOpen={Boolean(viewingTemplate)}
          onClose={() => setViewingTemplate(null)}
          templateId={viewingTemplate.id}
          templateTitle={viewingTemplate.title}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {/* Simple Personalization Form */}
      {creatingTemplateId && (
        <QuickCreateModal
          isOpen={Boolean(creatingTemplateId)}
          onClose={() => setCreatingTemplateId(null)}
          selectedTemplateId={creatingTemplateId}
        />
      )}
    </div>
  );
}
