import { create } from 'zustand';
import type {
  ConstructionObject,
  Transaction,
  CalendarEvent,
  Client,
  User,
  ObjectStatus,
  TelegramSettings,
  Material,
  WarehouseOperation,
  Purchase,
  ObjectHistoryEntry,
  TransactionType,
  ObjectWorkItem,
  ObjectMaterialItem,
} from '../types';

export type FormPageState =
  | { type: 'addObject' }
  | { type: 'editObject'; object: ConstructionObject }
  | { type: 'addTransaction'; defaultType?: TransactionType }
  | { type: 'editTransaction'; transaction: Transaction }
  | { type: 'addEvent'; selectedDate?: string; preselectedObjectId?: string }
  | { type: 'editEvent'; event: CalendarEvent }
  | { type: 'addMaterial' }
  | { type: 'editMaterial'; material: Material }
  | { type: 'telegram' }
  | { type: 'warehouse' }
  | { type: 'profile' }
  | { type: 'serviceCatalog' }
  | { type: 'materialCatalog' }
  | { type: 'financeCategories' }
  | { type: 'eventTypes' }
  | { type: 'export' }
  | { type: 'backup' }
  | { type: 'danger' };

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;

  objects: ConstructionObject[];
  setObjects: (objects: ConstructionObject[]) => void;
  addObject: (object: ConstructionObject) => void;
  updateObject: (id: string, updates: Partial<ConstructionObject>) => void;
  deleteObject: (id: string) => void;

  objectWorkItems: ObjectWorkItem[];
  addObjectWorkItem: (item: ObjectWorkItem) => void;
  updateObjectWorkItem: (id: string, updates: Partial<ObjectWorkItem>) => void;
  deleteObjectWorkItem: (id: string) => void;

  objectMaterialItems: ObjectMaterialItem[];
  addObjectMaterialItem: (item: ObjectMaterialItem) => void;
  updateObjectMaterialItem: (id: string, updates: Partial<ObjectMaterialItem>) => void;
  deleteObjectMaterialItem: (id: string) => void;

  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;

  telegramSettings: TelegramSettings;
  setTelegramSettings: (settings: Partial<TelegramSettings>) => void;

  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;

  warehouseOperations: WarehouseOperation[];
  setWarehouseOperations: (operations: WarehouseOperation[]) => void;
  addWarehouseOperation: (operation: WarehouseOperation) => void;

  purchases: Purchase[];
  setPurchases: (purchases: Purchase[]) => void;
  addPurchase: (purchase: Purchase) => void;
  updatePurchase: (id: string, updates: Partial<Purchase>) => void;
  deletePurchase: (id: string) => void;

  objectHistory: ObjectHistoryEntry[];
  setObjectHistory: (history: ObjectHistoryEntry[]) => void;
  addObjectHistoryEntry: (entry: ObjectHistoryEntry) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeTab: 'home' | 'objects' | 'calendar' | 'finances' | 'warehouse' | 'settings';
  setActiveTab: (tab: 'home' | 'objects' | 'calendar' | 'finances' | 'warehouse' | 'settings') => void;

  isFabOpen: boolean;
  setIsFabOpen: (open: boolean) => void;
  toggleFab: () => void;

  // Track if any modal is open to hide FAB
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;

  objectStatusFilter: ObjectStatus | 'all';
  setObjectStatusFilter: (status: ObjectStatus | 'all') => void;

  financeFilter: 'all' | 'income' | 'expense' | 'myShare';
  setFinanceFilter: (filter: 'all' | 'income' | 'expense' | 'myShare') => void;

  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  formPage: FormPageState | null;
  setFormPage: (page: FormPageState | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: {
    id: '1',
    email: 'sergey@element.ru',
    name: 'Сергей',
    role: 'admin',
    avatar_url: undefined,
    created_at: new Date().toISOString(),
  },
  setUser: (user) => set({ user }),

  objects: [
    {
      id: '1',
      name: 'Квартира Иванов',
      client_id: '1',
      address: 'ул. Ленина, 15, кв. 42',
      status: 'in_progress',
      budget: 450000,
      spent: 180000,
      profit: 120000,
      progress: 65,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Дом Петровых',
      client_id: '2',
      address: 'пос. Солнечный, 8',
      status: 'measurement',
      budget: 1200000,
      spent: 0,
      profit: 0,
      progress: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Коттедж Сидоров',
      client_id: '3',
      address: 'КП Лесная поляна, 15',
      status: 'completed',
      budget: 850000,
      spent: 620000,
      profit: 230000,
      progress: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  setObjects: (objects) => set({ objects }),
  addObject: (object) => set((state) => ({ objects: [...state.objects, object] })),
  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)),
    })),
  deleteObject: (id) =>
    set((state) => ({ objects: state.objects.filter((obj) => obj.id !== id) })),

  objectWorkItems: [],
  addObjectWorkItem: (item) => set((state) => ({ objectWorkItems: [...state.objectWorkItems, item] })),
  updateObjectWorkItem: (id, updates) => set((state) => ({
    objectWorkItems: state.objectWorkItems.map((item) => item.id === id ? { ...item, ...updates } : item),
  })),
  deleteObjectWorkItem: (id) => set((state) => ({
    objectWorkItems: state.objectWorkItems.filter((item) => item.id !== id),
  })),

  objectMaterialItems: [],
  addObjectMaterialItem: (item) => set((state) => ({ objectMaterialItems: [...state.objectMaterialItems, item] })),
  updateObjectMaterialItem: (id, updates) => set((state) => ({
    objectMaterialItems: state.objectMaterialItems.map((item) => item.id === id ? { ...item, ...updates } : item),
  })),
  deleteObjectMaterialItem: (id) => set((state) => ({
    objectMaterialItems: state.objectMaterialItems.filter((item) => item.id !== id),
  })),

  clients: [],
  setClients: (clients) => set({ clients }),
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (id, updates) =>
    set((state) => ({
      clients: state.clients.map((client) => (client.id === id ? { ...client, ...updates } : client)),
    })),
  deleteClient: (id) =>
    set((state) => ({ clients: state.clients.filter((client) => client.id !== id) })),

  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx)),
    })),
  deleteTransaction: (id) =>
    set((state) => ({ transactions: state.transactions.filter((tx) => tx.id !== id) })),

  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((event) => (event.id === id ? { ...event, ...updates } : event)),
    })),
  deleteEvent: (id) =>
    set((state) => ({ events: state.events.filter((event) => event.id !== id) })),

  telegramSettings: {
    botToken: '',
    chatId: '',
    notificationsEnabled: false,
  },
  setTelegramSettings: (settings) =>
    set((state) => ({ telegramSettings: { ...state.telegramSettings, ...settings } })),

  materials: [],
  setMaterials: (materials) => set({ materials }),
  addMaterial: (material) => set((state) => ({ materials: [...state.materials, material] })),
  updateMaterial: (id, updates) =>
    set((state) => ({
      materials: state.materials.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  deleteMaterial: (id) =>
    set((state) => ({ materials: state.materials.filter((m) => m.id !== id) })),

  warehouseOperations: [],
  setWarehouseOperations: (operations) => set({ warehouseOperations: operations }),
  addWarehouseOperation: (operation) =>
    set((state) => ({ warehouseOperations: [...state.warehouseOperations, operation] })),

  purchases: [],
  setPurchases: (purchases) => set({ purchases }),
  addPurchase: (purchase) => set((state) => ({ purchases: [...state.purchases, purchase] })),
  updatePurchase: (id, updates) =>
    set((state) => ({
      purchases: state.purchases.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deletePurchase: (id) =>
    set((state) => ({ purchases: state.purchases.filter((p) => p.id !== id) })),

  objectHistory: [],
  setObjectHistory: (history) => set({ objectHistory: history }),
  addObjectHistoryEntry: (entry) =>
    set((state) => ({ objectHistory: [...state.objectHistory, entry] })),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isFabOpen: false,
  setIsFabOpen: (open) => set({ isFabOpen: open }),
  toggleFab: () => set((state) => ({ isFabOpen: !state.isFabOpen })),

  isModalOpen: false,
  setIsModalOpen: (open) => set({ isModalOpen: open }),

  objectStatusFilter: 'all',
  setObjectStatusFilter: (status) => set({ objectStatusFilter: status }),

  financeFilter: 'all',
  setFinanceFilter: (filter) => set({ financeFilter: filter }),

  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  formPage: null,
  setFormPage: (page) => set({ formPage: page }),

  

}));
