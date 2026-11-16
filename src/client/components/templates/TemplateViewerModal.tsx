import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check } from 'lucide-react';
import { TemplateId, WeddingInvitation } from '@/shared/types';
import { SAMPLE_INVITATION } from '@/shared/defaults';
import { TemplateRenderer } from './TemplateRenderer';
import { EnvelopeOpening } from '../common/EnvelopeOpening';
import { AudioPlayerWidget } from '../common/AudioPlayerWidget';
import { useAudio } from '@/client/hooks/useAudio';
import { useConfetti } from '@/client/hooks/useConfetti';

interface TemplateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: TemplateId;
  templateTitle: string;
  onSelectTemplate: (id: TemplateId) => void;
}

export function TemplateViewerModal({
  isOpen,
  onClose,
  templateId,
  templateTitle,
  onSelectTemplate,
}: TemplateViewerModalProps) {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);

  // Clone sample data with current template ID
  const previewData: WeddingInvitation = {
    ...SAMPLE_INVITATION,
    theme: {
      ...SAMPLE_INVITATION.theme,
      templateId,
    },
  };

  const { isPlaying, isMuted, play, togglePlay, toggleMute, pause } = useAudio(
    previewData.theme.backgroundMusicUrl
  );

  const { shootPetals, shootGoldDust } = useConfetti();

  const handleOpenEnvelope = () => {
    setHasOpenedEnvelope(true);
    play();
    if (templateId === 'botanical') {
      shootPetals();
    } else {
      shootGoldDust();
    }
  };

  const handleModalClose = () => {
    pause();
    setHasOpenedEnvelope(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
        >
          {/* Top Sticky Header */}
          <div className="h-14 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-6 flex items-center justify-between z-40 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleModalClose}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-serif block">
                  Interactive Preview
                </span>
                <span className="text-sm font-semibold text-white">
                  {templateTitle}
                </span>
              </div>
            </div>

            {/* Prominent "Use This Template" CTA */}
            <button
              onClick={() => {
                pause();
                onSelectTemplate(templateId);
              }}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-neutral-950 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Use This Template</span>
            </button>
          </div>

          {/* Interactive Preview Container */}
          <div className="flex-1 overflow-y-auto relative">
            {!hasOpenedEnvelope && (
              <EnvelopeOpening
                sealText={previewData.theme.envelopeSealText || 'A & K'}
                coupleNames={`${previewData.couple.bride.name} & ${previewData.couple.groom.name}`}
                primaryColor={previewData.theme.primaryColor}
                accentColor={previewData.theme.accentColor}
                onOpen={handleOpenEnvelope}
              />
            )}

            <TemplateRenderer data={previewData} previewMode={false} />

            {hasOpenedEnvelope && (
              <AudioPlayerWidget
                isPlaying={isPlaying}
                isMuted={isMuted}
                title={previewData.theme.musicTitle}
                onTogglePlay={togglePlay}
                onToggleMute={toggleMute}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
