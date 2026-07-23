import { AnimatePresence, motion } from 'framer-motion';
import { X, Clock3 } from 'lucide-react';
import { useMemo } from 'react';
import { useStore } from '../../store';
import { zIndex } from '../../utils/zIndex';
import type { ObjectHistoryEntry } from '../../types';

const ACTION_LABELS: Record<string, string> = {
  object_created: 'Создание объекта',
  object_updated: 'Редактирование объекта',
  work_added: 'Добавлена работа',
  material_added: 'Добавлен материал',
  comment_updated: 'Комментарий обновлён',
  number_updated: 'Номер объекта обновлён',
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ObjectHistoryModalProps {
  objectId: string;
  onClose: () => void;
}

export function ObjectHistoryModal({ objectId, onClose }: ObjectHistoryModalProps) {
  const { objectHistory } = useStore();

  const entries = useMemo<ObjectHistoryEntry[]>(() => {
    return objectHistory
      .filter((entry) => entry.object_id === objectId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [objectHistory, objectId]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.55)', zIndex: zIndex.dialog }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-xl rounded-2xl overflow-hidden"
          style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-muted-weak" />
              <h2 className="text-lg font-semibold text-foreground">История объекта</h2>
            </div>
            <button onClick={onClose} className="text-muted-weak hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-5 space-y-4">
            {entries.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-weak">История пока пуста</div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm font-semibold text-foreground">
                      {ACTION_LABELS[entry.action_type] ?? entry.action_type}
                    </span>
                    <span className="text-2xs text-muted-weak">{formatDate(entry.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted">{entry.description}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
