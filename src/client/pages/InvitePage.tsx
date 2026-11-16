import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { WeddingInvitation } from '@/shared/types';
import { SAMPLE_INVITATION } from '@/shared/defaults';
import { getInvitation } from '@/client/lib/api';
import { useAudio } from '@/client/hooks/useAudio';
import { useConfetti } from '@/client/hooks/useConfetti';
import { EnvelopeOpening } from '@/client/components/common/EnvelopeOpening';
import { AudioPlayerWidget } from '@/client/components/common/AudioPlayerWidget';
import { TemplateRenderer } from '@/client/components/templates/TemplateRenderer';

export function InvitePage() {
  const { slug = 'ananya-and-karan' } = useParams<{ slug: string }>();
  const [data, setData] = useState<WeddingInvitation>(SAMPLE_INVITATION);
  const [hasOpened, setHasOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isPlaying, isMuted, play, togglePlay, toggleMute } = useAudio(
    data.theme?.backgroundMusicUrl || SAMPLE_INVITATION.theme.backgroundMusicUrl
  );

  const { shootPetals, shootGoldDust } = useConfetti();

  useEffect(() => {
    getInvitation(slug)
      .then((inv) => {
        setData(inv);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleOpenEnvelope = () => {
    setHasOpened(true);
    // Play music now that user has interacted with the document
    play();

    // Trigger opening particles
    if (data.theme?.animationEffect === 'petals') {
      shootPetals();
    } else {
      shootGoldDust();
    }
  };

  const isSelfContained =
    data.theme?.templateId === 'opal-romance' ||
    data.theme?.templateId === 'amber' ||
    data.theme?.templateId === 'ever-after-bloom' ||
    data.theme?.templateId === 'mountain' ||
    data.theme?.templateId === 'royal-grace' ||
    data.theme?.templateId === 'the-sacred-garden';

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-amber-200">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-serif tracking-widest text-xs uppercase">Preparing Your Invitation...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-950">
      {/* Wax seal & Envelope Reveal for traditional templates */}
      {!isSelfContained && !hasOpened && (
        <EnvelopeOpening
          sealText={data.theme?.envelopeSealText || 'A & K'}
          coupleNames={`${data.couple.bride.name} & ${data.couple.groom.name}`}
          primaryColor={data.theme?.primaryColor}
          accentColor={data.theme?.accentColor}
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Main Wedding Invitation Template */}
      <TemplateRenderer data={data} previewMode={false} />

      {/* Floating Audio Player Widget for traditional templates */}
      {!isSelfContained && hasOpened && (
        <AudioPlayerWidget
          isPlaying={isPlaying}
          isMuted={isMuted}
          title={data.theme?.musicTitle || 'Wedding Theme'}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
        />
      )}
    </div>
  );
}

