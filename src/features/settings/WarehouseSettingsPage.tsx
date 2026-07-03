import { useState } from 'react';
import { Package, FolderOpen, MapPin, Bell, Plus, Trash2 } from 'lucide-react';
import { FormPageShell } from '../../ui';

interface WarehouseSettingsPageProps {
  onBack: () => void;
}

type TabId = 'categories' | 'materials' | 'locations' | 'notifications';

const tabs: Array<{ id: TabId; label: string; icon: typeof Package }> = [
  { id: 'categories', label: 'Категории', icon: FolderOpen },
  { id: 'materials', label: 'Материалы', icon: Package },
  { id: 'locations', label: 'Места', icon: MapPin },
  { id: 'notifications', label: 'Уведомления', icon: Bell },
];

const defaultCategories = [
  { id: '1', name: 'Кабель', color: '#F59E0B', icon: 'cable' },
  { id: '2', name: 'Автоматы', color: '#3B82F6', icon: 'breaker' },
  { id: '3', name: 'Щиты', color: '#8B5CF6', icon: 'shield' },
  { id: '4', name: 'Освещение', color: '#F97316', icon: 'light' },
  { id: '5', name: 'Розетки', color: '#EC4899', icon: 'socket' },
  { id: '6', name: 'Расходники', color: '#64748B', icon: 'consumable' },
  { id: '7', name: 'Инструмент', color: '#14B8A6', icon: 'tool' },
  { id: '8', name: 'Прочее', color: '#94A3B8', icon: 'other' },
];

const defaultLocations = [
  { id: '1', name: 'Основной склад', type: 'main' },
  { id: '2', name: 'Автомобиль', type: 'vehicle' },
  { id: '3', name: 'Объект', type: 'object' },
];

export function WarehouseSettingsPage({ onBack }: WarehouseSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('categories');
  const [categories, setCategories] = useState(defaultCategories);
  const [locations, setLocations] = useState(defaultLocations);
  const [lowStockThreshold, setLowStockThreshold] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newLocationName, setNewLocationName] = useState('');

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    setCategories([...categories, { id: Date.now().toString(), name: newCategoryName, color: '#64748B', icon: 'other' }]);
    setNewCategoryName('');
  };

  const deleteCategory = (id: string) => setCategories(categories.filter((c) => c.id !== id));

  const addLocation = () => {
    if (!newLocationName.trim()) return;
    setLocations([...locations, { id: Date.now().toString(), name: newLocationName, type: 'custom' }]);
    setNewLocationName('');
  };

  const deleteLocation = (id: string) => setLocations(locations.filter((l) => l.id !== id));

  return (
    <FormPageShell title="Настройки склада" onBack={onBack}>
      <div className="space-y-4">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'bg-accent/20 text-accent' : 'text-muted-weak hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'categories' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-weak">Категории для группировки материалов</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Новая категория..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#222938', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
              />
              <button onClick={addCategory} className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
                  <span className="flex-1 text-sm text-foreground">{category.name}</span>
                  <button onClick={() => deleteCategory(category.id)} className="p-1.5 rounded-lg hover:bg-error/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-muted-weak hover:text-error" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-weak">Настройки карточек материалов</p>
            <div className="space-y-2">
              <label className="text-xs text-muted-weak">Поля материала</label>
              {[
                { key: 'name', label: 'Название', enabled: true },
                { key: 'article', label: 'Артикул', enabled: true },
                { key: 'category', label: 'Категория', enabled: true },
                { key: 'unit', label: 'Единица измерения', enabled: true },
                { key: 'price', label: 'Закупочная цена', enabled: true },
                { key: 'min_stock', label: 'Минимальный остаток', enabled: true },
                { key: 'supplier', label: 'Поставщик', enabled: false },
                { key: 'comment', label: 'Комментарий', enabled: false },
              ].map((field) => (
                <div key={field.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-sm text-foreground">{field.label}</span>
                  <button className={`relative w-10 h-5 rounded-full transition-colors ${field.enabled ? 'bg-success' : 'bg-card-elevated'}`}>
                    <div className="absolute w-4 h-4 rounded-full bg-white shadow-sm top-0.5" style={{ left: field.enabled ? '22px' : '2px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-weak">Места хранения материалов</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Новое место хранения..."
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#222938', border: '1px solid rgba(255,255,255,0.1)', color: '#F1F5F9' }}
              />
              <button onClick={addLocation} className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <MapPin className="w-4 h-4 text-muted-weak" />
                  <span className="flex-1 text-sm text-foreground">{location.name}</span>
                  {location.type !== 'main' && location.type !== 'vehicle' && location.type !== 'object' && (
                    <button onClick={() => deleteLocation(location.id)} className="p-1.5 rounded-lg hover:bg-error/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-muted-weak hover:text-error" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-weak">Уведомления о складских событиях</p>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p className="text-sm font-medium text-foreground">Низкий остаток</p>
                <p className="text-xs text-muted-weak">Уведомлять при остатке ниже минимума</p>
              </div>
              <button onClick={() => setLowStockThreshold(!lowStockThreshold)} className={`relative w-10 h-5 rounded-full transition-colors ${lowStockThreshold ? 'bg-success' : 'bg-card-elevated'}`}>
                <div className="absolute w-4 h-4 rounded-full bg-white shadow-sm top-0.5" style={{ left: lowStockThreshold ? '22px' : '2px' }} />
              </button>
            </div>
            {[
              { key: 'receipt', label: 'Поступление материалов', enabled: true },
              { key: 'writeoff', label: 'Списание материалов', enabled: true },
              { key: 'purchase', label: 'Новая закупка', enabled: true },
              { key: 'purchase_received', label: 'Закупка получена', enabled: true },
            ].map((notif) => (
              <div key={notif.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm text-foreground">{notif.label}</span>
                <button className={`relative w-10 h-5 rounded-full transition-colors ${notif.enabled ? 'bg-success' : 'bg-card-elevated'}`}>
                  <div className="absolute w-4 h-4 rounded-full bg-white shadow-sm top-0.5" style={{ left: notif.enabled ? '22px' : '2px' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormPageShell>
  );
}
