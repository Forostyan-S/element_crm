// Object Status Types
export type ObjectStatus =
  | 'new'
  | 'measurement'
  | 'estimate'
  | 'approval'
  | 'in_progress'
  | 'waiting_materials'
  | 'paused'
  | 'completed'
  | 'paid'
  | 'archived';

export const OBJECT_STATUS_LABELS: Record<ObjectStatus, string> = {
  new: 'Новый',
  measurement: 'Замер',
  estimate: 'Смета',
  approval: 'Согласование',
  in_progress: 'В работе',
  waiting_materials: 'Ожидание материалов',
  paused: 'Приостановлен',
  completed: 'Завершен',
  paid: 'Оплачен',
  archived: 'Архив',
};

export const OBJECT_STATUS_COLORS: Record<ObjectStatus, string> = {
  new: '#94A3B8',
  measurement: '#F59E0B',
  estimate: '#8B5CF6',
  approval: '#EC4899',
  in_progress: '#3B82F6',
  waiting_materials: '#F97316',
  paused: '#6B7280',
  completed: '#22C55E',
  paid: '#10B981',
  archived: '#4B5563',
};

export const OBJECT_STATUS_PROGRESS: Record<ObjectStatus, number> = {
  new: 10,
  measurement: 20,
  estimate: 35,
  approval: 50,
  in_progress: 75,
  waiting_materials: 65,
  paused: 60,
  completed: 100,
  paid: 100,
  archived: 100,
};

// Event Types
export type EventType =
  | 'measurement'
  | 'installation'
  | 'meeting'
  | 'purchase'
  | 'delivery'
  | 'call'
  | 'reminder';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  measurement: 'Замер',
  installation: 'Монтаж',
  meeting: 'Встреча',
  purchase: 'Закупка',
  delivery: 'Доставка',
  call: 'Созвон',
  reminder: 'Напоминание',
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  measurement: '#F59E0B',
  installation: '#3B82F6',
  meeting: '#8B5CF6',
  purchase: '#22C55E',
  delivery: '#10B981',
  call: '#06B6D4',
  reminder: '#EF4444',
};

// Transaction Types
export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'material'
  | 'salary'
  | 'equipment'
  | 'transport'
  | 'service'
  | 'payment'
  | 'other';

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  material: 'Материалы',
  salary: 'Зарплата',
  equipment: 'Оборудование',
  transport: 'Транспорт',
  service: 'Услуги',
  payment: 'Оплата клиента',
  other: 'Другое',
};

// Core Entities
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  telegram?: string;
  created_at: string;
  updated_at: string;
}

export interface ConstructionObject {
  id: string;
  name: string;
  client_id: string;
  client?: Client;
  address: string;
  /** Structured address fields are kept alongside the display-ready address. */
  street?: string;
  house?: string;
  apartment?: string;
  entrance?: string;
  floor?: number;
  object_number?: string;
  object_type?: 'apartment' | 'house' | 'office' | 'shop' | 'commercial' | 'industrial';
  area?: number;
  rooms?: number;
  status: ObjectStatus;
  /** Contract total. `budget` is retained for backwards compatibility. */
  total_cost?: number;
  budget: number;
  spent: number;
  profit: number;
  progress: number;
  description?: string;
  notes?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

/** A priced work included in an object's estimate. */
export interface ObjectWorkItem {
  id: string;
  object_id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  status: 'planned' | 'in_progress' | 'completed';
  date?: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}

/** A material allocated to an object. Prices are saved per line to preserve estimate history. */
export interface ObjectMaterialItem {
  id: string;
  object_id: string;
  material_id?: string;
  name: string;
  quantity: number;
  unit: string;
  purchase_price: number;
  sale_price: number;
  markup: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  object_id?: string;
  object?: ConstructionObject;
  date: string;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  end_time?: string;
  object_id?: string;
  object?: ConstructionObject;
  client_id?: string;
  client?: Client;
  description?: string;
  all_day: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'worker';
  avatar_url?: string;
  phone?: string;
  company?: string;
  city?: string;
  address?: string;
  created_at: string;
}

// Telegram settings
export interface TelegramSettings {
  botToken: string;
  chatId: string;
  notificationsEnabled: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  activeObjects: number;
  monthIncome: number;
  monthExpenses: number;
  netProfit: number;
  myShare: number;
  incomeChange: number;
  expensesChange: number;
  netProfitChange: number;
  myShareChange: number;
}

// Warehouse Types
export type OperationType = 'receipt' | 'writeoff' | 'return' | 'adjustment';
export type PurchaseStatus = 'draft' | 'ordered' | 'in_transit' | 'received';

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
  receipt: 'Поступление',
  writeoff: 'Списание',
  return: 'Возврат',
  adjustment: 'Корректировка',
};

export const PURCHASE_STATUS_LABELS: Record<PurchaseStatus, string> = {
  draft: 'Черновик',
  ordered: 'Заказано',
  in_transit: 'В пути',
  received: 'Получено',
};

export const PURCHASE_STATUS_COLORS: Record<PurchaseStatus, string> = {
  draft: '#64748B',
  ordered: '#F59E0B',
  in_transit: '#3B82F6',
  received: '#22C55E',
};

export interface Material {
  id: string;
  category: string;
  name: string;
  article?: string;
  manufacturer?: string;
  unit: string;
  current_stock: number;
  min_stock: number;
  purchase_price: number;
  sale_price: number;
  created_at: string;
  updated_at: string;
}

export interface WarehouseOperation {
  id: string;
  material_id: string;
  material?: Material;
  operation_type: OperationType;
  quantity: number;
  object_id?: string;
  object?: ConstructionObject;
  notes?: string;
  user_id?: string;
  created_at: string;
}

export interface Purchase {
  id: string;
  supplier: string;
  purchase_date: string;
  total_amount: number;
  status: PurchaseStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  material_id: string;
  material?: Material;
  quantity: number;
  price: number;
  created_at: string;
}

export interface ObjectHistoryEntry {
  id: string;
  object_id: string;
  action_type: string;
  description: string;
  user_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
