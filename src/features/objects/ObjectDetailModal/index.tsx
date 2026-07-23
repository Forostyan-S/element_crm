import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ObjectStatus, EventType } from '../../../types';
import { OBJECT_STATUS_LABELS, OBJECT_STATUS_COLORS } from '../../../types';
import { zIndex } from '../../../utils/zIndex';
import { useStore } from '../../../store';
import { useObjectDetails } from './hooks/useObjectDetails';
import { tabs, fmt, EVENT_TYPES } from './constants';
import { MainTab, WorkTab, MaterialsTab, EventsTab, FinanceTab, FilesTab } from './tabs';
import { AddWorkModal, AddMaterialModal, AddObjectEventModal, DeleteObjectModal } from './modals';
import { ObjectCommentModal } from '../ObjectCommentModal';
import { ObjectHistoryModal } from '../ObjectHistoryModal';
import type {
  ObjectDetailModalProps,
  TabId,
  ObjectEventItem,
  ObjectFileItem,
  CatalogWork,
} from './types';

export function ObjectDetailModal({ isOpen, onClose, object }: ObjectDetailModalProps) {
  const { deleteObject, setIsModalOpen, setFormPage, addObjectWorkItem, addObjectMaterialItem, addObjectHistoryEntry, updateObject } = useStore();
  const currentObject = useStore((state) => state.objects.find((o) => o.id === object?.id) ?? object);
  const { workItems, materials } = useObjectDetails(currentObject);

  useEffect(() => {
    setIsModalOpen(isOpen);
    return () => setIsModalOpen(false);
  }, [isOpen, setIsModalOpen]);

  useEffect(() => {
    setNumberValue(currentObject?.object_number ?? '');
  }, [currentObject]);

  const [activeTab, setActiveTab] = useState<TabId>('main');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [workInputType, setWorkInputType] = useState<'catalog' | 'manual'>('catalog');
  const [selectedCatalogWork, setSelectedCatalogWork] = useState<CatalogWork | null>(null);
  const [manualWorkName, setManualWorkName] = useState('');
  const [workQuantity, setWorkQuantity] = useState('');
  const [workPrice, setWorkPrice] = useState('');
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [materialInputType, setMaterialInputType] = useState<'warehouse' | 'manual'>('warehouse');
  const [manualMaterialName, setManualMaterialName] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materialPrice, setMaterialPrice] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [numberValue, setNumberValue] = useState(object?.object_number ?? '');
  const [objectEvents, setObjectEvents] = useState<ObjectEventItem[]>([
    { id: '1', type: 'measurement', title: 'Замер', date: '2024-01-10', time: '10:00', status: 'completed' },
    { id: '2', type: 'installation', title: 'Монтаж', date: '2024-01-15', time: '09:00', status: 'in_progress' },
    { id: '3', type: 'handover', title: 'Сдача', date: '2024-01-22', time: '14:00', status: 'new' },
  ]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  useEffect(() => {
    setNumberValue(object?.object_number ?? '');
  }, [object]);
  const [newEventType, setNewEventType] = useState<EventType>('measurement');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEventTime, setNewEventTime] = useState('10:00');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [files, setFiles] = useState<ObjectFileItem[]>([
    { type: 'estimate', name: 'Смета', status: 'done' },
    { type: 'contract', name: 'Договор', status: 'in_progress' },
  ]);

  if (!object) return null;

  const status = object.status as ObjectStatus;
  const color = OBJECT_STATUS_COLORS[status];
  const label = OBJECT_STATUS_LABELS[status];

  const workCost = workItems.reduce((sum, item) => sum + item.total, 0);
  const materialCost = materials.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const markup = materials.reduce((sum, item) => sum + item.quantity * item.markup, 0);
  const budget = workCost + materialCost + markup;
  const costPrice = workCost + materialCost;
  const marginAmount = budget - costPrice;
  const marginPercent = budget > 0 ? (marginAmount / budget) * 100 : 0;
  const profit = workCost + markup;

  const handleAddWorkFromCatalog = () => {
    if (!selectedCatalogWork || !workQuantity || Number.isNaN(Number(workQuantity))) return;
    const quantity = parseInt(workQuantity, 10);
    const newItem = {
      id: Date.now().toString(),
      name: selectedCatalogWork.name,
      quantity,
      unit: selectedCatalogWork.unit,
      pricePerUnit: selectedCatalogWork.price,
      total: quantity * selectedCatalogWork.price,
    };

    addObjectWorkItem({
      id: newItem.id,
      object_id: object.id,
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      price: newItem.pricePerUnit,
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    addObjectHistoryEntry({
      id: Date.now().toString(),
      object_id: object.id,
      action_type: 'work_added',
      description: `Добавлена работа "${newItem.name}" ${newItem.quantity} ${newItem.unit}`,
      created_at: new Date().toISOString(),
    });

    setSelectedCatalogWork(null);
    setWorkQuantity('');
    setShowAddWorkModal(false);
  };

  const handleAddWorkManual = () => {
    if (!manualWorkName || !workQuantity || !workPrice) return;
    const quantity = parseInt(workQuantity, 10);
    const price = parseInt(workPrice, 10);
    const newItem = {
      id: Date.now().toString(),
      name: manualWorkName,
      quantity,
      unit: 'шт',
      pricePerUnit: price,
      total: quantity * price,
    };

    addObjectWorkItem({
      id: newItem.id,
      object_id: object.id,
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      price: newItem.pricePerUnit,
      status: 'planned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    addObjectHistoryEntry({
      id: Date.now().toString(),
      object_id: object.id,
      action_type: 'work_added',
      description: `Добавлена работа "${newItem.name}" ${newItem.quantity} ${newItem.unit}`,
      created_at: new Date().toISOString(),
    });

    setManualWorkName('');
    setWorkQuantity('');
    setWorkPrice('');
    setShowAddWorkModal(false);
  };

  const handleAddMaterial = () => {
    if (!manualMaterialName || !materialQuantity || !materialPrice) return;
    const quantity = parseInt(materialQuantity, 10);
    const price = parseInt(materialPrice, 10);

    addObjectMaterialItem({
      id: Date.now().toString(),
      object_id: object.id,
      name: manualMaterialName,
      quantity,
      unit: 'шт',
      purchase_price: price,
      sale_price: price,
      markup: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    addObjectHistoryEntry({
      id: Date.now().toString(),
      object_id: object.id,
      action_type: 'material_added',
      description: `Добавлен материал "${manualMaterialName}" ${quantity} ${'шт'}`,
      created_at: new Date().toISOString(),
    });

    setManualMaterialName('');
    setMaterialQuantity('');
    setMaterialPrice('');
    setShowAddMaterialModal(false);
  };

  const handleAddEvent = () => {
    if (!newEventDate || !newEventTime) return;

    const eventType = EVENT_TYPES.find((item) => item.value === newEventType);
    const newEvent: ObjectEventItem = {
      id: Date.now().toString(),
      type: newEventType,
      title: newEventTitle || eventType?.label || 'Событие',
      date: newEventDate,
      time: newEventTime,
      status: 'new',
    };

    setObjectEvents((prev) => [...prev, newEvent]);
    addObjectHistoryEntry({
      id: Date.now().toString(),
      object_id: object.id,
      action_type: 'event_added',
      description: `Добавлено событие "${newEvent.title}" на ${newEvent.date}`,
      created_at: new Date().toISOString(),
    });
    setNewEventType('measurement');
    setNewEventDate(new Date().toISOString().split('T')[0]);
    setNewEventTime('10:00');
    setNewEventTitle('');
    setShowAddEventModal(false);
  };

  const handleUpdateEventStatus = (eventId: string, status: ObjectEventItem['status']) => {
    setObjectEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, status } : event)));
  };

  const handleUpdateFileStatus = (type: ObjectFileItem['type'], status: ObjectFileItem['status']) => {
    setFiles((prev) => {
      const existing = prev.find((file) => file.type === type);
      if (existing) {
        return prev.map((file) => (file.type === type ? { ...file, status } : file));
      }

      const fileType = type;
      return [...prev, { type, name: fileType, status }];
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
            className="fixed inset-x-4 top-4 bottom-4 max-w-lg mx-auto rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: '#0F1115',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              zIndex: zIndex.modal,
              paddingTop: 'env(safe-area-inset-top, 0px)',
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: `${color}30` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-foreground truncate">{object.name}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-lg" style={{ backgroundColor: `${color}25`, color }}>
                      {label}
                    </span>
                      {isEditingNumber ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={numberValue}
                          onChange={(e) => setNumberValue(e.target.value)}
                          className="rounded-lg bg-[#111827] px-2 py-1 text-xs text-foreground border border-white/10 outline-none"
                          placeholder="Без номера"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateObject(object.id, {
                              object_number: numberValue || undefined,
                              updated_at: new Date().toISOString(),
                            });
                            addObjectHistoryEntry({
                              id: Date.now().toString(),
                              object_id: object.id,
                              action_type: 'number_updated',
                              description: `Номер объекта изменён на ${numberValue || 'без номера'}`,
                              created_at: new Date().toISOString(),
                            });
                            setIsEditingNumber(false);
                          }}
                          className="text-2xs font-semibold text-accent"
                        >
                          Сохранить
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNumberValue(object.object_number ?? '');
                            setIsEditingNumber(false);
                          }}
                          className="text-2xs font-medium text-muted-weak"
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingNumber(true)}
                        className="text-xs font-medium text-muted-weak hover:text-foreground transition-colors"
                      >
                        {object.object_number || 'Без номера'}
                      </button>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-card-elevated transition-colors">
                  <X className="w-5 h-5 text-muted-weak" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-weak">Бюджет</p>
                  <p className="text-sm font-bold text-foreground">{fmt(budget)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-weak">Прибыль</p>
                  <p className="text-sm font-bold text-success">{fmt(profit)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-weak">Маржа</p>
                  <p className="text-sm font-bold" style={{ color }}>{marginPercent.toFixed(0)}%</p>
                </div>
              </div>
            </div>

            <div className="flex gap-1 p-2 border-b border-border flex-shrink-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                      isActive ? 'bg-accent/20 text-accent' : 'text-muted-weak hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'main' && (
                <MainTab
                  object={object}
                  onEditComment={() => setShowCommentModal(true)}
                  onOpenHistory={() => setShowHistoryModal(true)}
                />
              )}
              {activeTab === 'work' && <WorkTab workItems={workItems} onAddWork={() => setShowAddWorkModal(true)} />}
              {activeTab === 'materials' && <MaterialsTab materials={materials} onAddMaterial={() => setShowAddMaterialModal(true)} />}
              {activeTab === 'events' && (
                <EventsTab
                  events={objectEvents}
                  onStatusChange={handleUpdateEventStatus}
                  onAddEvent={() => setShowAddEventModal(true)}
                />
              )}
              {activeTab === 'finance' && <FinanceTab object={object} />}
              {activeTab === 'files' && <FilesTab files={files} onStatusChange={handleUpdateFileStatus} />}
            </div>

            <div className="p-4 border-t border-border flex-shrink-0 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-medium text-foreground transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
              >
                Закрыть
              </button>
              <button
                onClick={() => setFormPage({ type: 'editObject', object })}
                className="flex-1 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
              >
                Редактировать
              </button>
            </div>
          </motion.div>

          <AddWorkModal
            isOpen={showAddWorkModal}
            onClose={() => setShowAddWorkModal(false)}
            inputType={workInputType}
            setInputType={setWorkInputType}
            selectedCatalogWork={selectedCatalogWork}
            setSelectedCatalogWork={setSelectedCatalogWork}
            manualWorkName={manualWorkName}
            setManualWorkName={setManualWorkName}
            workQuantity={workQuantity}
            setWorkQuantity={setWorkQuantity}
            workPrice={workPrice}
            setWorkPrice={setWorkPrice}
            onAddFromCatalog={handleAddWorkFromCatalog}
            onAddManual={handleAddWorkManual}
          />

          <AddMaterialModal
            isOpen={showAddMaterialModal}
            onClose={() => setShowAddMaterialModal(false)}
            inputType={materialInputType}
            setInputType={setMaterialInputType}
            manualMaterialName={manualMaterialName}
            setManualMaterialName={setManualMaterialName}
            materialQuantity={materialQuantity}
            setMaterialQuantity={setMaterialQuantity}
            materialPrice={materialPrice}
            setMaterialPrice={setMaterialPrice}
            onAdd={handleAddMaterial}
          />

          <AddObjectEventModal
            isOpen={showAddEventModal}
            onClose={() => setShowAddEventModal(false)}
            eventType={newEventType}
            setEventType={setNewEventType}
            eventDate={newEventDate}
            setEventDate={setNewEventDate}
            eventTime={newEventTime}
            setEventTime={setNewEventTime}
            eventTitle={newEventTitle}
            setEventTitle={setNewEventTitle}
            onAdd={handleAddEvent}
            eventTypes={EVENT_TYPES}
          />

          <DeleteObjectModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onDelete={() => {
              deleteObject(object.id);
              setShowDeleteConfirm(false);
              onClose();
            }}
          />

          {showCommentModal && (
            <ObjectCommentModal
              object={object}
              onClose={() => setShowCommentModal(false)}
            />
          )}

          {showHistoryModal && (
            <ObjectHistoryModal objectId={object.id} onClose={() => setShowHistoryModal(false)} />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
