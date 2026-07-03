import { useState } from 'react';
import { Send, Eye, EyeOff, CheckCircle, XCircle, Info, MessageSquare } from 'lucide-react';
import { useStore } from '../../store';
import { FormPageShell } from '../../ui';

interface TelegramSettingsPageProps {
  onBack: () => void;
}

export function TelegramSettingsPage({ onBack }: TelegramSettingsPageProps) {
  const { telegramSettings, setTelegramSettings } = useStore();
  const [showToken, setShowToken] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
          text: '✅ *CRM Element*\n\nТестовое уведомление работает!',
          parse_mode: 'Markdown',
        }),
      });
      setTestStatus(res.ok ? 'success' : 'error');
    } catch {
      setTestStatus('error');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  return (
    <FormPageShell title="Telegram Bot" onBack={onBack}>
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Уведомления и бот</p>
            <p className="text-xs text-muted-weak">Настройте отправку событий в Telegram</p>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-weak mb-1.5 block">Bot Token</label>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: '#222938', border: '1px solid rgba(255,255,255,0.1)' }}>
            <input
              type={showToken ? 'text' : 'password'}
              value={telegramSettings.botToken}
              onChange={(e) => setTelegramSettings({ botToken: e.target.value })}
              placeholder="1234567890:ABCdef..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
            <button onClick={() => setShowToken(!showToken)} className="p-1 text-muted-weak hover:text-muted">
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <Info className="w-3 h-3 text-muted-weak" />
            <span className="text-2xs text-muted-weak">Получить у @BotFather</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-weak mb-1.5 block">Chat ID</label>
          <div className="rounded-xl px-3 py-2.5" style={{ background: '#222938', border: '1px solid rgba(255,255,255,0.1)' }}>
            <input
              type="text"
              value={telegramSettings.chatId}
              onChange={(e) => setTelegramSettings({ chatId: e.target.value })}
              placeholder="-100123456789"
              className="w-full bg-transparent text-sm text-foreground outline-none"
            />
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <Info className="w-3 h-3 text-muted-weak" />
            <span className="text-2xs text-muted-weak">Узнать через @userinfobot</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p className="text-sm font-medium text-foreground">Уведомления</p>
            <p className="text-xs text-muted-weak">Отправлять события в Telegram</p>
          </div>
          <button
            onClick={() => setTelegramSettings({ notificationsEnabled: !telegramSettings.notificationsEnabled })}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              telegramSettings.notificationsEnabled ? 'bg-success' : 'bg-card-elevated'
            }`}
          >
            <div
              className="absolute w-5 h-5 rounded-full bg-white shadow-md top-0.5 transition-all"
              style={{ left: telegramSettings.notificationsEnabled ? '26px' : '2px' }}
            />
          </button>
        </div>

        <button
          onClick={handleSendTest}
          disabled={testStatus === 'sending'}
          className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            testStatus === 'success'
              ? 'bg-success/20 text-success border border-success/30'
              : testStatus === 'error'
              ? 'bg-error/20 text-error border border-error/30'
              : 'bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30'
          }`}
        >
          {testStatus === 'idle' && <><Send className="w-4 h-4" /> Отправить тест</>}
          {testStatus === 'sending' && <><div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />Отправка...</>}
          {testStatus === 'success' && <><CheckCircle className="w-4 h-4" /> Успешно!</>}
          {testStatus === 'error' && <><XCircle className="w-4 h-4" /> Ошибка</>}
        </button>
      </div>
    </FormPageShell>
  );
}
