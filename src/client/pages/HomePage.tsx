import { Sparkles, ArrowRight, Heart, Music, CheckCircle2, QrCode, Cloud, ShieldCheck, Zap } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navbar */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-serif font-bold text-base shadow-lg shadow-amber-500/20">
            V
          </div>
          <span className="font-serif font-bold text-xl tracking-wider text-white">
            Vivaah
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/invite/ananya-and-karan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-300 hover:text-amber-300 transition-colors hidden sm:block"
          >
            Live Demo
          </a>
          <a
            href="/builder"
            className="px-5 py-2 rounded-full text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Create Invitation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center relative">
        {/* Ambient Top Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-serif tracking-widest uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Wedding Invitations</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight mb-6">
          Invitations that touch hearts,{' '}
          <span className="gold-gradient-text block font-script italic text-5xl sm:text-7xl md:text-8xl mt-2 font-normal">
            not just screens.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-sans leading-relaxed mb-10">
          Transform your special celebration into an animated, music-filled digital masterpiece.
          Wax seal reveals, live RSVP tracking, and instant WhatsApp sharing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/builder"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Start Customizing Your Invite</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="/invite/ananya-and-karan"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 hover:bg-neutral-800/80 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Experience Sample Invitation</span>
          </a>
        </div>
      </section>

      {/* Interactive Feature Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-neutral-800">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400/80 font-serif block mb-1">
            Engineered for Magic & Elegance
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Everything You Need to Delight Your Guests
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Interactive Wax Seal Reveal
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Guests break the digital wax seal to unveil the invitation, automatically triggering
              falling petals and your romantic background song.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              Live RSVP & Guest Wishes
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Collect guest headcounts, dietary requirements, and heartfelt blessings in real-time
              synced to Cloudflare D1.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              WhatsApp Ready & UPI Shagun
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              One-click share card on WhatsApp, QR code generation, Google Maps navigation, and digital
              gifting via direct UPI.
            </p>
          </div>
        </div>
      </section>

      {/* Cloudflare Tech Stack Showcase */}
      <section className="max-w-5xl mx-auto px-6 py-16 mb-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/20 shadow-2xl">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-mono uppercase tracking-wider mb-2">
            <Cloud className="w-4 h-4" />
            <span>Cloudflare Native Architecture</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
            Zero Egress. Sub-millisecond Global Edge.
          </h3>
          <p className="text-sm text-neutral-300 mb-8 leading-relaxed max-w-2xl">
            Built from scratch to leverage Cloudflare's complete developer platform:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <Zap className="w-5 h-5 text-amber-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">Workers & Pages</h4>
              <p className="text-xs text-neutral-400 mt-1">Instant SSR and edge API routing with Hono.</p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">Cloudflare D1</h4>
              <p className="text-xs text-neutral-400 mt-1">Serverless edge SQLite storing invitations and RSVPs.</p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <Cloud className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">Cloudflare R2</h4>
              <p className="text-xs text-neutral-400 mt-1">$0 egress for high-res photo albums & MP3 audio.</p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
              <h4 className="text-sm font-semibold text-white">Cloudflare KV</h4>
              <p className="text-xs text-neutral-400 mt-1">Sub-15ms slug resolution for custom invite URLs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-10 text-center text-xs text-neutral-500 font-sans">
        <p>© 2026 Vivaah Digital Invitations • Powered by Cloudflare Workers, D1 & R2</p>
      </footer>
    </div>
  );
}
