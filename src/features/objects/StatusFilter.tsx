import { motion } from 'framer-motion';
import { OBJECT_STATUS_LABELS, OBJECT_STATUS_COLORS, type ObjectStatus } from '../../types';

type FilterValue = ObjectStatus | 'all';

interface StatusFilterProps {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
}

const FILTER_OPTIONS: Array<{ value: FilterValue; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: OBJECT_STATUS_LABELS.new },
  { value: 'measurement', label: OBJECT_STATUS_LABELS.measurement },
  { value: 'estimate', label: OBJECT_STATUS_LABELS.estimate },
  { value: 'approval', label: OBJECT_STATUS_LABELS.approval },
  { value: 'in_progress', label: OBJECT_STATUS_LABELS.in_progress },
  { value: 'waiting_materials', label: OBJECT_STATUS_LABELS.waiting_materials },
  { value: 'completed', label: OBJECT_STATUS_LABELS.completed },
];

export function StatusFilter({ activeFilter, onFilterChange }: StatusFilterProps) {
  return (
    <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.value;
        const color = option.value !== 'all' ? OBJECT_STATUS_COLORS[option.value as ObjectStatus] : '#3B82F6';

        return (
          <motion.button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={
              isActive
                ? {
                    backgroundColor: `${color}20`,
                    color: color,
                    border: `1px solid ${color}50`,
                  }
                : {
                    backgroundColor: '#1B2130',
                    color: '#94A3B8',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }
            }
            whileTap={{ scale: 0.96 }}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
}
