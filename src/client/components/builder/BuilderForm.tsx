import React from 'react';
import { WeddingInvitation, EventType, TemplateId } from '@/shared/types';
import {
  Users,
  Calendar,
  BookOpen,
  Palette,
  Share2,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface BuilderFormProps {
  data: WeddingInvitation;
  onChange: (updated: WeddingInvitation) => void;
  activeTab: 'couple' | 'events' | 'story' | 'theme' | 'publish';
  setActiveTab: (tab: 'couple' | 'events' | 'story' | 'theme' | 'publish') => void;
  onSave: () => void;
  saving: boolean;
}

export function BuilderForm({
  data,
  onChange,
  activeTab,
  setActiveTab,
  onSave,
  saving,
}: BuilderFormProps) {
  const updateCouple = (person: 'bride' | 'groom', field: string, value: string) => {
    onChange({
      ...data,
      couple: {
        ...data.couple,
        [person]: {
          ...data.couple[person],
          [field]: value,
        },
      },
    });
  };

  const updateTheme = (field: string, value: any) => {
    onChange({
      ...data,
      theme: {
        ...data.theme,
        [field]: value,
      },
    });
  };

  const handleAddEvent = () => {
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: 'New Celebration',
      type: 'ceremony' as EventType,
      date: data.weddingDate || '2026-12-18',
      time: '06:00 PM',
      venueName: 'The Grand Palace',
      address: 'City Center',
      dressCode: 'Festive Chic',
      description: 'Join us for an unforgettable evening of joy and festivities!',
    };

    onChange({
      ...data,
      events: [...data.events, newEvent],
    });
  };

  const handleRemoveEvent = (id: string) => {
    onChange({
      ...data,
      events: data.events.filter((e) => e.id !== id),
    });
  };

  const handleUpdateEvent = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      events: data.events.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const handleAddStoryMoment = () => {
    const newMoment = {
      id: `story-${Date.now()}`,
      dateOrYear: 'Our Special Day',
      title: 'A New Chapter',
      description: 'Write about how you met or a cherished memory together.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    };
    onChange({
      ...data,
      story: [...data.story, newMoment],
    });
  };

  const handleRemoveStoryMoment = (id: string) => {
    onChange({
      ...data,
      story: data.story.filter((s) => s.id !== id),
    });
  };

  const handleUpdateStoryMoment = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      story: data.story.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  const tabs = [
    { id: 'couple', label: 'Couple', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'story', label: 'Story & Photos', icon: BookOpen },
    { id: 'theme', label: 'Theme & Music', icon: Palette },
    { id: 'publish', label: 'Publish & Share', icon: Share2 },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 text-neutral-100">
      {/* Top Tab Bar */}
      <div className="flex items-center gap-1 p-3 border-b border-neutral-800 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* TAB 1: COUPLE & GENERAL */}
        {activeTab === 'couple' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-1">
                General Invitation Info
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                Personalize your wedding date, URL slug, and romantic tagline.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Invitation URL Slug</label>
                  <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs">
                    <span className="text-neutral-500 mr-1">/invite/</span>
                    <input
                      type="text"
                      value={data.slug}
                      onChange={(e) => onChange({ ...data, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="bg-transparent focus:outline-none text-white w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Wedding Date</label>
                  <input
                    type="date"
                    value={data.weddingDate}
                    onChange={(e) => onChange({ ...data, weddingDate: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Wedding Hashtag</label>
                  <input
                    type="text"
                    value={data.hashtag || ''}
                    onChange={(e) => onChange({ ...data, hashtag: e.target.value })}
                    placeholder="#AnanyaWedsKaran"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={data.tagline}
                    onChange={(e) => onChange({ ...data, tagline: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Bride Details */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                Bride Details
              </h4>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Bride Name</label>
                <input
                  type="text"
                  value={data.couple.bride.name}
                  onChange={(e) => updateCouple('bride', 'name', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Parents' Names</label>
                <input
                  type="text"
                  value={data.couple.bride.parents || ''}
                  onChange={(e) => updateCouple('bride', 'parents', e.target.value)}
                  placeholder="D/o Mrs. Sunita & Mr. Rajesh Sharma"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Photo URL</label>
                <input
                  type="text"
                  value={data.couple.bride.photoUrl || ''}
                  onChange={(e) => updateCouple('bride', 'photoUrl', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Groom Details */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Groom Details
              </h4>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Groom Name</label>
                <input
                  type="text"
                  value={data.couple.groom.name}
                  onChange={(e) => updateCouple('groom', 'name', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Parents' Names</label>
                <input
                  type="text"
                  value={data.couple.groom.parents || ''}
                  onChange={(e) => updateCouple('groom', 'parents', e.target.value)}
                  placeholder="S/o Mrs. Rekha & Mr. Vikram Mehra"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Photo URL</label>
                <input
                  type="text"
                  value={data.couple.groom.photoUrl || ''}
                  onChange={(e) => updateCouple('groom', 'photoUrl', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  Celebration Schedule
                </h3>
                <p className="text-xs text-neutral-400">
                  Manage ceremonies, dates, Google Maps links, and dress codes.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddEvent}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.events.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-300">
                      Event #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(evt.id)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={evt.title}
                        onChange={(e) => handleUpdateEvent(evt.id, 'title', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Type</label>
                      <select
                        value={evt.type}
                        onChange={(e) => handleUpdateEvent(evt.id, 'type', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="haldi">Haldi</option>
                        <option value="mehendi">Mehendi</option>
                        <option value="sangeet">Sangeet & Cocktails</option>
                        <option value="wedding">Wedding / Pheras</option>
                        <option value="reception">Reception</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={evt.date}
                        onChange={(e) => handleUpdateEvent(evt.id, 'date', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Time</label>
                      <input
                        type="text"
                        value={evt.time}
                        onChange={(e) => handleUpdateEvent(evt.id, 'time', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Venue Name</label>
                      <input
                        type="text"
                        value={evt.venueName}
                        onChange={(e) => handleUpdateEvent(evt.id, 'venueName', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Dress Code</label>
                      <input
                        type="text"
                        value={evt.dressCode || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'dressCode', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STORY & PHOTOS */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  Our Love Story
                </h3>
                <p className="text-xs text-neutral-400">Chronicle your special milestones.</p>
              </div>
              <button
                type="button"
                onClick={handleAddStoryMoment}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.story.map((moment) => (
                <div
                  key={moment.id}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={moment.dateOrYear}
                      onChange={(e) => handleUpdateStoryMoment(moment.id, 'dateOrYear', e.target.value)}
                      placeholder="e.g. Autumn 2021"
                      className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-amber-300 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStoryMoment(moment.id)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={moment.title}
                    onChange={(e) => handleUpdateStoryMoment(moment.id, 'title', e.target.value)}
                    placeholder="Milestone title"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                  />

                  <textarea
                    rows={2}
                    value={moment.description}
                    onChange={(e) => handleUpdateStoryMoment(moment.id, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: THEME & MUSIC */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Visual Template & Aura
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                Choose the visual language for your wedding invitation.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => updateTheme('templateId', 'royal')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    data.theme.templateId === 'royal'
                      ? 'bg-amber-500/20 border-amber-400 shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Royal Heritage</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Regal Crimson, Gold Foil, Mandalas, Grand Indian Wedding elegance.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => updateTheme('templateId', 'botanical')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    data.theme.templateId === 'botanical'
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-md'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Botanical Floral</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Eucalyptus greens, blush watercolor, gentle romantic garden feel.
                  </p>
                </button>
              </div>
            </div>

            {/* Background Music Picker */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Romantic Background Music
              </h4>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Song Track Name</label>
                <input
                  type="text"
                  value={data.theme.musicTitle}
                  onChange={(e) => updateTheme('musicTitle', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Audio MP3 URL</label>
                <input
                  type="text"
                  value={data.theme.backgroundMusicUrl}
                  onChange={(e) => updateTheme('backgroundMusicUrl', e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Wax Seal Text */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Wax Seal Monogram
              </h4>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Seal Monogram (2-3 Letters)</label>
                <input
                  type="text"
                  maxLength={5}
                  value={data.theme.envelopeSealText}
                  onChange={(e) => updateTheme('envelopeSealText', e.target.value.toUpperCase())}
                  placeholder="A & K"
                  className="w-32 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-serif text-center uppercase"
                />
              </div>
            </div>

            {/* UPI & Shagun Options */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Digital Shagun (UPI)
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableGifts"
                  checked={data.enableGifts}
                  onChange={(e) => onChange({ ...data, enableGifts: e.target.checked })}
                  className="rounded border-neutral-700 text-amber-500 w-4 h-4 bg-neutral-800"
                />
                <label htmlFor="enableGifts" className="text-xs text-neutral-300">
                  Enable digital Shagun / Blessings button
                </label>
              </div>
              {data.enableGifts && (
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">UPI ID</label>
                  <input
                    type="text"
                    value={data.upiId || ''}
                    onChange={(e) => onChange({ ...data, upiId: e.target.value })}
                    placeholder="couple@okhdfcbank"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PUBLISH & SHARE */}
        {activeTab === 'publish' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-1">
                Your Digital Invitation is Ready!
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                Share this personalized link with your family and friends via WhatsApp, SMS, or QR code.
              </p>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <label className="block text-xs text-neutral-400">Live Invitation Link</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/invite/${data.slug}`}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/invite/${data.slug}`);
                      alert('Copied invitation link!');
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-400 text-neutral-950 text-xs font-semibold hover:bg-amber-300 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>

                <div className="pt-3">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `We are overjoyed to invite you to celebrate our wedding! Click to open our animated invitation: ${window.location.origin}/invite/${data.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Share on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center text-center mt-4">
                <span className="text-xs text-neutral-400 mb-3">Scan QR code to open invitation</span>
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      `${window.location.origin}/invite/${data.slug}`
                    )}`}
                    alt="Invitation QR"
                    className="w-32 h-32"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save / Deploy Bar */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
        <a
          href={`/invite/${data.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
        >
          <span>Open Full View ↗</span>
        </a>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save & Publish'}
        </button>
      </div>
    </div>
  );
}
