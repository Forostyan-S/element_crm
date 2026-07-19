import { motion } from 'framer-motion';
import { useState } from 'react';
import { Building2, Search, ArrowUpDown, Wallet, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store';
import { EmptyState } from '../../ui';
import { StatusFilter } from './StatusFilter';
import { ObjectCard } from './ObjectCard';

import { calculateObjectFinancials } from './objectFinancials';
import { ObjectNumberModal } from './ObjectNumberModal';
import { ObjectCommentModal } from './ObjectCommentModal';
import type { ObjectStatus, ConstructionObject } from '../../types';

type SortOption = 'new' | 'cost' | 'active' | 'completed';

const SORT_OPTIONS: Array<{ value: SortOption; label: string; icon: typeof Clock }> = [
  { value: 'new', label: 'Новые', icon: Clock },
  { value: 'cost', label: 'По стоимости', icon: Wallet },
  { value: 'active', label: 'Активные', icon: AlertTriangle },
  { value: 'completed', label: 'Завершенные', icon: CheckCircle },
];

export function ObjectsPage() {
  const { objects, transactions, objectWorkItems, objectMaterialItems, setObjectStatusFilter, setFormPage, setSelectedObjectId } = useStore();
  const [filter, setFilter] = useState<ObjectStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('new');
  const [showSortMenu, setShowSortMenu] = useState(false);
const [selectedObject, setSelectedObject] =
  useState<ConstructionObject | null>(null);

const [modalType, setModalType] =
  useState<'number' | 'comment' | null>(null);





  const filteredObjects = objects.filter((obj) => {
    const matchesFilter = filter === 'all' || obj.status === filter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [obj.name, obj.address, obj.object_number, obj.client?.name, obj.client?.phone]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const sortedObjects = [...filteredObjects].sort((a, b) => {
    switch (sortBy) {
      case 'cost':
        return (b.total_cost ?? b.budget) - (a.total_cost ?? a.budget);
      case 'new':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'active':
        const aActive = a.status === 'in_progress' ? 1 : 0;
        const bActive = b.status === 'in_progress' ? 1 : 0;
        return bActive - aActive;
      case 'completed':
        return a.status === 'completed' ? -1 : b.status === 'completed' ? 1 : 0;
      default:
        return 0;
    }
  });

  const handleFilterChange = (newFilter: ObjectStatus | 'all') => {
    setFilter(newFilter);
    setObjectStatusFilter(newFilter);
  };

  const handleObjectClick = (object: ConstructionObject) => {
    setSelectedObjectId(object.id);
  };

  

  const openNumberModal = (object: ConstructionObject) => {
  setSelectedObject(object);
  setModalType('number');
};

const openCommentModal = (object: ConstructionObject) => {
  setSelectedObject(object);
  setModalType('comment');
};

const closeModal = () => {
  setModalType(null);
  setSelectedObject(null);
};

  return (
  <>
    <motion.div
      className="pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-weak" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по объектам..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-weak"
            style={{ background: 'rgba(27, 33, 48, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="px-4 mb-3 flex items-center gap-2">
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted"
          style={{ background: 'rgba(27, 33, 48, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
        </button>
        {showSortMenu && (
          <div className="absolute z-10 mt-1 rounded-xl overflow-hidden" style={{ background: '#1E293B', border: '1px solid #334155', top: '120px', left: '16px' }}>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => { setSortBy(option.value); setShowSortMenu(false); }}
                className="w-full px-4 py-2 flex items-center gap-2 text-sm text-left hover:bg-slate-600"
                style={{ color: sortBy === option.value ? '#3B82F6' : '#FFFFFF' }}
              >
                <option.icon className="w-3.5 h-3.5" />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Filter */}
      <div className="px-4 mb-4">
        <StatusFilter activeFilter={filter} onFilterChange={handleFilterChange} />
      </div>

      {/* Objects List */}
      {sortedObjects.length > 0 ? (
        <div className="px-4 space-y-3">
          {sortedObjects.map((object, index) => (
           <ObjectCard
  key={object.id}
  object={object}
  index={index}
  financials={calculateObjectFinancials(
    objectWorkItems.filter((item) => item.object_id === object.id),
    objectMaterialItems.filter((item) => item.object_id === object.id),
    transactions.filter((item) => item.object_id === object.id),
  )}

  onClick={() => handleObjectClick(object)}
  onNumberClick={() => openNumberModal(object)}
  onCommentClick={() => openCommentModal(object)}
/>
          ))}
        </div>
      ) : (
        <div className="px-4">
          <EmptyState
            icon={Building2}
            title="Нет объектов"
            description="Создайте первый объект, чтобы начать работу"
            action={{
              label: 'Создать объект',
              onClick: () => setFormPage({ type: 'addObject' }),
            }}
          />
        </div>
      )}
        </motion.div>

    {modalType === 'number' && selectedObject && (
  <ObjectNumberModal
    object={selectedObject}
    onClose={closeModal}
  />
)}

{modalType === 'comment' && selectedObject && (
  <ObjectCommentModal
    object={selectedObject}
    onClose={closeModal}
  />
)}
  </>
);
}
