import { useState } from 'react';
import { AlertTriangle, Trash2, Download, RotateCcw, Building2, Package, Database, LogOut } from 'lucide-react';
import { FormPageShell } from '../../ui';

interface DangerZonePageProps {
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

type ConfirmAction = 'testData' | 'resetSettings' | 'deleteObjects' | 'deleteMaterials' | 'wipeAll' | 'logout' | null;

export function DangerZonePage({ onBack, onShowToast }: DangerZonePageProps) {
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [exportBefore, setExportBefore] = useState(true);

  const actions: { id: ConfirmAction; icon: typeof Trash2; label: string; desc: string; color: string }[] = [
    { id: 'testData', icon: Trash2, label: 'Очистить тестовые данные', desc: 'Удалить демо-объекты и материалы', color: '#F59E0B' },
    { id: 'resetSettings', icon: RotateCcw, label: 'Сбросить настройки', desc: 'Вернуть настройки по умолчанию', color: '#F97316' },
    { id: 'deleteObjects', icon: Building2, label: 'Удалить все объекты', desc: 'Безвозвратно удалить все объекты', color: '#EF4444' },
    { id: 'deleteMaterials', icon: Package, label: 'Удалить все материалы', desc: 'Очистить склад полностью', color: '#EF4444' },
    { id: 'wipeAll', icon: Database, label: 'Полностью очистить CRM', desc: 'Удалить все данные безвозвратно', color: '#DC2626' },
    { id: 'logout', icon: LogOut, label: 'Выйти из аккаунта', desc: 'Завершить текущую сессию', color: '#64748B' },
  ];

  const handleConfirm = () => {
    if (!confirm) return;
    const action = actions.find((a) => a.id === confirm);
    onShowToast?.(`${action?.label} — выполнено`);
    setConfirm(null);
  };

  return (
    <FormPageShell title="Опасная зона" onBack={onBack}>
      <div className="space-y-5">
        <div className="rounded-card p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, #1B2130 100%)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="w-10 h-10 rounded-xl bg-error/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Опасная зона</p>
            <p className="text-xs text-muted-weak">Действия необратимы — будьте осторожны</p>
          </div>
        </div>

        {/* Export before delete toggle */}
        <div className="rounded-card p-4 flex items-center justify-between" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">Экспортировать перед удалением</p>
              <p className="text-xs text-muted-weak">Создать бэкап перед опасными действиями</p>
            </div>
          </div>
          <button onClick={() => setExportBefore(!exportBefore)} className={`relative w-12 h-6 rounded-full transition-colors ${exportBefore ? 'bg-success' : 'bg-card-elevated'}`}>
            <div className="absolute w-5 h-5 rounded-full bg-white shadow-md top-0.5 transition-all" style={{ left: exportBefore ? '26px' : '2px' }} />
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => setConfirm(action.id)}
              className="w-full rounded-card p-3 flex items-center gap-3 transition-all text-left"
              style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${action.color}20` }}>
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: action.color }}>{action.label}</p>
                <p className="text-xs text-muted-weak">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200, background: 'rgba(0,0,0,0.7)' }} onClick={() => setConfirm(null)}>
          <div className="rounded-[20px] p-5 max-w-sm w-full text-center" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{actions.find((a) => a.id === confirm)?.label}</h3>
            <p className="text-sm text-muted mb-4">Вы уверены? Это действие нельзя отменить.</p>
            {exportBefore && <p className="text-xs text-accent mb-4">Перед удалением будет создан экспорт данных</p>}
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="flex-1 py-3 rounded-xl font-medium text-foreground" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>Отмена</button>
              <button onClick={handleConfirm} className="flex-1 py-3 rounded-xl font-medium text-white" style={{ background: '#EF4444' }}>Подтвердить</button>
            </div>
          </div>
        </div>
      )}
    </FormPageShell>
  );
}
