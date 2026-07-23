import { AnimatePresence, motion } from 'framer-motion';

interface DeleteObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteObjectModal({ isOpen, onClose, onDelete }: DeleteObjectModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 200, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="rounded-[20px] p-5 max-w-sm w-full text-center"
          style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-base font-semibold text-foreground mb-2">Удалить объект?</h3>
          <p className="text-sm text-muted mb-4">Это действие нельзя отменить. Объект будет удален безвозвратно.</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium text-foreground"
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              Отмена
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-3 rounded-xl font-medium text-white"
              style={{ background: '#EF4444' }}
            >
              Удалить
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
