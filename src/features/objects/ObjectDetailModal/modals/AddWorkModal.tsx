import { motion, AnimatePresence } from 'framer-motion';
import { WORK_CATALOG, fmt } from '../constants';
import { zIndex } from '../../../../utils/zIndex';
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
  onAddFromCatalog,
  onAddManual,
}: AddWorkModalProps) {
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
                <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Выберите работу</label>
                <select
                  value={selectedCatalogWork?.name || ''}
                  onChange={(e) => {
                    const work = WORK_CATALOG.find((item) => item.name === e.target.value) || null;
                    setSelectedCatalogWork(work);
                    if (work) setWorkPrice(work.price.toString());
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
                  style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                >
                  <option value="">-- Выберите --</option>
                  {WORK_CATALOG.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} ({fmt(item.price)}/{item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Количество</label>
                <input
                  type="number"
                  value={workQuantity}
                  onChange={(e) => setWorkQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl"
                  style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                />
              </div>

              {selectedCatalogWork && workQuantity && (
                <div className="p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <p className="text-sm" style={{ color: '#94A3B8' }}>Итого:</p>
                  <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                    {fmt(parseInt(workQuantity, 10) * selectedCatalogWork.price)}
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Название работы</label>
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
                  <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Количество</label>
                  <input
                    type="number"
                    value={workQuantity}
                    onChange={(e) => setWorkQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Цена за ед.</label>
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
              onClick={inputType === 'catalog' ? onAddFromCatalog : onAddManual}
              className="flex-1 py-3 rounded-xl font-medium"
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
