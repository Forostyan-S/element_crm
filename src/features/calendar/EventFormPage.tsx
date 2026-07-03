import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import { FormPageShell, Field, Input, Textarea, Select } from '../../ui';
import { EVENT_TYPE_LABELS } from '../../types';
import type { CalendarEvent, EventType } from '../../types';

interface EventFormPageProps {
  editEvent?: CalendarEvent | null;
  selectedDate?: string;
  preselectedObjectId?: string;
  onBack: () => void;
  onSaved?: () => void;
}

const TYPE_OPTIONS = Object.entries(EVENT_TYPE_LABELS) as [EventType, string][];

export function EventFormPage({ editEvent, selectedDate, preselectedObjectId, onBack, onSaved }: EventFormPageProps) {
  const { addEvent, updateEvent, deleteEvent, objects } = useStore();

  const [type, setType] = useState<EventType>('measurement');
  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [objectId, setObjectId] = useState(preselectedObjectId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState('none');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEdit = !!editEvent;

  useEffect(() => {
    if (editEvent) {
      setType(editEvent.type);
      setDate(editEvent.date.split('T')[0]);
      setTime(editEvent.time || '09:00');
      setObjectId(editEvent.object_id || '');
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
    }
  }, [editEvent]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Выберите дату';
    if (!time) e.time = 'Выберите время';
    if (!title.trim()) e.title = 'Введите название события';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (isEdit && editEvent) {
      updateEvent(editEvent.id, {
        type,
        date: new Date(date).toISOString(),
        time,
        object_id: objectId || undefined,
        title: title.trim(),
        description: description.trim() || undefined,
      });
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: title.trim(),
        type,
        date: new Date(date).toISOString(),
        time,
        all_day: false,
        object_id: objectId || undefined,
        description: description.trim() || undefined,
        created_at: new Date().toISOString(),
      };
      addEvent(newEvent);
    }
    onSaved?.();
    onBack();
  };

  const handleDelete = () => {
    if (editEvent) {
      deleteEvent(editEvent.id);
      setShowDeleteConfirm(false);
      onBack();
    }
  };

  const footer = (
    <div className="flex gap-3">
      {isEdit && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-3 rounded-xl font-medium text-error transition-colors"
          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={handleSave}
        className="flex-1 py-3 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-1.5"
        style={{ background: '#3B82F6' }}
      >
        <Check className="w-4 h-4" />
        {isEdit ? 'Сохранить' : 'Создать событие'}
      </button>
    </div>
  );

  return (
    <FormPageShell
      title={isEdit ? 'Редактировать событие' : 'Новое событие'}
      onBack={onBack}
      footer={footer}
    >
      <div className="space-y-4">
        <Field label="Название" required error={errors.title}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Замер квартиры" error={!!errors.title} />
        </Field>

        <Field label="Тип события" required>
          <Select value={type} onChange={(e) => setType(e.target.value as EventType)}>
            {TYPE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Дата" required error={errors.date}>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} error={!!errors.date} />
          </Field>
          <Field label="Время" required error={errors.time}>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} error={!!errors.time} />
          </Field>
        </div>

        <Field label="Объект">
          <Select value={objectId} onChange={(e) => setObjectId(e.target.value)}>
            <option value="">-- Без объекта --</option>
            {objects.map((obj) => (
              <option key={obj.id} value={obj.id}>{obj.name} — {obj.address}</option>
            ))}
          </Select>
        </Field>

        <Field label="Исполнитель">
          <Input value={reminder === 'none' ? '' : reminder} onChange={(e) => setReminder(e.target.value)} placeholder="Имя исполнителя" />
        </Field>

        <Field label="Комментарий">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Дополнительная информация..." />
        </Field>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 200, background: 'rgba(0, 0, 0, 0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              className="rounded-[20px] p-5 max-w-sm w-full text-center"
              style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-foreground mb-2">Удалить событие?</h3>
              <p className="text-sm text-muted mb-4">Это действие нельзя отменить.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-medium text-foreground"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-medium text-white"
                  style={{ background: '#EF4444' }}
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FormPageShell>
  );
}
