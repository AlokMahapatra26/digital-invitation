import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
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

  const { shootPetals } = useConfetti();

  const handleOpenEnvelope = () => {
    setHasOpenedEnvelope(true);
    play();
    shootPetals();
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
          className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col overflow-hidden text-[#2C2724]"
        >
          {/* Top Sticky Minimalist Header */}
          <div className="h-14 bg-white/90 backdrop-blur-md border-b border-[#E8DFD0] px-4 sm:px-6 flex items-center justify-between z-40 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleModalClose}
                className="p-1.5 rounded-full text-[#8C827A] hover:text-[#2C2724] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A97E] font-sans block">
                  Interactive Preview
                </span>
                <span className="text-sm font-display text-[#2C2724] tracking-wide">
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
              className="px-5 py-2 rounded-full bg-[#2C2724] hover:bg-[#453E3A] text-[#FAF7F2] font-medium text-xs tracking-wider uppercase flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <Check className="w-3.5 h-3.5 text-[#C8A97E]" />
              <span>Use This Design</span>
            </button>
          </div>

          {/* Interactive Preview Container */}
          <div className="flex-1 overflow-y-auto relative">
            {!hasOpenedEnvelope && (
              <EnvelopeOpening
                sealText={previewData.theme.envelopeSealText || 'S & J'}
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
