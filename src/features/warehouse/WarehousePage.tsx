import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  ShoppingCart,
  AlertTriangle,
  Check,
  Clock,
  Truck,
  Archive,
} from 'lucide-react';
import { useStore } from '../../store';
import { EmptyState } from '../../ui';
import type { Material, Purchase } from '../../types';

// Material Categories
export const MATERIAL_CATEGORIES = [
  { id: 'cable', label: 'Кабель', color: '#F59E0B' },
  { id: 'breakers', label: 'Автоматы', color: '#3B82F6' },
  { id: 'shields', label: 'Щиты', color: '#8B5CF6' },
  { id: 'lighting', label: 'Освещение', color: '#F97316' },
  { id: 'sockets', label: 'Розетки', color: '#EC4899' },
  { id: 'consumables', label: 'Расходники', color: '#64748B' },
  { id: 'tools', label: 'Инструмент', color: '#14B8A6' },
  { id: 'other', label: 'Прочее', color: '#94A3B8' },
];

const demoMaterials: Material[] = [
  {
    id: '1',
    category: 'Кабель',
    name: 'ВВГ 3×2.5',
    article: 'ВВГ-3x2.5',
    manufacturer: 'КВК',
    unit: 'м',
    current_stock: 450,
    min_stock: 100,
    purchase_price: 85,
    sale_price: 120,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    category: 'Кабель',
    name: 'ВВГ 3×4',
    article: 'ВВГ-3x4',
    manufacturer: 'КВК',
    unit: 'м',
    current_stock: 280,
    min_stock: 50,
    purchase_price: 135,
    sale_price: 180,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    category: 'Розетки',
    name: 'Подрозетник',
    article: 'П-65',
    manufacturer: 'IEK',
    unit: 'шт',
    current_stock: 45,
    min_stock: 50,
    purchase_price: 12,
    sale_price: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    category: 'Автоматы',
    name: 'Автомат ABB S201 16A',
    article: 'S201-C16',
    manufacturer: 'ABB',
    unit: 'шт',
    current_stock: 35,
    min_stock: 20,
    purchase_price: 850,
    sale_price: 1200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    category: 'Автоматы',
    name: 'УЗО ABB F202 40A 30mA',
    article: 'F202-A-40-30',
    manufacturer: 'ABB',
    unit: 'шт',
    current_stock: 8,
    min_stock: 10,
    purchase_price: 3200,
    sale_price: 4500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    category: 'Расходники',
    name: 'Дюбель-гвоздь 6×40',
    article: 'ДГ-6x40',
    manufacturer: 'Mungo',
    unit: 'шт',
    current_stock: 850,
    min_stock: 200,
    purchase_price: 3.5,
    sale_price: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoPurchases: Purchase[] = [
  {
    id: '1',
    supplier: 'Электро-М',
    purchase_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    total_amount: 125000,
    status: 'received',
    notes: 'Кабель и автоматика',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    supplier: 'IEK-Сервис',
    purchase_date: new Date().toISOString().split('T')[0],
    total_amount: 45000,
    status: 'ordered',
    notes: 'Установочные изделия',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    supplier: 'ABB Россия',
    purchase_date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    total_amount: 85000,
    status: 'draft',
    notes: 'Автоматика на объект Петровых',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

type TabId = 'stocks' | 'purchases';

const tabs: Array<{ id: TabId; label: string; icon: typeof Package }> = [
  { id: 'stocks', label: 'Остатки', icon: Package },
  { id: 'purchases', label: 'Закупки', icon: ShoppingCart },
];

const purchaseStatusFlow = [
  { status: 'draft', label: 'Черновик', icon: Archive, color: '#64748B' },
  { status: 'ordered', label: 'Заказано', icon: Clock, color: '#F59E0B' },
  { status: 'in_transit', label: 'В пути', icon: Truck, color: '#3B82F6' },
  { status: 'received', label: 'Получено', icon: Check, color: '#22C55E' },
];

const fmt = (v: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

const numFmt = (v: number) => new Intl.NumberFormat('ru-RU').format(v);

export function WarehousePage() {
  const { materials, purchases, setFormPage } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>('stocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const displayMaterials = materials.length > 0 ? materials : demoMaterials;
  const displayPurchases = purchases.length > 0 ? purchases : demoPurchases;

  const lowStockMaterials = displayMaterials.filter((m) => m.current_stock <= m.min_stock);

  const categories = [...new Set(displayMaterials.map((m) => m.category))];

  const filteredMaterials = displayMaterials.filter((m) => {
    const matchesSearch =
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.article?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (categoryName: string) => {
    const cat = MATERIAL_CATEGORIES.find(c => categoryName.toLowerCase().includes(c.label.toLowerCase()));
    return cat?.color || '#64748B';
  };

  return (
    <motion.div
      className="pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 mb-4 flex justify-end">
        <button
          onClick={() => setFormPage({ type: 'addMaterial' })}
          className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white"
          style={{ background: '#3B82F6', boxShadow: '0 6px 18px rgba(59,130,246,0.28)' }}
        >
          <Plus className="w-4 h-4" />
          Добавить позицию
        </button>
      </div>

      {/* Low-stock notice */}
      <div className="px-4 mb-4">
        <motion.div
          className="rounded-card p-3 relative overflow-hidden"
          style={{
            background: lowStockMaterials.length > 0
              ? 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, #1B2130 100%)'
              : 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, #1B2130 100%)',
            border: lowStockMaterials.length > 0
              ? '1px solid rgba(239,68,68,0.3)'
              : '1px solid rgba(34,197,94,0.2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${lowStockMaterials.length > 0 ? 'bg-error/15' : 'bg-success/15'}`}>
            <AlertTriangle className={`w-4 h-4 ${lowStockMaterials.length > 0 ? 'text-error' : 'text-success'}`} />
          </div>
          <p className="text-2xs text-muted-weak">Низкий остаток</p>
          <p className={`text-base font-bold ${lowStockMaterials.length > 0 ? 'text-error' : 'text-success'}`}>
            {lowStockMaterials.length}
          </p>
          <p className="text-2xs text-muted-weak">позиций</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-muted-weak hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* STOCKS TAB */}
      {activeTab === 'stocks' && (
        <div className="px-4">
          {/* Search & Filter */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-weak" />
              <input
                type="text"
                placeholder="Поиск по названию, артикулу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm"
                style={{
                  background: '#1B2130',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#F1F5F9',
                }}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm"
              style={{
                background: '#1B2130',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#F1F5F9',
              }}
            >
              <option value="all">Все</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Materials List */}
          {filteredMaterials.length > 0 ? (
            <div className="space-y-2">
              {filteredMaterials.map((material, index) => {
                const isLow = material.current_stock <= material.min_stock;
                const stockValue = material.current_stock * material.purchase_price;
                const catColor = getCategoryColor(material.category);

                return (
                  <motion.div
                    key={material.id}
                    className="rounded-card p-3 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${catColor}08 0%, #1B2130 100%)`,
                      border: isLow ? '1px solid rgba(239,68,68,0.25)' : `1px solid ${catColor}15`,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -2 }}
                    onClick={() => { setFormPage({ type: 'editMaterial', material }); }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: catColor }}
                          />
                          <p className="text-sm font-medium text-foreground truncate">{material.name}</p>
                          {isLow && (
                            <span className="text-2xs px-1.5 py-0.5 rounded bg-error/20 text-error flex-shrink-0">
                              Мало
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-weak mt-0.5">
                          {material.category} {material.article ? `• ${material.article}` : ''}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-foreground">
                          {numFmt(material.current_stock)} {material.unit}
                        </p>
                        <p className="text-xs text-muted">{fmt(stockValue)}</p>
                      </div>
                    </div>

                    {/* Stock bar */}
                    <div className="h-1 bg-card-elevated rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: isLow ? '#EF4444' : catColor,
                          width: `${Math.min(100, (material.current_stock / material.min_stock) * 50)}%`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (material.current_stock / material.min_stock) * 50)}%` }}
                        transition={{ delay: index * 0.03 + 0.1, duration: 0.4 }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border/30 text-xs text-muted-weak">
                      <span>Мин: {material.min_stock} {material.unit}</span>
                      <span>Закупка: {fmt(material.purchase_price)}</span>
                      {material.manufacturer && <span>{material.manufacturer}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Package} title="Нет материалов" description="Добавьте материалы на склад" action={{ label: 'Добавить материал', onClick: () => setFormPage({ type: 'addMaterial' }) }} />
          )}
        </div>
      )}

      {/* PURCHASES TAB */}
      {activeTab === 'purchases' && (
        <div className="px-4">
          {/* Purchase Status Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {purchaseStatusFlow.map((s) => (
              <button
                key={s.status}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-card-elevated`}
                style={{ color: s.color }}
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Purchases List */}
          <div className="space-y-2">
            {displayPurchases.map((purchase, index) => {
              const statusConfig = purchaseStatusFlow.find(s => s.status === purchase.status) || purchaseStatusFlow[0];
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={purchase.id}
                  className="rounded-card p-3"
                  style={{
                    background: `linear-gradient(135deg, ${statusConfig.color}08 0%, #1B2130 100%)`,
                    border: `1px solid ${statusConfig.color}20`,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{purchase.supplier}</p>
                      <p className="text-xs text-muted-weak">
                        {new Date(purchase.purchase_date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-bold text-foreground">{fmt(purchase.total_amount)}</p>
                      <span
                        className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full mt-1"
                        style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                  {purchase.notes && (
                    <p className="text-xs text-muted pt-2 border-t border-border/30">{purchase.notes}</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {displayPurchases.length === 0 && (
            <EmptyState icon={ShoppingCart} title="Нет закупок" description="Создайте закупку у поставщика" action={{ label: 'Создать закупку', onClick: () => setFormPage({ type: 'addMaterial' }) }} />
          )}
        </div>
      )}
    </motion.div>
  );
}
