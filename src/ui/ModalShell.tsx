import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { zIndex } from '../utils/zIndex';
import { useStore } from '../store';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export function ModalShell({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-md' }: ModalShellProps) {
  const setIsModalOpen = useStore((s) => s.setIsModalOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
    return () => setIsModalOpen(false);
  }, [isOpen, setIsModalOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
            className={`fixed inset-x-4 top-1/2 -translate-y-1/2 ${maxWidth} mx-auto rounded-[20px] overflow-hidden max-h-[85vh] flex flex-col`}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
              zIndex: zIndex.modal,
            }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
              }}
            >
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl transition-colors hover:bg-white/5"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className="px-5 py-4 flex-shrink-0"
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
