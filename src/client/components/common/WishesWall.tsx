import React, { useState, useEffect } from 'react';
import { Heart, Send, MessageCircleHeart } from 'lucide-react';
import { WishRecord } from '@/shared/types';
import { getWishes, submitWish } from '@/client/lib/api';
import { useConfetti } from '@/client/hooks/useConfetti';

interface WishesWallProps {
  slug: string;
  accentColor?: string;
  themeStyle?: 'royal' | 'botanical' | 'minimalist';
}

export function WishesWall({
  slug,
  accentColor = '#d4af37',
  themeStyle = 'royal',
}: WishesWallProps) {
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [senderName, setSenderName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { shootHearts } = useConfetti();

  useEffect(() => {
    getWishes(slug).then(setWishes);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setLoading(true);
    try {
      const res = await submitWish(slug, {
        senderName,
        relation,
        message,
      });

      if (res.wish) {
        setWishes((prev) => [res.wish, ...prev]);
      } else {
        // Fallback optimistic
        const tempWish: WishRecord = {
          id: `wish-${Date.now()}`,
          invitationId: slug,
          senderName,
          relation,
          message,
          createdAt: new Date().toISOString(),
        };
        setWishes((prev) => [tempWish, ...prev]);
      }

      setSenderName('');
      setRelation('');
      setMessage('');
      shootHearts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border ${
        themeStyle === 'minimalist'
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-neutral-950/70 backdrop-blur-md border-amber-500/25'
      }`}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-3">
          <MessageCircleHeart className="w-6 h-6" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Wishes & Blessings
        </h3>
        <p className="text-xs text-amber-200/70 font-serif uppercase tracking-wider mt-1">
          Leave a heartfelt note for the couple
        </p>
      </div>

      {/* Post a Wish Form */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4 max-w-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your Name *"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
          />
          <input
            type="text"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            placeholder="Relation (e.g. Groom's Friend, Cousin)"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
          />
        </div>

        <textarea
          rows={3}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your warm wishes and blessings..."
          className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-amber-400 focus:outline-none text-white text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-xs uppercase tracking-wider text-neutral-950 bg-amber-400 hover:bg-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? 'Posting...' : 'Post Blessing'}</span>
        </button>
      </form>

      {/* Wishes Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {wishes.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-neutral-900/50 border border-white/5 flex flex-col justify-between"
          >
            <p className="text-sm text-neutral-200 italic mb-4 leading-relaxed font-serif">
              "{item.message}"
            </p>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
              <div>
                <span className="font-semibold text-amber-200 block">
                  {item.senderName}
                </span>
                {item.relation && (
                  <span className="text-[11px] text-neutral-400 block">
                    {item.relation}
                  </span>
                )}
              </div>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
