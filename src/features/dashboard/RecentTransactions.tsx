import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import type { Transaction } from '../../types';
import { useStore } from '../../store';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onTransactionClick?: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  material: 'Материалы',
  salary: 'Зарплата',
  equipment: 'Оборудование',
  transport: 'Транспорт',
  service: 'Услуги',
  payment: 'Оплата клиента',
  other: 'Другое',
};

export function RecentTransactions({ transactions, onTransactionClick }: RecentTransactionsProps) {
  const { setActiveTab } = useStore();

  if (transactions.length === 0) return null;

  return (
    <section className="px-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">Последние операции</h2>
        <button
          onClick={() => setActiveTab('finances')}
          className="flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
        >
          Все <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div
        className="rounded-card overflow-hidden"
        style={{
          background: '#1B2130',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        {transactions.slice(0, 4).map((tx, index) => (
          <motion.div
            key={tx.id}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${index > 0 ? 'border-t border-border' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.06 + 0.1 }}
            whileHover={{ x: 2 }}
            onClick={() => {
              onTransactionClick?.(tx.id);
              setActiveTab('finances');
            }}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                tx.type === 'income' ? 'bg-success/15' : 'bg-error/15'
              }`}
            >
              {tx.type === 'income' ? (
                <ArrowUpRight className="w-4 h-4 text-success" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-error" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
              <p className="text-2xs text-muted-weak">{CATEGORY_LABELS[tx.category] || tx.category}</p>
            </div>
            <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
              {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} ₽
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
