import { Plus, Wrench } from 'lucide-react';
import type { WorkItem } from '../types';
import { fmt } from '../constants';

interface WorkTabProps {
  workItems: WorkItem[];
  onAddWork: () => void;
}

export function WorkTab({ workItems, onAddWork }: WorkTabProps) {
  const totalWorkCost = workItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Работы по объекту</h3>
        <span className="text-xs text-muted-weak">{workItems.length} поз.</span>
      </div>

      {workItems.length > 0 ? (
        <>
          {workItems.map((work) => (
            <div
              key={work.id}
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{work.name}</p>
                  <p className="text-xs text-muted-weak">{work.quantity} {work.unit} x {fmt(work.pricePerUnit)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{fmt(work.total)}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-xl p-3 mt-4" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-foreground">Итого работы</span>
              <span className="text-base font-bold text-accent">{fmt(totalWorkCost)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Wrench className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-weak">Нет добавленных работ</p>
        </div>
      )}

      <button
        onClick={onAddWork}
        className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
        style={{ background: '#3B82F6', color: '#FFFFFF' }}
      >
        <Plus className="w-5 h-5" />
        Добавить работу
      </button>
    </div>
  );
}
