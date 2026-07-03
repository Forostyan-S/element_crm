import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  icon: LucideIcon;
  color: string;
  delay?: number;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export function KPICard({ title, value, subtitle, change, icon: Icon, color, delay = 0, size = 'md', onClick }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;

  const content = (
    <>
      {/* Background glow */}
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className={`relative ${size === 'sm' ? 'p-3' : 'p-3.5'}`}>
        <div className="flex items-start justify-between mb-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-0.5 text-2xs font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
            </div>
          )}
        </div>
        <p className="text-2xs text-muted-weak mb-0.5 leading-tight">{title}</p>
        <p className={`font-bold text-foreground leading-tight ${size === 'sm' ? 'text-base' : 'text-lg'}`}>{value}</p>
        {subtitle && <p className="text-2xs text-muted-weak mt-0.5">{subtitle}</p>}
      </div>
    </>
  );

  if (onClick) {
    return (
      <motion.button
        className="relative overflow-hidden rounded-card w-full text-left"
        style={{
          background: `linear-gradient(135deg, ${color}08 0%, #1B2130 100%)`,
          border: `1px solid ${color}25`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.25 }}
        whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-card"
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, #1B2130 100%)`,
        border: `1px solid ${color}25`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
    >
      {content}
    </motion.div>
  );
}
