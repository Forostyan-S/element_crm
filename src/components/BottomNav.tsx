import { motion } from 'framer-motion';
import { Home, Building2, Calendar, Wallet, Settings, Package } from 'lucide-react';
import { useStore } from '../store';
import { zIndex } from '../utils/zIndex';

const navItems = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'objects', label: 'Объекты', icon: Building2 },
  { id: 'calendar', label: 'Календарь', icon: Calendar },
  { id: 'finances', label: 'Финансы', icon: Wallet },
  { id: 'warehouse', label: 'Склад', icon: Package },
  { id: 'settings', label: 'Настройки', icon: Settings },
] as const;

type TabId = (typeof navItems)[number]['id'];

export function BottomNav() {
  const { activeTab, setActiveTab, isFabOpen, setIsFabOpen, isModalOpen } = useStore();

  const handleNavClick = (tab: TabId) => {
    if (isFabOpen) setIsFabOpen(false);
    setActiveTab(tab);
  };

  // Hide bottom nav when modal is open
  if (isModalOpen) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0"
      style={{
        background: 'rgba(15,17,21,0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: zIndex.bottomNav,
      }}
    >
      <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="relative flex flex-col items-center py-1 px-2 rounded-button"
            >
              {isActive && (
                <motion.div
                  className="absolute -top-2 w-6 h-0.5 rounded-full bg-accent"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#3B82F6' : '#64748B',
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <motion.span
                className="text-2xs mt-0.5 font-medium"
                animate={{ color: isActive ? '#F1F5F9' : '#64748B' }}
              >
                {item.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
