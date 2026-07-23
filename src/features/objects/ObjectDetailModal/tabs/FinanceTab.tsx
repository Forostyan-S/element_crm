import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { ConstructionObject } from '../../../../types';
import { fmt } from '../constants';

interface FinanceTabProps {
  object: ConstructionObject;
}

export function FinanceTab({ object }: FinanceTabProps) {
  const margin = object.budget > 0 ? (object.profit / object.budget) * 100 : 0;
  const myShare = object.profit / 2;
  const received = object.spent + object.profit * 0.5;
  const remaining = object.budget - received;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-weak">Доходы</span>
          </div>
          <p className="text-base font-bold text-success">{fmt(object.budget)}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4 text-error" />
            <span className="text-xs text-muted-weak">Расходы</span>
          </div>
          <p className="text-base font-bold text-error">{fmt(object.spent)}</p>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-medium text-foreground">Финансы объекта</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted">Бюджет</span>
            <span className="text-sm font-medium text-foreground">{fmt(object.budget)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Расходы</span>
            <span className="text-sm font-medium text-error">{fmt(object.spent)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Прибыль</span>
            <span className="text-sm font-medium text-success">{fmt(object.profit)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border/50">
            <span className="text-sm text-muted">Маржа</span>
            <span className="text-sm font-bold text-warning">{margin.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Оплачено</span>
            <span className="text-sm font-medium text-foreground">{fmt(received)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Осталось получить</span>
            <span className="text-sm font-medium text-warning">{fmt(Math.max(0, remaining))}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border/50">
            <span className="text-sm font-medium text-foreground">Моя доля (50%)</span>
            <span className="text-base font-bold text-warning">{fmt(myShare)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
