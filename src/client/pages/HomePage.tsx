import { useState } from 'react';
import { Eye, Check, Play } from 'lucide-react';
import { TemplateId } from '@/shared/types';
import { TemplateViewerModal } from '@/client/components/templates/TemplateViewerModal';
import { QuickCreateModal } from '@/client/components/templates/QuickCreateModal';
import { GaneshaEmblem } from '@/client/components/common/GaneshaEmblem';

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
    id: 'kumkum-kankotri',
    title: 'Royal Kumkum Kankotri',
    subtitle: '|| Shree Ganeshaya Namah || • Traditional Royal Heritage',
    description:
      'Auspicious Kumkum crimson with regal Jari gold foil borders. Features Ganesha Sthapana, Pithi, Mameru, Raas-Garba, and Hastamelap ceremonies.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    tag: 'Most Popular',
    paletteName: 'Kumkum Crimson · Jari Gold · Saffron',
  },
  {
    id: 'patola-ivory',
    title: 'Patola Ivory Silk',
    subtitle: 'Contemporary Gujarati Luxury • Patola Gold Foil',
    description:
      'Creamy raw silk paper texture with intricate gold-foiled Patan Patola geometric borders. Designed for modern Gujarati families sharing on WhatsApp.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    tag: 'Modern Luxury',
    paletteName: 'Ivory Silk · Patola Gold · Auspicious Maroon',
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C211E] font-sans antialiased selection:bg-[#F3D7B5]">
      {/* Top Auspicious Header */}
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#E8D4B0]">
        <div className="flex items-center gap-3">
          <GaneshaEmblem className="w-10 h-10" color="#8C2323" />
          <div>
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-wide text-[#8C2323] block leading-tight">
              Shubh Vivah
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#7A6B56] block font-serif">
              Gujarati Digital Wedding Invitations
            </span>
          </div>
        </div>

        <button
          onClick={() => handleOpenPreview(TEMPLATES[0])}
          className="px-4 py-2 rounded-full text-xs font-serif font-semibold text-[#8C2323] border border-[#8C2323]/30 hover:bg-[#8C2323] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Play className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
          <span>Live Demo</span>
        </button>
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
          Soulful Shehnai melodies, Mandap Muhurat, Pithi, Mameru, Raas-Garba, and Hastamelap
          tailored for effortless WhatsApp sharing.
        </p>
      </section>

      {/* Exactly 2 Gujarati Templates Collection */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="text-center mb-8">
          <span className="text-[11px] font-serif uppercase tracking-widest text-[#7A6B56] block mb-1">
            Curated Collection
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2323]">
            Choose Your Invitation Design
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group bg-white rounded-3xl border-2 border-[#EAD8B7] shadow-[0_15px_40px_-10px_rgba(70,50,30,0.1)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(70,50,30,0.18)] flex flex-col justify-between"
            >
              {/* Image Preview Window */}
              <div
                className="relative h-64 sm:h-72 overflow-hidden bg-[#FAF6F0] cursor-pointer"
                onClick={() => handleOpenPreview(tmpl)}
              >
                <img
                  src={tmpl.image}
                  alt={tmpl.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-[#EAD8B7] text-xs font-serif font-bold text-[#8C2323] shadow-xs">
                  {tmpl.tag}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="text-xs font-serif font-medium drop-shadow-sm">
                    {tmpl.paletteName}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-serif font-semibold text-[#C59A44] block mb-1">
                    {tmpl.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#8C2323] mb-2">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5D4E3E] font-serif leading-relaxed mb-6">
                    {tmpl.description}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-5 border-t border-[#F0E2CC]">
                  <button
                    onClick={() => handleOpenPreview(tmpl)}
                    className="flex-1 py-2.5 rounded-full border border-[#D4AF37] hover:bg-[#FAF6F0] text-xs font-serif font-bold text-[#8C2323] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Preview Card</span>
                  </button>

                  <button
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className="flex-1 py-2.5 rounded-full bg-[#8C2323] hover:bg-[#721B1B] text-xs font-serif font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-[#F9E2AF]" />
                    <span>Select & Create</span>
                  </button>
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

      {/* Quick Create Form Modal */}
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
