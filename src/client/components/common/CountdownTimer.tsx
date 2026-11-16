import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  targetDate: string;
  accentColor?: string;
  themeStyle?: 'royal' | 'botanical' | 'minimalist';
}

export function CountdownTimer({
  targetDate,
  accentColor = '#C8A97E',
}: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="py-4 text-center">
        <span className="text-sm font-serif italic tracking-widest text-[#2C2724]">
          Today is the Day
        </span>
      </div>
    );
  }

  const units = [
    { label: 'days', value: days },
    { label: 'hours', value: hours },
    { label: 'minutes', value: minutes },
    { label: 'seconds', value: seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 my-6">
      {units.map((unit, idx) => (
        <div key={idx} className="flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl font-display font-normal text-[#2C2724] tracking-tight">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C827A] mt-1 font-sans">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
