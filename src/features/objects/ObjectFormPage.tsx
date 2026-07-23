import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Search, UserPlus, User as UserIcon } from 'lucide-react';
import { useStore } from '../../store';
import { FormPageShell, Field, Input, Textarea } from '../../ui';
import { OBJECT_STATUS_LABELS } from '../../types';
import type { ConstructionObject, ObjectStatus, Client } from '../../types';

interface ObjectFormPageProps {
  editObject?: ConstructionObject | null;
  onBack: () => void;
  onSaved?: () => void;
}

const STATUS_OPTIONS = Object.entries(OBJECT_STATUS_LABELS) as [ObjectStatus, string][];

const OBJECT_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Дом' },
  { value: 'office', label: 'Офис' },
  { value: 'shop', label: 'Магазин' },
  { value: 'commercial', label: 'Коммерция' },
  { value: 'industrial', label: 'Производство' },
] as const;

export type ObjectType = typeof OBJECT_TYPES[number]['value'];

const TOTAL_STEPS = 4;

export function ObjectFormPage({ editObject, onBack, onSaved }: ObjectFormPageProps) {
  const { addObject, updateObject, deleteObject, clients, addClient, addObjectHistoryEntry } = useStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [objectNumber, setObjectNumber] = useState('');
  const [status, setStatus] = useState<ObjectStatus>('new');
  const [objectType, setObjectType] = useState<ObjectType>('apartment');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [rooms, setRooms] = useState('');
  const [contactMode, setContactMode] = useState<'select' | 'new'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEdit = !!editObject;

  useEffect(() => {
    if (editObject) {
      setName(editObject.name);
      setStreet(editObject.street || editObject.address || '');
      setHouse(editObject.house || '');
      setApartment(editObject.apartment || '');
      setEntrance(editObject.entrance || '');
      setObjectNumber(editObject.object_number || '');
      setStatus(editObject.status);
      setObjectType(editObject.object_type || 'apartment');
      setArea(editObject.area !== undefined ? String(editObject.area) : '');
      setFloor(editObject.floor !== undefined ? String(editObject.floor) : '');
      setRooms(editObject.rooms !== undefined ? String(editObject.rooms) : '');
      setStartDate(editObject.start_date || '');
      setEndDate(editObject.end_date || '');
      setDescription(editObject.description || '');
      setNotes(editObject.notes || '');
      if (editObject.client) {
        const existing = clients.find((c) => c.id === editObject.client_id);
        if (existing) {
          setSelectedClient(existing);
          setContactMode('select');
        } else {
          setNewClientName(editObject.client.name || '');
          setNewClientPhone(editObject.client.phone || '');
          setContactMode('new');
        }
      }
    }
  }, [editObject, clients]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.phone && c.phone.includes(q))
    );
  }, [clients, searchQuery]);

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!name.trim()) e.name = 'Введите название объекта';
      if (!street.trim()) e.street = 'Введите улицу';
      if (!house.trim()) e.house = 'Введите номер дома';
    }
    if (step === 1) {
      if (area && (isNaN(Number(area)) || Number(area) < 0)) e.area = 'Площадь должна быть числом';
    }
    if (step === 2) {
      if (contactMode === 'select' && !selectedClient) e.client = 'Выберите контакт';
      if (contactMode === 'new') {
        if (!newClientName.trim()) e.client = 'Введите имя клиента';
        if (newClientPhone && !/^[\d\s\+\-\(\)]+$/.test(newClientPhone)) e.phone = 'Некорректный телефон';
      }
    }
    if (step === 3) {
      if (startDate && endDate && new Date(endDate) < new Date(startDate))
        e.endDate = 'Дата окончания раньше даты начала';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const resolveClient = (): { clientId: string; client: Client } => {
    const now = new Date().toISOString();
    if (contactMode === 'select' && selectedClient) {
      return { clientId: selectedClient.id, client: selectedClient };
    }
    const newClient: Client = {
      id: Date.now().toString(),
      name: newClientName.trim(),
      phone: newClientPhone.trim(),
      created_at: now,
      updated_at: now,
    };
    addClient(newClient);
    return { clientId: newClient.id, client: newClient };
  };

  const handleSave = () => {
    if (!validateStep()) return;

    const now = new Date().toISOString();
    const { clientId, client } = resolveClient();
    const address = [street.trim(), house.trim() && `д. ${house.trim()}`, apartment.trim() && `кв. ${apartment.trim()}`]
      .filter(Boolean)
      .join(', ');
    const objectFields = {
      address,
      street: street.trim() || undefined,
      house: house.trim() || undefined,
      apartment: apartment.trim() || undefined,
      entrance: entrance.trim() || undefined,
      object_number: objectNumber.trim() || undefined,
      object_type: objectType,
      area: area.trim() ? Number(area) : undefined,
      floor: floor.trim() ? Number(floor) : undefined,
      rooms: rooms.trim() ? Number(rooms) : undefined,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (isEdit && editObject) {
      updateObject(editObject.id, {
        name: name.trim(),
        ...objectFields,
        status,
        client_id: clientId,
        client,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        updated_at: now,
      });
      addObjectHistoryEntry({
        id: Date.now().toString(),
        object_id: editObject.id,
        action_type: 'object_updated',
        description: 'Объект отредактирован',
        created_at: now,
      });
    } else {
      const newObject: ConstructionObject = {
        id: Date.now().toString(),
        name: name.trim(),
        client_id: clientId,
        client,
        ...objectFields,
        status,
        budget: 0,
        spent: 0,
        profit: 0,
        progress: 10,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        created_at: now,
        updated_at: now,
      };
      addObject(newObject);
      addObjectHistoryEntry({
        id: Date.now().toString(),
        object_id: newObject.id,
        action_type: 'object_created',
        description: 'Объект создан',
        created_at: now,
      });
    }
    onSaved?.();
    onBack();
  };

  const handleDelete = () => {
    if (editObject) {
      deleteObject(editObject.id);
      setShowDeleteConfirm(false);
      onBack();
    }
  };

  const footer = (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === step ? '24px' : '8px',
              background: i <= step ? '#3B82F6' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
      <div className="flex gap-3">
        {isEdit && step === 0 && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-3 rounded-xl font-medium text-error transition-colors"
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            Удалить
          </button>
        )}
        {step > 0 && (
          <button
            onClick={handlePrev}
            className="flex-1 py-3 rounded-xl font-medium text-foreground transition-colors"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            Назад
          </button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-1"
            style={{ background: '#3B82F6' }}
          >
            Далее
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-1.5"
            style={{ background: '#3B82F6' }}
          >
            <Check className="w-4 h-4" />
            {isEdit ? 'Сохранить' : 'Создать объект'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <FormPageShell
      title={isEdit ? 'Редактировать объект' : 'Новый объект'}
      onBack={onBack}
      footer={footer}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {step === 0 && (
            <>
              <Field label="Название" required error={errors.name}>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Квартира Иванова" error={!!errors.name} />
              </Field>
              {isEdit && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Статус">
                    <div className="rounded-xl px-3 py-2.5 text-sm text-muted" style={{ background: 'rgba(27, 33, 48, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      {OBJECT_STATUS_LABELS[status]}
                    </div>
                  </Field>
                  <Field label="№ объекта">
                    <Input value={objectNumber} onChange={(e) => setObjectNumber(e.target.value)} placeholder="А-001" />
                  </Field>
                </div>
              )}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted">Адрес</p>
                <div className="grid grid-cols-[1fr_112px] gap-3">
                  <Field label="Улица" required error={errors.street}>
                    <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="ул. Ленина" error={!!errors.street} />
                  </Field>
                  <Field label="Дом" required error={errors.house}>
                    <Input value={house} onChange={(e) => setHouse(e.target.value)} placeholder="15" error={!!errors.house} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Квартира">
                    <Input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="42" />
                  </Field>
                  <Field label="Подъезд">
                    <Input value={entrance} onChange={(e) => setEntrance(e.target.value)} placeholder="2" />
                  </Field>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-2">
                  Тип объекта
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {OBJECT_TYPES.map((type) => {
                    const isSelected = objectType === type.value;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setObjectType(type.value)}
                        className="py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: isSelected ? '#3B82F6' : 'rgba(27, 33, 48, 0.6)',
                          border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: isSelected ? '#FFFFFF' : '#94A3B8',
                        }}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Field label="Статус">
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.slice(0, 6).map(([value, label]) => {
                    const isSelected = status === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setStatus(value)}
                        className="py-2 px-3 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(27, 33, 48, 0.6)',
                          border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          color: isSelected ? '#3B82F6' : '#94A3B8',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </Field>
              {!isEdit && (
                <Field label="№ объекта">
                  <Input value={objectNumber} onChange={(e) => setObjectNumber(e.target.value)} placeholder="А-001" />
                </Field>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Площадь (м²)" error={errors.area}>
                <Input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="65" error={!!errors.area} />
              </Field>
              <Field label="Этаж">
                <Input type="number" value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="3" />
              </Field>
              <Field label="Количество комнат">
                <Input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder="2" />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              {/* Contact mode toggle */}
              <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(27, 33, 48, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  onClick={() => setContactMode('select')}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5"
                  style={{
                    background: contactMode === 'select' ? '#3B82F6' : 'transparent',
                    color: contactMode === 'select' ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  <UserIcon className="w-4 h-4" />
                  Выбрать контакт
                </button>
                <button
                  onClick={() => setContactMode('new')}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5"
                  style={{
                    background: contactMode === 'new' ? '#3B82F6' : 'transparent',
                    color: contactMode === 'new' ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                  Новый контакт
                </button>
              </div>

              {contactMode === 'select' ? (
                <div className="space-y-3">
                  {clients.length > 0 && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-weak" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск контакта..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-weak"
                        style={{ background: 'rgba(27, 33, 48, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                      />
                    </div>
                  )}

                  {errors.client && (
                    <p className="text-2xs text-error">{errors.client}</p>
                  )}

                  {filteredClients.length > 0 ? (
                    <div className="space-y-2">
                      {filteredClients.map((c) => {
                        const isSelected = selectedClient?.id === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => setSelectedClient(c)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                            style={{
                              background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(27, 33, 48, 0.6)',
                              border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                          >
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: isSelected ? '#3B82F6' : 'rgba(255, 255, 255, 0.05)' }}
                            >
                              <span className="text-sm font-semibold" style={{ color: isSelected ? '#FFFFFF' : '#94A3B8' }}>
                                {c.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                              {c.phone && <p className="text-xs text-muted-weak truncate">{c.phone}</p>}
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-weak mb-1">
                        {clients.length === 0 ? 'Нет сохранённых контактов' : 'Контакт не найден'}
                      </p>
                      <button
                        onClick={() => { setContactMode('new'); setSearchQuery(''); }}
                        className="text-sm text-accent font-medium"
                      >
                        Создать новый контакт
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Field label="Имя" required error={errors.client}>
                    <Input value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Иван Иванов" error={!!errors.client} />
                  </Field>
                  <Field label="Телефон" error={errors.phone}>
                    <Input type="tel" value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} placeholder="+7 999 123-45-67" error={!!errors.phone} />
                  </Field>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Дата начала">
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Field>
                <Field label="Дата окончания" error={errors.endDate}>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} error={!!errors.endDate} />
                </Field>
              </div>
              <Field label="Комментарий">
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание работ..." />
              </Field>
              <Field label="Заметки">
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Внутренние заметки..." />
              </Field>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 200, background: 'rgba(0, 0, 0, 0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              className="rounded-[20px] p-5 max-w-sm w-full text-center"
              style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
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
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-medium text-white"
                  style={{ background: '#EF4444' }}
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FormPageShell>
  );
}
