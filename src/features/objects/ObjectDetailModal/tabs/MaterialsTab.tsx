import { Package } from 'lucide-react';
import type { ObjectMaterial } from '../types';
import { fmt } from '../constants';

interface MaterialsTabProps {
  materials: ObjectMaterial[];
  onAddMaterial: () => void;
}

export function MaterialsTab({ materials, onAddMaterial }: MaterialsTabProps) {
  const totalMaterialsCost = materials.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Списанные материалы</h3>
        <span className="text-xs text-muted-weak">{materials.length} поз.</span>
      </div>

      {materials.length > 0 ? (
        <>
          {materials.map((material) => (
            <div
              key={material.id}
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{material.name}</p>
                  <p className="text-xs text-muted-weak">{material.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{material.quantity} {material.unit}</p>
                  <p className="text-xs text-muted">{fmt(material.quantity * material.price)}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-xl p-3 mt-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-foreground">Итого материалы</span>
              <span className="text-base font-bold text-warning">{fmt(totalMaterialsCost)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-weak">Нет материалов</p>
        </div>
      )}

      <button
        onClick={onAddMaterial}
        className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
        style={{ background: '#3B82F6', color: '#FFFFFF' }}
      >
        <span className="w-5 h-5">+</span>
        Добавить материал
      </button>
    </div>
  );
}
