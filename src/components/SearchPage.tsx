import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  X,
  Search,
  Building2,
  Calendar,
  Wallet,
} from 'lucide-react';
import { useStore } from '../store';
import type { ConstructionObject, CalendarEvent, Transaction } from '../types';
import { zIndex } from '../utils/zIndex';

interface SearchPageProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResult = {
  id: string;
  type: 'object' | 'event' | 'transaction' | 'client';
  title: string;
  subtitle: string;
  icon: typeof Building2;
  color: string;
  data: ConstructionObject | CalendarEvent | Transaction | { id: string; name: string } | null;
};

export function SearchPage({ isOpen, onClose }: SearchPageProps) {
  const { objects, events, transactions } = useStore();
  const [query, setQuery] = useState('');

  const searchResults: SearchResult[] = [];

  if (query.length > 1) {
    const q = query.toLowerCase();

    // Search objects
    objects.forEach((obj) => {
      if (obj.name.toLowerCase().includes(q) || obj.address.toLowerCase().includes(q) || obj.id.includes(q)) {
        searchResults.push({
          id: obj.id,
          type: 'object',
          title: obj.name,
          subtitle: obj.address,
          icon: Building2,
          color: '#3B82F6',
          data: obj,
        });
      }
    });

    // Search events
    events.forEach((ev) => {
      if (ev.title.toLowerCase().includes(q)) {
        const eventColors: Record<string, string> = {
          measurement: '#F59E0B',
          installation: '#3B82F6',
          meeting: '#8B5CF6',
        };
        searchResults.push({
          id: ev.id,
          type: 'event',
          title: ev.title,
          subtitle: new Date(ev.date).toLocaleDateString('ru-RU') + (ev.time ? ` • ${ev.time}` : ''),
          icon: Calendar,
          color: eventColors[ev.type] || '#64748B',
          data: ev,
        });
      }
    });

    // Search transactions
    transactions.forEach((tx) => {
      if (tx.description.toLowerCase().includes(q)) {
        searchResults.push({
          id: tx.id,
          type: 'transaction',
          title: tx.description,
          subtitle: `${tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()} ₽`,
          icon: Wallet,
          color: tx.type === 'income' ? '#22C55E' : '#EF4444',
          data: tx,
        });
      }
    });
  }

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0"
            style={{ background: '#0F1115', zIndex: zIndex.modal, paddingTop: 'env(safe-area-inset-top, 0px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-weak" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Поиск по объектам, событиям, транзакциям..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm"
                  style={{
                    background: '#1B2130',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#F1F5F9',
                  }}
                />
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-card-elevated rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-weak" />
              </button>
            </div>

            {/* Results */}
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 70px)' }}>
              {query.length > 1 ? (
                searchResults.length > 0 ? (
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-muted-weak mb-3">{searchResults.length} результатов</p>
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={`${result.type}-${result.id}`}
                        className="rounded-xl p-3 flex items-center gap-3 cursor-pointer"
                        style={{
                          background: '#1B2130',
                          border: `1px solid ${result.color}20`,
                        }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${result.color}20` }}
                        >
                          <result.icon className="w-5 h-5" style={{ color: result.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                          <p className="text-xs text-muted-weak truncate">{result.subtitle}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className="text-2xs px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${result.color}20`, color: result.color }}
                          >
                            {result.type === 'object' && 'Объект'}
                            {result.type === 'event' && 'Событие'}
                            {result.type === 'transaction' && 'Транзакция'}
                            {result.type === 'client' && 'Клиент'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Search className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-weak">Ничего не найдено</p>
                    <p className="text-xs text-muted-weak mt-1">Попробуйте другой запрос</p>
                  </div>
                )
              ) : (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-muted-weak mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-weak">Начните вводить для поиска</p>
                  <p className="text-xs text-muted-weak mt-1">Объекты, события, транзакции</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
