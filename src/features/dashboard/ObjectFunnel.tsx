import { motion } from 'framer-motion';
import { OBJECT_STATUS_LABELS, OBJECT_STATUS_COLORS, type ObjectStatus } from '../../types';

interface FunnelBlockProps {
  statusCounts: Record<string, number>;
}

const FUNNEL_STATUSES: ObjectStatus[] = ['new', 'measurement', 'estimate', 'approval', 'in_progress', 'completed'];

export function ObjectFunnel({ statusCounts }: FunnelBlockProps) {
  return (
    <section className="px-4 mb-6">
      <h2 className="text-base font-semibold text-foreground mb-3">Воронка объектов</h2>
      <div className="grid grid-cols-3 gap-2">
        {FUNNEL_STATUSES.map((status, index) => {
          const count = statusCounts[status] ?? 0;
          const color = OBJECT_STATUS_COLORS[status];
          const label = OBJECT_STATUS_LABELS[status];

          return (
            <motion.div
              key={status}
              className="rounded-2xl p-3 relative overflow-hidden"
              style={{
                background: '#1B2130',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
              }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -1 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ backgroundColor: color }}
              />
              <div
                className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full blur-xl opacity-20 pointer-events-none"
                style={{ backgroundColor: color }}
              />
              <div className="relative">
                <p
                  className="text-2xl font-bold mb-0.5"
                  style={{ color }}
                >
                  {count}
                </p>
                <p className="text-2xs text-muted leading-tight">{label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
