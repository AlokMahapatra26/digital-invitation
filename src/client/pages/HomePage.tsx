import { useState } from 'react';
import { Sparkles, Eye, Check, Heart, Play, QrCode, Cloud, ArrowRight } from 'lucide-react';
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
  colors: string[];
}

const TEMPLATES: TemplateCardData[] = [
  {
    id: 'royal',
    title: 'Royal Heritage',
    subtitle: 'Shubh Vivaah • Imperial Grandeur',
    description:
      'Deep crimson maroons, shimmering gold dust, intricate mandalas, and royal arch frames. Perfect for grand traditional Indian celebrations.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    tag: 'Most Popular',
    colors: ['#721c24', '#d4af37', '#2a080c'],
  },
  {
    id: 'botanical',
    title: 'Botanical Garden',
    subtitle: 'Soft Watercolor & Eucalyptus',
    description:
      'Delicate pastel foliage, soft blush blooms, and gentle romantic cursive typography. Ideal for garden, destination, and spring weddings.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    tag: 'Romantic',
    colors: ['#283618', '#606c38', '#dda15e'],
  },
  {
    id: 'minimalist',
    title: 'Modern Minimalist',
    subtitle: 'Editorial High-Fashion',
    description:
      'Striking clean serif typography, monochrome ivory and onyx aesthetic with subtle gold touches. Inspired by Vogue and luxury editorials.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    tag: 'Chic',
    colors: ['#000000', '#737373', '#e5e5e5'],
  },
  {
    id: 'celestial',
    title: 'Celestial Starlit',
    subtitle: 'Written in the Stars',
    description:
      'Deep midnight navy, glowing starlight particles, and champagne gold constellations. For magical evening receptions and starlit vows.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    tag: 'Dreamy',
    colors: ['#070b19', '#4338ca', '#ffd166'],
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-serif font-bold text-base shadow-lg shadow-amber-500/20">
            V
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-wider text-white block">
              Vivaah
            </span>
            <span className="text-[10px] text-amber-200/60 uppercase tracking-widest font-serif">
              Digital Wedding Invitations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenPreview(TEMPLATES[0])}
            className="px-4 py-2 rounded-full text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-800 hover:bg-neutral-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Sample Demo</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-10 pb-16 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-serif tracking-widest uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Select • Preview • Create Your Page Instantly</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight mb-6">
          Pick a template you love,{' '}
          <span className="gold-gradient-text block font-script italic text-5xl sm:text-7xl md:text-8xl mt-1 font-normal">
            we'll build the magic.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed">
          Click any template below to experience the animated wax seal reveal, romantic background music,
          and live RSVP flow. Like what you see? Enter your names and your page is ready in seconds!
        </p>
      </section>

      {/* 4 Interactive Templates Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group relative rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Image Preview Banner */}
              <div
                className="relative h-64 overflow-hidden cursor-pointer"
                onClick={() => handleOpenPreview(tmpl)}
              >
                <img
                  src={tmpl.image}
                  alt={tmpl.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-amber-300">
                  {tmpl.tag}
                </div>

                {/* Color Palette Dots */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                  {tmpl.colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Hover Play/Preview Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                  <div className="px-5 py-2.5 rounded-full bg-amber-400 text-neutral-950 font-semibold text-xs flex items-center gap-2 shadow-xl">
                    <Eye className="w-4 h-4" />
                    <span>View Interactive Preview</span>
                  </div>
                </div>
              </div>

              {/* Template Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-400/90 font-serif block mb-1">
                    {tmpl.subtitle}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                    {tmpl.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800/80">
                  <button
                    onClick={() => handleOpenPreview(tmpl)}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-700 hover:border-amber-400 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Preview Template</span>
                  </button>

                  <button
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-xs font-semibold text-neutral-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Select & Create</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-10 text-center text-xs text-neutral-500 font-sans">
        <p>© 2026 Vivaah • Crafted with love for memorable celebrations</p>
      </footer>

      {/* Full-Screen Interactive Template Preview Modal */}
      {viewingTemplate && (
        <TemplateViewerModal
          isOpen={Boolean(viewingTemplate)}
          onClose={() => setViewingTemplate(null)}
          templateId={viewingTemplate.id}
          templateTitle={viewingTemplate.title}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {/* Simple Details Creation Dialog */}
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
