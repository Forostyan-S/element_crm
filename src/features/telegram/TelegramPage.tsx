import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Eye, EyeOff, CheckCircle, XCircle, Bell, BellOff, MessageSquare, Info } from 'lucide-react';
import { useStore } from '../../store';

const NOTIFICATION_TYPES = [
  { key: 'new_client', icon: '📞', label: 'Новый клиент', description: 'При добавлении нового клиента' },
  { key: 'new_object', icon: '🏠', label: 'Новый объект', description: 'При создании нового объекта' },
  { key: 'status_change', icon: '🔄', label: 'Изменение статуса', description: 'При смене статуса объекта' },
  { key: 'new_estimate', icon: '📋', label: 'Создание сметы', description: 'При создании сметы' },
  { key: 'estimate_update', icon: '✏️', label: 'Изменение сметы', description: 'При изменении сметы' },
  { key: 'new_income', icon: '💰', label: 'Получена оплата', description: 'При добавлении дохода' },
  { key: 'new_expense', icon: '💸', label: 'Новый расход', description: 'При добавлении расхода' },
  { key: 'new_event', icon: '📅', label: 'Новое событие', description: 'При создании события' },
  { key: 'event_reschedule', icon: '🔄', label: 'Перенос события', description: 'При переносе события' },
  { key: 'new_document', icon: '📄', label: 'Новый документ', description: 'При загрузке документа' },
  { key: 'object_completed', icon: '✅', label: 'Завершение объекта', description: 'При завершении объекта' },
];

export function TelegramPage() {
  const { telegramSettings, setTelegramSettings } = useStore();
  const [showToken, setShowToken] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [enabledTypes, setEnabledTypes] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_TYPES.map((t) => [t.key, true]))
  );

  const handleSendTest = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 2500);
      return;
    }
    setTestStatus('sending');
    try {
      const url = `https://api.telegram.org/bot${telegramSettings.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramSettings.chatId,
          text: '✅ *CRM Element*\n\nТестовое уведомление работает! Настройка Telegram выполнена успешно.',
          parse_mode: 'Markdown',
        }),
      });
      if (res.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch {
      setTestStatus('error');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const toggleType = (key: string) => {
    setEnabledTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      className="pb-8 space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero banner */}
      <motion.div
        className="mx-4 rounded-card p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0e2a42 0%, #1B2130 100%)',
          border: '1px solid rgba(35,152,219,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: '#2398DB' }} />
        <div className="relative flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(35,152,219,0.2)', border: '1px solid rgba(35,152,219,0.3)' }}
          >
            <MessageSquare className="w-7 h-7" style={{ color: '#2398DB' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Telegram</h2>
            <p className="text-sm text-muted">Мгновенные уведомления о событиях</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-2 h-2 rounded-full ${telegramSettings.notificationsEnabled ? 'bg-success animate-pulse' : 'bg-muted-weak'}`} />
              <span className="text-xs text-muted-weak">
                {telegramSettings.notificationsEnabled ? 'Уведомления включены' : 'Уведомления отключены'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Card */}
      <motion.div
        className="mx-4 rounded-card overflow-hidden"
        style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Настройки подключения</h3>
        </div>

        {/* Bot Token */}
        <div className="px-4 py-4 border-b border-border">
          <label className="text-xs text-muted-weak mb-2 block">Bot Token</label>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#222938', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <input
              type={showToken ? 'text' : 'password'}
              value={telegramSettings.botToken}
              onChange={(e) => setTelegramSettings({ botToken: e.target.value })}
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-weak outline-none"
            />
            <button onClick={() => setShowToken(!showToken)} className="p-1 text-muted-weak hover:text-muted transition-colors">
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-start gap-1.5 mt-2">
            <Info className="w-3.5 h-3.5 text-muted-weak flex-shrink-0 mt-0.5" />
            <p className="text-2xs text-muted-weak">Получить у @BotFather в Telegram</p>
          </div>
        </div>

        {/* Chat ID */}
        <div className="px-4 py-4 border-b border-border">
          <label className="text-xs text-muted-weak mb-2 block">Chat ID</label>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#222938', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <input
              type="text"
              value={telegramSettings.chatId}
              onChange={(e) => setTelegramSettings({ chatId: e.target.value })}
              placeholder="-100123456789 или @username"
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-weak outline-none"
            />
          </div>
          <div className="flex items-start gap-1.5 mt-2">
            <Info className="w-3.5 h-3.5 text-muted-weak flex-shrink-0 mt-0.5" />
            <p className="text-2xs text-muted-weak">Узнать через @userinfobot или @getmyid_bot</p>
          </div>
        </div>

        {/* Notifications toggle */}
        <div className="px-4 py-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Уведомления включены</p>
            <p className="text-xs text-muted-weak">Отправлять события в Telegram</p>
          </div>
          <button
            onClick={() => setTelegramSettings({ notificationsEnabled: !telegramSettings.notificationsEnabled })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              telegramSettings.notificationsEnabled ? 'bg-success' : 'bg-card-elevated'
            }`}
          >
            <motion.div
              className="absolute w-5 h-5 rounded-full bg-white shadow-md top-0.5"
              animate={{ left: telegramSettings.notificationsEnabled ? '26px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Test notification */}
        <div className="px-4 py-4">
          <motion.button
            onClick={handleSendTest}
            disabled={testStatus === 'sending'}
            className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              testStatus === 'success'
                ? 'bg-success/20 text-success border border-success/30'
                : testStatus === 'error'
                ? 'bg-error/20 text-error border border-error/30'
                : 'bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30'
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {testStatus === 'idle' && <><Send className="w-4 h-4" /> Отправить тест</>}
            {testStatus === 'sending' && <><motion.div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7 }} />Отправка...</>}
            {testStatus === 'success' && <><CheckCircle className="w-4 h-4" /> Успешно отправлено!</>}
            {testStatus === 'error' && <><XCircle className="w-4 h-4" /> Ошибка. Проверьте настройки</>}
          </motion.button>
        </div>
      </motion.div>

      {/* Notification types */}
      <motion.div
        className="mx-4 rounded-card overflow-hidden"
        style={{ background: '#1B2130', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Типы уведомлений</h3>
          <button
            onClick={() => setEnabledTypes(Object.fromEntries(NOTIFICATION_TYPES.map((t) => [t.key, !Object.values(enabledTypes).every(Boolean)])))}
            className="text-xs text-accent"
          >
            {Object.values(enabledTypes).every(Boolean) ? 'Отключить все' : 'Включить все'}
          </button>
        </div>

        {NOTIFICATION_TYPES.map((type, index) => (
          <motion.div
            key={type.key}
            className={`flex items-center gap-3 px-4 py-3.5 ${index > 0 ? 'border-t border-border' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.03 }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-card-elevated text-lg flex-shrink-0">
              {type.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{type.label}</p>
              <p className="text-2xs text-muted-weak">{type.description}</p>
            </div>
            <button
              onClick={() => toggleType(type.key)}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                enabledTypes[type.key] ? 'bg-accent' : 'bg-card-elevated'
              }`}
            >
              <motion.div
                className="absolute w-4 h-4 rounded-full bg-white shadow-sm top-0.5"
                animate={{ left: enabledTypes[type.key] ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Info block */}
      <motion.div
        className="mx-4 rounded-2xl p-4"
        style={{ background: 'rgba(35,152,219,0.08)', border: '1px solid rgba(35,152,219,0.2)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex gap-3">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-foreground mb-1">Как настроить?</p>
            <ol className="text-2xs text-muted-weak space-y-1 list-none">
              <li>1. Создайте бота через @BotFather в Telegram</li>
              <li>2. Скопируйте токен и вставьте в поле выше</li>
              <li>3. Узнайте ваш Chat ID через @userinfobot</li>
              <li>4. Включите нужные типы уведомлений</li>
              <li>5. Нажмите «Отправить тест» для проверки</li>
            </ol>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
