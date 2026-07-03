import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useStore } from '../../store';
import { FormPageShell, Field, Input, Textarea, Select } from '../../ui';
import { TRANSACTION_CATEGORY_LABELS } from '../../types';
import type { Transaction, TransactionType, TransactionCategory } from '../../types';

interface TransactionFormPageProps {
  editTransaction?: Transaction | null;
  defaultType?: TransactionType;
  onBack: () => void;
  onSaved?: () => void;
}

const INCOME_CATEGORIES: TransactionCategory[] = ['payment', 'service', 'other'];
const EXPENSE_CATEGORIES: TransactionCategory[] = ['material', 'salary', 'equipment', 'transport', 'service', 'other'];

export function TransactionFormPage({ editTransaction, defaultType = 'income', onBack, onSaved }: TransactionFormPageProps) {
  const { addTransaction, updateTransaction, deleteTransaction, objects } = useStore();

  const [type, setType] = useState<TransactionType>(defaultType);
  const [typeSelected, setTypeSelected] = useState(!!editTransaction);
  const [category, setCategory] = useState<TransactionCategory>('payment');
  const [amount, setAmount] = useState('');
  const [objectId, setObjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEdit = !!editTransaction;

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setCategory(editTransaction.category);
      setAmount(String(editTransaction.amount));
      setObjectId(editTransaction.object_id || '');
      setDate(editTransaction.date.split('T')[0]);
      setComment(editTransaction.description || '');
    }
  }, [editTransaction]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeSelect = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'payment' : 'material');
    setTypeSelected(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const amountNum = Number(amount);
    if (!amount.trim() || isNaN(amountNum) || amountNum <= 0)
      e.amount = 'Введите сумму больше 0';
    if (!date) e.date = 'Выберите дату';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (isEdit && editTransaction) {
      updateTransaction(editTransaction.id, {
        type,
        category,
        amount: Number(amount),
        object_id: objectId || undefined,
        date: new Date(date).toISOString(),
        description: comment.trim() || TRANSACTION_CATEGORY_LABELS[category],
      });
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type,
        category,
        amount: Number(amount),
        description: comment.trim() || TRANSACTION_CATEGORY_LABELS[category],
        object_id: objectId || undefined,
        date: new Date(date).toISOString(),
        created_at: new Date().toISOString(),
      };
      addTransaction(newTransaction);
    }
    onSaved?.();
    onBack();
  };

  const handleDelete = () => {
    if (editTransaction) {
      deleteTransaction(editTransaction.id);
      setShowDeleteConfirm(false);
      onBack();
    }
  };

  const footer = (
    <div className="flex gap-3">
      {isEdit && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-3 rounded-xl font-medium text-error transition-colors"
          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={handleSave}
        className="flex-1 py-3 rounded-xl font-medium text-white transition-colors flex items-center justify-center gap-1.5"
        style={{ background: type === 'income' ? '#22C55E' : '#EF4444' }}
      >
        <Check className="w-4 h-4" />
        {isEdit ? 'Сохранить' : 'Создать'}
      </button>
    </div>
  );

  return (
    <FormPageShell
      title={isEdit ? 'Редактировать транзакцию' : 'Новая транзакция'}
      onBack={onBack}
      footer={typeSelected ? footer : undefined}
    >
      {!typeSelected ? (
        <div className="space-y-3 pt-4">
          <p className="text-sm text-muted text-center mb-4">Выберите тип операции</p>
          <button
            onClick={() => handleTypeSelect('income')}
            className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all"
            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
              <ArrowUpCircle className="w-6 h-6" style={{ color: '#22C55E' }} />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold text-foreground">Доход</p>
              <p className="text-xs text-muted">Поступление средств</p>
            </div>
          </button>
          <button
            onClick={() => handleTypeSelect('expense')}
            className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all"
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
              <ArrowDownCircle className="w-6 h-6" style={{ color: '#EF4444' }} />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold text-foreground">Расход</p>
              <p className="text-xs text-muted">Списание средств</p>
            </div>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={() => handleTypeSelect('income')}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: type === 'income' ? '#22C55E' : 'rgba(255, 255, 255, 0.05)',
                border: type === 'income' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                color: type === 'income' ? '#FFFFFF' : '#94A3B8',
              }}
            >
              Доход
            </button>
            <button
              onClick={() => handleTypeSelect('expense')}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: type === 'expense' ? '#EF4444' : 'rgba(255, 255, 255, 0.05)',
                border: type === 'expense' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                color: type === 'expense' ? '#FFFFFF' : '#94A3B8',
              }}
            >
              Расход
            </button>
          </div>

          <Field label="Сумма" required error={errors.amount}>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" error={!!errors.amount} />
          </Field>

          <Field label="Категория" required>
            <Select value={category} onChange={(e) => setCategory(e.target.value as TransactionCategory)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{TRANSACTION_CATEGORY_LABELS[cat]}</option>
              ))}
            </Select>
          </Field>

          <Field label="Объект">
            <Select value={objectId} onChange={(e) => setObjectId(e.target.value)}>
              <option value="">-- Без объекта --</option>
              {objects.map((obj) => (
                <option key={obj.id} value={obj.id}>{obj.name} — {obj.address}</option>
              ))}
            </Select>
          </Field>

          <Field label="Дата" required error={errors.date}>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} error={!!errors.date} />
          </Field>

          <Field label="Комментарий">
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Комментарий к транзакции..." />
          </Field>
        </div>
      )}

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
              <h3 className="text-base font-semibold text-foreground mb-2">Удалить транзакцию?</h3>
              <p className="text-sm text-muted mb-4">Это действие нельзя отменить.</p>
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
