import { useState } from 'react';
import { X } from 'lucide-react';
import { ConstructionObject } from '../../types';
import { useStore } from '../../store';

interface Props {
  object: ConstructionObject;
  onClose: () => void;
}

export function ObjectNumberModal({
  object,
  onClose,
}: Props) {
  const { updateObject } = useStore();

  const [number, setNumber] = useState(
    object.object_number ?? ''
  );

  

 const handleSave = () => {
  updateObject(object.id, {
    object_number: number,
    updated_at: new Date().toISOString(),
  });

  onClose();
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,.55)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5"
        style={{
          background: "#1B2130",
          border: "1px solid rgba(255,255,255,.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">
            Номер объекта
          </h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Например: ТБ-0001"
          className="w-full rounded-xl px-4 py-3 bg-[#111827] border border-white/10 outline-none"
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