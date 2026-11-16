import { Volume2, VolumeX, Disc3 } from 'lucide-react';

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
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E8DFD0] rounded-full pl-3 pr-2 py-1.5 shadow-[0_8px_30px_rgba(50,40,30,0.08)] transition-all duration-300">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onTogglePlay}>
        <Disc3
          className={`w-4 h-4 text-[#C8A97E] transition-transform ${
            isPlaying && !isMuted ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '6s' }}
        />
        <div className="max-w-[120px] sm:max-w-[160px] overflow-hidden whitespace-nowrap">
          <p className="text-[11px] text-[#453E3A] font-sans truncate tracking-wide">
            {title || 'Acoustic Melody'}
          </p>
        </div>
      </div>

      <button
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="w-6 h-6 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE2] text-[#6B635B] flex items-center justify-center transition-colors cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
      </button>
    </div>
  );
}
