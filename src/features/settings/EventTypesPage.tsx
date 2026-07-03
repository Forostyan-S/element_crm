import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, Clock } from 'lucide-react';
import { FormPageShell } from '../../ui';

interface EventTypesPageProps {
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

interface EventType {
  id: string;
  name: string;
  color: string;
  icon: string;
  defaultDuration: number;
}

const defaultTypes: EventType[] = [
  { id: '1', name: 'Замер', color: '#3B82F6', icon: 'ruler', defaultDuration: 60 },
  { id: '2', name: 'Монтаж', color: '#22C55E', icon: 'hammer', defaultDuration: 480 },
  { id: '3', name: 'Доставка', color: '#F59E0B', icon: 'truck', defaultDuration: 120 },
  { id: '4', name: 'Закупка', color: '#8B5CF6', icon: 'package', defaultDuration: 90 },
  { id: '5', name: 'Встреча', color: '#EC4899', icon: 'users', defaultDuration: 60 },
  { id: '6', name: 'Созвон', color: '#14B8A6', icon: 'phone', defaultDuration: 30 },
];

const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#EC4899', '#F97316'];
const ICONS = ['ruler', 'hammer', 'truck', 'package', 'users', 'phone', 'calendar', 'home', 'zap', 'check'];

export function EventTypesPage({ onBack, onShowToast }: EventTypesPageProps) {
  const [types, setTypes] = useState<EventType[]>(defaultTypes);
  const [showForm, setShowForm] = useState(false);
  const [editType, setEditType] = useState<EventType | null>(null);
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState(COLORS[0]);
  const [formIcon, setFormIcon] = useState(ICONS[0]);
  const [formDuration, setFormDuration] = useState('60');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const openAdd = () => {
    setEditType(null);
    setFormName(''); setFormColor(COLORS[0]); setFormIcon(ICONS[0]); setFormDuration('60');
    setShowForm(true);
  };

  const openEdit = (t: EventType) => {
    setEditType(t);
    setFormName(t.name); setFormColor(t.color); setFormIcon(t.icon); setFormDuration(String(t.defaultDuration));
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    const duration = Number(formDuration) || 60;
    if (editType) {
      setTypes(types.map((t) => t.id === editType.id ? { ...t, name: formName, color: formColor, icon: formIcon, defaultDuration: duration } : t));
      onShowToast?.('Тип события обновлён');
    } else {
      setTypes([...types, { id: Date.now().toString(), name: formName, color: formColor, icon: formIcon, defaultDuration: duration }]);
      onShowToast?.('Тип события добавлен');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setTypes(types.filter((t) => t.id !== id));
    setConfirmDelete(null);
    onShowToast?.('Тип события удалён');
  };

  const fmtDuration = (min: number) => {
    if (min < 60) return `${min} мин`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}ч ${m}м` : `${h}ч`;
  };

  const inputStyle = { background: '#222938', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' } as const;

  if (showForm) {
    const footer = (
      <button onClick={handleSave} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-1.5" style={{ background: '#3B82F6' }}>
        <Check className="w-4 h-4" />
        {editType ? 'Сохранить' : 'Добавить тип'}
      </button>
    );
    return (
      <FormPageShell title={editType ? 'Редактировать тип' : 'Новый тип события'} onBack={() => setShowForm(false)} footer={footer}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-weak mb-1.5 block">Название</label>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Замер" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
          </div>
          <div>
            <label className="text-xs text-muted-weak mb-2 block">Цвет</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setFormColor(c)} className="w-9 h-9 rounded-full transition-all" style={{ background: c, border: formColor === c ? '3px solid #F1F5F9' : '3px solid transparent', transform: formColor === c ? 'scale(1.1)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-weak mb-2 block">Иконка</label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((ic) => (
                <button key={ic} onClick={() => setFormIcon(ic)} className="aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-all" style={{ background: formIcon === ic ? formColor : 'rgba(255,255,255,0.03)', color: formIcon === ic ? '#FFFFFF' : '#94A3B8', border: formIcon === ic ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-weak mb-1.5 block">Длительность по умолчанию (мин)</label>
            <input type="number" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} placeholder="60" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
          </div>
        </div>
      </FormPageShell>
    );
  }

  return (
    <FormPageShell title="Типы событий" onBack={onBack}>
      <div className="space-y-4">
        <button onClick={openAdd} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2" style={{ background: '#3B82F6' }}>
          <Plus className="w-4 h-4" />
          Добавить тип события
        </button>

        <div className="space-y-2">
          {types.map((t) => (
            <div key={t.id} className="rounded-card p-3 flex items-center gap-3" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${t.color}20` }}>
                <span className="text-xs font-bold" style={{ color: t.color }}>{t.icon.slice(0, 2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-muted-weak" />
                  <span className="text-xs text-muted-weak">{fmtDuration(t.defaultDuration)}</span>
                </div>
              </div>
              <button onClick={() => openEdit(t)} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Pencil className="w-3.5 h-3.5 text-muted-weak" />
              </button>
              <button onClick={() => setConfirmDelete(t.id)} className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <Trash2 className="w-3.5 h-3.5 text-error" />
              </button>
            </div>
          ))}
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200, background: 'rgba(0,0,0,0.7)' }} onClick={() => setConfirmDelete(null)}>
            <div className="rounded-[20px] p-5 max-w-sm w-full text-center" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-foreground mb-2">Удалить тип события?</h3>
              <p className="text-sm text-muted mb-4">Это действие нельзя отменить.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-xl font-medium text-foreground" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>Отмена</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-3 rounded-xl font-medium text-white" style={{ background: '#EF4444' }}>Удалить</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormPageShell>
  );
}
