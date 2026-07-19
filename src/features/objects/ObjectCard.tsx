import { motion } from 'framer-motion';
import {
  MapPin,
  Wallet,
  UserRound,
  MessageSquare,
} from 'lucide-react';
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

  onNumberClick?: () => void;
  onCommentClick?: () => void;

  financials?: ObjectFinancials;
  
}

const fmt = (v: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

export function ObjectCard({
  object,
  index = 0,
  onClick,
  financials,
  onNumberClick,
  onCommentClick,
}: ObjectCardProps){  
  const status = object.status as ObjectStatus;
  const color = OBJECT_STATUS_COLORS[status];
  const label = OBJECT_STATUS_LABELS[status];
  const progress = OBJECT_STATUS_PROGRESS[status] ?? object.progress ?? 0;
  const totalCost = financials?.total ?? object.total_cost ?? object.budget;
  const materialCost = financials?.materialCost ?? 0;
  const markup = financials?.markup ?? 0;
  const paid = financials?.paid ?? 0;
  const remaining = financials?.remaining ?? Math.max(0, totalCost - object.spent);
  

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
<div className="flex items-start justify-between mb-3 gap-3">

  <div className="flex-1 min-w-0">

    <h3 className="text-sm font-semibold text-foreground truncate">
      {object.name}
    </h3>

    <span
      className="inline-flex mt-1 text-2xs font-semibold px-2 py-0.5 rounded"
      style={{
        backgroundColor: `${color}25`,
        color,
      }}
    >
      {label}
    </span>

  </div>

  <button
    type="button"
    className="text-xs font-semibold text-muted hover:text-foreground transition-colors"
    onClick={(e) => {
      e.stopPropagation();
      onNumberClick?.();
    }}
  >
    {object.object_number || 'Без номера'}
  </button>

</div>

        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-muted-weak flex-shrink-0" />
          <p className="text-xs text-muted leading-5">{object.address}</p>
        </div>

        {object.client?.name && (
  <div className="flex items-center gap-1 mb-3">
    <UserRound className="w-3.5 h-3.5 text-muted-weak flex-shrink-0" />

    <p className="text-xs text-muted truncate">
      {object.client.name}
    </p>
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
          style={{
  background: object.hasNewComment
    ? 'rgba(34,197,94,.18)'
    : 'rgba(255,255,255,0.035)',

  border: object.hasNewComment
    ? '1px solid rgba(34,197,94,.5)'
    : '1px solid rgba(255,255,255,.06)',
}}
          onClick={(event) => {
  event.stopPropagation();
  onCommentClick?.();
}}
        >
          <MessageSquare className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-2xs text-muted-weak mb-0.5">Комментарий</p>
            <p className="text-xs text-muted line-clamp-2">{object.description || 'Нет комментария'}</p>
          </div>
        </button>

        
      </div>
    </motion.div>
  );
}
