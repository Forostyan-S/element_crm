import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../store';
import { EmptyState } from '../../ui';
import { TransactionCard } from './TransactionCard';
import type { Transaction } from '../../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const demoTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'payment',
    amount: 150000,
    description: 'Аванс за квартиру Иванов',
    date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'expense',
    category: 'material',
    amount: 45200,
    description: 'Кабель ВВГ 3x2.5 — 500м',
    date: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    type: 'expense',
    category: 'salary',
    amount: 85000,
    description: 'Зарплата за неделю',
    date: new Date(Date.now() - 172800000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    type: 'income',
    category: 'payment',
    amount: 320000,
    description: 'Оплата за офис Меридиан',
    date: new Date(Date.now() - 259200000).toISOString(),
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '5',
    type: 'expense',
    category: 'equipment',
    amount: 28000,
    description: 'Перфоратор Bosch GBH',
    date: new Date(Date.now() - 345600000).toISOString(),
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '6',
    type: 'expense',
    category: 'transport',
    amount: 8500,
    description: 'Топливо',
    date: new Date(Date.now() - 432000000).toISOString(),
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
];

const monthlyData = [
  { month: 'Янв', income: 420000, expense: 280000, profit: 140000 },
  { month: 'Фев', income: 380000, expense: 310000, profit: 70000 },
  { month: 'Мар', income: 520000, expense: 350000, profit: 170000 },
  { month: 'Апр', income: 480000, expense: 290000, profit: 190000 },
  { month: 'Май', income: 650000, expense: 380000, profit: 270000 },
  { month: 'Июн', income: 854000, expense: 312000, profit: 542000 },
];

const fmt = (v: number) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);

const tooltipStyle = {
  backgroundColor: '#1B2130',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
};

type ChartTab = 'income' | 'expense' | 'profit';

export function FinancesPage() {
  const { transactions, financeFilter, setFinanceFilter, setFormPage } = useStore();
  const [chartTab, setChartTab] = useState<ChartTab>('income');

  const displayTransactions = transactions.length > 0 ? transactions : demoTransactions;

  const filteredTransactions =
    financeFilter === 'all'
      ? displayTransactions
      : financeFilter === 'myShare'
        ? displayTransactions.filter((tx) => tx.type === 'income')
        : displayTransactions.filter((tx) => tx.type === financeFilter);

  const totalIncome = displayTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((s, tx) => s + tx.amount, 0);
  const totalExpense = displayTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((s, tx) => s + tx.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const myShare = netProfit / 2;

  // Receivables demo: total project budgets minus received payments
  const receivables = 1250000 + 890000 - totalIncome;

  const CHART_TABS: Array<{ id: ChartTab; label: string; color: string }> = [
    { id: 'income', label: 'Доходы', color: '#22C55E' },
    { id: 'expense', label: 'Расходы', color: '#EF4444' },
    { id: 'profit', label: 'Прибыль', color: '#3B82F6' },
  ];

  return (
    <motion.div
      className="pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Cards — 2x2 */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-4">
        {/* Оборот */}
        <motion.div
          className="rounded-card p-4 relative overflow-hidden"
          style={{
            background: '#1B2130',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-success/10 blur-xl pointer-events-none" />
          <div className="w-8 h-8 rounded-xl bg-success/15 flex items-center justify-center mb-2">
            <ArrowUpRight className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xs text-muted-weak mb-0.5">Оборот</p>
          <p className="text-base font-bold text-foreground">{fmt(totalIncome)}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-2xs text-success">+12.5%</span>
          </div>
        </motion.div>

        {/* Расходы */}
        <motion.div
          className="rounded-card p-4 relative overflow-hidden"
          style={{
            background: '#1B2130',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-error/10 blur-xl pointer-events-none" />
          <div className="w-8 h-8 rounded-xl bg-error/15 flex items-center justify-center mb-2">
            <ArrowDownRight className="w-4 h-4 text-error" />
          </div>
          <p className="text-2xs text-muted-weak mb-0.5">Расходы</p>
          <p className="text-base font-bold text-foreground">{fmt(totalExpense)}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-error" />
            <span className="text-2xs text-error">-8.3%</span>
          </div>
        </motion.div>

        {/* Чистая прибыль */}
        <motion.div
          className="rounded-card p-4 relative overflow-hidden"
          style={{
            background: '#1B2130',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-accent/10 blur-xl pointer-events-none" />
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center mb-2">
            <PiggyBank className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xs text-muted-weak mb-0.5">Чистая прибыль</p>
          <p className="text-base font-bold text-foreground">{fmt(netProfit)}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-2xs text-success">+18.4%</span>
          </div>
        </motion.div>

        {/* Моя доля */}
        <motion.div
          className="rounded-card p-4 relative overflow-hidden"
          style={{
            background: '#1B2130',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-warning/10 blur-xl pointer-events-none" />
          <div className="w-8 h-8 rounded-xl bg-warning/15 flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xs text-muted-weak mb-0.5">Моя доля (50%)</p>
          <p className="text-base font-bold text-foreground">{fmt(myShare)}</p>
          <p className="text-2xs text-muted-weak mt-1">{fmt(netProfit)} ÷ 2</p>
        </motion.div>
      </div>

      {/* Receivables Card */}
      <motion.div
        className="mx-4 mb-5 rounded-card p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a2035 0%, #1B2130 100%)',
          border: '1px solid rgba(139,92,246,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted mb-0.5">Клиенты должны</p>
            <p className="text-xl font-bold text-foreground">{fmt(Math.max(0, receivables))}</p>
            <p className="text-2xs text-muted-weak">Дебиторская задолженность</p>
          </div>
          <div className="text-right">
            <div className="text-2xs text-muted-weak">По объектам</div>
            <div className="text-xs font-medium text-purple-400 mt-0.5">2 клиента</div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="px-4 mb-5">
        <motion.div
          className="rounded-card overflow-hidden"
          style={{
            background: '#1B2130',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {/* Chart tabs */}
          <div className="flex border-b border-border">
            {CHART_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setChartTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  chartTab === tab.id ? 'text-foreground border-b-2' : 'text-muted'
                }`}
                style={chartTab === tab.id ? { borderBottomColor: tab.color } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            <motion.div
              key={chartTab}
              className="h-52"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={CHART_TABS.find((t) => t.id === chartTab)?.color}
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_TABS.find((t) => t.id === chartTab)?.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748B"
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748B"
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: '#F1F5F9', fontWeight: 600 }}
                    itemStyle={{ color: '#94A3B8' }}
                    formatter={(value: number) => [`${value.toLocaleString()} ₽`]}
                  />
                  <Area
                    type="monotone"
                    dataKey={chartTab}
                    stroke={CHART_TABS.find((t) => t.id === chartTab)?.color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#gradFill)"
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    isAnimationActive
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Monthly bar comparison */}
      <div className="px-4 mb-5">
        <motion.div
          className="rounded-card overflow-hidden"
          style={{
            background: '#1B2130',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-4 pb-0">
            <h3 className="text-sm font-semibold text-foreground mb-3">Сравнение по месяцам</h3>
          </div>
          <div className="px-4 pb-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={14} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748B"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: '#F1F5F9', fontWeight: 600 }}
                  itemStyle={{ color: '#94A3B8' }}
                  formatter={(value: number) => [`${value.toLocaleString()} ₽`]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: '#94A3B8' }}
                  formatter={(value: string) =>
                    value === 'income' ? 'Доходы' : value === 'expense' ? 'Расходы' : 'Прибыль'
                  }
                />
                <Bar dataKey="income" fill="#22C55E" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} />
                <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} />
                <Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Transactions */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-foreground">Транзакции</h3>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-card-elevated">
            {(['all', 'income', 'expense', 'myShare'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFinanceFilter(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  financeFilter === type ? 'bg-accent text-white' : 'text-muted'
                }`}
              >
                {type === 'all' ? 'Все' : type === 'income' ? 'Доходы' : type === 'expense' ? 'Расходы' : 'Моя доля'}
              </button>
            ))}
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-2">
            {filteredTransactions.map((transaction, index) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                index={index}
                onEdit={(tx) => { setFormPage({ type: 'editTransaction', transaction: tx }); }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Wallet}
            title="Нет транзакций"
            description="Здесь будут отображаться все финансовые операции"
          />
        )}
      </div>
    </motion.div>
  );
}
