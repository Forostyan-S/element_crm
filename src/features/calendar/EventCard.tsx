import { motion } from 'framer-motion';
import type { CalendarEvent, EventType } from '../../types';
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '../../types';
import { Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  event: CalendarEvent;
  index?: number;
  onClick?: () => void;
}

export function EventCard({ event, index = 0, onClick }: EventCardProps) {
  const eventColor = EVENT_TYPE_COLORS[event.type as EventType];
  const eventLabel = EVENT_TYPE_LABELS[event.type as EventType];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      className="bg-card rounded-card p-4 shadow-card relative overflow-hidden cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      {/* Accent line on left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: eventColor }}
      />

      <div className="flex items-start gap-3 pl-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${eventColor}20` }}
        >
          <span className="text-lg" style={{ color: eventColor }}>
            {event.type === 'measurement' && '📏'}
            {event.type === 'installation' && '🔌'}
            {event.type === 'meeting' && '🤝'}
            {event.type === 'purchase' && '🛒'}
            {event.type === 'delivery' && '📦'}
            {event.type === 'call' && '📞'}
            {event.type === 'reminder' && '⏰'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-2xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${eventColor}20`,
                color: eventColor,
              }}
            >
              {eventLabel}
            </span>
            {!event.all_day && event.time && (
              <span className="text-2xs text-muted-weak">{event.time}</span>
            )}
          </div>
          <h3 className="text-sm font-medium text-foreground truncate mb-1">
            {event.title}
          </h3>
          {event.object && (
            <p className="text-2xs text-muted truncate">{event.object.name}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
