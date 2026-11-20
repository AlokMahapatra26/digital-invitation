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

  const isSelfContained =
    templateId === 'opal-romance' ||
    templateId === 'amber' ||
    templateId === 'ever-after-bloom' ||
    templateId === 'mountain' ||
    templateId === 'royal-grace' ||
    templateId === 'the-sacred-garden' ||
    templateId === 'rajwadi-kankotri' ||
    templateId === 'kanku-kankotri' ||
    templateId === 'kumkum-kankotri';

  const previewData: WeddingInvitation = {
    ...SAMPLE_INVITATION,
    theme: {
      ...SAMPLE_INVITATION.theme,
      templateId,
      backgroundMusicUrl:
        templateId === 'opal-romance'
          ? '/templates/opal-romance/soundtrack.mp3'
          : templateId === 'amber'
            ? '/templates/amber/music-placeholder.mp3'
            : templateId === 'ever-after-bloom'
              ? '/templates/ever-after-bloom/soundtrack.mp3'
              : templateId === 'mountain'
                ? '/templates/mountain/soundtrack.mp3'
                : templateId === 'royal-grace'
                  ? '/templates/royal-grace/soundtrack.mp3'
                  : templateId === 'the-sacred-garden'
                    ? '/templates/the-sacred-garden/soundtrack.mp3'
                    : templateId === 'rajwadi-kankotri' || templateId === 'kanku-kankotri'
                      ? '/templates/rajwadi-kankotri/soundtrack.mp3'
                      : SAMPLE_INVITATION.theme.backgroundMusicUrl,
      musicTitle:
        templateId === 'opal-romance'
          ? 'Opal Palace Garden Romance Symphony'
          : templateId === 'amber'
            ? 'Sunehri Candlelit Symphony'
            : templateId === 'ever-after-bloom'
              ? 'Amrit Mahal Dawn Symphony'
              : templateId === 'mountain'
                ? 'Himalayan Santoor & Flute Symphony'
                : templateId === 'royal-grace'
                  ? 'Royal Grace Acoustic Symphony'
                  : templateId === 'the-sacred-garden'
                    ? 'Ludovico Einaudi — Divenire'
                    : templateId === 'rajwadi-kankotri' || templateId === 'kanku-kankotri'
                      ? 'Mangal Phera (Instrumental Symphony)'
                      : SAMPLE_INVITATION.theme.musicTitle,
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
          className="fixed inset-0 z-50 bg-[#290303] flex flex-col overflow-hidden text-[#FAF5EB]"
        >
          {/* Top Sticky Minimalist Header */}
          <div className="h-14 bg-[#3D0606]/95 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 sm:px-6 flex items-center justify-between z-40 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleModalClose}
                className="p-1.5 rounded-full text-[#F9E2AF]/80 hover:text-white hover:bg-[#5E0D0D] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-serif block">
                  Interactive Preview
                </span>
                <span className="text-sm font-serif font-bold text-white tracking-wide">
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
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#F9E2AF] via-[#E8C288] to-[#D4AF37] hover:brightness-110 text-[#380505] font-serif font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Use This Template</span>
            </button>
          </div>

          {/* Interactive Preview Container */}
          <div className="flex-1 overflow-y-auto relative">
            {!isSelfContained && !hasOpenedEnvelope && (
              <EnvelopeOpening
                sealText={previewData.theme.envelopeSealText || '|| SHREE ||'}
                coupleNames={`${previewData.couple.bride.name} & ${previewData.couple.groom.name}`}
                primaryColor={previewData.theme.primaryColor}
                accentColor={previewData.theme.accentColor}
                onOpen={handleOpenEnvelope}
              />
            )}

            <TemplateRenderer key={`${templateId}-${isOpen}`} data={previewData} previewMode={false} />

            {!isSelfContained && hasOpenedEnvelope && (
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
