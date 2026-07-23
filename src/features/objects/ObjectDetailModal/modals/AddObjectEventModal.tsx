import { AnimatePresence, motion } from 'framer-motion';
import type { Dispatch, SetStateAction } from 'react';
import { zIndex } from '../../../../utils/zIndex';
import type { EventType } from '../../../../types';

interface AddObjectEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventType: EventType;
  setEventType: Dispatch<SetStateAction<EventType>>;
  eventDate: string;
  setEventDate: (value: string) => void;
  eventTime: string;
  setEventTime: (value: string) => void;
  eventTitle: string;
  setEventTitle: (value: string) => void;
  onAdd: () => void;
  eventTypes: Array<{ value: EventType; label: string; color: string }>;
}

export function AddObjectEventModal({
  isOpen,
  onClose,
  eventType,
  setEventType,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  eventTitle,
  setEventTitle,
  onAdd,
  eventTypes,
}: AddObjectEventModalProps) {
  if (!isOpen) return null;

  const selectedType = eventTypes.find((item) => item.value === eventType);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          zIndex: zIndex.backdrop,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 max-w-md mx-auto overflow-hidden"
        style={{
          background: '#0F172A',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          border: '1px solid #1E293B',
          zIndex: zIndex.modalPanel,
          paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="p-4 border-b" style={{ borderColor: '#1E293B' }}>
          <h2 className="text-lg font-semibold text-center" style={{ color: '#FFFFFF' }}>Добавить событие</h2>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Тип события</label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setEventType(item.value)}
                  className="py-3 px-3 rounded-xl flex items-center gap-2 text-sm"
                  style={{
                    background: eventType === item.value ? '#3B82F6' : '#1E293B',
                    color: '#FFFFFF',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: eventType === item.value ? '#FFFFFF' : item.color }}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Дата</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
              />
            </div>
            <div>
              <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Время</label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Название (необязательно)</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder={selectedType?.label || 'Название'}
              className="w-full px-4 py-3 rounded-xl"
              style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium"
              style={{ background: '#1E293B', border: '1px solid #334155', color: '#94A3B8' }}
            >
              Отмена
            </button>
            <button
              onClick={onAdd}
              className="flex-1 py-3 rounded-xl font-medium"
              style={{ background: '#3B82F6', color: '#FFFFFF' }}
            >
              Добавить
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
