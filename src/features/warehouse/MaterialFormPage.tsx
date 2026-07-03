import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import { FormPageShell, Field, Input, Textarea, Select } from '../../ui';
import type { Material } from '../../types';

interface MaterialFormPageProps {
  editMaterial?: Material | null;
  onBack: () => void;
  onSaved?: () => void;
}

const UNITS = ['шт', 'м', 'м²', 'м³', 'кг', 'л', 'уп', 'компл'];

export function MaterialFormPage({ editMaterial, onBack, onSaved }: MaterialFormPageProps) {
  const { addMaterial, updateMaterial, deleteMaterial } = useStore();

  const [category, setCategory] = useState('Кабель');
  const [name, setName] = useState('');
  const [article, setArticle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('шт');
  const [minStock, setMinStock] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEdit = !!editMaterial;

  useEffect(() => {
    if (editMaterial) {
      setCategory(editMaterial.category);
      setName(editMaterial.name);
      setArticle(editMaterial.article || '');
      setPrice(String(editMaterial.purchase_price));
      setStock(String(editMaterial.current_stock));
      setUnit(editMaterial.unit);
      setMinStock(String(editMaterial.min_stock));
    }
  }, [editMaterial]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Введите наименование';
    if (!price.trim() || isNaN(Number(price)) || Number(price) < 0)
      e.price = 'Введите корректную цену';
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0)
      e.stock = 'Введите корректное количество';
    if (!minStock.trim() || isNaN(Number(minStock)) || Number(minStock) < 0)
      e.minStock = 'Введите минимальный остаток';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const now = new Date().toISOString();
    if (isEdit && editMaterial) {
      updateMaterial(editMaterial.id, {
        category,
        name: name.trim(),
        article: article.trim() || undefined,
        purchase_price: Number(price),
        current_stock: Number(stock),
        unit,
        min_stock: Number(minStock),
        updated_at: now,
      });
    } else {
      const newMaterial: Material = {
        id: Date.now().toString(),
        category,
        name: name.trim(),
        article: article.trim() || undefined,
        unit,
        current_stock: Number(stock),
        min_stock: Number(minStock),
        purchase_price: Number(price),
        sale_price: Number(price),
        created_at: now,
        updated_at: now,
      };
      addMaterial(newMaterial);
    }
    onSaved?.();
    onBack();
  };

  const handleDelete = () => {
    if (editMaterial) {
      deleteMaterial(editMaterial.id);
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
        style={{ background: '#3B82F6' }}
      >
        <Check className="w-4 h-4" />
        {isEdit ? 'Сохранить' : 'Создать'}
      </button>
    </div>
  );

  return (
    <FormPageShell
      title={isEdit ? 'Редактировать материал' : 'Новый материал'}
      onBack={onBack}
      footer={footer}
    >
      <div className="space-y-4">
        <Field label="Категория" required>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Кабель">Кабель</option>
            <option value="Автоматы">Автоматы</option>
            <option value="Щиты">Щиты</option>
            <option value="Освещение">Освещение</option>
            <option value="Розетки">Розетки</option>
            <option value="Расходники">Расходники</option>
            <option value="Инструмент">Инструмент</option>
            <option value="Прочее">Прочее</option>
          </Select>
        </Field>

        <Field label="Наименование" required error={errors.name}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ВВГ 3×2.5" error={!!errors.name} />
        </Field>

        <Field label="Артикул">
          <Input value={article} onChange={(e) => setArticle(e.target.value)} placeholder="ВВГ-3x2.5" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Цена" required error={errors.price}>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="85" error={!!errors.price} />
          </Field>
          <Field label="Количество" required error={errors.stock}>
            <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="450" error={!!errors.stock} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Единица измерения" required>
            <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </Select>
          </Field>
          <Field label="Минимальный остаток" required error={errors.minStock}>
            <Input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="100" error={!!errors.minStock} />
          </Field>
        </div>

        <Field label="Место хранения">
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Стеллаж A-3" />
        </Field>

        <Field label="Комментарий">
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Дополнительная информация..." />
        </Field>
      </div>

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
              <h3 className="text-base font-semibold text-foreground mb-2">Удалить материал?</h3>
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
