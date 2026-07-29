import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ServiceCatalogItem } from '../../../../types';
import { WORK_CATALOG, fmt } from '../constants';
import { zIndex } from '../../../../utils/zIndex';
import { useStore } from '../../../../store';
import type { CatalogWork } from '../types';

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputType: 'catalog' | 'manual';
  setInputType: (value: 'catalog' | 'manual') => void;
  selectedCatalogWork: CatalogWork | null;
  setSelectedCatalogWork: (value: CatalogWork | null) => void;
  manualWorkName: string;
  setManualWorkName: (value: string) => void;
  workQuantity: string;
  setWorkQuantity: (value: string) => void;
  workPrice: string;
  setWorkPrice: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  manualUnit: string;
  setManualUnit: (value: string) => void;
  saveToCatalog: boolean;
  setSaveToCatalog: (value: boolean) => void;
  onAddFromCatalog: () => void;
  onAddManual: () => void;
}

export function AddWorkModal({
  isOpen,
  onClose,
  inputType,
  setInputType,
  selectedCatalogWork,
  setSelectedCatalogWork,
  manualWorkName,
  setManualWorkName,
  workQuantity,
  setWorkQuantity,
  workPrice,
  setWorkPrice,
  selectedCategory,
  setSelectedCategory,
  manualUnit,
  setManualUnit,
  saveToCatalog,
  setSaveToCatalog,
  onAddFromCatalog,
  onAddManual,
}: AddWorkModalProps) {
  const { serviceCatalog, addServiceCatalogItem } = useStore();
  const [search, setSearch] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const catalogItems = useMemo(() => {
    const baseItems = serviceCatalog.length > 0 ? serviceCatalog : WORK_CATALOG;
    return baseItems.map((item) => ({
      id: item.id ?? `${item.category}-${item.name}`,
      category: item.category ?? 'Общее',
      name: item.name,
      unit: item.unit,
      price: item.price,
    }));
  }, [serviceCatalog]);

  const categories = useMemo(() => Array.from(new Set(catalogItems.map((item) => item.category))), [catalogItems]);
  const categoryOptions = useMemo(() => [...categories, 'Новая категория'], [categories]);
  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return catalogItems.filter((item) => {
      const matchesCategory = item.category === selectedCategory;
      const matchesSearch = !normalized || item.name.toLowerCase().includes(normalized);
      return matchesCategory && matchesSearch;
    });
  }, [catalogItems, search, selectedCategory]);

  const selectedService = filteredItems.find((item) => item.name === selectedCatalogWork?.name) ?? filteredItems[0] ?? null;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          zIndex: zIndex.backdrop,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 max-w-md mx-auto overflow-hidden"
        style={{
          background: '#0F172A',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          border: '1px solid #1E293B',
          zIndex: zIndex.modalPanel,
          paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="p-4 border-b" style={{ borderColor: '#1E293B' }}>
          <h2 className="text-lg font-semibold text-center" style={{ color: '#FFFFFF' }}>Добавить работу</h2>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setInputType('catalog')}
              className="flex-1 py-3 rounded-xl font-medium text-sm"
              style={{
                background: inputType === 'catalog' ? '#3B82F6' : '#1E293B',
                color: '#FFFFFF',
              }}
            >
              Из каталога
            </button>
            <button
              onClick={() => setInputType('manual')}
              className="flex-1 py-3 rounded-xl font-medium text-sm"
              style={{
                background: inputType === 'manual' ? '#3B82F6' : '#1E293B',
                color: '#FFFFFF',
              }}
            >
              Вручную
            </button>
          </div>

          {inputType === 'catalog' ? (
            <>
              <div>
                <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Поиск</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-weak" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Начните вводить работу"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Категория</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

          

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedCatalogWork({ name: item.name, unit: item.unit, price: item.price });
                      setWorkPrice(String(item.price));
                    }}
                    className="w-full rounded-xl p-3 text-left"
                    style={{
                      background: selectedService?.name === item.name ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selectedService?.name === item.name ? '#3B82F6' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-weak">{item.unit} • {fmt(item.price)}</p>
                      </div>
                      {selectedService?.name === item.name && <CheckCircle2 className="w-4 h-4 text-accent" />}
                    </div>
                  </button>
                ))}
                {filteredItems.length === 0 && (
                  <div className="rounded-xl p-3 text-sm text-muted-weak" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    Ничего не найдено. Попробуйте другой запрос.
                  </div>
                )}
              </div>

              <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-weak">Работа</p>
                    <p className="text-sm font-semibold text-foreground">{selectedService?.name || 'Выберите работу'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-weak">Количество</p>
                    <input
                      type="number"
                      value={workQuantity}
                      onChange={(e) => setWorkQuantity(e.target.value)}
                      placeholder="0"
                      className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                      style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF' }}
                    />
                  </div>
                </div>
                {selectedService && workQuantity && (
                  <div className="mt-3 flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-sm text-muted-weak">Итого</span>
                    <span className="text-sm font-semibold text-foreground">{fmt(parseInt(workQuantity, 10) * selectedService.price)}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Категория</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory === 'Новая категория' && (
                <div>
                  <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Название новой категории</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Например: Слаботочка"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                  />
                </div>
              )}

              <div>
                <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Название работы</label>
                <input
                  type="text"
                  value={manualWorkName}
                  onChange={(e) => setManualWorkName(e.target.value)}
                  placeholder="Название"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Единица</label>
                  <select
                    value={manualUnit}
                    onChange={(e) => setManualUnit(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm"
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                  >
                    {['шт', 'м', 'м²', 'м³', 'кг', 'л', 'точка', 'компл'].map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Цена за ед.</label>
                  <input
                    type="number"
                    value={workPrice}
                    onChange={(e) => setWorkPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                />
                </div>
              </div>

              <div>
                <label className="text-xs mb-2 block" style={{ color: '#94A3B8' }}>Количество</label>
                <input
                  type="number"
                  value={workQuantity}
                  onChange={(e) => setWorkQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-weak">
                <input
                  type="checkbox"
                  checked={saveToCatalog}
                  onChange={(e) => setSaveToCatalog(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-transparent"
                />
                Сохранить в каталог
              </label>

              {workQuantity && workPrice && (
                <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <p className="text-sm" style={{ color: '#94A3B8' }}>Итого:</p>
                  <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                    {fmt(parseInt(workQuantity, 10) * parseInt(workPrice, 10))}
                  </p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium"
              style={{ background: '#1E293B', border: '1px solid #334155', color: '#94A3B8' }}
            >
              Отмена
            </button>
            <button
              onClick={() => {
                if (inputType === 'catalog') {
                  onAddFromCatalog();
                  return;
                }

                const categoryToSave = selectedCategory === 'Новая категория' ? newCategoryName.trim() : selectedCategory;
                if (saveToCatalog && categoryToSave) {
                  addServiceCatalogItem({
                    id: Date.now().toString(),
                    name: manualWorkName.trim(),
                    category: categoryToSave,
                    unit: manualUnit,
                    price: Number(workPrice || 0),
                    description: '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  } as ServiceCatalogItem);
                }
                onAddManual();
              }}
              disabled={inputType === 'catalog' ? !selectedCatalogWork : !manualWorkName.trim() || !workPrice || (saveToCatalog && selectedCategory === 'Новая категория' && !newCategoryName.trim())}
              className="flex-1 py-3 rounded-xl font-medium disabled:opacity-50"
              style={{ background: '#3B82F6', color: '#FFFFFF' }}
            >
              Добавить
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
