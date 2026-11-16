import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  targetDate: string;
  accentColor?: string;
  themeStyle?: 'royal' | 'botanical' | 'minimalist';
}

export function CountdownTimer({
  targetDate,
  accentColor = '#d4af37',
  themeStyle = 'royal',
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="py-4 text-center">
        <span
          className="text-lg font-serif tracking-widest uppercase"
          style={{ color: accentColor }}
        >
          Today is the Day! 💍
        </span>
      </div>
    );
  }

  const units = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 my-6">
      {units.map((unit, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl min-w-[65px] sm:min-w-[85px] border ${
            themeStyle === 'minimalist'
              ? 'bg-neutral-900/40 border-neutral-800'
              : 'bg-black/30 backdrop-blur-sm border-amber-500/20'
          }`}
        >
          <span
            className="text-2xl sm:text-4xl font-serif font-bold tracking-tight"
            style={{ color: accentColor }}
          >
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
