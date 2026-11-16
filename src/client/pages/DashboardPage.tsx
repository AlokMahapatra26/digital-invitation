import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Trash2,
  Users,
  Calendar,
  Heart,
  Clock,
  Sparkles,
  ArrowLeft,
  LogOut,
  MapPin,
  Eye,
} from 'lucide-react';
import { WeddingInvitation, TemplateId } from '@/shared/types';
import { useAuth } from '@/client/context/AuthContext';
import { GaneshaEmblem } from '@/client/components/common/GaneshaEmblem';
import { QuickCreateModal } from '@/client/components/templates/QuickCreateModal';

export function DashboardPage() {
  const { user, token, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [invitations, setInvitations] = useState<WeddingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('mountain');

  useEffect(() => {
    if (!user && !token) {
      // Prompt user to sign in
      openAuthModal('login');
      return;
    }

    const fetchMyInvitations = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/my-invitations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setInvitations(data.invitations || []);
        }
      } catch (err) {
        console.error('Failed to load user invitations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyInvitations();
  }, [user, token]);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleShareWhatsApp = (inv: WeddingInvitation) => {
    const url = `${window.location.origin}/invite/${inv.slug}`;
    const text = `🌸 You're cordially invited to the wedding celebration of ${inv.couple.bride.name} & ${inv.couple.groom.name}! View our royal digital invitation here: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invitation?')) return;

    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setInvitations((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete invitation:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C211E] font-sans antialiased selection:bg-[#F3D7B5]">
      {/* Top Auspicious Header */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#E8D4B0]">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <GaneshaEmblem className="w-9 h-9" color="#8C2323" />
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl tracking-wide text-[#8C2323] block leading-tight group-hover:text-[#681818] transition-colors">
                Shubh Vivah
              </span>
              <span className="text-[9px] tracking-[0.22em] uppercase text-[#7A6B56] block font-serif">
                Invitation Dashboard
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-serif font-semibold text-[#7A6B56] hover:text-[#8C2323] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Templates</span>
          </Link>

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-[#E8D4B0]">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-serif font-bold text-[#8C2323] block">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#7A6B56] block font-sans">
                  {user.email}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-full text-[#7A6B56] hover:text-[#8C2323] hover:bg-[#EFE2CC] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Banner Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8D4B0]">
          <div>
            <span className="text-[10px] font-serif uppercase tracking-[0.25em] text-[#8C2323] font-bold block mb-1">
              My Wedding Invitations
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#8C2323]">
              Welcome, {user?.name || 'Guest'}
            </h1>
            <p className="text-xs sm:text-sm text-[#5D4E3E] font-serif mt-1">
              Manage your published wedding pages, monitor RSVPs, and share with your guests.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedTemplateId('mountain');
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8C2323] to-[#681818] hover:brightness-110 text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all self-start sm:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Invitation</span>
          </button>
        </div>

        {/* Invitations Grid */}
        {loading ? (
          <div className="py-20 text-center text-[#7A6B56] font-serif">
            <Sparkles className="w-8 h-8 mx-auto mb-3 animate-pulse text-[#D4AF37]" />
            <p className="text-sm">Loading your wedding invitations...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border-2 border-dashed border-[#E8D4B0] max-w-xl mx-auto my-8">
            <Heart className="w-12 h-12 mx-auto text-[#D4AF37] mb-3" />
            <h3 className="text-xl font-serif font-bold text-[#8C2323] mb-2">
              No Wedding Invitations Yet
            </h3>
            <p className="text-xs text-[#5D4E3E] font-serif max-w-sm mx-auto mb-6 leading-relaxed">
              You haven't created any wedding invitation pages yet. Pick a template and customize it
              with your couple photos, events, and love story.
            </p>
            <button
              onClick={() => {
                setSelectedTemplateId('mountain');
                setIsCreateModalOpen(true);
              }}
              className="px-6 py-3 rounded-full bg-[#8C2323] hover:bg-[#681818] text-white font-serif font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Invitation</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map((inv) => {
              const weddingDateFormatted = new Date(inv.weddingDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-3xl border border-[#E8D4B0] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Top Tag & Template Name */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E8D4B0] text-[10px] font-serif uppercase tracking-wider text-[#8C2323] font-bold">
                        {inv.theme?.templateId === 'mountain'
                          ? 'Himalayan Mountain'
                          : inv.theme?.templateId === 'the-sacred-garden'
                          ? 'The Sacred Garden'
                          : inv.theme?.templateId === 'royal-grace'
                          ? 'Royal Grace'
                          : 'Royal Vivah'}
                      </span>
                      <span className="text-[10px] font-serif text-[#7A6B56] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D4AF37]" />
                        <span>{weddingDateFormatted}</span>
                      </span>
                    </div>

                    {/* Couple Names */}
                    <h3 className="text-xl font-serif font-bold text-[#8C2323] mb-1">
                      {inv.couple.bride.name} & {inv.couple.groom.name}
                    </h3>
                    <p className="text-xs text-[#7A6B56] font-serif mb-4 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{inv.events?.[0]?.venueName || 'Ceremony Venue'}</span>
                    </p>

                    {/* Invitation Stats */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FAF6F0] border border-[#E8D4B0]/60 mb-4 text-center">
                      <div>
                        <span className="text-lg font-serif font-bold text-[#8C2323] block leading-tight">
                          {inv.events?.length || 0}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-[#7A6B56] font-serif">
                          Ceremonies
                        </span>
                      </div>
                      <div>
                        <span className="text-lg font-serif font-bold text-[#8C2323] block leading-tight">
                          {inv.gallery?.length || 0}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-[#7A6B56] font-serif">
                          Photos
                        </span>
                      </div>
                    </div>

                    {/* Link Display */}
                    <div className="p-2 rounded-xl bg-[#FAF6F0] border border-[#E8D4B0] flex items-center justify-between text-[11px] text-[#5D4E3E] font-mono mb-4">
                      <span className="truncate pr-2">/invite/{inv.slug}</span>
                      <button
                        onClick={() => handleCopyLink(inv.slug)}
                        title="Copy Invitation Link"
                        className="p-1 rounded text-[#8C2323] hover:bg-[#EFE2CC] cursor-pointer shrink-0"
                      >
                        {copiedSlug === inv.slug ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 py-4 bg-[#FAF6F0]/80 border-t border-[#E8D4B0] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`/invite/${inv.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#E8D4B0] text-[#8C2323] hover:bg-[#8C2323] hover:text-white text-xs font-serif font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>

                      <button
                        onClick={() => handleShareWhatsApp(inv)}
                        title="Share on WhatsApp"
                        className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(inv.id)}
                      title="Delete Invitation"
                      className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quick Create Modal */}
      <QuickCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        selectedTemplateId={selectedTemplateId}
      />
    </div>
  );
}
