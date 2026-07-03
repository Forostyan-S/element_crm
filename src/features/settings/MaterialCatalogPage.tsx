import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Package, Check } from 'lucide-react';
import { FormPageShell } from '../../ui';

interface MaterialCatalogPageProps {
  onBack: () => void;
  onShowToast?: (msg: string) => void;
}

interface CatalogMaterial {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  minStock: number;
}

const defaultMaterials: CatalogMaterial[] = [
  { id: '1', name: 'ВВГ 3×2.5', category: 'Кабель', unit: 'м', price: 85, minStock: 100 },
  { id: '2', name: 'ВВГ 3×4', category: 'Кабель', unit: 'м', price: 135, minStock: 50 },
  { id: '3', name: 'Автомат ABB 16A', category: 'Автоматы', unit: 'шт', price: 850, minStock: 20 },
  { id: '4', name: 'УЗО ABB 40A', category: 'Автоматы', unit: 'шт', price: 3200, minStock: 10 },
  { id: '5', name: 'Подрозетник', category: 'Розетки', unit: 'шт', price: 12, minStock: 50 },
  { id: '6', name: 'Дюбель-гвоздь 6×40', category: 'Расходники', unit: 'шт', price: 3.5, minStock: 200 },
];

const CATEGORIES = ['Кабель', 'Автоматы', 'Щиты', 'Освещение', 'Розетки', 'Расходники', 'Инструмент', 'Прочее'];
const UNITS = ['шт', 'м', 'м²', 'м³', 'кг', 'л', 'уп', 'компл'];

export function MaterialCatalogPage({ onBack, onShowToast }: MaterialCatalogPageProps) {
  const [materials, setMaterials] = useState<CatalogMaterial[]>(defaultMaterials);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editMaterial, setEditMaterial] = useState<CatalogMaterial | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formUnit, setFormUnit] = useState(UNITS[0]);
  const [formPrice, setFormPrice] = useState('');
  const [formMinStock, setFormMinStock] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = materials.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditMaterial(null);
    setFormName(''); setFormCategory(CATEGORIES[0]); setFormUnit(UNITS[0]); setFormPrice(''); setFormMinStock('');
    setShowForm(true);
  };

  const openEdit = (m: CatalogMaterial) => {
    setEditMaterial(m);
    setFormName(m.name); setFormCategory(m.category); setFormUnit(m.unit); setFormPrice(String(m.price)); setFormMinStock(String(m.minStock));
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPrice || !formMinStock) return;
    const price = Number(formPrice);
    const minStock = Number(formMinStock);
    if (editMaterial) {
      setMaterials(materials.map((m) => m.id === editMaterial.id ? { ...m, name: formName, category: formCategory, unit: formUnit, price, minStock } : m));
      onShowToast?.('Материал обновлён');
    } else {
      setMaterials([...materials, { id: Date.now().toString(), name: formName, category: formCategory, unit: formUnit, price, minStock }]);
      onShowToast?.('Материал добавлен');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
    setConfirmDelete(null);
    onShowToast?.('Материал удалён');
  };

  const fmt = (v: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(v);

  const inputStyle = { background: '#222938', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' } as const;

  if (showForm) {
    const footer = (
      <button onClick={handleSave} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-1.5" style={{ background: '#3B82F6' }}>
        <Check className="w-4 h-4" />
        {editMaterial ? 'Сохранить' : 'Добавить материал'}
      </button>
    );
    return (
      <FormPageShell title={editMaterial ? 'Редактировать материал' : 'Новый материал'} onBack={() => setShowForm(false)} footer={footer}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-weak mb-1.5 block">Название</label>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="ВВГ 3×2.5" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
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
              <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="85" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-weak mb-1.5 block">Минимальный остаток</label>
            <input type="number" value={formMinStock} onChange={(e) => setFormMinStock(e.target.value)} placeholder="100" className="w-full px-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
          </div>
        </div>
      </FormPageShell>
    );
  }

  return (
    <FormPageShell title="Каталог материалов" onBack={onBack}>
      <div className="space-y-4">
        <div className="rounded-card p-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.1) 0%, #1B2130 100%)', border: '1px solid rgba(20,184,166,0.2)' }}>
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Каталог материалов</p>
            <p className="text-xs text-muted-weak">{materials.length} позиций</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-weak" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm" style={inputStyle} />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm" style={inputStyle}>
            <option value="all">Все</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button onClick={openAdd} className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2" style={{ background: '#3B82F6' }}>
          <Plus className="w-4 h-4" />
          Добавить материал
        </button>

        <div className="space-y-2">
          {filtered.map((m) => (
            <div key={m.id} className="rounded-card p-3" style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-weak">{m.category} • мин: {m.minStock} {m.unit}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-foreground">{fmt(m.price)}</p>
                  <p className="text-xs text-muted-weak">/{m.unit}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 pt-2 border-t border-border/30">
                <button onClick={() => openEdit(m)} className="flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1" style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}>
                  <Pencil className="w-3 h-3" /> Редактировать
                </button>
                <button onClick={() => setConfirmDelete(m.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-sm text-muted-weak py-8">Материалы не найдены</p>}
        </div>

        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200, background: 'rgba(0,0,0,0.7)' }} onClick={() => setConfirmDelete(null)}>
            <div className="rounded-[20px] p-5 max-w-sm w-full text-center" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-foreground mb-2">Удалить материал?</h3>
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
