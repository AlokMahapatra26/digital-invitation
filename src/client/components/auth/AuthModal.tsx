import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User as UserIcon, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/client/context/AuthContext';
import { GaneshaEmblem } from '@/client/components/common/GaneshaEmblem';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(authModalTab);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync tab with initial tab when modal opens
  React.useEffect(() => {
    setTab(authModalTab);
    setError(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === 'login') {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }
      const res = await register(name, email, password);
      if (!res.success) {
        setError(res.error || 'Registration failed');
      }
    }

    setLoading(false);
  };

  const handleUseDemo = () => {
    setEmail('demo@shubhvivah.com');
    setPassword('password123');
    setTab('login');
    setError(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#FAF6F0] border-2 border-[#D4AF37] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden text-[#2C211E]"
        >
          {/* Top Decorative Border */}
          <div className="h-2 bg-gradient-to-r from-[#8C2323] via-[#D4AF37] to-[#8C2323]" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#7A6B56] hover:text-[#8C2323] hover:bg-[#EFE2CC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header with Emblem */}
            <div className="text-center mb-6">
              <GaneshaEmblem className="w-10 h-10 mx-auto mb-2" color="#8C2323" />
              <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8C2323] font-bold block">
                || Shree Ganeshaya Namah ||
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#8C2323] mt-1">
                {tab === 'login' ? 'Welcome Back' : 'Create Your Account'}
              </h3>
              <p className="text-xs text-[#5D4E3E] font-serif mt-1">
                {tab === 'login'
                  ? 'Sign in to manage your invitations and RSVPs'
                  : 'Start designing your royal wedding invitation'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-[#E8D4B0] mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError(null);
                }}
                className={`flex-1 pb-3 text-xs font-serif font-bold uppercase tracking-wider text-center transition-all cursor-pointer border-b-2 ${
                  tab === 'login'
                    ? 'border-[#8C2323] text-[#8C2323]'
                    : 'border-transparent text-[#7A6B56] hover:text-[#2C211E]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError(null);
                }}
                className={`flex-1 pb-3 text-xs font-serif font-bold uppercase tracking-wider text-center transition-all cursor-pointer border-b-2 ${
                  tab === 'register'
                    ? 'border-[#8C2323] text-[#8C2323]'
                    : 'border-transparent text-[#7A6B56] hover:text-[#2C211E]'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-sans leading-snug">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                    Your Name / Couple Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#7A6B56] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alok & Priyanshi"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E8D4B0] focus:border-[#8C2323] focus:ring-1 focus:ring-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A6B56] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E8D4B0] focus:border-[#8C2323] focus:ring-1 focus:ring-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-semibold text-[#5D4E3E] mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A6B56] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E8D4B0] focus:border-[#8C2323] focus:ring-1 focus:ring-[#8C2323] focus:outline-none text-xs text-[#2C211E] font-serif transition-colors"
                  />
                </div>
                {tab === 'register' && (
                  <span className="text-[10px] text-[#7A6B56] block mt-1 font-serif">
                    Minimum 6 characters
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8C2323] to-[#681818] hover:brightness-110 text-white font-serif font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Account Button */}
            {tab === 'login' && (
              <div className="mt-5 pt-4 border-t border-[#E8D4B0] text-center">
                <button
                  type="button"
                  onClick={handleUseDemo}
                  className="inline-flex items-center gap-1.5 text-[11px] font-serif font-semibold text-[#8C2323] hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Fill Demo Account Credentials</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
