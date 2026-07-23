import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { CalendarEvent, EventType } from '../../types';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '../../types';

interface CalendarWidgetProps {
  events: CalendarEvent[];
  onEventClick?: (eventId: string) => void;
}

export function CalendarWidget({ events, onEventClick }: CalendarWidgetProps) {
  const today = new Date();
  const todayStr = today.toDateString();

  const upcoming = events
    .filter((e) => {
      const d = new Date(e.date);
      return d >= today || d.toDateString() === todayStr;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <section className="px-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">Ближайшие события</h2>
        <div
          className="rounded-card p-4 text-center"
          style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-sm text-muted-weak">Нет запланированных событий</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4">
      <h2 className="text-sm font-semibold text-foreground mb-3">Ближайшие события</h2>
      <div className="space-y-2">
        {upcoming.map((event, index) => {
          const color = EVENT_TYPE_COLORS[event.type as EventType];
          const label = EVENT_TYPE_LABELS[event.type as EventType];
          const d = new Date(event.date);
          const isToday = d.toDateString() === todayStr;
          const isTomorrow = d.toDateString() === new Date(Date.now() + 86400000).toDateString();

          return (
            <motion.div
              key={event.id}
              className="rounded-card p-3 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${color}08 0%, #1B2130 100%)`,
                border: `1px solid ${color}20`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 2 }}
              onClick={() => onEventClick?.(event.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                    <span
                      className="text-2xs px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-2xs text-muted-weak">
                    {isToday ? (
                      <span className="text-accent font-medium">Сегодня</span>
                    ) : isTomorrow ? (
                      <span>Завтра</span>
                    ) : (
                      <span>{d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
                    )}
                    {event.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border/50">
        {[
          { type: 'measurement', color: '#F59E0B', label: 'Замер' },
          { type: 'installation', color: '#3B82F6', label: 'Монтаж' },
          { type: 'meeting', color: '#8B5CF6', label: 'Встреча' },
          { type: 'purchase', color: '#22C55E', label: 'Закупка' },
          { type: 'reminder', color: '#EF4444', label: 'Дедлайн' },
        ].map((item) => (
          <div key={item.type} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-2xs text-muted-weak">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
