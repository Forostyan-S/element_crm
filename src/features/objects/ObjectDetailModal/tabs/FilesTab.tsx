import { Plus, FileText } from 'lucide-react';
import type { ObjectFileItem } from '../types';
import { FILE_TYPES } from '../constants';

interface FilesTabProps {
  files: ObjectFileItem[];
  onStatusChange: (type: ObjectFileItem['type'], status: ObjectFileItem['status']) => void;
}

export function FilesTab({ files, onStatusChange }: FilesTabProps) {
  return (
    <div className="space-y-3">
      <div className="text-center py-4">
        <FileText className="w-10 h-10 text-muted-weak mx-auto mb-2 opacity-50" />
        <p className="text-xs text-muted-weak">Фото, PDF, документы</p>
      </div>

      {FILE_TYPES.map((fileType) => {
        const existing = files.find((file) => file.type === fileType.type);
        const status = existing?.status ?? 'not_used';
        const statusColor = status === 'not_used' ? '#64748B' : status === 'in_progress' ? '#3B82F6' : '#22C55E';

        return (
          <div
            key={fileType.type}
            className="rounded-xl p-3 flex items-center justify-between"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-sm text-foreground">{fileType.name}</span>
            <select
              value={status}
              onChange={(e) => onStatusChange(fileType.type, e.target.value as ObjectFileItem['status'])}
              className="text-xs px-2 py-1 rounded-lg appearance-none cursor-pointer"
              style={{ background: `${statusColor}20`, color: statusColor, border: 'none' }}
            >
              <option value="not_used">Не используется</option>
              <option value="in_progress">В работе</option>
              <option value="done">Готово</option>
            </select>
          </div>
        );
      })}

      <button
        className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all mt-4"
        style={{ background: '#3B82F6', color: '#FFFFFF' }}
      >
        <Plus className="w-5 h-5" />
        Добавить файл
      </button>
    </div>
  );
}
