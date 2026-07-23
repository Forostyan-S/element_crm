import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useStore } from '../../store';
import { EmptyState } from '../../ui';
import { EventCard } from './EventCard';
import type { CalendarEvent, EventType } from '../../types';
import { EVENT_TYPE_COLORS } from '../../types';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const demoEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Замер квартиры у Новиковых',
    type: 'measurement',
    date: new Date().toISOString(),
    time: '10:00',
    end_time: '12:00',
    all_day: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Монтаж проводки',
    type: 'installation',
    date: new Date().toISOString(),
    time: '14:00',
    end_time: '18:00',
    all_day: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Закупка материалов',
    type: 'purchase',
    date: new Date(Date.now() + 86400000).toISOString(),
    all_day: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Встреча с клиентом',
    type: 'meeting',
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '11:00',
    all_day: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Созвон по проекту',
    type: 'call',
    date: new Date(Date.now() + 172800000).toISOString(),
    time: '15:00',
    all_day: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Напоминание: сдать отчёт',
    type: 'reminder',
    date: new Date(Date.now() + 259200000).toISOString(),
    all_day: true,
    created_at: new Date().toISOString(),
  },
];

type EventTypeFilter = EventType | 'all';
type ViewMode = 'month' | 'week' | 'day';

const TYPE_FILTERS: Array<{ value: EventTypeFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'measurement', label: 'Замеры' },
  { value: 'installation', label: 'Монтажи' },
  { value: 'meeting', label: 'Встречи' },
  { value: 'purchase', label: 'Закупки' },
  { value: 'call', label: 'Созвоны' },
  { value: 'reminder', label: 'Напоминания' },
];

export function CalendarPage() {
  const { events, setFormPage } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>('all');

  const displayEvents = events.length > 0 ? events : demoEvents;

  const filteredEvents =
    typeFilter === 'all'
      ? displayEvents
      : displayEvents.filter((e) => e.type === typeFilter);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getWeekDays = (date: Date): Date[] => {
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const getEventsForDay = (date: Date) =>
    filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
  const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();

  const navigate = (direction: 'prev' | 'next') => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') d.setMonth(d.getMonth() + (direction === 'next' ? 1 : -1));
      else if (viewMode === 'week') d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
      else d.setDate(d.getDate() + (direction === 'next' ? 1 : -1));
      return d;
    });
  };

  const days = getDaysInMonth(selectedDate);
  const weekDays = getWeekDays(selectedDate);
  const selectedDayEvents = getEventsForDay(selectedDate);

  const headerTitle = () => {
    if (viewMode === 'month') return `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    if (viewMode === 'week') {
      const first = weekDays[0];
      const last = weekDays[6];
      return `${first.getDate()} – ${last.getDate()} ${MONTHS[last.getMonth()]}`;
    }
    return selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <motion.div
      className="pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Navigation header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('prev')}
            className="p-2 rounded-xl bg-card hover:bg-card-elevated transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted" />
          </button>
          <h2 className="text-base font-semibold text-foreground capitalize">{headerTitle()}</h2>
          <button
            onClick={() => navigate('next')}
            className="p-2 rounded-xl bg-card hover:bg-card-elevated transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === mode ? 'bg-accent text-white' : 'text-muted'
              }`}
            >
              {mode === 'month' ? 'Мес' : mode === 'week' ? 'Нед' : 'День'}
            </button>
          ))}
        </div>
      </div>

      {/* Event type filters */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide">
        {TYPE_FILTERS.map((f) => {
          const isActive = typeFilter === f.value;
          const color = f.value !== 'all' ? EVENT_TYPE_COLORS[f.value as EventType] : '#3B82F6';
          return (
            <motion.button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={
                isActive
                  ? { backgroundColor: `${color}20`, color, border: `1px solid ${color}50` }
                  : { backgroundColor: '#1B2130', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }
              }
              whileTap={{ scale: 0.95 }}
            >
              {f.label}
            </motion.button>
          );
        })}
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <>
          {/* Color Legend */}
          <div className="px-4 mb-3">
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'measurement', color: '#F59E0B', label: 'Замер' },
                { type: 'installation', color: '#3B82F6', label: 'Монтаж' },
                { type: 'meeting', color: '#8B5CF6', label: 'Встреча' },
                { type: 'purchase', color: '#22C55E', label: 'Закупка' },
                { type: 'reminder', color: '#EF4444', label: 'Дедлайн' },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-2xs text-muted-weak">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-card p-4 mx-4 mb-4 shadow-card"
            style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-2xs text-muted-weak font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                if (!date) return <div key={`e-${index}`} className="w-full aspect-square" />;
                const dayEvents = getEventsForDay(date);
                const today = isToday(date);
                const isSelected = isSameDay(date, selectedDate);
                return (
                  <motion.button
                    key={date.toISOString()}
                    className={`relative w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-colors ${
                      isSelected ? 'bg-accent' : today ? 'bg-accent/20' : 'hover:bg-card-elevated'
                    }`}
                    onClick={() => setSelectedDate(date)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <span className={`text-sm ${isSelected ? 'text-white font-bold' : today ? 'text-accent font-bold' : 'text-foreground'}`}>
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={event.id || i}
                            className="w-1 h-1 rounded-full"
                            style={isSelected ? { backgroundColor: '#fff' } : { backgroundColor: EVENT_TYPE_COLORS[event.type as EventType] }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="px-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              {selectedDayEvents.length > 0 && (
                <span className="text-xs text-muted">{selectedDayEvents.length} событий</span>
              )}
            </div>
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDayEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} onClick={() => { setFormPage({ type: 'editEvent', event }); }} />
                ))}
              </div>
            ) : (
              <EmptyState icon={CalendarIcon} title="Нет событий" description="На этот день ничего не запланировано" />
            )}
          </div>
        </>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="px-4">
          <div
            className="rounded-card overflow-hidden mb-4"
            style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="grid grid-cols-7">
              {weekDays.map((date, i) => {
                const dayEvents = getEventsForDay(date);
                const today = isToday(date);
                const isSelected = isSameDay(date, selectedDate);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`flex flex-col items-center py-3 transition-colors ${
                      isSelected ? 'bg-accent/20' : 'hover:bg-card-elevated'
                    } ${i > 0 ? 'border-l border-border' : ''}`}
                  >
                    <span className="text-2xs text-muted-weak mb-1">{WEEKDAYS[i]}</span>
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${
                        isSelected ? 'bg-accent text-white' : today ? 'text-accent' : 'text-foreground'
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayEvents.slice(0, 2).map((e, j) => (
                          <div
                            key={j}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: EVENT_TYPE_COLORS[e.type as EventType] }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDayEvents.length > 0 ? (
            <div className="space-y-2">
              {selectedDayEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} onClick={() => {}} />
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarIcon} title="Нет событий" description="На этот день ничего не запланировано" />
          )}
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="px-4">
          {selectedDayEvents.length > 0 ? (
            <div className="space-y-2">
              {selectedDayEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} onClick={() => {}} />
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarIcon} title="Нет событий" description="На этот день ничего не запланировано" />
          )}
        </div>
      )}
    </motion.div>
  );
}
