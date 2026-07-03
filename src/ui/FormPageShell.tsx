import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { zIndex } from '../utils/zIndex';

interface FormPageShellProps {
  title: string;
  onBack: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function FormPageShell({ title, onBack, children, footer }: FormPageShellProps) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col"
      style={{ background: '#0F1115', zIndex: zIndex.modal }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      <header
        className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
        style={{
          paddingTop: 'calc(0.875rem + env(safe-area-inset-top, 0px))',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(15,17,21,0.88)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-card-elevated transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4" style={{ paddingBottom: footer ? '1rem' : 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
          {children}
        </div>
      </div>

      {footer && (
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{
            paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(15,17,21,0.88)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {footer}
        </div>
      )}
    </motion.div>
  );
}
