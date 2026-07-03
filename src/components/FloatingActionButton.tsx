import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Building2, Wallet, Calendar } from 'lucide-react';
import { useStore } from '../store';
import { zIndex } from '../utils/zIndex';

const fabItems = [
  { id: 'object', label: 'Новый объект', icon: Building2, color: '#3B82F6' },
  { id: 'transaction', label: 'Новая транзакция', icon: Wallet, color: '#22C55E' },
  { id: 'event', label: 'Новое событие', icon: Calendar, color: '#F59E0B' },
];

const FAB_VISIBLE_SCREENS = ['home', 'objects', 'calendar', 'finances', 'warehouse'];

interface FloatingActionButtonProps {
  onAction?: (action: string) => void;
}

export function FloatingActionButton({ onAction }: FloatingActionButtonProps) {
  const { isFabOpen, toggleFab, setIsFabOpen, activeTab, isModalOpen } = useStore();

  const shouldShowFab = FAB_VISIBLE_SCREENS.includes(activeTab) && !isModalOpen;

  const handleItemClick = (id: string) => {
    setIsFabOpen(false);
    setTimeout(() => onAction?.(id), 250);
  };

  if (!shouldShowFab) return null;

  return (
    <>
      {/* Backdrop — closes menu on outside click */}
      <AnimatePresence>
        {isFabOpen && (
          <motion.div
            className="fixed inset-0"
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              zIndex: zIndex.fabBackdrop,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFabOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Speed Dial actions + FAB container — above backdrop so blur never affects buttons */}
      <div
        className="fixed right-4 flex flex-col items-end gap-3"
        style={{
          bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
          zIndex: zIndex.fabSheet,
        }}
      >
        {/* Action items */}
        <AnimatePresence>
          {isFabOpen && (
            <div className="flex flex-col items-end gap-3">
              {fabItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.6 }}
                  transition={{
                    type: 'spring',
                    damping: 18,
                    stiffness: 260,
                    delay: index * 0.05,
                  }}
                  onClick={() => handleItemClick(item.id)}
                >
                  {/* Label */}
                  <span
                    className="text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap"
                    style={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      color: '#F1F5F9',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Icon circle */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: item.color,
                      boxShadow: `0 4px 12px ${item.color}40`,
                    }}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB button — 56×56, rotates 45° on open */}
        <motion.button
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: '#3B82F6',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFab}
        >
          <motion.div
            animate={{ rotate: isFabOpen ? 45 : 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <Plus className="w-7 h-7 text-white" />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
