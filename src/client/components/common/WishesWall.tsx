import React, { useState, useEffect } from 'react';
import { Heart, Send } from 'lucide-react';
import { WishRecord } from '@/shared/types';
import { getWishes, submitWish } from '@/client/lib/api';
import { useConfetti } from '@/client/hooks/useConfetti';

interface WishesWallProps {
  slug: string;
  accentColor?: string;
  themeStyle?: 'royal' | 'botanical' | 'minimalist';
}

export function WishesWall({ slug }: WishesWallProps) {
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [senderName, setSenderName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { shootPetals } = useConfetti();

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
      shootPetals();
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#8C827A] block mb-1">
          Guestbook
        </span>
        <h3 className="text-2xl font-display text-[#231F1D]">Wishes & Blessings</h3>
      </div>

      {/* Post a Wish Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3 max-w-md mx-auto text-left">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            required
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your Name *"
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
          />
          <input
            type="text"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            placeholder="Relation (e.g. Friend)"
            className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
          />
        </div>

        <textarea
          rows={2}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your warm thoughts and wishes..."
          className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD0] focus:border-[#C8A97E] focus:outline-none text-[#2C2724] text-xs"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-xl font-medium text-[11px] uppercase tracking-wider text-[#FAF7F2] bg-[#2C2724] hover:bg-[#453E3A] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Send className="w-3 h-3 text-[#C8A97E]" />
          <span>{loading ? 'Posting...' : 'Leave a Blessing'}</span>
        </button>
      </form>

      {/* Wishes Stream */}
      <div className="space-y-3 max-w-lg mx-auto text-left">
        {wishes.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#FAF7F2]/80 border border-[#EDE5DA] flex flex-col justify-between"
          >
            <p className="text-xs text-[#453E3A] font-serif italic mb-2 leading-relaxed">
              "{item.message}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-[#7C746C] pt-2 border-t border-[#EFE7DC]">
              <span className="font-medium text-[#2C2724]">
                {item.senderName} {item.relation ? `• ${item.relation}` : ''}
              </span>
              <Heart className="w-3 h-3 text-[#C8A97E]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
