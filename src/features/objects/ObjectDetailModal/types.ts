import type { CalendarEvent, ConstructionObject, EventType } from '../../../types';

export type TabId = 'main' | 'work' | 'materials' | 'events' | 'finance' | 'files';

export interface WorkItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
}

export interface ObjectMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  markup: number;
  date: string;
}

export interface ObjectFileItem {
  type: 'estimate' | 'contract' | 'report' | 'act' | 'wiring_plan' | 'single_line';
  name: string;
  status: 'not_used' | 'in_progress' | 'done';
}

export type ObjectEventStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export interface ObjectEventItem {
  id: string;
  type: EventType;
  title: string;
  date: string;
  time?: string;
  status: ObjectEventStatus;
}

export interface CatalogWork {
  name: string;
  unit: string;
  price: number;
}

export interface HistoryEntry {
  id: string;
  action: string;
  date: string;
  user: string;
}

export interface ObjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  object: ConstructionObject | null;
}

export interface ObjectDetailModalState {
  workItems: WorkItem[];
  materials: ObjectMaterial[];
  events: CalendarEvent[];
}
