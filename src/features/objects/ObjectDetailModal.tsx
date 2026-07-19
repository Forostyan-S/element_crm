import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Wallet,
  Package,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  User,
  Check,
  History,
  Wrench,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { ConstructionObject, ObjectStatus } from '../../types';
import { OBJECT_STATUS_LABELS, OBJECT_STATUS_COLORS } from '../../types';
import { zIndex } from '../../utils/zIndex';
import { useStore } from '../../store';

interface ObjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  object: ConstructionObject | null;
}

type TabId = 'main' | 'work' | 'materials' | 'events' | 'finance' | 'files';

const tabs: Array<{ id: TabId; label: string; icon: typeof MapPin }> = [
  { id: 'main', label: 'Основное', icon: MapPin },
  { id: 'work', label: 'Работа', icon: Wrench },
  { id: 'materials', label: 'Материалы', icon: Package },
  { id: 'events', label: 'События', icon: Calendar },
  { id: 'finance', label: 'Финансы', icon: Wallet },
  { id: 'files', label: 'Файлы', icon: FileText },
];

const fmt = (v: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

// Work item type
interface WorkItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
}

// Material type
interface ObjectMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  date: string;
}

// Event type for object
interface ObjectEventItem {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  comment?: string;
}

// File type
interface ObjectFileItem {
  type: 'estimate' | 'contract' | 'report' | 'act' | 'wiring_plan' | 'single_line';
  name: string;
  status: 'not_used' | 'in_progress' | 'done';
}

const FILE_TYPES: Array<{ type: ObjectFileItem['type']; name: string }> = [
  { type: 'estimate', name: 'Смета' },
  { type: 'contract', name: 'Договор' },
  { type: 'report', name: 'Отчет' },
  { type: 'act', name: 'Акт выполненных работ' },
  { type: 'wiring_plan', name: 'План электропроводки' },
  { type: 'single_line', name: 'Однолинейная схема' },
];

const EVENT_STATUSES = [
  { value: 'new', label: 'Новый', color: '#6B7280' },
  { value: 'in_progress', label: 'В работе', color: '#3B82F6' },
  { value: 'completed', label: 'Завершено', color: '#22C55E' },
  { value: 'cancelled', label: 'Отменено', color: '#EF4444' },
];

const WORK_CATALOG = [
  { name: 'Прокладка кабеля', unit: 'м', price: 150 },
  { name: 'Установка розетки', unit: 'шт', price: 500 },
  { name: 'Установка выключателя', unit: 'шт', price: 450 },
  { name: 'Монтаж распределительной коробки', unit: 'шт', price: 800 },
  { name: 'Сборка щита', unit: 'шт', price: 5000 },
  { name: 'Установка автомата', unit: 'шт', price: 350 },
];

const EVENT_TYPES = [
  { value: 'measurement', label: 'Замер', color: '#F59E0B' },
  { value: 'installation', label: 'Монтаж', color: '#3B82F6' },
  { value: 'purchase', label: 'Закупка', color: '#22C55E' },
  { value: 'handover', label: 'Сдача', color: '#A855F7' },
];

export function ObjectDetailModal({ isOpen, onClose, object }: ObjectDetailModalProps) {
  const { deleteObject, setIsModalOpen, setFormPage, objectWorkItems, objectMaterialItems, addObjectWorkItem, addObjectMaterialItem } = useStore();

  useEffect(() => {
    setIsModalOpen(isOpen);
    return () => setIsModalOpen(false);
  }, [isOpen, setIsModalOpen]);
  const [activeTab, setActiveTab] = useState<TabId>('main');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Work items state
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [workInputType, setWorkInputType] = useState<'catalog' | 'manual'>('catalog');
  const [selectedCatalogWork, setSelectedCatalogWork] = useState<typeof WORK_CATALOG[0] | null>(null);
  const [manualWorkName, setManualWorkName] = useState('');
  const [workQuantity, setWorkQuantity] = useState('');
  const [workPrice, setWorkPrice] = useState('');

  // Materials state
  const [materials, setMaterials] = useState<ObjectMaterial[]>([]);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [materialInputType, setMaterialInputType] = useState<'warehouse' | 'manual'>('warehouse');
  const [manualMaterialName, setManualMaterialName] = useState('');
  const [materialQuantity, setMaterialQuantity] = useState('');
  const [materialPrice, setMaterialPrice] = useState('');

  // Events state
  const [objectEvents, setObjectEvents] = useState<ObjectEventItem[]>([
    { id: '1', type: 'measurement', title: 'Замер', date: '2024-01-10', time: '10:00', status: 'completed' },
    { id: '2', type: 'installation', title: 'Монтаж', date: '2024-01-15', time: '09:00', status: 'in_progress' },
    { id: '3', type: 'handover', title: 'Сдача', date: '2024-01-22', time: '14:00', status: 'new' },
  ]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventType, setNewEventType] = useState('measurement');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEventTime, setNewEventTime] = useState('10:00');
  const [newEventTitle, setNewEventTitle] = useState('');

  // Files state
  const [files, setFiles] = useState<ObjectFileItem[]>([
    { type: 'estimate', name: 'Смета', status: 'done' },
    { type: 'contract', name: 'Договор', status: 'in_progress' },
  ]);

  useEffect(() => {
    if (!object) return;
    setWorkItems(objectWorkItems.filter((item) => item.object_id === object.id).map((item) => ({
      id: item.id, name: item.name, quantity: item.quantity, unit: item.unit, pricePerUnit: item.price, total: item.quantity * item.price,
    })));
    setMaterials(objectMaterialItems.filter((item) => item.object_id === object.id).map((item) => ({
      id: item.id, name: item.name, quantity: item.quantity, unit: item.unit, price: item.purchase_price, date: item.created_at,
    })));
  }, [object, objectWorkItems, objectMaterialItems]);

  const demoHistory = [
    { id: '1', action: 'Создан объект', date: '2024-01-08', user: 'Сергей' },
    { id: '2', action: 'Статус: Замер -> Смета', date: '2024-01-12', user: 'Сергей' },
    { id: '3', action: 'Статус: Смета -> В работе', date: '2024-01-15', user: 'Сергей' },
  ];

  if (!object) return null;

  const status = object.status as ObjectStatus;
  const color = OBJECT_STATUS_COLORS[status];
  const label = OBJECT_STATUS_LABELS[status];
  const margin = object.budget > 0 ? (object.profit / object.budget) * 100 : 0;
  const myShare = object.profit / 2;
  const received = object.spent + object.profit * 0.5;
  const remaining = object.budget - received;

  const totalWorkCost = workItems.reduce((sum, w) => sum + w.total, 0);
  const totalMaterialsCost = materials.reduce((sum, m) => sum + m.quantity * m.price, 0);

  // Work handlers
  const handleAddWorkFromCatalog = () => {
    if (!selectedCatalogWork || !workQuantity) return;
    const q = parseInt(workQuantity);
    const newItem: WorkItem = {
      id: Date.now().toString(),
      name: selectedCatalogWork.name,
      quantity: q,
      unit: selectedCatalogWork.unit,
      pricePerUnit: selectedCatalogWork.price,
      total: q * selectedCatalogWork.price,
    };
    setWorkItems(prev => [...prev, newItem]);
    if (object) addObjectWorkItem({ id: newItem.id, object_id: object.id, name: newItem.name, quantity: newItem.quantity, unit: newItem.unit, price: newItem.pricePerUnit, status: 'planned', created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    setSelectedCatalogWork(null);
    setWorkQuantity('');
    setShowAddWorkModal(false);
  };

  const handleAddWorkManual = () => {
    if (!manualWorkName || !workQuantity || !workPrice) return;
    const q = parseInt(workQuantity);
    const p = parseInt(workPrice);
    const newItem: WorkItem = {
      id: Date.now().toString(),
      name: manualWorkName,
      quantity: q,
      unit: 'шт',
      pricePerUnit: p,
      total: q * p,
    };
    setWorkItems(prev => [...prev, newItem]);
    if (object) addObjectWorkItem({ id: newItem.id, object_id: object.id, name: newItem.name, quantity: newItem.quantity, unit: newItem.unit, price: newItem.pricePerUnit, status: 'planned', created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    setManualWorkName('');
    setWorkQuantity('');
    setWorkPrice('');
    setShowAddWorkModal(false);
  };

  // Material handlers
  const handleAddMaterial = () => {
    if (!manualMaterialName || !materialQuantity || !materialPrice) return;
    const q = parseInt(materialQuantity);
    const p = parseInt(materialPrice);
    const newItem: ObjectMaterial = {
      id: Date.now().toString(),
      name: manualMaterialName,
      quantity: q,
      unit: 'шт',
      price: p,
      date: new Date().toISOString().split('T')[0],
    };
    setMaterials(prev => [...prev, newItem]);
    if (object) addObjectMaterialItem({ id: newItem.id, object_id: object.id, name: newItem.name, quantity: newItem.quantity, unit: newItem.unit, purchase_price: newItem.price, sale_price: newItem.price, markup: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    setManualMaterialName('');
    setMaterialQuantity('');
    setMaterialPrice('');
    setShowAddMaterialModal(false);
  };

  // Event handlers
  const handleAddEvent = () => {
    if (!newEventDate || !newEventTime) return;
    const eventType = EVENT_TYPES.find(t => t.value === newEventType);
    const newEvent: ObjectEventItem = {
      id: Date.now().toString(),
      type: newEventType,
      title: newEventTitle || eventType?.label || 'Событие',
      date: newEventDate,
      time: newEventTime,
      status: 'new',
    };
    setObjectEvents(prev => [...prev, newEvent]);
    setNewEventType('measurement');
    setNewEventDate(new Date().toISOString().split('T')[0]);
    setNewEventTime('10:00');
    setNewEventTitle('');
    setShowAddEventModal(false);
  };

  const handleUpdateEventStatus = (eventId: string, newStatus: ObjectEventItem['status']) => {
    setObjectEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
  };

  // File handler
  const handleUpdateFileStatus = (type: ObjectFileItem['type'], newStatus: ObjectFileItem['status']) => {
    setFiles(prev => {
      const existing = prev.find(f => f.type === type);
      if (existing) {
        return prev.map(f => f.type === type ? { ...f, status: newStatus } : f);
      } else {
        const fileType = FILE_TYPES.find(t => t.type === type);
        return [...prev, { type, name: fileType?.name || type, status: newStatus }];
      }
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
          >
            {/* Header */}
            <div
              className="flex-shrink-0 p-4 border-b"
              style={{ borderColor: `${color}30` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-foreground truncate">{object.name}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-lg"
                      style={{ backgroundColor: `${color}25`, color }}
                    >
                      {label}
                    </span>
                    <span className="text-xs text-muted-weak">#{object.id.slice(0, 6)}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-card-elevated transition-colors"
                >
                  <X className="w-5 h-5 text-muted-weak" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-weak">Бюджет</p>
                  <p className="text-sm font-bold text-foreground">{fmt(object.budget)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-weak">Прибыль</p>
                  <p className="text-sm font-bold text-success">{fmt(object.profit)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-weak">Маржа</p>
                  <p className="text-sm font-bold" style={{ color }}>{margin.toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-2 border-b border-border flex-shrink-0 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-accent/20 text-accent'
                        : 'text-muted-weak hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* MAIN TAB */}
              {activeTab === 'main' && (
                <div className="space-y-4">
                  {/* Client Info */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-muted-weak" />
                      <h3 className="text-sm font-medium text-foreground">Клиент</h3>
                    </div>
                    <p className="text-base font-semibold text-foreground">Иван Иванов</p>
                    <p className="text-sm text-muted">+7 (999) 123-45-67</p>
                  </div>

                  {/* Address */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-weak" />
                      <h3 className="text-sm font-medium text-foreground">Адрес</h3>
                    </div>
                    <p className="text-sm text-foreground">{object.address}</p>
                  </div>

                  {/* Progress */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-foreground">Прогресс</h3>
                      <span className="text-sm font-bold" style={{ color }}>{object.progress}%</span>
                    </div>
                    <div className="h-2 bg-card-elevated rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${object.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* History */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <History className="w-4 h-4 text-muted-weak" />
                      <h3 className="text-sm font-medium text-foreground">История</h3>
                    </div>
                    <div className="space-y-3">
                      {demoHistory.map((h) => (
                        <div key={h.id} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{h.action}</p>
                            <p className="text-xs text-muted-weak">{h.date} - {h.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* WORK TAB */}
              {activeTab === 'work' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">Работы по объекту</h3>
                    <span className="text-xs text-muted-weak">{workItems.length} поз.</span>
                  </div>

                  {workItems.length > 0 ? (
                    <>
                      {workItems.map((work) => (
                        <div
                          key={work.id}
                          className="rounded-xl p-3"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">{work.name}</p>
                              <p className="text-xs text-muted-weak">{work.quantity} {work.unit} x {fmt(work.pricePerUnit)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-foreground">{fmt(work.total)}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="rounded-xl p-3 mt-4" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">Итого работы</span>
                          <span className="text-base font-bold text-accent">{fmt(totalWorkCost)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Wrench className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-weak">Нет добавленных работ</p>
                    </div>
                  )}

                  <button
                    onClick={() => setShowAddWorkModal(true)}
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                    style={{ background: '#3B82F6', color: '#FFFFFF' }}
                  >
                    <Plus className="w-5 h-5" />
                    Добавить работу
                  </button>
                </div>
              )}

              {/* MATERIALS TAB */}
              {activeTab === 'materials' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">Списанные материалы</h3>
                    <span className="text-xs text-muted-weak">{materials.length} поз.</span>
                  </div>

                  {materials.length > 0 ? (
                    <>
                      {materials.map((mat) => (
                        <div
                          key={mat.id}
                          className="rounded-xl p-3"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">{mat.name}</p>
                              <p className="text-xs text-muted-weak">{mat.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-foreground">{mat.quantity} {mat.unit}</p>
                              <p className="text-xs text-muted">{fmt(mat.quantity * mat.price)}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="rounded-xl p-3 mt-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">Итого материалы</span>
                          <span className="text-base font-bold text-warning">{fmt(totalMaterialsCost)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-weak">Нет материалов</p>
                    </div>
                  )}

                  <button
                    onClick={() => setFormPage({ type: 'addMaterial' })}
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                    style={{ background: '#3B82F6', color: '#FFFFFF' }}
                  >
                    <Plus className="w-5 h-5" />
                    Добавить материал
                  </button>
                </div>
              )}

              {/* EVENTS TAB */}
              {activeTab === 'events' && (
                <div className="space-y-3">
                  {objectEvents.length > 0 ? (
                    <>
                      {objectEvents.map((ev) => {
                        const evType = EVENT_TYPES.find(t => t.value === ev.type);
                        const evColor = evType?.color || '#64748B';
                        const statusInfo = EVENT_STATUSES.find(s => s.value === ev.status) || EVENT_STATUSES[0];

                        return (
                          <div
                            key={ev.id}
                            className="rounded-xl p-3"
                            style={{ background: `${evColor}08`, border: `1px solid ${evColor}20` }}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: evColor }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{ev.title}</p>
                                <p className="text-xs text-muted-weak">{ev.date} - {ev.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <select
                                value={ev.status}
                                onChange={(e) => handleUpdateEventStatus(ev.id, e.target.value as ObjectEventItem['status'])}
                                className="text-xs px-2 py-1 rounded-lg appearance-none cursor-pointer"
                                style={{
                                  background: `${statusInfo.color}20`,
                                  color: statusInfo.color,
                                  border: 'none',
                                }}
                              >
                                {EVENT_STATUSES.map(s => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-weak">Нет событий</p>
                    </div>
                  )}

                  <button
                    onClick={() => setFormPage({ type: 'addEvent', preselectedObjectId: object.id })}
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                    style={{ background: '#3B82F6', color: '#FFFFFF' }}
                  >
                    <Plus className="w-5 h-5" />
                    Добавить событие
                  </button>
                </div>
              )}

              {/* FINANCE TAB */}
              {activeTab === 'finance' && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-xs text-muted-weak">Доходы</span>
                      </div>
                      <p className="text-base font-bold text-success">{fmt(object.budget)}</p>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-error" />
                        <span className="text-xs text-muted-weak">Расходы</span>
                      </div>
                      <p className="text-base font-bold text-error">{fmt(object.spent)}</p>
                    </div>
                  </div>

                  {/* Profit Details */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <h3 className="text-sm font-medium text-foreground">Финансы объекта</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted">Бюджет</span>
                        <span className="text-sm font-medium text-foreground">{fmt(object.budget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted">Расходы</span>
                        <span className="text-sm font-medium text-error">{fmt(object.spent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted">Прибыль</span>
                        <span className="text-sm font-medium text-success">{fmt(object.profit)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-border/50">
                        <span className="text-sm text-muted">Маржа</span>
                        <span className="text-sm font-bold text-warning">{margin.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted">Оплачено</span>
                        <span className="text-sm font-medium text-foreground">{fmt(received)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted">Осталось получить</span>
                        <span className="text-sm font-medium text-warning">{fmt(Math.max(0, remaining))}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-border/50">
                        <span className="text-sm font-medium text-foreground">Моя доля (50%)</span>
                        <span className="text-base font-bold text-warning">{fmt(myShare)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FILES TAB */}
              {activeTab === 'files' && (
                <div className="space-y-3">
                  <div className="text-center py-4">
                    <FileText className="w-10 h-10 text-muted-weak mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-muted-weak">Фото, PDF, документы</p>
                  </div>

                  {FILE_TYPES.map((fileType) => {
                    const existingFile = files.find(f => f.type === fileType.type);
                    const statusInfo = existingFile ? {
                      value: existingFile.status,
                      label: existingFile.status === 'not_used' ? 'Не используется' :
                             existingFile.status === 'in_progress' ? 'В работе' : 'Готово',
                      color: existingFile.status === 'not_used' ? '#64748B' :
                             existingFile.status === 'in_progress' ? '#3B82F6' : '#22C55E',
                    } : { value: 'not_used', label: 'Не используется', color: '#64748B' };

                    return (
                      <div
                        key={fileType.type}
                        className="rounded-xl p-3 flex items-center justify-between"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <span className="text-sm text-foreground">{fileType.name}</span>
                        <select
                          value={statusInfo.value}
                          onChange={(e) => handleUpdateFileStatus(fileType.type, e.target.value as ObjectFileItem['status'])}
                          className="text-xs px-2 py-1 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `${statusInfo.color}20`,
                            color: statusInfo.color,
                            border: 'none',
                          }}
                        >
                          <option value="not_used">Не используется</option>
                          <option value="in_progress">В работе</option>
                          <option value="done">Готово</option>
                        </select>
                      </div>
                    );
                  })}

                  <button
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all mt-4"
                    style={{ background: '#3B82F6', color: '#FFFFFF' }}
                  >
                    <Plus className="w-5 h-5" />
                    Добавить файл
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex-shrink-0 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-3 rounded-xl font-medium text-error transition-colors"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-medium text-foreground transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
              >
                Закрыть
              </button>
              <button
                onClick={() => { setFormPage({ type: 'editObject', object }); }}
                className="flex-1 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Редактировать
              </button>
            </div>
          </motion.div>

          {/* Add Work Modal */}
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
            catalog={WORK_CATALOG}
          />

          {/* Add Material Modal */}
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

          {/* Add Event Modal (object-specific) */}
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

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{ zIndex: 200, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowDeleteConfirm(false)}
            >
              <div
                className="rounded-[20px] p-5 max-w-sm w-full text-center"
                style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-base font-semibold text-foreground mb-2">Удалить объект?</h3>
                <p className="text-sm text-muted mb-4">Это действие нельзя отменить. Объект будет удален безвозвратно.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-xl font-medium text-foreground"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={() => { if (object) { deleteObject(object.id); setShowDeleteConfirm(false); onClose(); } }}
                    className="flex-1 py-3 rounded-xl font-medium text-white"
                    style={{ background: '#EF4444' }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

interface CatalogWork {
  name: string;
  price: number;
  unit: string;
}

// Add Work Modal Component
function AddWorkModal({
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
  catalog,
}: {
  isOpen: boolean;
  onClose: () => void;
  inputType: 'catalog' | 'manual';
  setInputType: (v: 'catalog' | 'manual') => void;
  selectedCatalogWork: CatalogWork | null;
  setSelectedCatalogWork: (v: CatalogWork | null) => void;
  manualWorkName: string;
  setManualWorkName: (v: string) => void;
  workQuantity: string;
  setWorkQuantity: (v: string) => void;
  workPrice: string;
  setWorkPrice: (v: string) => void;
  onAddFromCatalog: () => void;
  onAddManual: () => void;
  catalog: CatalogWork[];
}) {
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
                    const work = catalog.find(w => w.name === e.target.value);
                    setSelectedCatalogWork(work || null);
                    if (work) setWorkPrice(work.price.toString());
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
                  style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                >
                  <option value="">-- Выберите --</option>
                  {catalog.map((w) => (
                    <option key={w.name} value={w.name}>{w.name} ({fmt(w.price)}/{w.unit})</option>
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
                    {fmt(parseInt(workQuantity) * selectedCatalogWork.price)}
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
                    {fmt(parseInt(workQuantity) * parseInt(workPrice))}
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

// Add Material Modal Component
function AddMaterialModal({
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
}: {
  isOpen: boolean;
  onClose: () => void;
  inputType: 'warehouse' | 'manual';
  setInputType: (v: 'warehouse' | 'manual') => void;
  manualMaterialName: string;
  setManualMaterialName: (v: string) => void;
  materialQuantity: string;
  setMaterialQuantity: (v: string) => void;
  materialPrice: string;
  setMaterialPrice: (v: string) => void;
  onAdd: () => void;
}) {
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
              <Package className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
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

              {materialQuantity && materialPrice && (
                <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)' }}>
                  <p className="text-sm" style={{ color: '#94A3B8' }}>Итого:</p>
                  <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                    {fmt(parseInt(materialQuantity) * parseInt(materialPrice))}
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

// Add Object Event Modal Component
function AddObjectEventModal({
  isOpen,
  onClose,
  eventType,
  setEventType,
  eventDate,
  setEventDate,
  eventTime,
  setEventTime,
  eventTitle,
  setEventTitle,
  onAdd,
  eventTypes,
}: {
  isOpen: boolean;
  onClose: () => void;
  eventType: string;
  setEventType: (v: string) => void;
  eventDate: string;
  setEventDate: (v: string) => void;
  eventTime: string;
  setEventTime: (v: string) => void;
  eventTitle: string;
  setEventTitle: (v: string) => void;
  onAdd: () => void;
  eventTypes: typeof EVENT_TYPES;
}) {
  if (!isOpen) return null;

  const selectedType = eventTypes.find(t => t.value === eventType);

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
          <h2 className="text-lg font-semibold text-center" style={{ color: '#FFFFFF' }}>Добавить событие</h2>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Тип события</label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setEventType(t.value)}
                  className="py-3 px-3 rounded-xl flex items-center gap-2 text-sm"
                  style={{
                    background: eventType === t.value ? '#3B82F6' : '#1E293B',
                    color: '#FFFFFF',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: eventType === t.value ? '#FFFFFF' : t.color }}
                  />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Дата</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
              />
            </div>
            <div>
              <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Время</label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>Название (необязательно)</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder={selectedType?.label || 'Название'}
              className="w-full px-4 py-3 rounded-xl"
              style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
            />
          </div>

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
