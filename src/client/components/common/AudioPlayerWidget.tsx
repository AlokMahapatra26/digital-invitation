import { Volume2, VolumeX, Music, Disc3 } from 'lucide-react';

interface AudioPlayerWidgetProps {
  isPlaying: boolean;
  isMuted: boolean;
  title: string;
  onTogglePlay: () => void;
  onToggleMute: () => void;
}

export function AudioPlayerWidget({
  isPlaying,
  isMuted,
  title,
  onTogglePlay,
  onToggleMute,
}: AudioPlayerWidgetProps) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-amber-500/30 rounded-full pl-3 pr-2 py-1.5 shadow-2xl transition-all duration-300 hover:border-amber-400">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onTogglePlay}>
        <Disc3
          className={`w-5 h-5 text-amber-400 transition-transform ${
            isPlaying && !isMuted ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '4s' }}
        />
        <div className="max-w-[130px] sm:max-w-[180px] overflow-hidden whitespace-nowrap">
          <p className="text-xs text-amber-100 font-sans truncate">
            {title || 'Background Music'}
          </p>
        </div>
      </div>

      <button
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="w-7 h-7 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center transition-colors"
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
