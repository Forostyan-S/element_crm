import { motion } from 'framer-motion';
import { MapPin, Wallet, UserRound, MessageSquare, Plus, Pencil, FolderOpen } from 'lucide-react';
import {
  OBJECT_STATUS_LABELS,
  OBJECT_STATUS_COLORS,
  OBJECT_STATUS_PROGRESS,
  type ConstructionObject,
  type ObjectStatus,
} from '../../types';
import type { ObjectFinancials } from './objectFinancials';

interface ObjectCardProps {
  object: ConstructionObject;
  index?: number;
  onClick?: () => void;
  financials?: ObjectFinancials;
  onQuickAction?: (action: 'material' | 'work' | 'payment' | 'edit' | 'open') => void;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

export function ObjectCard({ object, index = 0, onClick, financials, onQuickAction }: ObjectCardProps) {
  const status = object.status as ObjectStatus;
  const color = OBJECT_STATUS_COLORS[status];
  const label = OBJECT_STATUS_LABELS[status];
  const progress = OBJECT_STATUS_PROGRESS[status] ?? object.progress ?? 0;
  const totalCost = financials?.total ?? object.total_cost ?? object.budget;
  const materialCost = financials?.materialCost ?? 0;
  const markup = financials?.markup ?? 0;
  const paid = financials?.paid ?? 0;
  const remaining = financials?.remaining ?? Math.max(0, totalCost - object.spent);
  const clientInitials = object.client?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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

        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-muted-weak flex-shrink-0" />
          <p className="text-xs text-muted leading-5">{object.address}</p>
        </div>

        {object.client ? (
          <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-3" style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.16)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}>
              {clientInitials || <UserRound className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xs text-muted-weak">Клиент</p>
              <p className="text-sm font-medium text-foreground truncate">{object.client.name}</p>
            </div>
            {object.client.phone && <p className="text-xs text-muted whitespace-nowrap">{object.client.phone}</p>}
          </div>
        ) : (
          <div className="rounded-xl px-3 py-2.5 mb-3" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-2xs text-muted-weak">Клиент</p>
            <p className="text-sm text-muted">Клиент не назначен</p>
          </div>
        )}

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
              <p className="text-2xs text-muted-weak">Работы</p>
              <p className="text-xs font-semibold text-foreground">{fmt(financials?.workCost ?? 0)}</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Материалы</p>
              <p className="text-xs font-semibold text-foreground">{fmt(materialCost)}</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Наценка</p>
              <p className="text-xs font-semibold text-success">{fmt(markup)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border/60">
            <div>
              <p className="text-2xs text-muted-weak">Итого</p>
              <p className="text-xs font-semibold text-foreground">{fmt(totalCost)}</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Оплачено</p>
              <p className="text-xs font-semibold text-success">{fmt(paid)}</p>
            </div>
            <div>
              <p className="text-2xs text-muted-weak">Осталось</p>
              <p className="text-xs font-semibold text-warning">{fmt(remaining)}</p>
            </div>
          </div>
        </div>

        <button
          className="w-full text-left flex items-start gap-2 rounded-xl p-2.5 mb-3 transition-colors"
          style={{ background: 'rgba(255,255,255,0.035)' }}
          onClick={(event) => { event.stopPropagation(); onClick?.(); }}
        >
          <MessageSquare className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-2xs text-muted-weak mb-0.5">Комментарий</p>
            <p className="text-xs text-muted line-clamp-2">{object.description || 'Нет комментария'}</p>
          </div>
        </button>

        {onQuickAction && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60">
            {[
              { id: 'material' as const, label: 'Материал', icon: Plus },
              { id: 'work' as const, label: 'Работа', icon: Plus },
              { id: 'payment' as const, label: 'Платёж', icon: Wallet },
              { id: 'edit' as const, label: 'Изменить', icon: Pencil },
              { id: 'open' as const, label: 'Открыть', icon: FolderOpen },
            ].map((action) => (
              <button
                key={action.id}
                onClick={(event) => { event.stopPropagation(); onQuickAction(action.id); }}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-2xs font-medium text-muted hover:text-foreground"
                style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
