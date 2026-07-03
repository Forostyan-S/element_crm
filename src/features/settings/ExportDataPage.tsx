import { useState } from 'react';
import { Download, Building2, Wallet, Package, Calendar, Database, Check, FileText, FileSpreadsheet, FileJson, FileType } from 'lucide-react';
import { FormPageShell } from '../../ui';

interface ExportDataPageProps {
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

const EXPORT_ITEMS = [
  { id: 'objects', label: 'Экспорт объектов', icon: Building2, color: '#3B82F6', desc: 'Все объекты и клиенты' },
  { id: 'finance', label: 'Экспорт финансов', icon: Wallet, color: '#22C55E', desc: 'Доходы и расходы' },
  { id: 'warehouse', label: 'Экспорт склада', icon: Package, color: '#14B8A6', desc: 'Материалы и операции' },
  { id: 'calendar', label: 'Экспорт календаря', icon: Calendar, color: '#F59E0B', desc: 'События и задачи' },
  { id: 'all', label: 'Экспорт всего проекта', icon: Database, color: '#8B5CF6', desc: 'Полный бэкап данных' },
];

const FORMATS = [
  { id: 'csv', label: 'CSV', icon: FileText },
  { id: 'excel', label: 'Excel', icon: FileSpreadsheet },
  { id: 'json', label: 'JSON', icon: FileJson },
  { id: 'pdf', label: 'PDF', icon: FileType },
];

export function ExportDataPage({ onBack, onShowToast }: ExportDataPageProps) {
  const [selectedItem, setSelectedItem] = useState('objects');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      const item = EXPORT_ITEMS.find((i) => i.id === selectedItem);
      const fmt = FORMATS.find((f) => f.id === selectedFormat);
      onShowToast?.(`Экспорт "${item?.label}" в ${fmt?.label} готов`);
    }, 1500);
  };

  const footer = (
    <button onClick={handleExport} disabled={exporting} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2" style={{ background: '#3B82F6', opacity: exporting ? 0.6 : 1 }}>
      {exporting ? (
        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Экспорт...</>
      ) : (
        <><Download className="w-4 h-4" />Экспортировать</>
      )}
    </button>
  );

  return (
    <FormPageShell title="Экспорт данных" onBack={onBack} footer={footer}>
      <div className="space-y-5">
        <div className="rounded-card p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, #1B2130 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Download className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Экспорт данных</p>
            <p className="text-xs text-muted-weak">Выберите данные и формат</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-weak mb-3 uppercase tracking-wider">Что экспортировать</h3>
          <div className="space-y-2">
            {EXPORT_ITEMS.map((item) => {
              const isSelected = selectedItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className="w-full rounded-card p-3 flex items-center gap-3 transition-all text-left"
                  style={{
                    background: isSelected ? `${item.color}10` : '#1B2130',
                    border: isSelected ? `1px solid ${item.color}40` : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-weak">{item.desc}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-weak mb-3 uppercase tracking-wider">Формат</h3>
          <div className="grid grid-cols-4 gap-2">
            {FORMATS.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className="rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all"
                  style={{
                    background: isSelected ? '#3B82F6' : '#1B2130',
                    border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  <fmt.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{fmt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </FormPageShell>
  );
}
