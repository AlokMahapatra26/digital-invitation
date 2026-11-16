import { WeddingEvent } from '@/shared/types';
import { Calendar, Clock, MapPin, Navigation, Sparkles } from 'lucide-react';

interface EventCardProps {
  event: WeddingEvent;
  accentColor?: string;
  themeStyle?: 'royal' | 'botanical' | 'minimalist';
}

export function EventCard({
  event,
  accentColor = '#d4af37',
  themeStyle = 'royal',
}: EventCardProps) {
  // Generate Google Calendar Link
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || `Wedding celebration: ${event.title}`);
    const location = encodeURIComponent(`${event.venueName}, ${event.address}`);
    
    // Normalize date format YYYYMMDD
    const cleanDate = event.date.replace(/-/g, '');
    const dates = `${cleanDate}T100000Z/${cleanDate}T160000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  const getEventBadgeClass = () => {
    switch (event.type) {
      case 'haldi':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'mehendi':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'sangeet':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'wedding':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'reception':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-xl border ${
        themeStyle === 'minimalist'
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-neutral-950/60 backdrop-blur-md border-amber-500/25'
      }`}
    >
      {/* Decorative Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border mb-2 ${getEventBadgeClass()}`}
          >
            {event.type}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-100">
            {event.title}
          </h3>
        </div>

        {event.dressCode && (
          <div className="flex items-center gap-1.5 text-xs text-amber-200/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Dress Code: {event.dressCode}</span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="text-sm text-neutral-300/90 mb-5 leading-relaxed font-sans">
          {event.description}
        </p>
      )}

      {/* Date, Time, Venue Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-sm text-neutral-300 mb-5">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-start gap-2.5 sm:col-span-2">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block">{event.venueName}</span>
            <span className="text-xs text-neutral-400 block">{event.address}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Maps & Calendar */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={event.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${event.venueName} ${event.address}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>View on Map</span>
        </a>

        <a
          href={createGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Add to Calendar</span>
        </a>
      </div>
    </div>
  );
}

