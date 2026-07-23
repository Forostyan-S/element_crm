import { motion } from 'framer-motion';
import { Building2, MapPin, ChevronRight } from 'lucide-react';
import { OBJECT_STATUS_COLORS, OBJECT_STATUS_LABELS, type ConstructionObject, type ObjectStatus } from '../../types';
import { useStore } from '../../store';

interface RecentObjectsProps {
  objects: ConstructionObject[];
  onObjectClick?: (objectId: string) => void;
}

export function RecentObjects({ objects, onObjectClick: _onObjectClick }: RecentObjectsProps) {
  const { setActiveTab, setSelectedObjectId } = useStore();

  if (objects.length === 0) return null;

  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">Активные объекты</h2>
        <button
          onClick={() => setActiveTab('objects')}
          className="flex items-center gap-1 text-sm text-accent hover:text-accent-hover transition-colors"
        >
          Все <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {objects.slice(0, 4).map((object, index) => {
          const color = OBJECT_STATUS_COLORS[object.status as ObjectStatus];
          const label = OBJECT_STATUS_LABELS[object.status as ObjectStatus];

          return (
            <motion.button
              key={object.id}
              className="rounded-2xl p-3.5 flex items-center gap-3 w-full text-left"
              style={{
                background: '#1B2130',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ x: 2, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedObjectId(object.id);
                setActiveTab('objects');
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <Building2 className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-foreground truncate">{object.name}</h3>
                  <span
                    className="text-2xs font-medium px-1.5 py-0.5 rounded-md flex-shrink-0"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {label}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-muted-weak flex-shrink-0" />
                  <p className="text-xs text-muted truncate">{object.address}</p>
                </div>
                {/* Mini progress bar */}
                <div className="mt-1.5 h-1 bg-card-elevated rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${object.progress}%` }}
                    transition={{ delay: index * 0.06 + 0.3, duration: 0.6 }}
                  />
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs font-semibold text-foreground">{object.budget.toLocaleString()} P</p>
                <p className="text-2xs text-success">+{object.profit.toLocaleString()} P</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
