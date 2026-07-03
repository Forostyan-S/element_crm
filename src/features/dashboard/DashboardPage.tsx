import { motion } from 'framer-motion';
import {
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import { KPICard } from './KPICard';
import { CalendarWidget } from './CalendarWidget';
import { RecentObjects } from './RecentObjects';
import { RecentTransactions } from './RecentTransactions';
import { useStore } from '../../store';
import type { ObjectStatus } from '../../types';

const demoObjects = [
  {
    id: '1',
    name: 'Квартира Иванов',
    client_id: '1',
    address: 'ул. Ленина, 15, кв. 42',
    status: 'in_progress' as ObjectStatus,
    budget: 450000,
    spent: 180000,
    profit: 120000,
    progress: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Дом Петровых',
    client_id: '2',
    address: 'пос. Солнечный, 8',
    status: 'measurement' as ObjectStatus,
    budget: 890000,
    spent: 0,
    profit: 0,
    progress: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Офис ТЦ Меридиан',
    client_id: '3',
    address: 'ТЦ Меридиан, 3 этаж',
    status: 'completed' as ObjectStatus,
    budget: 320000,
    spent: 280000,
    profit: 95000,
    progress: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Коттедж Сидоров',
    client_id: '4',
    address: 'КП Лесная поляна, 15',
    status: 'approval' as ObjectStatus,
    budget: 1250000,
    spent: 0,
    profit: 0,
    progress: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Магазин Цветочный',
    client_id: '5',
    address: 'ул. Гагарина, 22',
    status: 'new' as ObjectStatus,
    budget: 180000,
    spent: 0,
    profit: 0,
    progress: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Склад Восточный',
    client_id: '6',
    address: 'Промышленная зона, 3',
    status: 'estimate' as ObjectStatus,
    budget: 560000,
    spent: 0,
    profit: 0,
    progress: 35,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoTransactions = [
  {
    id: '1',
    type: 'income' as const,
    category: 'payment' as const,
    amount: 150000,
    description: 'Аванс за квартиру Иванов',
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'expense' as const,
    category: 'material' as const,
    amount: 45200,
    description: 'Кабель ВВГ 3x2.5',
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'expense' as const,
    category: 'salary' as const,
    amount: 85000,
    description: 'Зарплата за неделю',
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'income' as const,
    category: 'payment' as const,
    amount: 320000,
    description: 'Оплата за офис Меридиан',
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];

const demoEvents = [
  {
    id: '1',
    title: 'Замер квартиры',
    type: 'measurement' as const,
    date: new Date().toISOString(),
    time: '10:00',
    all_day: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Монтаж у Ивановых',
    type: 'installation' as const,
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '09:00',
    all_day: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Встреча с клиентом',
    type: 'meeting' as const,
    date: new Date(Date.now() + 172800000).toISOString(),
    time: '14:00',
    all_day: false,
    created_at: new Date().toISOString(),
  },
];

export function DashboardPage() {
  const { objects, transactions, events, setActiveTab, setFinanceFilter } = useStore();

  const displayObjects = objects.length > 0 ? objects : demoObjects;
  const displayTransactions = transactions.length > 0 ? transactions : demoTransactions;
  const displayEvents = events.length > 0 ? events : demoEvents;

  const fmt = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const totalIncome = displayTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((s, tx) => s + tx.amount, 0);

  const totalExpense = displayTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((s, tx) => s + tx.amount, 0);

  const netProfit = totalIncome - totalExpense;
  const myShare = Math.max(0, netProfit / 2);

  const activeStatuses: ObjectStatus[] = ['new', 'measurement', 'estimate', 'approval', 'in_progress', 'waiting_materials'];
  const activeObjectsList = displayObjects.filter((o) => activeStatuses.includes(o.status as ObjectStatus));
  const activeObjectsCount = activeObjectsList.length;

  return (
    <motion.div
      className="pb-4 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* KPI Grid — 2x2 */}
      <section className="grid grid-cols-2 gap-3 px-4">
        <KPICard
          title="Активные объекты"
          value={activeObjectsCount.toString()}
          subtitle={`всего ${displayObjects.length}`}
          icon={Building2}
          color="#3B82F6"
          delay={0}
          onClick={() => setActiveTab('objects')}
        />
        <KPICard
          title="Оборот"
          value={fmt(totalIncome)}
          change={12.5}
          icon={TrendingUp}
          color="#22C55E"
          delay={0.05}
          onClick={() => { setFinanceFilter('all'); setActiveTab('finances'); }}
        />
        <KPICard
          title="Расходы"
          value={fmt(totalExpense)}
          change={-8.3}
          icon={TrendingDown}
          color="#EF4444"
          delay={0.1}
          onClick={() => { setFinanceFilter('expense'); setActiveTab('finances'); }}
        />
        <KPICard
          title="Моя доля"
          value={fmt(myShare)}
          subtitle="50% от прибыли"
          icon={DollarSign}
          color="#F59E0B"
          delay={0.15}
          onClick={() => { setFinanceFilter('myShare'); setActiveTab('finances'); }}
        />
      </section>

      {/* Calendar Widget - First working block */}
      <CalendarWidget events={displayEvents} onEventClick={() => setActiveTab('calendar')} />

      {/* Active Objects */}
      <RecentObjects objects={activeObjectsList} onObjectClick={() => setActiveTab('objects')} />

      {/* Recent Transactions */}
      <RecentTransactions transactions={displayTransactions} onTransactionClick={() => setActiveTab('finances')} />
    </motion.div>
  );
}
