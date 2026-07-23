import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, CreditCard, ShoppingBag, Car, Users, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Transaction, TransactionCategory } from '../../types';
import { TRANSACTION_CATEGORY_LABELS } from '../../types';
import { useStore } from '../../store';
import { zIndex } from '../../utils/zIndex';

interface TransactionCardProps {
  transaction: Transaction;
  index?: number;
  onEdit?: (transaction: Transaction) => void;
}

const categoryIcons: Record<TransactionCategory, typeof Wallet> = {
  material: ShoppingBag,
  salary: Users,
  equipment: Wallet,
  transport: Car,
  service: CreditCard,
  payment: CreditCard,
  other: MoreHorizontal,
};

const categoryColors: Record<TransactionCategory, string> = {
  material: '#F59E0B',
  salary: '#8B5CF6',
  equipment: '#EC4899',
  transport: '#06B6D4',
  service: '#F97316',
  payment: '#22C55E',
  other: '#64748B',
};

export function TransactionCard({ transaction, index = 0, onEdit }: TransactionCardProps) {
  const { deleteTransaction } = useStore();
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const Icon = categoryIcons[transaction.category];
  const categoryColor = categoryColors[transaction.category];
  const categoryLabel = TRANSACTION_CATEGORY_LABELS[transaction.category];
  const isIncome = transaction.type === 'income';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    setShowDeleteConfirm(false);
    setShowActions(false);
  };

  return (
    <>
      <motion.div
        className="bg-card rounded-xl p-3 shadow-card relative"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: categoryColor }} />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {transaction.description || categoryLabel}
            </p>
            <div className="flex items-center gap-2 text-2xs text-muted-weak">
              <span>{categoryLabel}</span>
              {transaction.object && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-weak" />
                  <span className="truncate">{transaction.object.name}</span>
                </>
              )}
            </div>
            <p className="text-2xs text-muted-weak mt-0.5">
              {formatDate(transaction.date)} в {formatTime(transaction.created_at)}
            </p>
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            <p
              className={`text-base font-semibold ${
                isIncome ? 'text-success' : 'text-error'
              }`}
            >
              {isIncome ? '+' : '-'}{transaction.amount.toLocaleString()} P
            </p>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              {isIncome ? (
                <ArrowUpCircle className="w-3 h-3 text-success" />
              ) : (
                <ArrowDownCircle className="w-3 h-3 text-error" />
              )}
              <span className="text-2xs text-muted">
                {isIncome ? 'Доход' : 'Расход'}
              </span>
            </div>
          </div>

          {/* Actions Button */}
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-muted-weak" />
          </button>
        </div>

        {/* Actions Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              className="absolute right-3 top-full mt-1 rounded-xl overflow-hidden z-20"
              style={{ background: '#1E293B', border: '1px solid #334155', minWidth: '120px' }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <button
                onClick={() => {
                  onEdit?.(transaction);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-left hover:bg-slate-600"
                style={{ color: '#FFFFFF' }}
              >
                <Pencil className="w-4 h-4" />
                Редактировать
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2 text-sm text-left hover:bg-slate-600"
                style={{ color: '#EF4444' }}
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
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
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto rounded-2xl overflow-hidden"
              style={{
                background: '#0F172A',
                border: '1px solid #1E293B',
                zIndex: zIndex.dialog,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="p-4 text-center">
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.2)' }}
                >
                  <Trash2 className="w-6 h-6" style={{ color: '#EF4444' }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                  Удалить транзакцию?
                </h3>
                <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>
                  Это действие нельзя отменить. Транзакция будет удалена безвозвратно.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-xl font-medium"
                    style={{ background: '#1E293B', border: '1px solid #334155', color: '#FFFFFF' }}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 rounded-xl font-medium"
                    style={{ background: '#EF4444', color: '#FFFFFF' }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
