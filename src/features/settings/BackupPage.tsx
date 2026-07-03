import { useState } from 'react';
import { HardDrive, Download, RotateCcw, Check, Cloud, Calendar } from 'lucide-react';
import { FormPageShell } from '../../ui';

interface BackupPageProps {
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

export function BackupPage({ onBack, onShowToast }: BackupPageProps) {
  const [autoBackup, setAutoBackup] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      onShowToast?.('Резервная копия создана');
    }, 1500);
  };

  const handleRestore = () => onShowToast?.('Восстановление из резервной копии...');
  const handleDownload = () => onShowToast?.('Скачивание резервной копии...');

  const inputStyle = { background: '#222938', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' } as const;

  return (
    <FormPageShell title="Резервное копирование" onBack={onBack}>
      <div className="space-y-5">
        <div className="rounded-card p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, #1B2130 100%)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Резервное копирование</p>
            <p className="text-xs text-muted-weak">Защитите свои данные</p>
          </div>
        </div>

        {/* Last backup */}
        <div>
          <h3 className="text-xs font-semibold text-muted-weak mb-3 uppercase tracking-wider">Последняя резервная копия</h3>
          <div className="rounded-card p-4 space-y-3" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-weak">Дата</span>
              <span className="text-sm font-medium text-foreground">2 июля 2026, 14:30</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-weak">Размер</span>
              <span className="text-sm font-medium text-foreground">4.2 МБ</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-weak">Статус</span>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
                <Check className="w-3 h-3" /> Успешно
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button onClick={handleCreate} disabled={creating} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2" style={{ background: '#3B82F6', opacity: creating ? 0.6 : 1 }}>
            {creating ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Создание...</> : <><HardDrive className="w-4 h-4" />Создать резервную копию</>}
          </button>
          <button onClick={handleRestore} className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9' }}>
            <RotateCcw className="w-4 h-4" />Восстановить
          </button>
          <button onClick={handleDownload} className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F1F5F9' }}>
            <Download className="w-4 h-4" />Скачать
          </button>
        </div>

        {/* Auto backup */}
        <div>
          <h3 className="text-xs font-semibold text-muted-weak mb-3 uppercase tracking-wider">Автоматическое резервное копирование</h3>
          <div className="rounded-card overflow-hidden" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium text-foreground">Автоматическое копирование</p>
                <p className="text-xs text-muted-weak">Создавать бэкап по расписанию</p>
              </div>
              <button onClick={() => setAutoBackup(!autoBackup)} className={`relative w-12 h-6 rounded-full transition-colors ${autoBackup ? 'bg-success' : 'bg-card-elevated'}`}>
                <div className="absolute w-5 h-5 rounded-full bg-white shadow-md top-0.5 transition-all" style={{ left: autoBackup ? '26px' : '2px' }} />
              </button>
            </div>
            {autoBackup && (
              <div className="border-t border-border px-4 py-3.5">
                <label className="text-xs text-muted-weak mb-2 block">Период</label>
                <div className="flex gap-2">
                  {([
                    { v: 'day', l: 'Каждый день' },
                    { v: 'week', l: 'Каждую неделю' },
                    { v: 'month', l: 'Каждый месяц' },
                  ] as const).map((p) => (
                    <button
                      key={p.v}
                      onClick={() => setPeriod(p.v)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
                      style={{
                        background: period === p.v ? '#3B82F6' : 'rgba(255,255,255,0.03)',
                        color: period === p.v ? '#FFFFFF' : '#94A3B8',
                        border: period === p.v ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Calendar className="w-3 h-3" />
                      {p.l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormPageShell>
  );
}
