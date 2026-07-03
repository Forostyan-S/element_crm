import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { FormPageShell } from '../../ui';

interface FinanceCategoriesPageProps {
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

interface FinanceCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

const defaultCategories: FinanceCategory[] = [
  { id: '1', name: 'Оплата работ', color: '#22C55E', icon: 'wallet', type: 'income' },
  { id: '2', name: 'Аванс', color: '#3B82F6', icon: 'banknote', type: 'income' },
  { id: '3', name: 'Доп. услуги', color: '#14B8A6', icon: 'plus', type: 'income' },
  { id: '4', name: 'Материалы', color: '#F59E0B', icon: 'package', type: 'expense' },
  { id: '5', name: 'Зарплата', color: '#EF4444', icon: 'users', type: 'expense' },
  { id: '6', name: 'Транспорт', color: '#8B5CF6', icon: 'truck', type: 'expense' },
  { id: '7', name: 'Инструмент', color: '#EC4899', icon: 'hammer', type: 'expense' },
];

const COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#EC4899', '#F97316', '#64748B'];
const ICONS = ['wallet', 'banknote', 'plus', 'package', 'users', 'truck', 'hammer', 'home', 'calendar', 'phone'];

export function FinanceCategoriesPage({ onBack, onShowToast }: FinanceCategoriesPageProps) {
  const [categories, setCategories] = useState<FinanceCategory[]>(defaultCategories);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<FinanceCategory | null>(null);
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState(COLORS[0]);
  const [formIcon, setFormIcon] = useState(ICONS[0]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = categories.filter((c) => c.type === activeTab);

  const openAdd = () => {
    setEditCat(null);
    setFormName(''); setFormColor(COLORS[0]); setFormIcon(ICONS[0]);
    setShowForm(true);
  };

  const openEdit = (c: FinanceCategory) => {
    setEditCat(c);
    setFormName(c.name); setFormColor(c.color); setFormIcon(c.icon);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editCat) {
      setCategories(categories.map((c) => c.id === editCat.id ? { ...c, name: formName, color: formColor, icon: formIcon } : c));
      onShowToast?.('Категория обновлена');
    } else {
      setCategories([...categories, { id: Date.now().toString(), name: formName, color: formColor, icon: formIcon, type: activeTab }]);
      onShowToast?.('Категория добавлена');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    setConfirmDelete(null);
    onShowToast?.('Категория удалена');
  };

  const inputStyle = { background: '#222938', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' } as const;

  if (showForm) {
    const footer = (
      <button onClick={handleSave} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-1.5" style={{ background: '#3B82F6' }}>
        <Check className="w-4 h-4" />
        {editCat ? 'Сохранить' : 'Добавить категорию'}
      </button>
    );
    return (
      <FormPageShell title={editCat ? 'Редактировать категорию' : 'Новая категория'} onBack={() => setShowForm(false)} footer={footer}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-weak mb-1.5 block">Название</label>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Оплата работ" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
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
        </div>
      </FormPageShell>
    );
  }

  return (
    <FormPageShell title="Категории финансов" onBack={onBack}>
      <div className="space-y-4">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setActiveTab('income')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: activeTab === 'income' ? 'rgba(34,197,94,0.2)' : 'transparent', color: activeTab === 'income' ? '#22C55E' : '#94A3B8' }}>
            <TrendingUp className="w-4 h-4" /> Доход
          </button>
          <button onClick={() => setActiveTab('expense')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: activeTab === 'expense' ? 'rgba(239,68,68,0.2)' : 'transparent', color: activeTab === 'expense' ? '#EF4444' : '#94A3B8' }}>
            <TrendingDown className="w-4 h-4" /> Расход
          </button>
        </div>

        <button onClick={openAdd} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2" style={{ background: '#3B82F6' }}>
          <Plus className="w-4 h-4" />
          Добавить категорию
        </button>

        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-card p-3 flex items-center gap-3" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}20` }}>
                <span className="text-xs font-bold" style={{ color: c.color }}>{c.icon.slice(0, 2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-xs text-muted-weak">{c.icon}</span>
                </div>
              </div>
              <button onClick={() => openEdit(c)} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Pencil className="w-3.5 h-3.5 text-muted-weak" />
              </button>
              <button onClick={() => setConfirmDelete(c.id)} className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <Trash2 className="w-3.5 h-3.5 text-error" />
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-sm text-muted-weak py-8">Нет категорий</p>}
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200, background: 'rgba(0,0,0,0.7)' }} onClick={() => setConfirmDelete(null)}>
            <div className="rounded-[20px] p-5 max-w-sm w-full text-center" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-foreground mb-2">Удалить категорию?</h3>
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
