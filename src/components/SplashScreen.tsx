import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { zIndex } from '../utils/zIndex';

interface SplashScreenProps {
  isVisible: boolean;
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            background: '#0F1115',
            zIndex: zIndex.splash,
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Logo */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
          >
            <div
              className="w-20 h-20 rounded-[24px] flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                boxShadow: '0 0 40px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 180, delay: 0.25 }}
              >
                <Zap className="w-10 h-10 text-white" fill="white" strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>

          {/* App name */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Element<span className="text-accent">CRM</span>
            </h1>
            <p className="text-xs text-muted-weak mt-1 tracking-wide">
              Электромонтаж под контролем
            </p>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            className="absolute bottom-16 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #3B82F6, #60A5FA)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.3 }}
              />
            </div>
            <p className="text-2xs text-muted-weak">Загрузка...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
