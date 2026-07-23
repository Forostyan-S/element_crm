import { AnimatePresence, motion } from 'framer-motion';
import { zIndex } from '../../../../utils/zIndex';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputType: 'warehouse' | 'manual';
  setInputType: (value: 'warehouse' | 'manual') => void;
  manualMaterialName: string;
  setManualMaterialName: (value: string) => void;
  materialQuantity: string;
  setMaterialQuantity: (value: string) => void;
  materialPrice: string;
  setMaterialPrice: (value: string) => void;
  onAdd: () => void;
}

export function AddMaterialModal({
  isOpen,
  onClose,
  inputType,
  setInputType,
  manualMaterialName,
  setManualMaterialName,
  materialQuantity,
  setMaterialQuantity,
  materialPrice,
  setMaterialPrice,
  onAdd,
}: AddMaterialModalProps) {
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
          <h2 className="text-lg font-semibold text-center" style={{ color: '#FFFFFF' }}>Добавить материал</h2>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setInputType('warehouse')}
              className="flex-1 py-3 rounded-xl font-medium text-sm"
              style={{
                background: inputType === 'warehouse' ? '#3B82F6' : '#1E293B',
                color: '#FFFFFF',
              }}
            >
              Со склада
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

          {inputType === 'warehouse' ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-card-elevated" />
              <p className="text-sm text-muted-weak">Склад пуст или не подключен</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Название материала</label>
                <input
                  type="text"
                  value={manualMaterialName}
                  onChange={(e) => setManualMaterialName(e.target.value)}
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
                    value={materialQuantity}
                    onChange={(e) => setMaterialQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Цена</label>
                  <input
                    type="number"
                    value={materialPrice}
                    onChange={(e) => setMaterialPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl"
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                  />
                </div>
              </div>
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
              onClick={onAdd}
              disabled={inputType === 'manual' && (!manualMaterialName || !materialQuantity || !materialPrice)}
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
