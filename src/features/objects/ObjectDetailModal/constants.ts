import { MapPin, Wrench, Package, Calendar, Wallet, FileText } from 'lucide-react';
import type { TabId, ObjectFileItem } from './types';
import type { EventType } from '../../../types';

export const tabs: Array<{ id: TabId; label: string; icon: typeof MapPin }> = [
  { id: 'main', label: 'Основное', icon: MapPin },
  { id: 'work', label: 'Работа', icon: Wrench },
  { id: 'materials', label: 'Материалы', icon: Package },
  { id: 'events', label: 'События', icon: Calendar },
  { id: 'finance', label: 'Финансы', icon: Wallet },
  { id: 'files', label: 'Файлы', icon: FileText },
];

export const fmt = (v: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

export const FILE_TYPES: Array<{ type: ObjectFileItem['type']; name: string }> = [
  { type: 'estimate', name: 'Смета' },
  { type: 'contract', name: 'Договор' },
  { type: 'report', name: 'Отчет' },
  { type: 'act', name: 'Акт выполненных работ' },
  { type: 'wiring_plan', name: 'План электропроводки' },
  { type: 'single_line', name: 'Однолинейная схема' },
];

export const WORK_CATALOG = [
  { name: 'Прокладка кабеля', unit: 'м', price: 150 },
  { name: 'Установка розетки', unit: 'шт', price: 500 },
  { name: 'Установка выключателя', unit: 'шт', price: 450 },
  { name: 'Монтаж распределительной коробки', unit: 'шт', price: 800 },
  { name: 'Сборка щита', unit: 'шт', price: 5000 },
  { name: 'Установка автомата', unit: 'шт', price: 350 },
];

export const EVENT_TYPES: Array<{ value: EventType; label: string; color: string }> = [
  { value: 'measurement', label: 'Замер', color: '#F59E0B' },
  { value: 'installation', label: 'Монтаж', color: '#3B82F6' },
  { value: 'purchase', label: 'Закупка', color: '#22C55E' },
  { value: 'handover', label: 'Сдача', color: '#A855F7' },
];

export const EVENT_STATUSES = [
  { value: 'new', label: 'Новый', color: '#6B7280' },
  { value: 'in_progress', label: 'В работе', color: '#3B82F6' },
  { value: 'completed', label: 'Завершено', color: '#22C55E' },
  { value: 'cancelled', label: 'Отменено', color: '#EF4444' },
];
