import { Calendar } from 'lucide-react';
import type { ObjectEventItem } from '../types';
import { EVENT_STATUSES, EVENT_TYPES } from '../constants';

interface EventsTabProps {
  events: ObjectEventItem[];
  onStatusChange: (eventId: string, status: ObjectEventItem['status']) => void;
  onAddEvent: () => void;
}

export function EventsTab({ events, onStatusChange, onAddEvent }: EventsTabProps) {
  return (
    <div className="space-y-3">
      {events.length > 0 ? (
        events.map((event) => {
          const eventType = EVENT_TYPES.find((item) => item.value === event.type);
          const eventColor = eventType?.color || '#64748B';
          const statusInfo = EVENT_STATUSES.find((item) => item.value === event.status) || EVENT_STATUSES[0];

          return (
            <div
              key={event.id}
              className="rounded-xl p-3"
              style={{ background: `${eventColor}08`, border: `1px solid ${eventColor}20` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: eventColor }} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-weak">{event.date} - {event.time}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <select
                  value={event.status}
                  onChange={(e) => onStatusChange(event.id, e.target.value as ObjectEventItem['status'])}
                  className="text-xs px-2 py-1 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `${statusInfo.color}20`,
                    color: statusInfo.color,
                    border: 'none',
                  }}
                >
                  {EVENT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-weak">Нет событий</p>
        </div>
      )}

      <button
        onClick={onAddEvent}
        className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
        style={{ background: '#3B82F6', color: '#FFFFFF' }}
      >
        <span className="w-5 h-5">+</span>
        Добавить событие
      </button>
    </div>
  );
}
