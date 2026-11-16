import { useState } from 'react';
import { WeddingInvitation } from '@/shared/types';
import { SAMPLE_INVITATION } from '@/shared/defaults';
import { saveInvitation } from '@/client/lib/api';
import { BuilderForm } from '@/client/components/builder/BuilderForm';
import { TemplateRenderer } from '@/client/components/templates/TemplateRenderer';
import { Smartphone, Monitor, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';

export function BuilderPage() {
  const [data, setData] = useState<WeddingInvitation>(SAMPLE_INVITATION);
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'story' | 'theme' | 'publish'>('couple');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveInvitation(data);
      setSaveSuccess(true);
      setActiveTab('publish');
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Top Studio Navbar */}
      <header className="h-14 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-serif font-bold text-sm shadow-md">
              V
            </span>
            <span className="font-serif font-bold text-lg text-white tracking-wide">
              Vivaah Studio
            </span>
          </a>
        </div>

        {/* Device Switcher & Action */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                previewDevice === 'mobile'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                previewDevice === 'desktop'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
          </div>

          <a
            href={`/invite/${data.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-300 hover:text-amber-300 px-3 py-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors"
          >
            <span>Live Guest Preview</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-950" />
                <span>Published!</span>
              </>
            ) : saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Publish</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Customizer Form */}
        <div className="w-full md:w-[460px] lg:w-[500px] shrink-0 h-full overflow-hidden">
          <BuilderForm
            data={data}
            onChange={setData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSave={handleSave}
            saving={saving}
          />
        </div>

        {/* Right Side: Live Interactive Preview */}
        <div className="hidden md:flex flex-1 bg-neutral-950 items-center justify-center p-6 overflow-hidden relative">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: data.theme.primaryColor || '#721c24' }}
          />

          {previewDevice === 'mobile' ? (
            /* Sleek Smartphone Mockup */
            <div className="relative w-[375px] h-[780px] max-h-[92%] rounded-[48px] bg-neutral-900 border-[10px] border-neutral-800 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
              {/* Phone Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-neutral-800 rounded-b-2xl z-30 flex items-center justify-center">
                <div className="w-10 h-1 bg-neutral-700 rounded-full" />
              </div>

              {/* Scrollable Template View */}
              <div className="w-full h-full overflow-y-auto no-scrollbar pt-6">
                <TemplateRenderer data={data} previewMode={true} />
              </div>
            </div>
          ) : (
            /* Desktop Mockup Frame */
            <div className="w-full max-w-4xl h-[85%] rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
              <div className="h-8 bg-neutral-950 px-4 border-b border-neutral-800 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] text-neutral-400 font-mono ml-4">
                  https://vivaah.pages.dev/invite/{data.slug}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <TemplateRenderer data={data} previewMode={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

