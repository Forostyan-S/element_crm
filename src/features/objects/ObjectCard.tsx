import { motion } from 'framer-motion';
import { Building2, MapPin, TrendingUp, Percent, Wallet, Package, History } from 'lucide-react';
import {
  OBJECT_STATUS_LABELS,
  OBJECT_STATUS_COLORS,
  OBJECT_STATUS_PROGRESS,
  type ConstructionObject,
  type ObjectStatus,
} from '../../types';

interface ObjectCardProps {
  object: ConstructionObject;
  index?: number;
  onClick?: () => void;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

export function ObjectCard({ object, index = 0, onClick }: ObjectCardProps) {
  const status = object.status as ObjectStatus;
  const color = OBJECT_STATUS_COLORS[status];
  const label = OBJECT_STATUS_LABELS[status];
  const progress = OBJECT_STATUS_PROGRESS[status] ?? object.progress ?? 0;
  const margin = object.budget > 0 ? (object.profit / object.budget) * 100 : 0;
  const received = object.budget > 0 ? Math.min(object.spent + object.profit * 0.5, object.budget) : 0;
  const remaining = object.budget - received;

  return (
    <motion.div
      className="relative overflow-hidden rounded-card cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #1a2035 0%, #1B2130 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
      onClick={onClick}
    >
      {/* Color top stripe */}
      <div className="h-1 w-full" style={{ backgroundColor: color }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground truncate">{object.name}</h3>
              <span
                className="text-2xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ backgroundColor: `${color}25`, color }}
              >
                {label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted-weak flex-shrink-0" />
              <p className="text-xs text-muted truncate">{object.address}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs text-muted-weak">Прогресс</span>
            <span className="text-xs font-semibold" style={{ color }}>{progress}%</span>
          </div>
          <div className="h-1 bg-card-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
            />
          </div>
        </div>

        {/* Finance Block */}
        <div className="rounded-xl p-2.5 mb-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Wallet className="w-3.5 h-3.5 text-accent" />
            <span className="text-2xs font-medium text-muted">Финансы объекта</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-2xs text-muted-weak">Бюджет</p>
              <p className="text-xs font-semibold text-foreground">{fmt(object.budget)}</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Расходы</p>
              <p className="text-xs font-semibold text-error">{fmt(object.spent)}</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Прибыль</p>
              <p className="text-xs font-semibold text-success">{fmt(object.profit)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border">
            <div>
              <p className="text-2xs text-muted-weak">Маржа</p>
              <div className="flex items-center gap-0.5">
                <Percent className="w-2.5 h-2.5 text-warning" />
                <p className="text-xs font-semibold text-warning">{margin.toFixed(0)}%</p>
              </div>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Оплачено</p>
              <p className="text-xs font-semibold text-foreground">{fmt(received)}</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Осталось</p>
              <p className="text-xs font-semibold text-muted">{fmt(remaining)}</p>
            </div>
          </div>
        </div>

        {/* Materials Block */}
        <div className="rounded-xl p-2.5" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Package className="w-3.5 h-3.5 text-accent" />
            <span className="text-2xs font-medium text-muted">Материалы</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-2xs text-muted-weak">Закуплено</p>
              <p className="text-xs font-semibold text-foreground">—</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Списано</p>
              <p className="text-xs font-semibold text-muted">—</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Остаток</p>
              <p className="text-xs font-semibold text-muted">—</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
