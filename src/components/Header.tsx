import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { zIndex } from '../utils/zIndex';

interface HeaderProps {
  pageTitle?: string;
  onSearchClick?: () => void;
}

export function Header({ pageTitle, onSearchClick }: HeaderProps) {
  const { user } = useStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="sticky top-0" style={{ background: 'rgba(15,17,21,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)', zIndex: zIndex.header, paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="px-4 py-3.5 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-white">
                  {user?.name ? getInitials(user.name) : '?'}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs text-muted leading-none">{getGreeting()}</p>
              <h1 className="text-base font-semibold text-foreground leading-snug">
                {pageTitle || user?.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-xl bg-card hover:bg-card-elevated transition-colors"
            >
              <Search className="w-4.5 h-4.5 text-muted" />
            </button>
            <button className="relative p-2 rounded-xl bg-card hover:bg-card-elevated transition-colors">
              <Bell className="w-4.5 h-4.5 text-muted" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error" />
            </button>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
