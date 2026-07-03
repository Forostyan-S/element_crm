import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Hammer, Check } from 'lucide-react';
import { FormPageShell } from '../../ui';

interface ServiceCatalogPageProps {
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

interface Service {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  description?: string;
}

const defaultServices: Service[] = [
  { id: '1', name: 'Монтаж розетки', category: 'Электромонтаж', unit: 'шт', price: 450, description: 'Установка внутренней розетки' },
  { id: '2', name: 'Прокладка кабеля', category: 'Электромонтаж', unit: 'м', price: 80, description: 'ВВГ 3×2.5 в гофре' },
  { id: '3', name: 'Установка автомата', category: 'Щитовое оборудование', unit: 'шт', price: 350 },
  { id: '4', name: 'Сборка электрощита', category: 'Щитовое оборудование', unit: 'шт', price: 5000, description: 'До 12 модулей' },
  { id: '5', name: 'Монтаж светильника', category: 'Освещение', unit: 'шт', price: 600 },
  { id: '6', name: 'Замер сопротивления', category: 'Проверка', unit: 'точка', price: 250 },
];

const CATEGORIES = ['Электромонтаж', 'Щитовое оборудование', 'Освещение', 'Проверка', 'Монтаж', 'Прочее'];
const UNITS = ['шт', 'м', 'м²', 'м³', 'кг', 'л', 'точка', 'компл'];

export function ServiceCatalogPage({ onBack, onShowToast }: ServiceCatalogPageProps) {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formUnit, setFormUnit] = useState(UNITS[0]);
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditService(null);
    setFormName('');
    setFormCategory(CATEGORIES[0]);
    setFormUnit(UNITS[0]);
    setFormPrice('');
    setFormDescription('');
    setShowForm(true);
  };

  const openEdit = (s: Service) => {
    setEditService(s);
    setFormName(s.name);
    setFormCategory(s.category);
    setFormUnit(s.unit);
    setFormPrice(String(s.price));
    setFormDescription(s.description || '');
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPrice) return;
    const price = Number(formPrice);
    if (editService) {
      setServices(services.map((s) => s.id === editService.id ? { ...s, name: formName, category: formCategory, unit: formUnit, price, description: formDescription } : s));
      onShowToast?.('Услуга обновлена');
    } else {
      setServices([...services, { id: Date.now().toString(), name: formName, category: formCategory, unit: formUnit, price, description: formDescription }]);
      onShowToast?.('Услуга добавлена');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
    setConfirmDelete(null);
    onShowToast?.('Услуга удалена');
  };

  const fmt = (v: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);

  const inputStyle = { background: '#222938', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' } as const;

  if (showForm) {
    const footer = (
      <button onClick={handleSave} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-1.5" style={{ background: '#3B82F6' }}>
        <Check className="w-4 h-4" />
        {editService ? 'Сохранить' : 'Добавить услугу'}
      </button>
    );
    return (
      <FormPageShell title={editService ? 'Редактировать услугу' : 'Новая услуга'} onBack={() => setShowForm(false)} footer={footer}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-weak mb-1.5 block">Название</label>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Монтаж розетки" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
          </div>
          <div>
            <label className="text-xs text-muted-weak mb-1.5 block">Категория</label>
            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-weak mb-1.5 block">Единица</label>
              <select value={formUnit} onChange={(e) => setFormUnit(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-weak mb-1.5 block">Цена</label>
              <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="450" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-weak mb-1.5 block">Описание</label>
            <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Дополнительная информация..." rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm resize-none" style={inputStyle} />
          </div>
        </div>
      </FormPageShell>
    );
  }

  return (
    <FormPageShell title="Каталог услуг" onBack={onBack}>
      <div className="space-y-4">
        {/* Header card */}
        <div className="rounded-card p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, #1B2130 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Hammer className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Каталог услуг</p>
            <p className="text-xs text-muted-weak">{services.length} услуг</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-weak" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск услуги..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" style={inputStyle} />
        </div>

        {/* Add button */}
        <button onClick={openAdd} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2" style={{ background: '#3B82F6' }}>
          <Plus className="w-4 h-4" />
          Добавить услугу
        </button>

        {/* List */}
        <div className="space-y-2">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-card p-3" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-weak">{s.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-foreground">{fmt(s.price)}</p>
                  <p className="text-xs text-muted-weak">/{s.unit}</p>
                </div>
              </div>
              {s.description && <p className="text-xs text-muted mt-1">{s.description}</p>}
              <div className="flex gap-2 mt-2 pt-2 border-t border-border/30">
                <button onClick={() => openEdit(s)} className="flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1" style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}>
                  <Pencil className="w-3 h-3" /> Редактировать
                </button>
                <button onClick={() => setConfirmDelete(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-weak py-8">Услуги не найдены</p>
          )}
        </div>

        {/* Delete confirm */}
        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200, background: 'rgba(0,0,0,0.7)' }} onClick={() => setConfirmDelete(null)}>
            <div className="rounded-[20px] p-5 max-w-sm w-full text-center" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-foreground mb-2">Удалить услугу?</h3>
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
