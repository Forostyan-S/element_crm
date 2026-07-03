import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';
import { zIndex } from '../utils/zIndex';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-lg"
          style={{
            background: '#1E293B',
            border: '1px solid #334155',
            maxWidth: 'calc(100% - 32px)',
            zIndex: zIndex.toast,
            top: 'calc(1rem + env(safe-area-inset-top, 0px))',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#22C55E' }} />
          <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
            {message}
          </span>
          <button onClick={onClose} className="ml-2 p-1 -mr-1">
            <X className="w-4 h-4" style={{ color: '#94A3B8' }} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
