import { motion } from 'framer-motion';
import {
  User,
  ChevronRight,
  Hammer,
  Package,
  Wallet,
  Calendar,
  MessageSquare,
  Download,
  HardDrive,
  AlertTriangle,
  LogOut,
  Settings2,
} from 'lucide-react';
import { useStore } from '../../store';
import type { FormPageState } from '../../store';

interface SettingsItem {
  icon: typeof User;
  label: string;
  description?: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export function SettingsPage() {
  const { user, setFormPage } = useStore();

  const navigate = (page: FormPageState) => setFormPage(page);

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const sections: SettingsSection[] = [
    {
      title: 'Профиль',
      items: [
        {
          icon: User,
          label: 'Профиль',
          description: 'Имя, фото, контакты',
          onClick: () => navigate({ type: 'profile' }),
        },
      ],
    },
    {
      title: 'Склад',
      items: [
        {
          icon: Settings2,
          label: 'Настройки склада',
          description: 'Категории, материалы, уведомления',
          onClick: () => navigate({ type: 'warehouse' }),
        },
      ],
    },
    {
      title: 'Каталоги',
      items: [
        {
          icon: Hammer,
          label: 'Каталог услуг',
          description: 'Виды работ и расценки',
          onClick: () => navigate({ type: 'serviceCatalog' }),
        },
        {
          icon: Package,
          label: 'Каталог материалов',
          description: 'Материалы и цены',
          onClick: () => navigate({ type: 'materialCatalog' }),
        },
        {
          icon: Wallet,
          label: 'Категории финансов',
          description: 'Статьи доходов и расходов',
          onClick: () => navigate({ type: 'financeCategories' }),
        },
        {
          icon: Calendar,
          label: 'Типы событий',
          description: 'Виды задач и встреч',
          onClick: () => navigate({ type: 'eventTypes' }),
        },
      ],
    },
    {
      title: 'Интеграции',
      items: [
        {
          icon: MessageSquare,
          label: 'Telegram Bot',
          description: 'Уведомления и бот',
          onClick: () => navigate({ type: 'telegram' }),
        },
      ],
    },
    {
      title: 'Данные',
      items: [
        {
          icon: Download,
          label: 'Экспорт данных',
          description: 'Скачать объекты, финансы, события',
          onClick: () => navigate({ type: 'export' }),
        },
        {
          icon: HardDrive,
          label: 'Резервное копирование',
          description: 'Создать и восстановить бэкап',
          onClick: () => navigate({ type: 'backup' }),
        },
      ],
    },
    {
      title: 'Опасная зона',
      items: [
        {
          icon: AlertTriangle,
          label: 'Сбросить данные',
          description: 'Удалить все объекты и транзакции',
          danger: true,
          onClick: () => navigate({ type: 'danger' }),
        },
        {
          icon: LogOut,
          label: 'Выйти из аккаунта',
          danger: true,
          onClick: () => navigate({ type: 'danger' }),
        },
      ],
    },
  ];

  return (
    <motion.div
      className="pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* User Profile Card */}
      <div className="px-4 mb-6">
        <motion.div
          className="rounded-card p-4 flex items-center gap-4"
          style={{
            background: '#1B2130',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-white">
                {user?.name ? getInitials(user.name) : '?'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
            <p className="text-xs text-muted-weak mt-0.5">Администратор</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-weak flex-shrink-0" />
        </motion.div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.05 }}
          >
            <h3 className="text-xs font-semibold text-muted-weak mb-2 uppercase tracking-wider">
              {section.title}
            </h3>
            <div
              className="rounded-card overflow-hidden"
              style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
            >
              {section.items.map((item, itemIndex) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 transition-colors ${
                    item.danger ? 'hover:bg-error/10' : 'hover:bg-card-elevated'
                  } ${itemIndex > 0 ? 'border-t border-border' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.danger ? 'bg-error/20' : 'bg-card-elevated'
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${item.danger ? 'text-error' : 'text-muted'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-medium ${item.danger ? 'text-error' : 'text-foreground'}`}>
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-weak">{item.description}</p>
                    )}
                  </div>
                  {item.value && <span className="text-sm text-muted">{item.value}</span>}
                  {!item.danger && <ChevronRight className="w-4 h-4 text-muted-weak flex-shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8 px-4">
        <p className="text-xs text-muted-weak">CRM Element v2.0</p>
        <p className="text-2xs text-muted-weak mt-0.5">Создано для электромонтажников</p>
      </div>
    </motion.div>
  );
}
