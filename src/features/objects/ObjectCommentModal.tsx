import { useState } from 'react';
import { X } from 'lucide-react';
import { ConstructionObject } from '../../types';
import { useStore } from '../../store';
import { zIndex } from '../../utils/zIndex';

interface Props {
  object: ConstructionObject;
  onClose: () => void;
}

export function ObjectCommentModal({
  object,
  onClose,
}: Props) {
  const { updateObject, addObjectHistoryEntry } = useStore();

  const [comment, setComment] = useState(
  object.description ?? ''
);

const handleSave = () => {
  updateObject(object.id, {
    description: comment,
    hasNewComment: true,
    updated_at: new Date().toISOString(),
  });
  addObjectHistoryEntry({
    id: Date.now().toString(),
    object_id: object.id,
    action_type: 'comment_updated',
    description: 'Комментарий обновлён',
    created_at: new Date().toISOString(),
  });

  onClose();
};
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,.55)',
        zIndex: zIndex.dialog,
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-5"
        style={{
          background: '#1B2130',
          border: '1px solid rgba(255,255,255,.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">
            Комментарий
          </h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <textarea
          rows={8}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Введите комментарий..."
          className="w-full rounded-xl px-4 py-3 bg-[#111827] border border-white/10 outline-none resize-none"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5"
          >
            Отмена
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}