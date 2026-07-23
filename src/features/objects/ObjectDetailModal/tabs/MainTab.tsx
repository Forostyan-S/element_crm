import { MapPin, User, History, MessageSquare } from 'lucide-react';
import type { ConstructionObject } from '../../../../types';

interface MainTabProps {
  object: ConstructionObject;
  onEditComment: () => void;
  onOpenHistory: () => void;
}

export function MainTab({ object, onEditComment, onOpenHistory }: MainTabProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-muted-weak" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {object.client?.name || 'Клиент не указан'}
            </p>
            {object.client?.phone ? (
              <p className="text-xs text-muted">{object.client.phone}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-muted-weak" />
          <p className="text-sm text-foreground truncate">{object.address || 'Адрес не указан'}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEditComment}
        className={`w-full rounded-xl p-4 text-left transition-colors ${object.hasNewComment ? 'border border-success/40 bg-success/10' : ''}`}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-start gap-3">
          <MessageSquare className="w-4 h-4 text-muted-weak mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground mb-1">Комментарий</p>
            <p className="text-xs text-muted line-clamp-3">
              {object.description || 'Нет комментария'}
            </p>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={onOpenHistory}
        className="w-full rounded-xl p-4 text-left transition-colors"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <History className="w-4 h-4 text-muted-weak" />
          <div>
            <p className="text-sm font-semibold text-foreground">История</p>
            <p className="text-xs text-muted">Открыть журнал изменений</p>
          </div>
        </div>
      </button>
    </div>
  );
}
